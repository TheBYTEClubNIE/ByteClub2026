// Run: node lib/bytle.check.ts   (Node 22+ strips the types itself)
import assert from "node:assert/strict";
import { LENGTHS, LOGIN_POINTS, MAX_TRIES, NO_STATS, WORDS, pointsFor, score, statsFrom, statusOf, triesFor, view, wordFor } from "./bytle.ts";
import type { Day } from "./bytle.ts";
import { dayNumber, nextReset } from "./bytle-day.ts";
import { seal, unseal } from "./security.ts";

// word list: 4 to 8 letters, no duplicates, plenty of every length
for (const [w] of WORDS) assert.match(w, /^[A-Z]{4,8}$/, w);
for (const n of LENGTHS) assert.ok(WORDS.filter(([w]) => w.length === n).length >= 30, `few ${n}-letter words`);
assert.equal(new Set(WORDS.map(([w]) => w)).size, WORDS.length, "duplicate word");

// scoring, including repeated letters
assert.deepEqual(score("CACHE", "CACHE"), ["hit", "hit", "hit", "hit", "hit"]);
assert.deepEqual(score("QUEUE", "CACHE"), ["miss", "miss", "miss", "miss", "hit"]);
assert.deepEqual(score("ARRAY", "CACHE"), ["near", "miss", "miss", "miss", "miss"]);
assert.deepEqual(score("EERIE", "CACHE"), ["miss", "miss", "miss", "miss", "hit"]);
assert.deepEqual(score("HEAPS", "CACHE"), ["near", "near", "near", "miss", "miss"]);

// days roll over at midnight IST and every day has a word
const launch = Date.UTC(2026, 9, 1) - 5.5 * 3_600_000;
assert.equal(dayNumber(launch), 0);
assert.equal(dayNumber(launch - 1), -1);
assert.equal(nextReset(launch + 1000), launch + 86_400_000);
for (let d = -5; d < WORDS.length * 2; d++) assert.ok(wordFor(d).word);

// lengths follow the weekly rhythm, never the same two days running
for (let d = -10; d < 400; d++) {
  assert.equal(wordFor(d).word.length, LENGTHS[((d % 7) + 7) % 7]);
  assert.notEqual(wordFor(d).word.length, wordFor(d + 1).word.length);
}
// a year of days: no word comes back while its length still has unused words
const seen = new Map<string, number>();
for (let d = 0; d < 365; d++) {
  const w = wordFor(d).word;
  const pool = WORDS.filter(([x]) => x.length === w.length).length;
  const uses = LENGTHS.filter((n) => n === w.length).length;
  if (seen.has(w)) assert.ok(((d - seen.get(w)!) / 7) * uses >= pool - 1, `${w} repeats too soon`);
  seen.set(w, d);
}
// tries: one more than the letters, at least six
assert.deepEqual([4, 5, 6, 7, 8].map(triesFor), [6, 6, 7, 8, 9]);
assert.equal(MAX_TRIES, 9);
assert.equal(NO_STATS.dist.length, MAX_TRIES);
// scoring works at every length
assert.deepEqual(score("COMMAND", "COMPILE"), ["hit", "hit", "hit", "miss", "miss", "miss", "miss"]);
assert.deepEqual(score("NODE", "DONE"), ["near", "hit", "near", "hit"]);

// a game: the word only shows once it's over
const day = 3; // a 7-letter day: 8 tries
const { word } = wordFor(day);
assert.equal(word.length, 7);
const miss = "Z".repeat(7);
const fresh: Day = { day, guesses: [], status: "playing", points: LOGIN_POINTS };
assert.equal(view(fresh, NO_STATS, "A").word, undefined);
assert.equal(view(fresh, NO_STATS, "A").tries, 8);
assert.equal(statusOf(day, [miss]), "playing");
assert.equal(statusOf(day, [miss, word]), "won");
assert.equal(statusOf(day, Array(8).fill(miss)), "lost");
assert.equal(statusOf(day, Array(7).fill(miss)), "playing", "one try left");
assert.equal(view({ ...fresh, guesses: [miss, word], status: "won" }, NO_STATS, "A").word, word);

// points: 1 for showing up, plus tries left + 1 for solving
assert.equal(pointsFor(day, []), 1);
assert.equal(pointsFor(day, [miss]), 1);
assert.equal(pointsFor(day, [word]), 1 + 8); // solved first try on an 8-try day
assert.equal(pointsFor(day, [miss, word]), 1 + 7);
assert.equal(pointsFor(day, [...Array(7).fill(miss), word]), 1 + 1); // on the last try
assert.equal(pointsFor(day, Array(8).fill(miss)), 1); // lost

// stats from saved days: streaks need back-to-back wins
const won = (d: number, n: number): Day => ({ day: d, guesses: Array(n).fill("X"), status: "won", points: 3 });
const s1 = statsFrom([won(1, 2), won(2, 3), { day: 3, guesses: ["X"], status: "lost", points: 1 }, won(4, 1), won(5, 2), won(6, 2), { day: 7, guesses: [], status: "playing", points: 1 }]);
assert.equal(s1.played, 6); // today's unfinished game doesn't count yet
assert.equal(s1.won, 5);
assert.equal(s1.streak, 3); // days 4-6
assert.equal(s1.best, 3);
assert.equal(s1.lastWon, 6);
assert.deepEqual(s1.dist.slice(0, 3), [1, 3, 1]);
assert.equal(s1.points, 3 * 5 + 1 + 1);
assert.equal(statsFrom([won(1, 2), won(3, 2)]).streak, 1, "a skipped day ends the streak");
assert.deepEqual(statsFrom([]), NO_STATS);

// seals round-trip; any edit, or reuse for another purpose, is rejected
process.env.SESSION_SECRET = "test-secret-".repeat(4);
const g = { day, guesses: [miss] };
const sealed = seal("bytle", g);
assert.deepEqual(unseal("bytle", sealed), g);
assert.equal(unseal("admin", sealed), null);
const sig = sealed.split(".")[1];
const cheat = Buffer.from(JSON.stringify({ ...g, guesses: [] })).toString("base64url");
assert.equal(unseal("bytle", `${cheat}.${sig}`), null);
assert.equal(unseal("bytle", sealed.slice(0, -1) + (sealed.endsWith("A") ? "B" : "A")), null);
for (const junk of ["", "x", "a.b", "a.b.c", null, undefined]) assert.equal(unseal("bytle", junk), null);

console.log(`bytle ok: ${WORDS.length} words`);
