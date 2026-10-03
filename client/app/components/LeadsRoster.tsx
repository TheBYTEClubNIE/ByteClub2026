"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ClipboardList, Code2, Handshake, PenTool, Sparkles, type LucideIcon } from "lucide-react";
import { DOMAINS, LEADS, type Domain, type Lead, isProfileUrl, photoStyle, zoomedSizes } from "@/content/team";
import { Holo } from "./effects";
import { GithubIcon, InstagramIcon, LinkedInIcon } from "./DisplayCore";

const ICON: Record<Domain, LucideIcon> = {
  tech: Code2,
  design: PenTool,
  creative: Sparkles,
  management: ClipboardList,
  outreach: Handshake,
};
const TOTAL = DOMAINS.length;
const colorOf = (id: Domain) => DOMAINS.find((d) => d.id === id)!.color;
const labelOf = (id: Domain) => DOMAINS.find((d) => d.id === id)!.label;

const [HEAD, ...REST] = LEADS;
const OWNERS = REST.map((l) => l.arsenal[0]);
// One lane per domain, leaving the club lead's photo and ending at the last
// lead of that domain. The lane that ends first sits nearest the content,
// so no line ever crosses another.
const LANES = [...new Set(OWNERS)].sort((a, b) => OWNERS.lastIndexOf(b) - OWNERS.lastIndexOf(a));

type Pt = { x: number; y: number };
interface Bus {
  w: number;
  h: number;
  lanes: { d: Domain; x: number; top: number; bottom: number; path: string }[];
  branches: { d: Domain; path: string }[];
  pins: Pt[];
  gap: number;
}

// Lane geometry comes from where the photos actually sit, so the lines
// follow the layout at every breakpoint. Spacing is set in CSS.
function layoutBus(el: HTMLElement): Bus {
  const box = el.getBoundingClientRect();
  const css = getComputedStyle(el);
  const gap = parseFloat(css.getPropertyValue("--lane-gap"));
  const x0 = parseFloat(css.getPropertyValue("--lane-x0"));
  const pins = [...el.querySelectorAll<HTMLElement>("[data-pin]")].map((p) => {
    const r = p.getBoundingClientRect();
    return { x: r.left - box.left, y: r.top - box.top + r.height / 2 };
  });
  const [src, ...ends] = pins;
  const n = LANES.length;
  const R = (n - 1) * gap + 4; // concentric corners as the lines leave the club lead

  const lanes = LANES.map((d, k) => {
    const x = x0 + k * gap;
    const r = R - k * gap;
    const y = src.y + (k - (n - 1) / 2) * gap;
    const end = ends[OWNERS.lastIndexOf(d)];
    const t = Math.min(10, end.x - x);
    return {
      d,
      x,
      top: y + r,
      bottom: end.y - t,
      path: `M${src.x} ${y}H${x + r}A${r} ${r} 0 0 0 ${x} ${y + r}V${end.y - t}A${t} ${t} 0 0 0 ${x + t} ${end.y}H${end.x}`,
    };
  });
  const branches = REST.flatMap((l, i) => {
    const d = l.arsenal[0];
    if (OWNERS.lastIndexOf(d) === i) return [];
    const x = lanes.find((ln) => ln.d === d)!.x;
    const p = ends[i];
    const t = Math.min(10, p.x - x);
    return [{ d, path: `M${x} ${p.y - t}A${t} ${t} 0 0 0 ${x + t} ${p.y}H${p.x}` }];
  });
  return { w: Math.max(...pins.map((p) => p.x)) + 4, h: box.height, lanes, branches, pins, gap };
}

/* ───────── pieces ───────── */

