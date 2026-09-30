"use client";

import { useEffect, useState } from "react";
import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import SplitFlapText from "@/components/SplitFlapText";
import {
  type BoardStatus,
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
// from Departures to Arrivals without a redeploy.
export function useNow(builtAt: number) {
  const [now, setNow] = useState(builtAt);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const STATUS_COLOR: Record<BoardStatus | "TBA", string> = {
  BOARDING: "var(--accent)",
  NOW: "var(--accent-strong)",
  SCHEDULED: "var(--ink)",
  TBA: "var(--ink)",
  ARRIVED: "var(--ink-muted)",
};

// Board cells flip in once from blank when the board scrolls into view,
// row by row, then hold.
function Flap({ text, delay, color = "var(--ink)" }: { text: string; delay: number; color?: string }) {
  return (
    <SplitFlapText
      words={["", text]}
      loop={false}
      padTo={0}
      cycleDelay={delay}
      flipDuration={0.06}
      stagger={0.035}
      flipsPerChar={4}
      tileColor="#151a1f"
      textColor={color}
      fontSize="var(--flap-size)"
      tileRadius={3}
      gap={2}
      aria-hidden
      style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
    />
  );
}

const rowDelay = (i: number) => 450 + i * 160;

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

/* ───────── boarding pass ───────── */

function BoardingPass({ e, status }: { e: ClubEvent; status: BoardStatus }) {
  const cal = calendarLinks(e);
  return (
    <div className="pass">
      <div className="pass-strip" aria-hidden>
        <span>The Byte Club</span>
        <span>Boarding pass</span>
      </div>

      <div className="pass-main">
        <h4 className="pass-name">{e.name}</h4>
        <p className="pass-sum">{e.summary}</p>
        <dl className="pass-fields">
          <div>
            <dt>Date</dt>
            <dd>
              {boardDate(e.start)} {boardYear(e.start)}
            </dd>
          </div>
          <div>
            <dt>Boards</dt>
            <dd>{boardTime(e.start)}</dd>
          </div>
          {e.end && (
            <div>
              <dt>Lands</dt>
              <dd>{boardTime(e.end)}</dd>
            </div>
          )}
          {e.venue && (
            <div>
              <dt>Gate</dt>
              <dd>{e.venue}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="pass-stub">
        <span className="pass-code" aria-hidden>
          {e.code}
        </span>
        {status === "NOW" ? (
          <p className="pass-now">Happening now{e.venue ? ` at ${e.venue}` : ""}.</p>
        ) : e.register ? (
          <a className="btn pass-btn" href={e.register} target="_blank" rel="noopener noreferrer">
            Register
          </a>
        ) : (
          <a className="btn pass-btn" href={JOIN_LINK.href} target="_blank" rel="noopener noreferrer">
            Get notified
          </a>
        )}
        {status !== "NOW" && (
          <>
            <a className="pass-link" href={cal.google} target="_blank" rel="noopener noreferrer">
              Add to Google Calendar
            </a>
            <a className="pass-link" href={cal.ics} download={`${slugOf(e)}.ics`}>
              Apple / Outlook (.ics)
            </a>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────── rows ───────── */

function DepartureRow({ e, i, now }: { e: ClubEvent; i: number; now: number }) {
  const status = statusOf(e, now);
  const d = rowDelay(i);
  const sub = status === "NOW" ? "Happening now" : startsIn(e.start, now);
  return (
    <li className="board-item">
      <div className="board-row dep">
        <span className="sr-only">
          {e.name}, {boardDate(e.start)} at {boardTime(e.start)}
          {e.venue ? `, ${e.venue}` : ""}. {status === "BOARDING" ? "Registration open." : sub}
        </span>
        <div className="c-code">
          <Flap text={e.code} delay={d} color="var(--ink-muted)" />
        </div>
        <div className="c-event" aria-hidden>
          <p className="ev-name">{e.name}</p>
        </div>
        <div className="c-date">
          <Flap text={boardDate(e.start)} delay={d + 60} />
        </div>
        <div className="c-time">
          <Flap text={boardTime(e.start)} delay={d + 120} />
        </div>
        <div className="c-venue" aria-hidden>
          {e.venue}
        </div>
        <div className="c-status">
          <Flap text={status} delay={d + 180} color={STATUS_COLOR[status]} />
          {sub && (
            <span className="c-sub" aria-hidden>
              {sub}
            </span>
          )}
        </div>
      </div>
      <div className="pass-wrap">
        <BoardingPass e={e} status={status} />
      </div>
    </li>
  );
}

function EmptyDeparture() {
  const d = rowDelay(0);
  return (
    <li className="board-item">
      <div className="board-row dep">
        <span className="sr-only">Next event: to be announced.</span>
        <div className="c-code">
          <Flap text="---" delay={d} color="var(--ink-muted)" />
        </div>
        <div className="c-event" aria-hidden>
          <p className="ev-name">Next event</p>
        </div>
        <div className="c-date">
          <Flap text="-- ---" delay={d + 60} />
        </div>
        <div className="c-time">
          <Flap text="--:--" delay={d + 120} />
        </div>
        <div className="c-venue" aria-hidden>
          To be announced
        </div>
        <div className="c-status">
          <Flap text="TBA" delay={d + 180} color={STATUS_COLOR.TBA} />
        </div>
      </div>
      <div className="board-note">
        <p>
          Nothing&apos;s on the board right now. New events are announced {JOIN_LINK.where} first.
        </p>
        <a className="btn btn-accent" href={JOIN_LINK.href} target="_blank" rel="noopener noreferrer">
          Get notified
        </a>
      </div>
    </li>
  );
}

function ArrivalRow({ e, i }: { e: ClubEvent; i: number }) {
  const d = rowDelay(i);
  const photos = e.photos?.length ?? 0;
  return (
    <li className="board-item">
      <a className="board-row arr" href={`#past-${slugOf(e)}`}>
        <span className="sr-only">
          {e.name}
          {e.start ? `, ${boardDate(e.start)} ${boardYear(e.start)}` : ""}.
          {photos ? ` View ${photos} photos.` : ""}
        </span>
        <div className="c-code">
          <Flap text={e.code} delay={d} color="var(--ink-muted)" />
        </div>
        <div className="c-event" aria-hidden>
          <p className="ev-name">{e.name}</p>
          {photos > 0 && <span className="ev-link">{photos} photos →</span>}
        </div>
        <div className="c-date">
          <Flap text={boardDate(e.start)} delay={d + 60} />
        </div>
        <div className="c-status">
          <Flap text="ARRIVED" delay={d + 120} color={STATUS_COLOR.ARRIVED} />
        </div>
      </a>
    </li>
  );
}

/* ───────── section ───────── */

export default function EventsBoard({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const { upcoming, past } = splitEvents(now);

  return (
    <section id="events" className="section">
      <style>{BOARD_CSS}</style>

      <header className="section-head">
        <h2 className="section-title">Events</h2>
        <p className="section-lede">
          Hands-on sessions, ideathons and build nights, open to all years.
          Here&apos;s what&apos;s next, and what we&apos;ve already run.
        </p>
      </header>

      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="board">
          <div className="board-head">
            <h3 className="board-title">
              <PlaneTakeoff aria-hidden size={18} />
              Departures
            </h3>
            <span className="board-meta">{boardTime(new Date(now).toISOString())} IST</span>
          </div>
          <div className="board-cols dep" aria-hidden>
            <span>Code</span>
            <span>Event</span>
            <span>Date</span>
            <span>Time</span>
            <span>Venue</span>
            <span>Status</span>
          </div>
          <ul>
            {upcoming.length === 0 ? (
              <EmptyDeparture />
            ) : (
              upcoming.map((e, i) => <DepartureRow key={e.code + e.start} e={e} i={i} now={now} />)
            )}
          </ul>
        </div>

        {past.length > 0 && (
          <div className="board">
            <div className="board-head">
              <h3 className="board-title">
                <PlaneLanding aria-hidden size={18} />
                Arrivals
              </h3>
              <span className="board-meta">{past.length} events</span>
            </div>
            <div className="board-cols arr" aria-hidden>
              <span>Code</span>
              <span>Event</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            <ul>
              {past.map((e, i) => (
                <ArrivalRow key={e.code + (e.start ?? "")} e={e} i={i + 1} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

const BOARD_CSS = `
.board { --flap-size: 16px; background: #07090b; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.board-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 14px 20px; background: #0c0f12; border-bottom: 1px solid var(--line); }
.board-title { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; letter-spacing: -0.01em; color: var(--ink); }
.board-title svg { color: var(--accent); }
.board-meta { font-family: var(--font-mono); font-size: 13px; color: var(--ink-muted); font-variant-numeric: tabular-nums; }
.board-cols, .board-row { display: grid; column-gap: 16px; row-gap: 10px; align-items: center; padding: 16px 20px; }
.board-cols { display: none; padding-block: 10px; border-bottom: 1px solid var(--line); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); }
.board-item + .board-item { border-top: 1px solid var(--line); }

.dep { grid-template-columns: auto auto minmax(0, 1fr); grid-template-areas: "code code status" "event event event" "date time venue"; }
.arr { grid-template-columns: auto auto minmax(0, 1fr); grid-template-areas: "code date status" "event event event"; color: inherit; text-decoration: none; transition: background-color 0.2s ease; }
.arr:hover { background: rgba(255, 255, 255, 0.025); }
.arr:hover .ev-link { color: var(--accent-strong); }

.c-code { grid-area: code; }
.c-event { grid-area: event; min-width: 0; }
.c-date { grid-area: date; }
.c-time { grid-area: time; }
.c-venue { grid-area: venue; min-width: 0; font-family: var(--font-body); font-size: 14px; color: var(--ink-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.c-status { grid-area: status; justify-self: end; text-align: right; }
.c-sub { display: block; margin-top: 6px; font-family: var(--font-body); font-size: 12px; color: var(--ink-muted); }
.ev-name { font-family: var(--font-display); font-weight: 500; font-size: 1.05rem; line-height: 1.25; letter-spacing: -0.01em; color: var(--ink); }
.ev-link { display: inline-block; margin-top: 4px; font-family: var(--font-body); font-size: 13px; color: var(--accent); transition: color 0.2s ease; }

@media (min-width: 900px) {
  .board { --flap-size: 17px; }
  .board-cols { display: grid; }
  .dep { grid-template-columns: 5.5rem minmax(0, 1fr) 7.25rem 5.75rem minmax(0, 11rem) 9.5rem; grid-template-areas: "code event date time venue status"; }
  .arr { grid-template-columns: 5.5rem minmax(0, 1fr) 7.25rem 9.5rem; grid-template-areas: "code event date status"; }
  .c-status { justify-self: start; text-align: left; }
}

.board-note { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; margin: 0 20px 20px; padding: 16px 18px; border: 1px dashed var(--line-strong); border-radius: 10px; }
.board-note p { font-family: var(--font-body); font-size: 15px; line-height: 1.55; color: var(--ink-muted); max-width: 46ch; }

.pass-wrap { padding: 0 20px 20px; }
.pass { position: relative; display: grid; grid-template-columns: minmax(0, 1fr); background: #edf1f4; color: #0a0b0d; border-radius: 12px; overflow: hidden; }
.pass :focus-visible { outline-color: #0a0b0d; }
.pass-strip { grid-column: 1 / -1; display: flex; justify-content: space-between; padding: 9px 20px; background: var(--accent); color: #031018; font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }
.pass-main { padding: 20px; }
.pass-name { font-family: var(--font-display); font-weight: 600; font-size: clamp(1.35rem, 3vw, 1.75rem); line-height: 1.1; letter-spacing: -0.02em; }
.pass-sum { margin-top: 8px; max-width: 52ch; font-family: var(--font-body); font-size: 15px; line-height: 1.6; color: #3b444d; }
.pass-fields { margin-top: 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 24px; }
.pass-fields dt { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #4b5560; }
.pass-fields dd { margin-top: 2px; font-family: var(--font-display); font-weight: 500; font-size: 1rem; }
.pass-stub { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 20px; border-top: 2px dashed #c3cbd2; }
.pass-stub::before, .pass-stub::after { content: ""; position: absolute; top: -11px; width: 20px; height: 20px; border-radius: 50%; background: #07090b; }
.pass-stub::before { left: -10px; }
.pass-stub::after { right: -10px; }
.pass-code { font-family: var(--font-display); font-weight: 700; font-size: 2rem; line-height: 1; letter-spacing: 0.02em; margin-bottom: 4px; }
.pass-btn { align-self: stretch; background: #0a0b0d; color: #fff; }
.pass-btn:hover { background: #1d2329; }
.pass-now { font-family: var(--font-body); font-weight: 600; font-size: 15px; }
.pass-link { font-family: var(--font-body); font-size: 14px; color: #0a0b0d; text-decoration: underline; text-decoration-color: #9aa3ab; text-underline-offset: 3px; }
.pass-link:hover { text-decoration-color: #0a0b0d; }

@media (min-width: 720px) {
  .pass { grid-template-columns: minmax(0, 1fr) 15rem; }
  .pass-strip { grid-column: 1; }
  .pass-stub { grid-column: 2; grid-row: 1 / span 2; }
  .pass-fields { grid-template-columns: repeat(4, auto); justify-content: start; column-gap: 36px; }
  .pass-stub { justify-content: center; border-top: 0; border-left: 2px dashed #c3cbd2; }
  .pass-stub::before, .pass-stub::after { left: -11px; right: auto; }
  .pass-stub::before { top: -10px; }
  .pass-stub::after { top: auto; bottom: -10px; }
}
`;
