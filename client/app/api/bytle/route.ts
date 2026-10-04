import { cookies } from "next/headers";
import { type Game, NO_STATS, play, view } from "@/lib/bytle";
import { dayNumber } from "@/lib/bytle-day";
import { jsonBody, seal, tooMany, unseal } from "@/lib/security";

// Bytle is played here, so the answer never reaches the browser until the game
// is over. Progress and stats live in a sealed, httpOnly cookie: the browser
// keeps it but can't read or edit it, and an altered copy is simply ignored.
// The day comes from the server clock, so changing the phone's date does nothing.
const COOKIE = "bytle";

async function load(): Promise<Game> {
  const day = dayNumber(Date.now());
  const saved = unseal<Game>("bytle", (await cookies()).get(COOKIE)?.value);
  return { day, guesses: saved?.day === day ? saved.guesses : [], stats: saved?.stats ?? NO_STATS };
}

export async function GET() {
  return Response.json(view(await load()));
}

export async function POST(request: Request) {
  if (tooMany(request, "bytle", 60, 60_000)) return Response.json({ error: "Slow down a little" }, { status: 429 });
  const guess = String((await jsonBody(request))?.guess ?? "").toUpperCase();
  if (!/^[A-Z]{5}$/.test(guess)) return Response.json({ error: "Five letters, A to Z" }, { status: 400 });

  const game = await load();
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