// The club lead's photo in a ring of the five domains (drawn in a 360 box).
const SEG = 360 / TOTAL;
const BAND = 158; // middle of the coloured band
const RIM = 175;
const arc = (r: number, a0: number, a1: number, flip = false) => {
  // rounded so server and browser maths print the same path (no hydration mismatch)
  const pt = (deg: number) =>
    `${(180 + r * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(180 + r * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
  return flip ? `M${pt(a1)}A${r} ${r} 0 0 0 ${pt(a0)}` : `M${pt(a0)}A${r} ${r} 0 0 1 ${pt(a1)}`;
};

function Dial({ lead, hot, onHot }: { lead: Lead; hot: Domain | null; onHot: (d: Domain | null) => void }) {
  const covered = DOMAINS.filter((d) => lead.arsenal.includes(d.id));
  return (
    <div className="dial">
      <span className="dial-pin" data-pin aria-hidden />
      <Holo className="dial-holo">
        <div className="dial-photo" data-holo-card>
          <Image
            src={lead.image}
            alt={lead.name}
            fill
            sizes={zoomedSizes("(min-width: 1024px) 272px, (min-width: 768px) 200px, 15rem", lead.frame?.zoom)}
            quality={90}
            className="object-cover"
            style={photoStyle(lead.frame)}
          />
        </div>
      </Holo>
      <svg className="dial-ring" viewBox="0 0 360 360" aria-hidden>
        <circle className="dial-track" cx="180" cy="180" r="179" />
        {DOMAINS.map((d, i) => {
          const a0 = -90 - SEG / 2 + i * SEG + 4;
          const a1 = a0 + SEG - 8;
          const mid = (((a0 + a1) / 2 + 540) % 360) - 180;
          const on = lead.arsenal.includes(d.id);
          return (
            <g
              key={d.id}
              className={`dial-seg ${on ? "" : "is-off"} ${hot && hot !== d.id ? "is-dim" : ""}`}
              style={{ ["--c" as string]: d.color, ["--i" as string]: i }}
              onPointerEnter={(e) => e.pointerType === "mouse" && on && onHot(d.id)}
              onPointerLeave={() => onHot(null)}
            >
              <path className="dial-band" d={arc(BAND, a0, a1)} />
              <path className="dial-rim" d={arc(RIM, a0, a1)} pathLength={1} />
              {/* labels on the lower half run the other way so they read upright */}
              <path id={`dial-${d.id}`} d={arc(BAND, a0, a1, mid > 0 && mid < 180)} fill="none" />
              <text className="dial-label" textAnchor="middle" dominantBaseline="central">
                <textPath href={`#dial-${d.id}`} startOffset="50%">
                  {d.label.toUpperCase()}
                </textPath>
              </text>
            </g>
          );
        })}
      </svg>
      <div className="dial-sweep" aria-hidden />
      <p className="sr-only">Skill set: {covered.map((d) => d.label).join(", ")}</p>
    </div>
  );
}

