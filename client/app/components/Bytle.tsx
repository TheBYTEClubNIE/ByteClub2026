"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Delete, Share2 } from "lucide-react";
import { type Mark, dayNumber, nextReset, score, wordFor } from "@/lib/bytle";

const ROWS = 6;
const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const FLIP = 340; // ms per tile flip
const STAGGER = 260; // ms between tiles
const REVEAL_TOTAL = STAGGER * 4 + FLIP + 60;
const VERDICT = ["Compiled first try.", "Clean build.", "Tests passing.", "Shipped.", "Merged at the deadline.", "Hotfix landed. Phew."];
const SAY: Record<Mark, string> = { hit: "right spot", near: "in the word", miss: "not in the word" };
const EMOJI: Record<Mark, string> = { hit: "🟦", near: "🟨", miss: "⬛" };
const RANK: Record<Mark, number> = { miss: 0, near: 1, hit: 2 };

type Stats = { played: number; won: number; streak: number; best: number; lastWon: number; dist: number[] };
const NO_STATS: Stats = { played: 0, won: 0, streak: 0, best: 0, lastWon: -99, dist: [0, 0, 0, 0, 0, 0] };

// Progress only lives in this browser; private windows may refuse storage.
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // not fatal: the game still works for this visit
  }
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Bytle({ standalone = false }: { standalone?: boolean }) {
  const [day, setDay] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [revealRow, setRevealRow] = useState(-1);
  const [shakeRow, setShakeRow] = useState(-1);
  const [toast, setToast] = useState("");
  const [stats, setStats] = useState<Stats>(NO_STATS);
  const [countdown, setCountdown] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const visible = useRef(standalone);
  const toastTimer = useRef(0);

  const { word: answer, meaning } = day === null ? { word: "", meaning: "" } : wordFor(day);
  const won = answer !== "" && guesses.includes(answer);
  const done = won || guesses.length >= ROWS;
  const busy = revealRow !== -1;

  // The day (and saved progress) is only known in the browser.
  useEffect(() => {
    const d = dayNumber(Date.now());
    setDay(d);
    setGuesses(load<string[]>(`bytle:${d}`, []));
    setStats({ ...NO_STATS, ...load<Partial<Stats>>("bytle:stats", {}) });
  }, []);

  // Keyboard input only while the game is on screen, so typing elsewhere is untouched.
  useEffect(() => {
    if (standalone) return;
    const io = new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting), { threshold: 0.35 });
    io.observe(rootRef.current!);
    return () => io.disconnect();
  }, [standalone]);

  const flash = useCallback((msg: string, ms = 1700) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), ms);
  }, []);

  const submit = useCallback(() => {
    if (done || busy || day === null) return;
    const row = guesses.length;
    if (current.length < 5) {
      setShakeRow(row);
      window.setTimeout(() => setShakeRow(-1), 500);
      flash("Not enough letters");
      return;
    }
    const next = [...guesses, current];
    const isWin = current === answer;
    const isOver = isWin || next.length >= ROWS;
    setGuesses(next);
    setCurrent("");
    setRevealRow(row);
    save(`bytle:${day}`, next);

    window.setTimeout(() => {
      setRevealRow(-1);
      if (!isOver) return;
      setStats((prev) => {
        const s: Stats = { ...prev, dist: [...prev.dist] };
        s.played += 1;
        if (isWin) {
          s.won += 1;
          s.dist[next.length - 1] += 1;
          s.streak = prev.lastWon === day - 1 ? prev.streak + 1 : 1;
          s.best = Math.max(prev.best, s.streak);
          s.lastWon = day;
        } else {
          s.streak = 0;
        }
        save("bytle:stats", s);
        return s;
      });
      flash(isWin ? VERDICT[next.length - 1] : `Build failed. It was ${answer}.`, 2600);
    }, REVEAL_TOTAL);
  }, [answer, busy, current, day, done, flash, guesses]);

  const press = useCallback(
    (key: string) => {
      if (done || busy) return;
      if (key === "ENTER") return submit();
      if (key === "BACK") return setCurrent((c) => c.slice(0, -1));
      if (/^[A-Z]$/.test(key)) setCurrent((c) => (c.length < 5 ? c + key : c));
    },
    [busy, done, submit]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === "Enter") {
        // a focused button handles its own Enter
        if (target?.closest("button, a")) return;
        e.preventDefault();
        press("ENTER");
      } else if (e.key === "Backspace") {
        press("BACK");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        press(e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  // Time to the next word; ticks only while the finished game is on screen.
  useEffect(() => {
    if (!done || day === null) return;
    const tick = () => {
      const now = Date.now();
      if (dayNumber(now) !== day) {
        const d = dayNumber(now);
        setDay(d);
        setGuesses(load<string[]>(`bytle:${d}`, []));
        return;
      }
      if (!visible.current) return;
      const left = Math.max(0, nextReset(now) - now);
      setCountdown(`${pad(Math.floor(left / 3_600_000))}:${pad(Math.floor(left / 60_000) % 60)}:${pad(Math.floor(left / 1000) % 60)}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [day, done]);

  const keyState = useMemo(() => {
    const out: Record<string, Mark> = {};
    guesses.forEach((g, r) => {
      if (r === revealRow) return; // wait for the flip before colouring keys
      score(g, answer).forEach((m, i) => {
        if (!out[g[i]] || RANK[m] > RANK[out[g[i]]]) out[g[i]] = m;
      });
    });
    return out;
  }, [answer, guesses, revealRow]);

  const share = async () => {
    const grid = guesses.map((g) => score(g, answer).map((m) => EMOJI[m]).join("")).join("\n");
    const text = `Bytle #${(day ?? 0) + 1} ${won ? guesses.length : "X"}/6\n\n${grid}\n\nbyteclubnie.vercel.app/bytle`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      flash("Copied. Paste it in the group chat.");
    } catch {
      // share sheet dismissed
    }
  };

  const lastIndex = guesses.length - 1;
  const announce =
    revealRow === -1 && lastIndex >= 0
      ? `${guesses[lastIndex]}: ${score(guesses[lastIndex], answer)
          .map((m, i) => `${guesses[lastIndex][i]} ${SAY[m]}`)
          .join(", ")}.${done ? (won ? " Solved." : ` The word was ${answer}.`) : ""}`
      : "";

  const streak = day !== null && stats.lastWon >= day - 1 ? stats.streak : 0;
  const maxDist = Math.max(1, ...stats.dist);
  const Heading = standalone ? "h1" : "h2";
  const today =
    day === null ? "" : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

  return (
    <section id="bytle" ref={rootRef} className="section">
      <style>{BYTLE_CSS}</style>

      <header className="section-head">
        <Heading className="section-title">Bytle</Heading>
        <p className="section-lede">
          One tech word a day, six tries. Crack it and learn what it means,
          then send your grid to the group chat.
        </p>
      </header>

      <div className="bt-layout">
        <div className="bt-play">
          <div className="bt-bar">
            <span>{day === null ? "Bytle" : `Bytle #${day + 1}`}</span>
            <span>{today}</span>
          </div>

          <div className="bt-stage">
            <p className={`bt-toast ${toast ? "is-on" : ""}`} role="status">
              {toast}
            </p>
            <div className="bt-board" aria-hidden>
              {Array.from({ length: ROWS }, (_, r) => {
                const guess = guesses[r];
                const isCurrent = r === guesses.length && !done;
                const letters = guess ?? (isCurrent ? current : "");
                const marks = guess ? score(guess, answer) : null;
                const winRow = won && r === lastIndex && revealRow === -1;
                return (
                  <div
                    key={r}
                    className={`bt-row ${isCurrent ? "is-current" : ""} ${shakeRow === r ? "is-shake" : ""} ${winRow ? "is-win" : ""}`}
                  >
                    {Array.from({ length: 5 }, (_, c) => {
                      const ch = letters[c] ?? "";
                      const mark = marks?.[c];
                      return (
                        <span
                          key={c}
                          className={`bt-tile ${ch ? "is-filled" : ""} ${mark ? `is-${mark}` : ""} ${r === revealRow ? "is-revealing" : ""}`}
                          style={{ ["--c" as string]: c }}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>

          <div className="bt-keys" role="group" aria-label="Keyboard">
            {KEYS.map((row, i) => (
              <div key={row} className="bt-krow">
                {i === 2 && (
                  <button type="button" className="bt-key bt-key--wide" onMouseDown={(e) => e.preventDefault()} onClick={() => press("ENTER")}>
                    Enter
                  </button>
                )}
                {row.split("").map((k) => {
                  const m = keyState[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      className={`bt-key ${m ? `is-${m}` : ""}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => press(k)}
                      aria-label={m ? `${k}, ${SAY[m]}` : k}
                    >
                      {k}
                    </button>
                  );
                })}
                {i === 2 && (
                  <button
                    type="button"
                    className="bt-key bt-key--wide"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => press("BACK")}
                    aria-label="Delete letter"
                  >
                    <Delete size={20} aria-hidden />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="bt-side">
          {done && revealRow === -1 ? (
            <div className="bt-card bt-result">
              <p className="bt-verdict">{won ? VERDICT[lastIndex] : "Build failed."}</p>
              <p className="bt-word">{answer}</p>
              <p className="bt-meaning">{meaning}</p>
              <button type="button" className="btn btn-accent w-full" onClick={share}>
                <Share2 size={18} aria-hidden />
                Share your grid
              </button>
              <p className="bt-next">
                Next word in <strong>{countdown || "--:--:--"}</strong>
              </p>
            </div>
          ) : (
            <div className="bt-card">
              <h3 className="bt-h3">How it plays</h3>
              <p className="bt-copy">Guess the five-letter tech word. After each guess the tiles show how close you were.</p>
              <ul className="bt-legend">
                <li>
                  <span className="bt-tile bt-tile--sm is-hit">C</span> Right letter, right spot
                </li>
                <li>
                  <span className="bt-tile bt-tile--sm is-near">A</span> In the word, wrong spot
                </li>
                <li>
                  <span className="bt-tile bt-tile--sm is-miss">T</span> Not in the word
                </li>
              </ul>
              <p className="bt-copy">A new word drops every midnight (IST). Same word for everyone.</p>
            </div>
          )}

          <div className="bt-card">
            <h3 className="bt-h3">Your stats</h3>
            <dl className="bt-stats">
              <div>
                <dt>Played</dt>
                <dd>{stats.played}</dd>
              </div>
              <div>
                <dt>Win %</dt>
                <dd>{stats.played ? Math.round((stats.won / stats.played) * 100) : 0}</dd>
              </div>
              <div>
                <dt>Streak</dt>
                <dd>{streak}</dd>
              </div>
              <div>
                <dt>Best</dt>
                <dd>{stats.best}</dd>
              </div>
            </dl>
            <ol className="bt-dist" aria-label="Guess distribution">
              {stats.dist.map((n, i) => (
                <li key={i}>
                  <span>{i + 1}</span>
                  <span
                    className={`bt-bar-fill ${won && lastIndex === i ? "is-now" : ""}`}
                    style={{ width: `${Math.max(8, (n / maxDist) * 100)}%` }}
                  >
                    {n}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}

const BYTLE_CSS = `
.bt-layout { display: grid; gap: 28px; }
.bt-play { width: 100%; max-width: 30rem; margin-inline: auto; }
.bt-bar { display: flex; justify-content: space-between; margin-bottom: 14px; font-family: var(--font-mono); font-size: 13px; color: var(--ink-muted); }
.bt-bar span:first-child { color: var(--accent); }
.bt-stage { position: relative; }
.bt-toast { position: absolute; z-index: 2; left: 50%; top: -44px; transform: translate(-50%, -8px); padding: 8px 14px; border-radius: 999px; background: var(--ink); color: var(--bg); font-size: 14px; font-weight: 600; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.bt-toast.is-on { opacity: 1; transform: translate(-50%, 0); }

.bt-board { display: grid; gap: 7px; width: min(100%, 22rem); margin-inline: auto; perspective: 600px; }
.bt-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; }
.bt-tile {
  --mark-bg: transparent; --mark-fg: var(--ink); --mark-line: var(--line-strong);
  display: grid; place-items: center; aspect-ratio: 1; border-radius: 8px;
  border: 2px solid var(--mark-line); background: var(--mark-bg); color: var(--mark-fg);
  font-family: var(--font-display); font-weight: 700; font-size: clamp(1.35rem, 6vw, 1.8rem); line-height: 1;
  text-transform: uppercase; user-select: none;
}
.bt-tile.is-filled { --mark-line: var(--ink-faint); }
.bt-tile.is-hit { --mark-bg: var(--accent); --mark-fg: #031018; --mark-line: var(--accent); }
.bt-tile.is-near { --mark-bg: #ffbf7f; --mark-fg: #1d1206; --mark-line: #ffbf7f; }
.bt-tile.is-miss { --mark-bg: #242a30; --mark-fg: var(--ink-muted); --mark-line: #242a30; }
.bt-row.is-current .bt-tile.is-filled { animation: bt-pop 0.12s ease; }
.bt-tile.is-revealing { animation: bt-flip ${FLIP}ms ease-in-out both; animation-delay: calc(var(--c) * ${STAGGER}ms); }
.bt-row.is-shake { animation: bt-shake 0.45s ease; }
.bt-row.is-win .bt-tile { animation: bt-wave 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--c) * 90ms); }
@keyframes bt-pop { 50% { transform: scale(1.1); } }
@keyframes bt-flip {
  0% { transform: rotateX(0); background: transparent; color: var(--ink); border-color: var(--ink-faint); }
  49% { transform: rotateX(90deg); background: transparent; color: var(--ink); border-color: var(--ink-faint); }
  50% { transform: rotateX(90deg); background: var(--mark-bg); color: var(--mark-fg); border-color: var(--mark-line); }
  100% { transform: rotateX(0); background: var(--mark-bg); color: var(--mark-fg); border-color: var(--mark-line); }
}
@keyframes bt-shake { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
@keyframes bt-wave { 40% { transform: translateY(-14px); } }

.bt-keys { display: grid; gap: 7px; margin-top: 22px; }
.bt-krow { display: flex; justify-content: center; gap: 5px; }
.bt-key {
  flex: 1; max-width: 44px; height: 54px; border-radius: 8px;
  display: grid; place-items: center;
  background: #1b2025; color: var(--ink); border: 1px solid var(--line);
  font-family: var(--font-body); font-size: 15px; font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.08s ease;
  touch-action: manipulation;
}
.bt-key:active { transform: scale(0.94); }
.bt-key:hover { background: #242a30; }
.bt-key--wide { flex: 1.6; max-width: 72px; font-size: 13px; }
.bt-key.is-hit { background: var(--accent); color: #031018; border-color: var(--accent); }
.bt-key.is-near { background: #ffbf7f; color: #1d1206; border-color: #ffbf7f; }
.bt-key.is-miss { background: #0d1013; color: var(--ink-faint); border-color: var(--line); }

.bt-side { display: grid; gap: 16px; align-content: start; width: 100%; max-width: 30rem; margin-inline: auto; }
.bt-card { padding: 22px; border-radius: 14px; background: var(--bg-elevated); border: 1px solid var(--line); }
.bt-h3 { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; color: var(--ink); }
.bt-copy { margin-top: 10px; font-size: 15px; line-height: 1.6; color: var(--ink-muted); }
.bt-legend { display: grid; gap: 10px; margin-top: 16px; font-size: 14px; color: var(--ink); }
.bt-legend li { display: flex; align-items: center; gap: 12px; }
.bt-tile--sm { width: 34px; font-size: 1rem; border-radius: 6px; }

.bt-result { border-color: var(--accent-border); background: linear-gradient(180deg, rgba(40,194,255,0.08), var(--bg-elevated) 60%); }
.bt-verdict { font-family: var(--font-mono); font-size: 13px; color: var(--accent); }
.bt-word { margin-top: 8px; font-family: var(--font-display); font-weight: 700; font-size: 2.4rem; letter-spacing: 0.04em; color: var(--ink); }
.bt-meaning { margin: 8px 0 20px; font-size: 16px; line-height: 1.55; color: var(--ink-muted); }
.bt-next { margin-top: 14px; text-align: center; font-size: 14px; color: var(--ink-muted); }
.bt-next strong { font-family: var(--font-mono); font-weight: 500; color: var(--ink); }

.bt-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px; text-align: center; }
.bt-stats dd { order: -1; font-family: var(--font-display); font-weight: 600; font-size: 1.6rem; color: var(--ink); }
.bt-stats div { display: flex; flex-direction: column; }
.bt-stats dt { margin-top: 2px; font-size: 12px; color: var(--ink-muted); }
.bt-dist { display: grid; gap: 6px; margin-top: 18px; }
.bt-dist li { display: grid; grid-template-columns: 14px 1fr; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 12px; color: var(--ink-muted); }
.bt-bar-fill { display: block; padding: 3px 8px; border-radius: 4px; background: #242a30; color: var(--ink); text-align: right; }
.bt-bar-fill.is-now { background: var(--accent); color: #031018; }

@media (min-width: 1024px) {
  .bt-layout { grid-template-columns: minmax(0, 30rem) minmax(0, 24rem); justify-content: space-between; align-items: start; gap: 64px; }
  .bt-play, .bt-side { margin-inline: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .bt-tile.is-revealing, .bt-row.is-shake, .bt-row.is-win .bt-tile, .bt-row.is-current .bt-tile.is-filled { animation: none; }
}
`;
