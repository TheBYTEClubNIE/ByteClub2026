// Bytle's calendar, safe to use in the browser. The words themselves live in
// lib/bytle.ts and are only ever imported on the server.

const DAY = 86_400_000;
// Midnight IST, 1 Oct 2026: Bytle #1.
const LAUNCH = Date.UTC(2026, 9, 1) - 5.5 * 3_600_000;

export const dayNumber = (now: number) => Math.floor((now - LAUNCH) / DAY);
export const nextReset = (now: number) => LAUNCH + (dayNumber(now) + 1) * DAY;

// Bytle used to keep guesses and stats in localStorage, where anyone could
// edit them. Everything lives on the server now, so wipe the old copies.
export function clearOldSaves() {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith("bytle:")) localStorage.removeItem(k);
  } catch {
    // storage blocked: nothing to clear
  }
}
