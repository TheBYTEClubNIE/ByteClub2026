// Run: node lib/bytle.check.ts   (Node 22+ strips the types itself)
import assert from "node:assert/strict";
import { WORDS, dayNumber, nextReset, score, wordFor } from "./bytle.ts";

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

console.log(`bytle ok: ${WORDS.length} words`);
