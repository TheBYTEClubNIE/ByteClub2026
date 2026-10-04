// Run: node lib/bytle.check.ts   (Node 22+ strips the types itself)
import assert from "node:assert/strict";
import { NO_STATS, WORDS, play, score, view, wordFor } from "./bytle.ts";
import type { Game } from "./bytle.ts";
import { dayNumber, nextReset } from "./bytle-day.ts";
import { seal, unseal } from "./security.ts";

// word list: five letters, no duplicates
for (const [w] of WORDS) assert.match(w, /^[A-Z]{5}$/, w);
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

// a game: the word only shows once it's over, and stats move once
const day = 3;
const { word } = wordFor(day);
let g: Game = { day, guesses: [], stats: NO_STATS };
assert.equal(view(g).word, undefined);
g = play(g, "ZZZZZ");
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
for (let i = 0; i < 6; i++) lost = play(lost, "ZZZZZ");
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
