// Every event the club runs lives here, oldest first. Add new ones at the
// bottom. The site sorts them by itself: anything that hasn't ended shows
// under "Up next" on the events board, everything else moves to "Shipped"
// and the changelog. No code changes needed; add an entry, commit, done.
//
//   code      3-4 letter board code, e.g. "BTL"
//   start/end ISO time with the IST offset: "2026-04-08T14:30:00+05:30".
//             Leave both out if the date isn't known (old events).
//   register  Registration form link. Hidden once the event starts.
//   photos    Images in client/public/, shown in the past events timeline.

export interface ClubEvent {
  code: string;
  name: string;
  summary: string;
  venue?: string;
  start?: string;
  end?: string;
  register?: string;
  photos?: { src: string; caption: string }[];
}

export const EVENTS: ClubEvent[] = [
  {
    code: "BBI",
    name: "Beyond BYTE Ideathon",
    summary:
      "Our flagship ideathon: student teams pitched bold ideas beyond the classroom, from high-energy presentations to intense Q&A rounds.",
    photos: [
      { src: "/Events/1.jpg", caption: "Team presentations" },
      { src: "/Events/2.jpg", caption: "Audience engagement" },
      { src: "/Events/3.jpg", caption: "Team briefing" },
      { src: "/Events/4.jpg", caption: "Q&A session" },
      { src: "/Events/5.png", caption: "Event logo" },
    ],
  },
  {
    code: "B2B",
    name: "Bits to Bytes",
    summary:
      "A welcoming first step for newcomers: from the basics of tech to building real things, with the organizers who started it all.",
    photos: [
      { src: "/Events/bits-1.jpg", caption: "Student audience" },
      { src: "/Events/bits-2.jpg", caption: "Event engagement" },
      { src: "/Events/bits-3.png", caption: "Official poster" },
      { src: "/Events/bits-4.jpg", caption: "The Byte Club organizers" },
    ],
  },
  {
    code: "ASM",
    name: "Annual Assembly",
    summary:
      "The biggest gathering of our community: members old and new under one roof, and the group photos to prove it.",
    photos: [
      { src: "/Events/group-1.jpg", caption: "Mass gathering" },
      { src: "/Events/group-2.png", caption: "Community photo" },
    ],
  },
  {
    code: "BTL",
    name: "Beyond The Labs",
    summary:
      "Two hours, tools like Opal and Stitch, and one real problem to solve: see what you can build before time runs out.",
    venue: "North Auditorium",
    start: "2026-04-08T14:30:00+05:30",
    end: "2026-04-08T16:30:00+05:30",
    register:
      "https://docs.google.com/forms/d/e/1FAIpQLSesIVFQ6eHJcF4IgJrr2dmxLVfVOS_TR35nWEBjFIOLAGXLtQ/viewform",
    photos: [
      { src: "/Events/beyondlabs8.jpg", caption: "Closing moments" },
      { src: "/Events/beyondlabs3.jpg", caption: "Student participation" },
      { src: "/Events/beyondlabs4.jpg", caption: "Hands-on activity" },
      { src: "/Events/beyondlabs5.jpg", caption: "Interactive learning" },
      { src: "/Events/beyondlabs6.jpg", caption: "Technical discussion" },
      { src: "/Events/beyondlabs7.jpg", caption: "Team collaboration" },
    ],
  },
];

/* ───────── helpers (no need to touch these) ───────── */

const ms = (iso?: string) => (iso ? Date.parse(iso) : NaN);

// Undated events (from before dates were tracked) first in file order,
// then dated ones by date.
export const oldestFirst = (a: ClubEvent, b: ClubEvent) => (ms(a.start) || 0) - (ms(b.start) || 0);

export function splitEvents(now: number) {
  const upcoming = EVENTS.filter((e) => ms(e.end ?? e.start) > now).sort(oldestFirst);
  const past = EVENTS.filter((e) => !upcoming.includes(e)).sort(oldestFirst).reverse();
  return { upcoming, past };
}

export type BoardStatus = "REG OPEN" | "QUEUED" | "LIVE" | "SHIPPED";

export function statusOf(e: ClubEvent, now: number): BoardStatus {
  const start = ms(e.start);
  const end = ms(e.end ?? e.start);
  if (!(end > now)) return "SHIPPED";
  if (start <= now) return "LIVE";
  return e.register ? "REG OPEN" : "QUEUED";
}

const IST = "Asia/Kolkata";

export function boardDate(iso?: string) {
  if (!iso) return "-- ---";
  const d = new Date(iso);
  const day = d.toLocaleString("en-GB", { day: "2-digit", timeZone: IST });
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: IST });
  return `${day} ${month.slice(0, 3).toUpperCase()}`;
}

export function boardTime(iso?: string) {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: IST,
  });
}

export function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: IST });
}

export function boardYear(iso?: string) {
  return iso ? new Date(iso).toLocaleString("en-GB", { year: "numeric", timeZone: IST }) : "";
}

export function startsIn(iso: string | undefined, now: number) {
  const diff = ms(iso) - now;
  if (!(diff > 0)) return "";
  const mins = Math.floor(diff / 60000);
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  if (days > 0) return `Starts in ${days}d ${hours}h`;
  if (hours > 0) return `Starts in ${hours}h ${mins % 60}m`;
  return `Starts in ${mins}m`;
}

export const slugOf = (e: ClubEvent) => e.code.toLowerCase();
