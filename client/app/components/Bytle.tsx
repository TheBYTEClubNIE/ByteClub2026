"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Delete, Share2 } from "lucide-react";
import type { Mark, Stats, View } from "@/lib/bytle";
import { clearOldSaves, dayNumber, nextReset } from "@/lib/bytle-day";

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const FLIP = 340; // ms per tile flip
const STAGGER = 260; // ms between tiles
// the last tile starts flipping (letters - 1) staggers in
const revealMs = (letters: number) => STAGGER * (letters - 1) + FLIP + 60;
const VERDICT = ["Compiled first try.", "Clean build.", "Tests passing.", "Shipped.", "Merged at the deadline."];
// how it went, by guess number; the very last try is always a close call
const verdict = (row: number, tries: number) => (row === tries - 1 ? "Hotfix landed. Phew." : VERDICT[Math.min(row, VERDICT.length - 1)]);
const SAY: Record<Mark, string> = { hit: "right spot", near: "in the word", miss: "not in the word" };
const EMOJI: Record<Mark, string> = { hit: "🟦", near: "🟨", miss: "⬛" };
const RANK: Record<Mark, number> = { miss: 0, near: 1, hit: 2 };
const NO_ROWS: View["rows"] = [];
const NO_STATS: Stats = { played: 0, won: 0, streak: 0, best: 0, lastWon: -99, dist: [], points: 0 };

// The game is played on the server (app/api/bytle): the browser sends guesses
// and gets back marks, so nothing here can be read ahead or edited. Guests can
// play; signed-in players have every result saved to their account.
async function call(init?: RequestInit): Promise<View> {
  const res = await fetch("/api/bytle", { cache: "no-store", ...init });
  const data = await res.json().catch(() => ({}));
  // 409: the game was already over (finished in another tab); its state still comes back
  if (!res.ok && res.status !== 409) throw new Error(data.error ?? "Bytle is offline");
  return data as View;
}

// After a sign-in that didn't finish, the address carries ?signin=; read it once and tidy the URL.
function takeSignInNote() {
  const url = new URL(location.href);
  const note = url.searchParams.get("signin");
  if (!note) return null;
  url.searchParams.delete("signin");
  history.replaceState(null, "", url);
  return note === "unavailable" ? "Sign-in isn't available right now." : "Sign-in didn't finish. Try again.";
}

