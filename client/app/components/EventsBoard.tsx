"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Hammer, Lightbulb, Search, Sprout, Users, type LucideIcon } from "lucide-react";
import {
  EVENTS,
  type ClubEvent,
  boardDate,
  boardTime,
  boardYear,
  slugOf,
  splitEvents,
  startsIn,
  statusOf,
} from "@/content/events";
import { JOIN_LINK } from "@/content/site";

// Starts from the build-time timestamp so server and first client render
// agree, then switches to the visitor's clock. That's what moves an event
// from "Up next" to "Shipped" without a redeploy.
export function useNow(builtAt: number) {
  const [now, setNow] = useState(builtAt);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ───────── calendar links ───────── */

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
const where = (e: ClubEvent) => `${e.venue}, The National Institute of Engineering, Mysuru`;

function calendarLinks(e: ClubEvent) {
  const start = e.start!;
  const end = e.end ?? e.start!;
  const details = e.register ? `${e.summary}\n\nRegister: ${e.register}` : e.summary;
  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(e.name)}` +
    `&dates=${utc(start)}/${utc(end)}` +
    `&location=${encodeURIComponent(where(e))}` +
    `&details=${encodeURIComponent(details)}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Byte Club//Events//EN",
    "BEGIN:VEVENT",
    `UID:${slugOf(e)}-${utc(start)}@byteclubnie`,
    `DTSTAMP:${utc(start)}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${icsText(e.name)}`,
    `LOCATION:${icsText(where(e))}`,
    `DESCRIPTION:${icsText(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { google, ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
}

/* ───────── receipt pieces ───────── */

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="r-line">
      <span>{k}</span>
      <i aria-hidden />
      <span>{v}</span>
    </div>
  );
}

function Barcode({ text }: { text: string }) {
  // bar, gap, bar, gap… widths taken from the characters' bits
  const widths = [...text].flatMap((ch) => {
    const c = ch.charCodeAt(0);
    return [1 + (c & 1), 1 + ((c >> 1) & 1), 1 + ((c >> 2) & 1) * 2, 1 + ((c >> 4) & 1)];
  });
  let x = 0;
  const bars = widths.map((w, i) => {
    const bar = i % 2 === 0 ? <rect key={i} x={x} width={w} height="40" /> : null;
    x += w;
    return bar;
  });
  return (
    <svg className="r-barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden>
      {bars}
    </svg>
  );
}

function NextEvent({ e, now }: { e: ClubEvent; now: number }) {
  const status = statusOf(e, now);
  const cal = calendarLinks(e);
  const sub = status === "LIVE" ? `Happening now${e.venue ? ` at ${e.venue}` : ""}` : startsIn(e.start, now);
  return (
    <div className="r-next">
      <p className="r-big">
        <span className="r-code">{e.code}</span> {e.name}
      </p>
      <p className="r-sum">{e.summary}</p>
      <div className="r-lines">
        <Line k="Date" v={`${boardDate(e.start)} ${boardYear(e.start)}`} />
        <Line k="Time" v={`${boardTime(e.start)}${e.end ? `–${boardTime(e.end)}` : ""}`} />
        {e.venue && <Line k="Venue" v={e.venue} />}
      </div>
      {sub && <p className="r-note">{sub}</p>}
      {status !== "LIVE" && (
        <>
          <a className="r-btn" href={e.register ?? JOIN_LINK.href} target="_blank" rel="noopener noreferrer">
            {e.register ? "Register" : "Get notified"} →
          </a>
          <p className="r-cal">
            <a href={cal.google} target="_blank" rel="noopener noreferrer">
              + Google Calendar
            </a>
            <a href={cal.ics} download={`${slugOf(e)}.ics`}>
              + Apple / Outlook
            </a>
          </p>
        </>
      )}
    </div>
  );
}

function Receipt({ now, serial }: { now: number; serial: number }) {
  const { upcoming, past } = splitEvents(now);
  const photos = past.reduce((n, e) => n + (e.photos?.length ?? 0), 0);
  const printed = new Date(now).toISOString();
  const tag = upcoming[0] ? statusOf(upcoming[0], now) : "TBA";

  return (
    <div className="receipt">
      <header className="r-head">
        <p className="r-brand">The Byte Club</p>
        <p>NIE, Mysuru · Technical club</p>
        <p className="r-doc">Event receipt</p>
        <div className="r-meta">
          <span>No. {String(serial).padStart(4, "0")}</span>
          <span>
            {boardDate(printed)} {boardYear(printed)} · {boardTime(printed)}
          </span>
        </div>
      </header>

      <hr />
      <section aria-labelledby="r-up">
        <div className="r-title">
          <h3 id="r-up">Up next</h3>
          <span className="r-tag">{tag}</span>
        </div>
        {upcoming.length ? (
          upcoming.map((e) => <NextEvent key={e.code + e.start} e={e} now={now} />)
        ) : (
          <div className="r-next">
            <p className="r-big">Next event</p>
            <div className="r-lines">
              <Line k="Date" v="TBA" />
              <Line k="Venue" v="TBA" />
            </div>
            <p className="r-note">New events are announced {JOIN_LINK.where} first.</p>
            <a className="r-btn" href={JOIN_LINK.href} target="_blank" rel="noopener noreferrer">
              Get notified →
            </a>
          </div>
        )}
      </section>

      <hr />
      <div className="r-lines">
        <Line k="Events shipped" v={String(past.length)} />
        <Line k="Photos on file" v={String(photos)} />
        <Line k="Open to" v="All years" />
        <Line k="Next event" v={upcoming[0] ? boardDate(upcoming[0].start) : "TBA"} />
      </div>

      <hr />
      <footer className="r-foot">
        <Barcode text="THEBYTECLUB" />
        <p>Thank you for building with us</p>
        <p>See you at the next one</p>
      </footer>
    </div>
  );
}

/* ───────── what we run, how to get in ───────── */

// The kinds of events the club runs, each pointing at the last one it held
// (its photos are in the changelog).
const FORMATS: { name: string; blurb: string; icon: LucideIcon; example: string }[] = [
  { name: "Ideathons", blurb: "Pitch a bold idea as a team, then take the panel's questions.", icon: Lightbulb, example: "BBI" },
  { name: "Beginner sessions", blurb: "From the basics of tech to building something real. No experience needed.", icon: Sprout, example: "B2B" },
  { name: "Build sessions", blurb: "A time limit, one real problem, and the tools to solve it.", icon: Hammer, example: "BTL" },
  { name: "Treasure hunts", blurb: "Themed clue hunts: crack every clue before time runs out.", icon: Search, example: "UPSD" },
  { name: "Meetups", blurb: "The whole community in one room, members old and new.", icon: Users, example: "ASM" },
];

const STEPS = [
  { title: "It's announced", text: `New events are posted ${JOIN_LINK.where} first.` },
  { title: "You register", text: "Sign up with the form linked in the post, or on the receipt here." },
  { title: "You show up", text: "Open to all years, and no experience needed." },
  { title: "We post the photos", text: "Every event ends up in the changelog below." },
];

function WhatWeRun() {
  return (
    <div>
      <h3 className="ev-h3">What we run</h3>
      <ul className="ev-formats">
        {FORMATS.map((f) => {
          const last = EVENTS.find((e) => e.code === f.example);
          const Icon = f.icon;
          return (
            <li key={f.name} className="ev-format">
              <span className="ev-icon">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <p className="ev-format-name">{f.name}</p>
                <p className="ev-format-blurb">{f.blurb}</p>
                {last && (
                  <a className="ev-format-link" href={`#past-${slugOf(last)}`}>
                    Last one: {last.name} ↓
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function HowToGetIn() {
  return (
    <div>
      <h3 className="ev-h3">How to get in</h3>
      <ol className="ev-steps">
        {STEPS.map((step, i) => (
          <li key={step.title} className="ev-step">
            <span className="ev-step-n" aria-hidden>
              {i + 1}
            </span>
            <div>
              <p className="ev-step-title">{step.title}</p>
              <p className="ev-step-text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <a className="btn btn-accent ev-cta" href={JOIN_LINK.href} target="_blank" rel="noopener noreferrer">
        {JOIN_LINK.label}
      </a>
    </div>
  );
}

/* ───────── section ───────── */

// How each printer pushes paper out: thermal in quick small steps that each
// shove and settle, dot matrix a whole text line per jump.
const PRINTERS = [
  { id: "thermal", label: "Thermal", step: 12, ms: 34, ease: "cubic-bezier(0.3, 0, 0.1, 1)" },
  { id: "matrix", label: "Dot matrix", step: 22, ms: 80, ease: "steps(1, start)" },
] as const;
type Printer = (typeof PRINTERS)[number]["id"];

// Feeds a sheet out of the slot a step at a time, the way a printer pushes
// paper out as it prints. The sheet starts tucked inside the printer.
function feed(sheet: HTMLElement, p: Printer) {
  const { step, ms, ease } = PRINTERS.find((x) => x.id === p)!;
  const h = sheet.offsetHeight;
  const n = Math.max(1, Math.ceil(h / step));
  const frames: Keyframe[] = Array.from({ length: n + 1 }, (_, i) => ({
    transform: `translateY(${Math.min(0, i * step - h)}px)`,
    offset: i / n,
    easing: ease,
  }));
  return sheet.animate(frames, { duration: n * ms, fill: "both" });
}

// The club's events as a printout, printed when the section comes into view.
// Pick a printer (thermal receipt or dot-matrix fanfold); switching or
// "Reprint" tears the paper off and prints a fresh copy.
export default function EventsBoard({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const live = splitEvents(now).upcoming.length > 0;
  const stage = useRef<HTMLDivElement>(null);
  const [serial, setSerial] = useState(1);
  const [torn, setTorn] = useState(false);
  const [printer, setPrinter] = useState<Printer>("thermal");
  // printing starts the first time the section is on screen
  const [started, setStarted] = useState(false);
  const machine = useRef<HTMLDivElement>(null);
  const hang = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Each new sheet feeds out of the slot while the printer runs, then the
  // paper settles with a little swing. (Before paint, so it never flashes.)
  useLayoutEffect(() => {
    const paper = hang.current;
    if (!started || !paper) return;
    const body = machine.current!;
    body.classList.add("is-busy");
    paper.classList.add("is-feeding");
    const run = feed(paper.firstElementChild as HTMLElement, printer);
    run.finished.then(
      () => {
        body.classList.remove("is-busy");
        paper.classList.remove("is-feeding");
        paper.animate({ rotate: ["0deg", "0.9deg", "-0.5deg", "0.2deg", "0deg"] }, { duration: 1000, easing: "ease-out" });
      },
      () => {} // cancelled: torn off mid-print
    );
    return () => {
      run.cancel();
      body.classList.remove("is-busy");
    };
  }, [started, serial, printer]);

  const print = (next: Printer) => {
    if (torn) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTorn(true);
    setTimeout(
      () => {
        setTorn(false);
        setPrinter(next);
        setSerial((s) => s + 1);
      },
      calm ? 0 : 650
    );
  };

  return (
    <section id="events" className="section">
      <style>{RECEIPT_CSS}</style>
      <div className="ev-grid">
        <header className="section-head ev-head" style={{ marginBottom: 0 }}>
          <h2 className="section-title">Events</h2>
          <p className="section-lede">
            Hands-on sessions, ideathons and build nights, open to all years.
            Here&apos;s what&apos;s next, what we run, and how to get in.
          </p>
        </header>
        <div className="ev-body">
          <WhatWeRun />
          <HowToGetIn />
        </div>

        <div ref={stage} className="stage" data-printer={printer}>
          <div className="printer-bar">
            <div className="printer-pick" role="group" aria-label="Printer">
              {PRINTERS.map((p) => (
                <button key={p.id} type="button" aria-pressed={printer === p.id} onClick={() => printer !== p.id && print(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
            <button type="button" className="printer-btn" onClick={() => print(printer)}>
              Reprint
            </button>
          </div>
          <div ref={machine} className="printer" aria-hidden>
            {printer === "thermal" ? (
              <>
                <span className={`printer-led ${live ? "is-live" : ""}`} />
                <span className="printer-label">Byte Club · events</span>
                <span className="printer-slot" />
                <span className="printer-cutter" />
              </>
            ) : (
              <>
                <span className="matrix-panel">
                  <i className={`printer-led ${live ? "is-live" : ""}`} />
                  On line
                </span>
                <span className="matrix-window">
                  <span className="matrix-head" />
                </span>
                <span className="matrix-panel">Form feed</span>
                <span className="printer-slot" />
              </>
            )}
          </div>
          <div key={serial} ref={hang} className={`receipt-hang ${torn ? "is-torn" : ""}`}>
            <Receipt now={now} serial={serial} />
          </div>
        </div>
      </div>
    </section>
  );
}

const RECEIPT_CSS = `
/* phones: intro, the printout, then the details. desktop: printout on the right */
.ev-grid { display: grid; gap: 44px; grid-template-areas: "head" "stage" "body"; }
.ev-head { grid-area: head; }
.stage { grid-area: stage; }
.ev-body { grid-area: body; display: grid; gap: 44px; }
@media (min-width: 960px) {
  .ev-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 31rem); grid-template-areas: "head stage" "body stage"; grid-template-rows: auto 1fr; gap: 40px 72px; align-items: start; }
}

.ev-h3 { font-family: var(--font-display); font-weight: 600; font-size: 1.25rem; letter-spacing: -0.01em; color: var(--ink); }
.ev-formats { margin-top: 12px; }
.ev-format { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 14px; padding: 16px 0; border-top: 1px solid var(--line); }
.ev-format:last-child { border-bottom: 1px solid var(--line); }
.ev-icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent); }
.ev-format-name { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; color: var(--ink); }
.ev-format-blurb { margin-top: 2px; max-width: 52ch; font-size: 15px; line-height: 1.55; color: var(--ink-muted); }
.ev-format-link { display: inline-block; margin-top: 6px; font-size: 14px; font-weight: 500; color: var(--accent); transition: color 0.2s ease; }
.ev-format-link:hover { color: var(--accent-strong); }
.ev-steps { display: grid; gap: 16px; margin-top: 16px; }
.ev-step { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 12px; }
.ev-step-n { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line-strong); font-family: var(--font-mono); font-size: 13px; color: var(--ink); }
.ev-step-title { font-size: 15px; font-weight: 600; color: var(--ink); }
.ev-step-text { margin-top: 2px; font-size: 14.5px; line-height: 1.5; color: var(--ink-muted); }
.ev-cta { margin-top: 24px; }
@media (min-width: 640px) { .ev-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 28px; } }

/* the printer */
.stage { --r-paper: #f5f2ea; --r-ink: #16181a; position: relative; width: min(100%, 31rem); margin-inline: auto; }
/* controls: pick a printer, reprint */
.printer-bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.printer-pick { display: inline-flex; padding: 3px; border-radius: 999px; border: 1px solid var(--line-strong); background: rgba(255, 255, 255, 0.03); }
.printer-pick button { padding: 6px 13px; border-radius: 999px; font-family: var(--font-body); font-size: 13px; font-weight: 600; color: var(--ink-muted); cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease; }
.printer-pick button:hover { color: var(--ink); }
.printer-pick button[aria-pressed="true"] { background: var(--ink); color: #0a0b0d; }
.printer-btn { padding: 7px 14px; border-radius: 999px; border: 1px solid var(--line-strong); background: rgba(255, 255, 255, 0.04); font-family: var(--font-body); font-size: 13px; font-weight: 600; color: var(--ink); cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease; }
.printer-btn:hover { background: rgba(255, 255, 255, 0.1); }
.printer-btn:active, .printer-pick button:active { transform: translateY(1px); }

.printer { position: relative; z-index: 2; display: flex; align-items: center; gap: 10px; }
.printer-led { flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: #ffbf7f; box-shadow: 0 0 10px #ffbf7f; }
.printer-led.is-live { background: #7ee0b5; box-shadow: 0 0 10px #7ee0b5; }
.printer.is-busy .printer-led { animation: led 0.24s steps(2) infinite; }
@keyframes led { 50% { opacity: 0.3; } }
/* the motor hums while it prints */
.printer.is-busy { animation: buzz 0.1s steps(2) infinite; }
@keyframes buzz { 50% { transform: translateY(0.6px); } }
.printer-slot { position: absolute; left: 16px; right: 16px; bottom: 7px; height: 6px; border-radius: 3px; background: #040506; box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.9); }

/* thermal: a small black POS printer with a serrated tear bar */
[data-printer="thermal"] .printer { height: 64px; padding: 0 16px 14px; border-radius: 18px 18px 10px 10px; border: 1px solid var(--line-strong);
  background: radial-gradient(120% 90% at 50% 0%, #2d353d, transparent 60%), linear-gradient(180deg, #232a31, #12161a);
  box-shadow: 0 18px 30px -18px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -10px 18px -12px rgba(0, 0, 0, 0.8); }
[data-printer="thermal"] .printer::before { content: ""; position: absolute; left: 16px; right: 16px; top: 22px; height: 1px; background: rgba(255, 255, 255, 0.06); }
.printer-label { flex: 1; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-muted); }
.printer-cutter { position: absolute; left: 20px; right: 20px; bottom: 2px; height: 5px; background: linear-gradient(180deg, #d5dbe0, #7f8890);
  -webkit-mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 6px 100%; mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 6px 100%; }

/* dot matrix: a beige desk printer whose head shuttles while it prints */
[data-printer="matrix"] .printer { height: 78px; padding: 0 14px 16px; justify-content: space-between; border-radius: 12px 12px 6px 6px; border: 1px solid #a69f8e;
  background: linear-gradient(180deg, #e3ddcf, #c9c2b1); box-shadow: 0 18px 30px -16px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -8px 14px -10px rgba(60, 50, 30, 0.5); }
[data-printer="matrix"] .printer::before, [data-printer="matrix"] .printer::after { content: ""; position: absolute; top: 24px; width: 10px; height: 26px; border-radius: 3px; background: linear-gradient(90deg, #8d8676, #b8b09d, #8d8676); }
[data-printer="matrix"] .printer::before { left: -9px; }
[data-printer="matrix"] .printer::after { right: -9px; }
.matrix-panel { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #5d5646; }
.matrix-window { position: relative; flex: 1; height: 26px; margin: 0 6px; overflow: hidden; border-radius: 5px; background: linear-gradient(180deg, rgba(20, 22, 26, 0.85), rgba(40, 44, 50, 0.7)); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6); }
.matrix-window::before { content: ""; position: absolute; left: 4px; right: 4px; top: 12px; height: 2px; background: #6a7178; }
.matrix-head { position: absolute; top: 5px; left: 4px; width: 18px; height: 16px; border-radius: 3px; background: linear-gradient(180deg, #a8adb3, #6c7278); }
.printer.is-busy .matrix-head { animation: head 0.34s ease-in-out infinite alternate; }
@keyframes head { to { left: calc(100% - 22px); } }
[data-printer="matrix"] .printer-slot { left: 10px; right: 10px; background: #2a2620; }

/* the paper: comes out of the slot (anything above it stays inside the printer) */
.receipt-hang { position: relative; z-index: 1; margin: -9px 24px 0; transform-origin: 50% 0; clip-path: inset(0 -48px -160px -48px); }
.receipt-hang::before { content: ""; position: absolute; inset: 14px 8px 4px; box-shadow: 0 34px 50px -24px rgba(0, 0, 0, 0.9); pointer-events: none; transition: opacity 0.5s ease; }
.receipt-hang.is-feeding::before { opacity: 0; transition: none; }
.receipt-hang.is-torn { animation: r-tear 0.65s cubic-bezier(0.55, 0, 0.75, 0.2) forwards; }
@keyframes r-tear { 15% { transform: translateY(8px) rotate(-1.5deg); } 100% { transform: translateY(160px) rotate(-9deg); opacity: 0; } }

.receipt { position: relative; padding: 26px 22px 36px; color: var(--r-ink); font-family: var(--font-mono); font-size: 13px; line-height: 1.5;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.035), transparent 10%, transparent 90%, rgba(0, 0, 0, 0.035)), var(--r-paper);
  -webkit-mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%;
  mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%; }
.receipt ::selection { background: var(--r-ink); color: var(--r-paper); }
.receipt :focus-visible { outline: 2px solid var(--r-ink); outline-offset: 2px; }
.receipt hr { margin: 18px 0; border: 0; border-top: 2px dashed rgba(22, 24, 26, 0.3); }

.r-head { text-align: center; }
.r-head p { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; }
.r-brand { font-family: var(--font-display); font-weight: 700; font-size: 1.65rem !important; line-height: 1.1; letter-spacing: -0.02em !important; text-transform: none !important; }
.r-doc { display: inline-block; margin-top: 12px; padding: 2px 10px; background: var(--r-ink); color: var(--r-paper); font-weight: 600; }
.r-meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 14px; font-size: 12px; font-variant-numeric: tabular-nums; }

.r-title { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; text-transform: uppercase; }
.r-title h3 { font-weight: 700; font-size: 13px; letter-spacing: 0.1em; }
.r-tag { padding: 0 8px; background: var(--r-ink); color: var(--r-paper); font-weight: 600; font-size: 12px; }
.r-next { margin-top: 10px; }
.r-big { font-family: var(--font-display); font-weight: 700; font-size: 1.3rem; line-height: 1.15; letter-spacing: -0.01em; }
.r-sum { margin-top: 8px; font-family: var(--font-body); font-size: 14.5px; line-height: 1.6; color: #3a4046; }
.r-lines { display: grid; gap: 2px; margin-top: 10px; }
.r-line { display: flex; align-items: baseline; gap: 8px; text-transform: uppercase; font-variant-numeric: tabular-nums; }
.r-line i { flex: 1; min-width: 12px; transform: translateY(-4px); border-bottom: 2px dotted rgba(22, 24, 26, 0.35); }
.r-note { margin-top: 10px; color: #3e444a; }
.r-btn { display: flex; justify-content: center; margin-top: 12px; padding: 11px; background: var(--r-ink); color: var(--r-paper); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; transition: background-color 0.2s ease; }
.r-btn:hover { background: #2c3238; }
.r-cal { display: flex; flex-wrap: wrap; gap: 4px 16px; margin-top: 10px; font-size: 12px; }
.r-cal a { text-decoration: underline; text-underline-offset: 3px; }

.r-row { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; font-variant-numeric: tabular-nums; color: #4a5056; }
.r-code { font-weight: 700; }
.r-more { display: inline-block; margin-top: 10px; font-size: 13px; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
.r-more:hover { text-decoration-thickness: 2px; }

.r-foot { text-align: center; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; }
.r-barcode { display: block; width: 100%; height: 46px; margin-bottom: 12px; fill: var(--r-ink); }

/* dot-matrix paper: fanfold greenbar, tractor holes and perforations down both edges */
[data-printer="matrix"] .receipt-hang { margin-inline: 12px; }
[data-printer="matrix"] .receipt { --r-paper: #fbfbf6; --r-ink: #262a52; padding: 24px 42px 30px;
  background: repeating-linear-gradient(180deg, transparent 0 58px, rgba(126, 196, 150, 0.2) 58px 116px), var(--r-paper);
  -webkit-mask: radial-gradient(circle at 12px 9px, #0000 4px, #000 4.6px) 0 0 / 24px 18px repeat-y, radial-gradient(circle at 12px 9px, #0000 4px, #000 4.6px) 100% 0 / 24px 18px repeat-y, linear-gradient(#000 0 0) 50% 0 / calc(100% - 48px) 100% no-repeat;
  mask: radial-gradient(circle at 12px 9px, #0000 4px, #000 4.6px) 0 0 / 24px 18px repeat-y, radial-gradient(circle at 12px 9px, #0000 4px, #000 4.6px) 100% 0 / 24px 18px repeat-y, linear-gradient(#000 0 0) 50% 0 / calc(100% - 48px) 100% no-repeat; }
[data-printer="matrix"] .receipt::before, [data-printer="matrix"] .receipt::after { content: ""; position: absolute; top: 0; bottom: 0; border-left: 1px dashed rgba(38, 42, 82, 0.28); }
[data-printer="matrix"] .receipt::before { left: 24px; }
[data-printer="matrix"] .receipt::after { right: 24px; }
[data-printer="matrix"] .receipt hr { border-top-style: dotted; }
[data-printer="matrix"] .r-brand { font-family: var(--font-mono); font-size: 1.3rem !important; letter-spacing: 0.14em !important; text-transform: uppercase !important; }
[data-printer="matrix"] .r-big { font-family: var(--font-mono); font-size: 1.1rem; letter-spacing: 0.04em; text-transform: uppercase; }
[data-printer="matrix"] :is(.r-doc, .r-tag) { background: none; color: var(--r-ink); box-shadow: inset 0 0 0 1.5px var(--r-ink); }
[data-printer="matrix"] .r-btn { background: none; color: var(--r-ink); box-shadow: inset 0 0 0 2px var(--r-ink); }
[data-printer="matrix"] .r-btn:hover { background: var(--r-ink); color: var(--r-paper); }
/* waits inside the printer until it's fed out (only once the script has armed it) */
.stage.is-armed .receipt { transform: translateY(-100%); }

@media (prefers-reduced-motion: reduce) {
  .printer.is-busy, .printer.is-busy .printer-led { animation: none; }
}
`;
