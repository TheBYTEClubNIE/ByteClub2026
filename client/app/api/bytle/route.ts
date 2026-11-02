import { cookies } from "next/headers";
import { type Day, LOGIN_POINTS, NO_STATS, pointsFor, statsFrom, statusOf, view, wordFor } from "@/lib/bytle";
import { dayNumber } from "@/lib/bytle-day";
import { jsonBody, seal, tooMany, unseal } from "@/lib/security";
import { accountsReady, currentUser, db, googleName } from "@/lib/supabase";

// Bytle is played here. Anyone can play as a guest; signing in with Google
// saves each day to the player's account (stats, points, leaderboard). The
// answer never reaches the browser until the game is over, every guess is
// checked on the server, and the day comes from the server clock.
//
// A guest's game for today is kept in a sealed, httpOnly cookie (no stats).
// If they sign in later that day, it moves to their account, so a game you've
// already seen the answer to can't be replayed for points.

const GUEST = "bytle";
const GUEST_COOKIE = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/api/bytle" };
type Row = Day & { updated_at: string };

async function guestGuesses(day: number) {
  const saved = unseal<{ day: number; guesses: string[] }>("bytle", (await cookies()).get(GUEST)?.value);
  const letters = wordFor(day).word.length;
  return saved?.day === day && saved.guesses.every((g) => g.length === letters) ? saved.guesses : [];
}
const keepGuest = async (day: number, guesses: string[]) =>
  (await cookies()).set(GUEST, seal("bytle", { day, guesses }), { ...GUEST_COOKIE, maxAge: 2 * 86_400 });
const dropGuest = async () => (await cookies()).set(GUEST, "", { ...GUEST_COOKIE, maxAge: 0 });

const guestView = (day: number, guesses: string[]) => ({
  ...view({ day, guesses, status: statusOf(day, guesses), points: 0 }, NO_STATS, ""),
  guest: true,
  canSignIn: accountsReady(),
});

// Today's row for a signed-in player, created on their first visit of the
// day (that visit earns the daily login point). A guest game from earlier
// today moves in if the account hasn't played today yet.
async function today(userId: string, name: string) {
  const sb = db();
  const day = dayNumber(Date.now());
  const p = await sb.from("players").upsert({ id: userId, name }, { onConflict: "id" });
  if (p.error) throw p.error;
  const d = await sb
    .from("bytle_days")
    .upsert({ player_id: userId, day, points: LOGIN_POINTS }, { onConflict: "player_id,day", ignoreDuplicates: true });
  if (d.error) throw d.error;
  const { data, error } = await sb.from("bytle_days").select("day, guesses, status, points, updated_at").eq("player_id", userId);
  if (error) throw error;
  let rows = data as Row[];
  let row = rows.find((r) => r.day === day)!;

  const carried = await guestGuesses(day);
  if (carried.length && !row.guesses.length) {
    const moved: Row = { ...row, guesses: carried, status: statusOf(day, carried), points: pointsFor(day, carried), updated_at: new Date().toISOString() };
    const u = await sb
      .from("bytle_days")
      .update({ guesses: moved.guesses, status: moved.status, points: moved.points, updated_at: moved.updated_at })
      .eq("player_id", userId)
      .eq("day", day)
      .eq("updated_at", row.updated_at)
      .select("day");
    if (u.error) throw u.error;
    if (u.data.length) {
      row = moved;
      rows = rows.map((r) => (r.day === day ? moved : r));
    }
  }
  if (carried.length) await dropGuest();
  return { day, rows, row };
}

const signedInView = (row: Row, rows: Row[], name: string) => ({ ...view(row, statsFrom(rows), name), guest: false, canSignIn: true });

export async function GET(request: Request) {
  const user = accountsReady() ? await currentUser() : null;
  const day = dayNumber(Date.now());
  // the nav only wants to know whether today's word is still waiting
  if (new URL(request.url).searchParams.has("peek")) {
    if (!user) return Response.json({ fresh: !(await guestGuesses(day)).length });
    const { data } = await db().from("bytle_days").select("guesses").eq("player_id", user.id).eq("day", day).maybeSingle();
    return Response.json({ fresh: !data?.guesses.length });
  }
  if (!user) return Response.json(guestView(day, await guestGuesses(day)));
  const name = googleName(user);
  const { rows, row } = await today(user.id, name);
  return Response.json(signedInView(row, rows, name));
}

export async function POST(request: Request) {
  if (tooMany(request, "bytle", 60, 60_000)) return Response.json({ error: "Slow down a little" }, { status: 429 });
  const user = accountsReady() ? await currentUser() : null;
  const day = dayNumber(Date.now());
  const letters = wordFor(day).word.length;
  const guess = String((await jsonBody(request))?.guess ?? "").toUpperCase();
  if (!/^[A-Z]+$/.test(guess) || guess.length !== letters) {
    return Response.json({ error: `Today's word has ${letters} letters, A to Z` }, { status: 400 });
  }

  if (!user) {
    const before = await guestGuesses(day);
    if (statusOf(day, before) !== "playing") return Response.json(guestView(day, before), { status: 409 });
    const guesses = [...before, guess];
    await keepGuest(day, guesses);
    return Response.json(guestView(day, guesses));
  }

  const name = googleName(user);
  const { rows, row } = await today(user.id, name);
  if (row.status !== "playing") return Response.json(signedInView(row, rows, name), { status: 409 });
  const guesses = [...row.guesses, guess];
  const next: Row = { ...row, guesses, status: statusOf(day, guesses), points: pointsFor(day, guesses), updated_at: new Date().toISOString() };
  // only if nothing changed since we read it (two quick taps can't both count)
  const { data, error } = await db()
    .from("bytle_days")
    .update({ guesses: next.guesses, status: next.status, points: next.points, updated_at: next.updated_at })
    .eq("player_id", user.id)
    .eq("day", day)
    .eq("updated_at", row.updated_at)
    .select("day");
  if (error) throw error;
  if (!data.length) {
    const now = await today(user.id, name);
    return Response.json(signedInView(now.row, now.rows, name), { status: 409 });
  }
  return Response.json(signedInView(next, rows.map((r) => (r.day === day ? next : r)), name));
}