// Google blocks its sign-in inside apps' built-in browsers (Instagram, etc.).
function inAppBrowser() {
  const ua = navigator.userAgent;
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "Facebook";
  if (/LinkedInApp/i.test(ua)) return "LinkedIn";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  if (/\bLine\//i.test(ua)) return "LINE";
  return null;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

// "Sign in with Google", plus a heads-up inside apps where Google blocks it.
function SignIn({ inApp, label = "Sign in with Google" }: { inApp: string | null; label?: string }) {
  return (
    <>
      {inApp && (
        <p className="bt-note">
          Google doesn&apos;t allow sign-in inside {inApp}&apos;s browser. Tap the menu (⋯), choose <b>Open in browser</b>,
          then sign in there.
        </p>
      )}
      <a className="btn btn-primary bt-google" href="/auth/signin?next=/bytle">
        <GoogleIcon />
        {label}
      </a>
    </>
  );
}

type Entry = { name: string; points: number; wins: number; days: number; rank: number };

// The global leaderboard: top ten by points, and your own spot if you're further down.
function Leaderboard({ version }: { version: number }) {
  const [board, setBoard] = useState<{ top: Entry[]; me: Entry | null } | null>(null);
  useEffect(() => {
    fetch("/api/bytle/leaderboard", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setBoard)
      .catch(() => {});
  }, [version]);

  const top = board?.top.slice(0, 10) ?? [];
  const me = board?.me;
  const meShown = !!me && top.some((e) => e.rank === me.rank && e.name === me.name);
  return (
    <div className="bt-card">
      <h3 className="bt-h3">Global leaderboard</h3>
      <p className="bt-fine">1 point for every day you play, plus tries left + 1 for solving it.</p>
      {board === null ? (
        <p className="bt-copy">Loading…</p>
      ) : top.length === 0 ? (
        <p className="bt-copy">No scores yet. Be the first on the board.</p>
      ) : (
        <ol className="bt-lb">
          {top.map((e) => (
            <li key={e.rank + e.name} className={me && e.rank === me.rank && e.name === me.name ? "is-me" : ""}>
              <span className="bt-lb-rank">{e.rank}</span>
              <span className="bt-lb-name">{e.name}</span>
              <span className="bt-lb-pts">{e.points}</span>
            </li>
          ))}
          {me && !meShown && (
            <li className="is-me bt-lb-you">
              <span className="bt-lb-rank">{me.rank}</span>
              <span className="bt-lb-name">{me.name} (you)</span>
              <span className="bt-lb-pts">{me.points}</span>
            </li>
          )}
        </ol>
      )}
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Bytle({ standalone = false }: { standalone?: boolean }) {
  const [game, setGame] = useState<View | null>(null);
  const [current, setCurrent] = useState("");
  const [sending, setSending] = useState(false);
  const [revealRow, setRevealRow] = useState(-1);
  const [shakeRow, setShakeRow] = useState(-1);
  const [toast, setToast] = useState("");
  // shown stats lag the game by one flip, so the result isn't spoiled early
  const [stats, setStats] = useState<Stats>(NO_STATS);
  const [countdown, setCountdown] = useState("");

  const [inApp, setInApp] = useState<string | null>(null);
  // bumped whenever a result lands, so the leaderboard reloads
  const [boardVersion, setBoardVersion] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const visible = useRef(standalone);
  const toastTimer = useRef(0);

  const day = game?.day ?? null;
  const rows = game?.rows ?? NO_ROWS;
  // today's word length and tries (a 5 x 6 board until the server answers)
  const letters = game?.letters ?? 5;
  const tries = game?.tries ?? 6;
  const answer = game?.word ?? "";
  const meaning = game?.meaning ?? "";
  const won = game?.status === "won";
  const done = !!game && game.status !== "playing";
  // "in": signed in; "guest": can sign in; "off": sign-in isn't set up on the server
  const account = !game ? "loading" : !game.guest ? "in" : game.canSignIn ? "guest" : "off";
  const busy = sending || revealRow !== -1;

  const flash = useCallback((msg: string, ms = 1700) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), ms);
  }, []);

  const refresh = useCallback(() => {
    call()
      .then((g) => {
        setGame(g);
        setStats(g.stats);
        const note = takeSignInNote();
        if (note) flash(note, 3500);
      })
      .catch(() => flash("Couldn't load today's word. Refresh to try again.", 4000));
  }, [flash]);

  useEffect(refresh, [refresh]);


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the browser's user agent once
    setInApp(inAppBrowser());
  }, []);

  useEffect(clearOldSaves, []);

  // Keyboard input only while the game is on screen, so typing elsewhere is untouched.
  useEffect(() => {
    if (standalone) return;
    const io = new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting), { threshold: 0.35 });
    io.observe(rootRef.current!);
    return () => io.disconnect();
  }, [standalone]);

  const submit = useCallback(async () => {
    if (!game || done || busy) return;
    const row = rows.length;
    if (current.length < letters) {
      setShakeRow(row);
      window.setTimeout(() => setShakeRow(-1), 500);
      flash("Not enough letters");
      return;
    }
    setSending(true);
    try {
      const next = await call({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: current }),
      });
      setGame(next);
      setCurrent("");
      if (next.rows.length <= row) {
        setStats(next.stats);
        return;
      }
      setRevealRow(row);
      window.setTimeout(() => {
        setRevealRow(-1);
        setStats(next.stats);
        if (next.status !== "playing") setBoardVersion((v) => v + 1);
        if (next.status === "won") flash(verdict(row, next.tries), 2600);
        else if (next.status === "lost") flash(`Build failed. It was ${next.word}.`, 2600);
      }, revealMs(next.letters));
    } catch {
      flash("Couldn't reach the server. Try again.");
    } finally {
      setSending(false);
    }
  }, [busy, current, done, flash, game, letters, rows.length]);

  const press = useCallback(
    (key: string) => {
      if (!game || done || busy) return;
      if (key === "ENTER") return void submit();
      if (key === "BACK") return setCurrent((c) => c.slice(0, -1));
      if (/^[A-Z]$/.test(key)) setCurrent((c) => (c.length < letters ? c + key : c));
    },
    [busy, done, game, letters, submit]
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
      if (dayNumber(now) !== day) return refresh();
      if (!visible.current) return;
      const left = Math.max(0, nextReset(now) - now);
      setCountdown(`${pad(Math.floor(left / 3_600_000))}:${pad(Math.floor(left / 60_000) % 60)}:${pad(Math.floor(left / 1000) % 60)}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [day, done, refresh]);

  const keyState = useMemo(() => {
    const out: Record<string, Mark> = {};
    rows.forEach(({ guess, marks }, r) => {
      if (r === revealRow) return; // wait for the flip before colouring keys
      marks.forEach((m, i) => {
        if (!out[guess[i]] || RANK[m] > RANK[out[guess[i]]]) out[guess[i]] = m;
      });
    });
    return out;
  }, [rows, revealRow]);

  const share = async () => {
    const grid = rows.map(({ marks }) => marks.map((m) => EMOJI[m]).join("")).join("\n");
    const text = `Bytle #${(day ?? 0) + 1} ${won ? rows.length : "X"}/${tries}\n\n${grid}\n\nbyteclubnie.vercel.app/bytle`;
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

  const lastIndex = rows.length - 1;
  const last = rows[lastIndex];
  const announce =
    revealRow === -1 && last
      ? `${last.guess}: ${last.marks
          .map((m, i) => `${last.guess[i]} ${SAY[m]}`)
          .join(", ")}.${done ? (won ? " Solved." : ` The word was ${answer}.`) : ""}`
      : "";

  const streak = day !== null && stats.lastWon >= day - 1 ? stats.streak : 0;
  const maxDist = Math.max(1, ...stats.dist);
  // guess counts: 1 to 6 always, more once a long word has been won that late
  const distRows = Math.max(6, ...stats.dist.map((n, i) => (n ? i + 1 : 0)));
  const Heading = standalone ? "h1" : "h2";
  const today =
    day === null ? "" : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

  return (
    <section id="bytle" ref={rootRef} className="section">
      <style>{BYTLE_CSS}</style>

      <header className="section-head">
        <Heading className="section-title">Bytle</Heading>
        <p className="section-lede">
          One tech word a day, 4 to 8 letters long, with a try for every
          letter plus one. Crack it, learn what it means, then send your
          grid to the group chat.
        </p>
      </header>

      <div className="bt-layout">
        <div className="bt-play">
          <div className="bt-bar">
            <span>{day === null ? "Bytle" : `Bytle #${day + 1} · ${letters} letters, ${tries} tries`}</span>
            <span>{today}</span>
          </div>

          <div className="bt-stage">
            <p className={`bt-toast ${toast ? "is-on" : ""}`} role="status">
              {toast}
            </p>
            <div className="bt-board" aria-hidden style={{ ["--n" as string]: letters }}>
              {Array.from({ length: tries }, (_, r) => {
                const guess = rows[r]?.guess;
                const isCurrent = r === rows.length && !done;
                const typed = guess ?? (isCurrent ? current : "");
                const marks = rows[r]?.marks ?? null;
                const winRow = won && r === lastIndex && revealRow === -1;
                return (
                  <div
                    key={r}
                    className={`bt-row ${isCurrent ? "is-current" : ""} ${shakeRow === r ? "is-shake" : ""} ${winRow ? "is-win" : ""}`}
                  >
                    {Array.from({ length: letters }, (_, c) => {
                      const ch = typed[c] ?? "";
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
          {account === "in" && (
            <form method="post" action="/auth/signout" className="bt-account">
              <span>
                Playing as <b>{game?.name}</b>
              </span>
              <button type="submit">Sign out</button>
            </form>
          )}
          {account === "guest" && (
            <p className="bt-account">
              <span>Playing as a guest</span>
              <a href="/auth/signin?next=/bytle">Sign in to save your score</a>
            </p>
          )}
        </div>

        <aside className="bt-side">
          {done && revealRow === -1 ? (
            <div className="bt-card bt-result">
              <p className="bt-verdict">{won ? verdict(lastIndex, tries) : "Build failed."}</p>
              <p className="bt-word">{answer}</p>
              <p className="bt-meaning">{meaning}</p>
              <button type="button" className="btn btn-accent w-full" onClick={share}>
                <Share2 size={18} aria-hidden />
                Share your grid
              </button>
              <p className="bt-next">
                Next word in <strong>{countdown || "--:--:--"}</strong>
              </p>
              {account === "guest" && (
                <div className="bt-save">
                  <p className="bt-h3">Save this result</p>
                  <p className="bt-copy">
                    Sign in and today&apos;s game moves to your account: {won ? "your points count" : "it counts"}, your
                    streak starts, and you&apos;re on the global leaderboard.
                  </p>
                  <SignIn inApp={inApp} label="Sign in to save your score" />
                </div>
              )}
            </div>
          ) : (
            <div className="bt-card">
              <h3 className="bt-h3">How it plays</h3>
              <p className="bt-copy">
                Guess the tech word. It&apos;s 4 to 8 letters long and changes every day, and you get one more try than
                it has letters (never fewer than six). After each guess the tiles show how close you were.
              </p>
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

          {account === "guest" && !done && (
            <div className="bt-card">
              <h3 className="bt-h3">Your stats</h3>
              <p className="bt-copy">
                Sign in with Google to keep your stats and streak on any device and climb the global leaderboard. You can
                sign in mid-game; today&apos;s guesses come with you.
              </p>
              <SignIn inApp={inApp} />
              <p className="bt-fine">Your Google name and points appear on the leaderboard.</p>
            </div>
          )}
          {account === "in" && (
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
              <div>
                <dt>Points</dt>
                <dd>{stats.points}</dd>
              </div>
            </dl>
            <ol className="bt-dist" aria-label="Guess distribution">
              {Array.from({ length: distRows }, (_, i) => stats.dist[i] ?? 0).map((n, i) => (
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
          )}

          <Leaderboard version={boardVersion} />
        </aside>
      </div>
    </section>
  );
}

const BYTLE_CSS = `
.bt-google { width: 100%; gap: 10px; margin-top: 16px; }
.bt-save { margin-top: 20px; padding-top: 18px; border-top: 1px dashed var(--line-strong); }
.bt-note { margin-bottom: 14px; padding: 10px 12px; border-radius: 10px; background: rgba(255, 191, 127, 0.1); border: 1px solid rgba(255, 191, 127, 0.3); font-size: 14px; line-height: 1.5; color: #ffd9b3; }
.bt-fine { margin-top: 12px; font-size: 13px; line-height: 1.5; color: var(--ink-faint); }
.bt-account { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; font-size: 14px; color: var(--ink-muted); }
.bt-account b { color: var(--ink); font-weight: 600; }
.bt-account a { font-weight: 600; color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.bt-account button { padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line-strong); font-size: 13px; font-weight: 600; color: var(--ink); }
.bt-account button:hover { background: rgba(255, 255, 255, 0.06); }
.bt-lb { display: grid; gap: 4px; margin-top: 14px; counter-reset: none; }
.bt-lb li { display: grid; grid-template-columns: 2.2rem 1fr auto; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; font-size: 14px; color: var(--ink); }
.bt-lb li:nth-child(-n + 3) .bt-lb-rank { color: var(--accent); }
.bt-lb li.is-me { background: var(--accent-soft); outline: 1px solid var(--accent-border); }
.bt-lb-you { margin-top: 6px; }
.bt-lb-rank { font-family: var(--font-mono); font-size: 13px; color: var(--ink-muted); }
.bt-lb-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bt-lb-pts { font-family: var(--font-mono); font-weight: 500; color: var(--accent-strong); }
.bt-layout { display: grid; gap: 28px; }
.bt-play { width: 100%; max-width: 30rem; margin-inline: auto; }
.bt-bar { display: flex; justify-content: space-between; margin-bottom: 14px; font-family: var(--font-mono); font-size: 13px; color: var(--ink-muted); }
.bt-bar span:first-child { color: var(--accent); }
.bt-stage { position: relative; }
.bt-toast { position: absolute; z-index: 2; left: 50%; top: -44px; transform: translate(-50%, -8px); padding: 8px 14px; border-radius: 999px; background: var(--ink); color: var(--bg); font-size: 14px; font-weight: 600; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.bt-toast.is-on { opacity: 1; transform: translate(-50%, 0); }

.bt-board { --n: 5; display: grid; gap: 7px; width: min(100%, calc(var(--n) * 4.4rem)); margin-inline: auto; perspective: 600px; }
.bt-row { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 7px; }
.bt-board .bt-tile { font-size: clamp(1.05rem, calc(30vw / var(--n)), 1.8rem); }
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

.bt-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 16px; text-align: center; }
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
