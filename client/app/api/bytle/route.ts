import { cookies } from "next/headers";
import { type Game, MAX_TRIES, NO_STATS, play, view, wordFor } from "@/lib/bytle";
import { dayNumber } from "@/lib/bytle-day";
import { jsonBody, seal, tooMany, unseal } from "@/lib/security";

// Bytle is played here, so the answer never reaches the browser until the game
// is over. Progress and stats live in a sealed, httpOnly cookie: the browser
// keeps it but can't read or edit it, and an altered copy is simply ignored.
// The day comes from the server clock, so changing the phone's date does nothing.
const COOKIE = "bytle";

async function load(): Promise<Game> {
  const day = dayNumber(Date.now());
  const letters = wordFor(day).word.length;
  const saved = unseal<Game>("bytle", (await cookies()).get(COOKIE)?.value);
  // today's guesses only count if they fit today's word (it changed length once)
  const guesses = saved?.day === day && saved.guesses.every((g) => g.length === letters) ? saved.guesses : [];
  // older saves kept six guess counts; there can be up to MAX_TRIES now
  const stats = saved?.stats ? { ...saved.stats, dist: Array.from({ length: MAX_TRIES }, (_, i) => saved.stats.dist[i] ?? 0) } : NO_STATS;
  return { day, guesses, stats };
}

export async function GET() {
  return Response.json(view(await load()));
}

export async function POST(request: Request) {
  if (tooMany(request, "bytle", 60, 60_000)) return Response.json({ error: "Slow down a little" }, { status: 429 });
  const guess = String((await jsonBody(request))?.guess ?? "").toUpperCase();
  const game = await load();
  const letters = wordFor(game.day).word.length;
  if (!/^[A-Z]+$/.test(guess) || guess.length !== letters) {
    return Response.json({ error: `Today's word has ${letters} letters, A to Z` }, { status: 400 });
  }

  if (view(game).status !== "playing") return Response.json(view(game), { status: 409 });
  const next = play(game, guess);
  (await cookies()).set(COOKIE, seal("bytle", next), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/bytle",
    maxAge: 400 * 86_400,
  });
  return Response.json(view(next));
}