function Socials({ lead }: { lead: Lead }) {
  const links = [
    { href: lead.insta, label: "Instagram", icon: <InstagramIcon /> },
    { href: lead.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
    { href: lead.github, label: "GitHub", icon: <GithubIcon /> },
  ].filter((l) => isProfileUrl(l.href));
  if (!links.length) return null;
  return (
    <div className="crew-links">
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${lead.name} on ${l.label}`}>
          {l.icon}
        </a>
      ))}
    </div>
  );
}

function Shot({ lead, sizes }: { lead: Lead; sizes: string }) {
  return (
    <div className="crew-shot" data-pin>
      <Holo>
        <div className="crew-photo" data-holo-card>
          <Image
            src={lead.image}
            alt={lead.name}
            fill
            sizes={zoomedSizes(sizes, lead.frame?.zoom)}
            quality={90}
            className="object-cover"
            style={photoStyle(lead.frame)}
          />
        </div>
      </Holo>
    </div>
  );
}

/* ───────── section ───────── */

// The club lead's five domains leave their photo as a bus of coloured lines
// that runs down the section; each lead is plugged into their own colour.
// The bus draws itself with the scroll, and each lead powers up as the
// signal reaches them. Everything is readable without any of it.
export default function LeadsRoster() {
  const ref = useRef<HTMLDivElement>(null);
  const heads = useRef<(SVGGElement | null)[]>([]);
  const [bus, setBus] = useState<Bus | null>(null);
  const [hot, setHot] = useState<Domain | null>(null);

  useEffect(() => {
    const el = ref.current!;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = [...el.querySelectorAll<HTMLElement>("[data-row]")];
    let current: Bus | null = null;
    let raf = 0;

    const tick = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      el.classList.toggle("is-on", box.bottom > 0 && box.top < innerHeight);
      if (calm || !current) return;
      // the signal front rides a little below the middle of the screen
      const y = Math.min(Math.max(innerHeight * 0.72 - box.top, 0), box.height);
      el.style.setProperty("--head", `${y}px`);
      current.lanes.forEach((ln, k) => {
        const g = heads.current[k];
        if (!g) return;
        const on = y > ln.top && y < ln.bottom;
        g.style.opacity = on ? "1" : "0";
        if (on) g.setAttribute("transform", `translate(${ln.x} ${y})`);
      });
      current.pins.forEach((p, i) => {
        if (y >= p.y - 8) rows[i]?.classList.add("is-live");
      });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const measure = () => {
      current = layoutBus(el);
      setBus(current);
      queue();
    };

    if (!calm) el.classList.add("is-armed");
    current = layoutBus(el);
    setBus(current);
    tick(); // same task as arming, so rows already on screen never flash
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, []);

  const dim = (d: Domain) => (hot && hot !== d ? "is-dim" : "");
  const hover = (d: Domain | null) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setHot(d);
  };

  return (
    <div ref={ref} className="crew">
      <style>{CREW_CSS}</style>

      {bus && (
        <>
          <svg className="bus bus-draw" width={bus.w} height={bus.h} aria-hidden>
            {[...bus.lanes, ...bus.branches].map((ln, i) => (
              <g key={i} className={dim(ln.d)} style={{ ["--lc" as string]: colorOf(ln.d) }}>
                <path className="bus-line" d={ln.path} />
                <path className="bus-flow" d={ln.path} style={{ animationDelay: `${-i * 0.41}s` }} />
              </g>
            ))}
            {bus.pins.slice(1).map((p, i) => (
              <circle key={i} className={`bus-pin ${dim(REST[i].arsenal[0])}`} cx={p.x - 1} cy={p.y} r="3.5" fill={colorOf(REST[i].arsenal[0])} />
            ))}
            <rect
              className="bus-plug"
              x={bus.pins[0].x - 5}
              y={bus.pins[0].y - ((LANES.length - 1) * bus.gap) / 2 - 4}
              width="6"
              height={(LANES.length - 1) * bus.gap + 8}
              rx="2"
            />
          </svg>
          <svg className="bus" width={bus.w} height={bus.h} aria-hidden>
            {bus.lanes.map((ln, k) => (
              <g key={ln.d} ref={(g) => void (heads.current[k] = g)} className="bus-head" style={{ opacity: 0 }}>
                <circle r="9" fill={colorOf(ln.d)} opacity="0.22" />
                <circle r="2.6" fill="#fff" />
              </g>
            ))}
          </svg>
        </>
      )}

      <article data-row className="crew-head" onPointerEnter={hover(null)}>
        <Dial lead={HEAD} hot={hot} onHot={setHot} />
        <div className="crew-id">
          <p className="crew-role crew-fade">{HEAD.role}</p>
          <h3 className="crew-name crew-name--head">
            <span>{HEAD.name}</span>
          </h3>
          <p className="crew-area crew-fade">{HEAD.area}</p>
        </div>
        <div className="crew-body crew-fade">
          <div className="crew-skillhead">
            <span className="crew-label">Skill set</span>
            <span className="crew-count">
              {HEAD.arsenal.length === TOTAL ? "Covers every domain" : `${HEAD.arsenal.length} of ${TOTAL} domains`}
            </span>
          </div>
          <ul className="crew-chips">
            {HEAD.skills.map((s) => (
              <li key={s} className="crew-chip">
                {s}
              </li>
            ))}
          </ul>
          <p className="crew-bio">{HEAD.description}</p>
          <Socials lead={HEAD} />
        </div>
      </article>

      <ul className="crew-list">
        {REST.map((lead) => {
          const d = lead.arsenal[0];
          const Icon = ICON[d];
          return (
            <li
              key={lead.id}
              data-row
              className="crew-row"
              style={{ ["--c" as string]: colorOf(d) }}
              onPointerEnter={hover(d)}
              onPointerLeave={hover(null)}
            >
              <Shot lead={lead} sizes="(min-width: 1024px) 176px, (min-width: 768px) 144px, 6.75rem" />
              <div className="crew-id">
                <p className="crew-role crew-fade">{lead.role}</p>
                <h3 className="crew-name">
                  <span>{lead.name}</span>
                </h3>
                <p className="crew-area crew-fade">{lead.area}</p>
              </div>
              <div className="crew-body crew-fade">
                <p className="crew-label">Skill set</p>
                <ul className="crew-chips">
                  <li className="crew-chip is-domain">
                    <Icon size={14} aria-hidden />
                    {labelOf(d)}
                  </li>
                  {lead.skills.filter((s) => s.toLowerCase() !== labelOf(d).toLowerCase()).map((s) => (
                    <li key={s} className="crew-chip">
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="crew-bio">{lead.description}</p>
                <Socials lead={lead} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const CREW_CSS = `
.crew { --gutter: 36px; --lane-gap: 5; --lane-x0: 4; --c: var(--accent); position: relative; padding-left: var(--gutter); }

/* the bus */
.bus { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.bus-draw { clip-path: inset(-40px -80px calc(100% - var(--head, 100%)) -80px); }
.bus g { transition: opacity 0.3s ease; }
.bus g.is-dim, .bus-pin.is-dim { opacity: 0.15; }
.bus-line { fill: none; stroke: var(--lc); stroke-width: 2; stroke-linecap: round; opacity: 0.6; }
.bus-flow { fill: none; stroke: color-mix(in srgb, var(--lc) 45%, #fff); stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 0.1 120; animation: bus-flow 2.6s linear infinite; animation-play-state: paused; }
.crew.is-on .bus-flow { animation-play-state: running; }
@keyframes bus-flow { to { stroke-dashoffset: -120; } }
.bus-pin { transition: opacity 0.3s ease; }
.bus-plug { fill: var(--bg-elevated); stroke: var(--line-strong); }
.bus-head { transition: opacity 0.25s ease; }

/* a lead */
.crew-head, .crew-row { position: relative; display: grid; gap: 6px 16px; grid-template-areas: "shot id" "body body"; }
.crew-head { grid-template-columns: minmax(0, 1fr); grid-template-areas: "shot" "id" "body"; gap: 0; }
.crew-head .crew-id { margin-top: 22px; }
.crew-row { grid-template-columns: 6.75rem minmax(0, 1fr); }
.crew-shot { grid-area: shot; position: relative; }
.crew-photo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 14px; background: #07090b; outline: 1px solid color-mix(in srgb, var(--c) 40%, transparent); outline-offset: -1px; }
.crew-id { grid-area: id; align-self: end; min-width: 0; }
.crew-role { display: inline-block; padding: 3px 10px; border-radius: 999px; background: color-mix(in srgb, var(--c) 14%, transparent); border: 1px solid color-mix(in srgb, var(--c) 45%, transparent); font-family: var(--font-mono); font-size: 12px; color: var(--c); }
.crew-head .crew-role { color: var(--accent-strong); }
.crew-name { margin-top: 10px; overflow: hidden; padding-bottom: 0.06em; font-family: var(--font-display); font-weight: 600; font-size: clamp(1.55rem, 3.2vw, 2rem); line-height: 1.08; letter-spacing: -0.02em; color: var(--ink); text-wrap: balance; }
.crew-name > span { display: block; }
.crew-name--head { font-size: clamp(2rem, 6vw, 4.25rem); font-weight: 700; line-height: 1; letter-spacing: -0.035em; }
.crew-area { margin-top: 6px; font-size: 14px; color: var(--ink-muted); }
.crew-body { grid-area: body; min-width: 0; margin-top: 16px; }
.crew-label { font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; color: var(--ink); }
.crew-skillhead { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
.crew-count { font-size: 14px; color: var(--accent-strong); }
.crew-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.crew-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px; border: 1px solid var(--line-strong); background: rgba(7, 9, 11, 0.4); font-size: 13px; color: var(--ink); }
.crew-chip.is-domain { padding-left: 8px; border-color: var(--c); background: color-mix(in srgb, var(--c) 16%, transparent); }
.crew-chip.is-domain svg { color: var(--c); }
.crew-bio { margin-top: 14px; max-width: 62ch; font-size: 15px; line-height: 1.65; color: rgba(243, 245, 247, 0.86); }
.crew-links { display: flex; gap: 4px; margin-top: 10px; margin-left: -6px; }
.crew-links a { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 8px; color: var(--ink-muted); transition: color 0.2s ease, background-color 0.2s ease; }
.crew-links a:hover { color: var(--c); background: rgba(255, 255, 255, 0.05); }
.crew-list { display: grid; gap: 56px; margin-top: 64px; }

/* the club lead's dial: the five domains in a ring around the photo */
.dial { grid-area: shot; position: relative; width: min(100%, 20rem); aspect-ratio: 1; }
.dial-pin { position: absolute; inset: 1.2%; pointer-events: none; }
.dial-holo { position: absolute; inset: 13.3%; }
.dial-photo { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 50%; background: #07090b; clip-path: circle(50% at 50% 50%); transition: clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1); }
.dial-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.dial-track { fill: none; stroke: var(--line-strong); stroke-dasharray: 1 5; }
.dial-seg { transition: opacity 0.3s ease; }
.dial-seg.is-dim { opacity: 0.3; }
.dial-band { fill: none; stroke: color-mix(in srgb, var(--c) 17%, transparent); stroke-width: 30; pointer-events: stroke; transition: opacity 0.6s ease calc(var(--i) * 120ms + 500ms), stroke 0.3s ease; }
.dial-seg:hover .dial-band { stroke: color-mix(in srgb, var(--c) 32%, transparent); }
.dial-rim { fill: none; stroke: var(--c); stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 1 1; transition: stroke-dashoffset 0.8s cubic-bezier(0.65, 0, 0.35, 1) calc(var(--i) * 120ms + 350ms); }
.dial-label { fill: var(--c); font-family: var(--font-display); font-weight: 600; font-size: 15px; letter-spacing: 0.14em; transition: opacity 0.6s ease calc(var(--i) * 120ms + 600ms); }
.dial-seg.is-off .dial-band { stroke: transparent; }
.dial-seg.is-off .dial-rim { stroke: var(--line-strong); }
.dial-seg.is-off .dial-label { fill: var(--ink-faint); }
.dial-sweep { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; background: conic-gradient(from 0deg, transparent 0 80%, rgba(255, 255, 255, 0.4)); -webkit-mask: radial-gradient(closest-side, transparent 79%, #000 79.5% 97.5%, transparent 98%); mask: radial-gradient(closest-side, transparent 79%, #000 79.5% 97.5%, transparent 98%); mix-blend-mode: plus-lighter; animation: dial-sweep 7s linear infinite paused; }
.crew.is-on .dial-sweep { animation-play-state: running; }
@keyframes dial-sweep { to { transform: rotate(1turn); } }
.crew-head .crew-chips { margin-top: 12px; }

/* power-up: only once the script has armed the section, so it reads fine without */
.crew-shot::after { content: ""; position: absolute; inset: 0; z-index: 2; border-radius: 14px; background: var(--c); clip-path: inset(0 0 0 100%); pointer-events: none; }
.crew-name > span { transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s; }
.crew-fade { transition: opacity 0.6s ease 0.45s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s; }
.crew.is-armed [data-row]:not(.is-live) .crew-photo { opacity: 0; }
.crew.is-armed [data-row]:not(.is-live) .crew-name > span { transform: translateY(110%); }
.crew.is-armed [data-row]:not(.is-live) .crew-fade { opacity: 0; transform: translateY(12px); }
.crew.is-armed [data-row]:not(.is-live) .dial-photo { clip-path: circle(0% at 50% 50%); }
.crew.is-armed [data-row]:not(.is-live) .dial-rim { stroke-dashoffset: 1; }
.crew.is-armed [data-row]:not(.is-live) :is(.dial-band, .dial-label) { opacity: 0; }
.crew.is-armed .is-live .crew-shot::after { animation: crew-wipe 0.95s cubic-bezier(0.77, 0, 0.18, 1) both; }
.crew.is-armed .is-live .crew-photo { animation: crew-shot 0.95s linear both; }
@keyframes crew-wipe { 0% { clip-path: inset(0 100% 0 0); } 45%, 55% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 0 0 100%); } }
@keyframes crew-shot { 0%, 50% { opacity: 0; } 50.1%, 100% { opacity: 1; } }

@media (min-width: 768px) {
  .crew { --gutter: 56px; --lane-gap: 7; --lane-x0: 6; }
  .crew-head, .crew-row { grid-template-areas: "shot id" "shot body"; grid-template-rows: auto 1fr; }
  .crew-head { grid-template-columns: minmax(0, 17rem) minmax(0, 1fr); grid-template-rows: 1fr 1fr; gap: 0 40px; }
  .crew-head .crew-id { margin-top: 0; align-self: end; }
  .crew-head .crew-body { align-self: start; }
  .dial { width: 100%; }
  .crew-row { grid-template-columns: 9rem minmax(0, 1fr); gap: 0 28px; }
  .crew-id { align-self: start; }
  .crew-list { gap: 64px; margin-top: 88px; }
}
@media (min-width: 1024px) {
  .crew { --gutter: 72px; --lane-gap: 8; --lane-x0: 8; }
  .crew-head { grid-template-columns: minmax(0, 23rem) minmax(0, 1fr); gap: 0 64px; }
  .crew-row { grid-template-columns: 11rem minmax(0, 16rem) minmax(0, 1fr); grid-template-areas: "shot id body"; grid-template-rows: auto; gap: 0 40px; align-items: center; }
  .crew-row .crew-id { align-self: center; }
  .crew-row .crew-body { margin-top: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .bus-flow { display: none; }
}
`;
