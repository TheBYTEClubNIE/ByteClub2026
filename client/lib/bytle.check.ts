// Run: node lib/bytle.check.ts   (Node 22+ strips the types itself)
import assert from "node:assert/strict";
import { LENGTHS, MAX_TRIES, NO_STATS, WORDS, play, score, triesFor, view, wordFor } from "./bytle.ts";
import type { Game } from "./bytle.ts";
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

// a game: the word only shows once it's over, and stats move once
const day = 3; // a 7-letter day: 8 tries
const { word } = wordFor(day);
let g: Game = { day, guesses: [], stats: NO_STATS };
assert.equal(view(g).word, undefined);
assert.equal(word.length, 7);
assert.equal(view(g).tries, 8);
assert.equal(view(g).letters, 7);
g = play(g, "Z".repeat(7));
assert.equal(view(g).status, "playing");
assert.equal(view(g).word, undefined);
assert.equal(g.stats.played, 0);
g = play(g, word);
assert.equal(view(g).status, "won");
assert.equal(view(g).word, word);
assert.deepEqual([g.stats.played, g.stats.won, g.stats.streak, g.stats.dist[1]], [1, 1, 1, 1]);
const next = play({ day: day + 1, guesses: [], stats: g.stats }, wordFor(day + 1).word);
assert.equal(next.stats.streak, 2);
let lost: Game = { day: day + 2, guesses: [], stats: next.stats };
const lostLetters = wordFor(day + 2).word.length;
for (let i = 0; i < triesFor(lostLetters) - 1; i++) lost = play(lost, "Z".repeat(lostLetters));
assert.equal(view(lost).status, "playing", "still one try left");
lost = play(lost, "Z".repeat(lostLetters));
assert.equal(view(lost).status, "lost");
assert.deepEqual([lost.stats.played, lost.stats.won, lost.stats.streak, lost.stats.best], [3, 2, 0, 2]);

// seals round-trip; any edit, or reuse for another purpose, is rejected
process.env.SESSION_SECRET = "test-secret-".repeat(4);
const sealed = seal("bytle", g);
assert.deepEqual(unseal("bytle", sealed), g);
assert.equal(unseal("admin", sealed), null);
const sig = sealed.split(".")[1];
const cheat = Buffer.from(JSON.stringify({ ...g, stats: { ...g.stats, won: 999 } })).toString("base64url");
assert.equal(unseal("bytle", `${cheat}.${sig}`), null);
assert.equal(unseal("bytle", sealed.slice(0, -1) + (sealed.endsWith("A") ? "B" : "A")), null);
for (const junk of ["", "x", "a.b", "a.b.c", null, undefined]) assert.equal(unseal("bytle", junk), null);

console.log(`bytle ok: ${WORDS.length} words`);
