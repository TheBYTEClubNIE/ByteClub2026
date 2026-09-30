"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ClipboardList, Code2, Handshake, PenTool, Sparkles, type LucideIcon } from "lucide-react";
import { DOMAINS, LEADS, type Domain, type Lead, isProfileUrl } from "@/content/team";
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

// Per-photo framing from content/team.ts, so every face sits well in the 4:5 frame.
const frameStyle = (lead: Lead) => ({
  objectPosition: lead.frame?.position ?? "50% 50%",
  transform: lead.frame?.zoom ? `scale(${lead.frame.zoom})` : undefined,
  transformOrigin: lead.frame?.origin,
});
const labelOf = (id: Domain) => DOMAINS.find((d) => d.id === id)!.label;

/* ───────── background art, one per domain (drawn in the card's colour) ───────── */

function Art({ domain }: { domain: Domain | "all" }) {
  const common = { className: "lead-art", viewBox: "0 0 240 200", fill: "none", stroke: "currentColor", "aria-hidden": true } as const;
  switch (domain) {
    case "tech": // code minimap + brackets
      return (
        <svg {...common} strokeWidth="6" strokeLinecap="round">
          <path d="M40 40h60M112 40h40M60 62h90M60 84h50M122 84h60M80 106h70M60 128h40M112 128h30M40 150h80" />
          <path d="M196 60l-22 30 22 30M214 60l22 30-22 30" strokeWidth="5" opacity="0.7" />
        </svg>
      );
    case "design": // pen-tool curve with handles on a grid
      return (
        <svg {...common} strokeWidth="2">
          <path d="M0 50h240M0 100h240M0 150h240M60 0v200M120 0v200M180 0v200" opacity="0.35" strokeDasharray="3 6" />
          <path d="M30 160C70 40 150 40 210 140" strokeWidth="4" />
          <path d="M30 160L60 60M210 140L170 50" opacity="0.7" />
          <rect x="24" y="154" width="12" height="12" fill="currentColor" />
          <rect x="204" y="134" width="12" height="12" fill="currentColor" />
          <circle cx="60" cy="60" r="6" /> <circle cx="170" cy="50" r="6" />
        </svg>
      );
    case "creative": // film strip + sparkles
      return (
        <svg {...common} strokeWidth="3">
          <rect x="30" y="60" width="180" height="90" rx="6" />
          <path d="M30 78h180M30 132h180M90 78v54M150 78v54" opacity="0.7" />
          <path d="M44 66h8M64 66h8M84 66h8M104 66h8M124 66h8M144 66h8M164 66h8M184 66h8M44 144h8M64 144h8M84 144h8M104 144h8M124 144h8M144 144h8M164 144h8M184 144h8" strokeWidth="5" />
          <path d="M200 20l5 13 13 5-13 5-5 13-5-13-13-5 13-5z M40 175l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "management": // kanban board
      return (
        <svg {...common} strokeWidth="3">
          <rect x="20" y="30" width="60" height="150" rx="8" opacity="0.6" />
          <rect x="90" y="30" width="60" height="150" rx="8" opacity="0.6" />
          <rect x="160" y="30" width="60" height="150" rx="8" opacity="0.6" />
          <rect x="30" y="50" width="40" height="24" rx="4" fill="currentColor" fillOpacity="0.3" />
          <rect x="30" y="84" width="40" height="24" rx="4" fill="currentColor" fillOpacity="0.3" />
          <rect x="100" y="50" width="40" height="24" rx="4" fill="currentColor" fillOpacity="0.3" />
          <rect x="170" y="50" width="40" height="24" rx="4" fill="currentColor" fillOpacity="0.3" />
          <rect x="170" y="84" width="40" height="24" rx="4" fill="currentColor" fillOpacity="0.3" />
          <path d="M178 128l8 8 16-16" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "outreach": // network of people
      return (
        <svg {...common} strokeWidth="2.5">
          <path d="M120 100L50 50M120 100L200 45M120 100L60 165M120 100L195 160M50 50L200 45M60 165L195 160" opacity="0.6" />
          <circle cx="120" cy="100" r="16" fill="currentColor" fillOpacity="0.35" />
          <circle cx="50" cy="50" r="10" /> <circle cx="200" cy="45" r="10" /> <circle cx="60" cy="165" r="10" /> <circle cx="195" cy="160" r="10" />
        </svg>
      );
    default: // all domains: orbits with one planet per domain
      return (
        <svg className="lead-art lead-art--all" viewBox="0 0 240 240" fill="none" aria-hidden>
          <circle cx="120" cy="120" r="46" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <circle cx="120" cy="120" r="78" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="4 8" />
          <circle cx="120" cy="120" r="110" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          {DOMAINS.map((d, i) => {
            const r = [46, 78, 110, 78, 110][i];
            const a = (i * 72 - 90) * (Math.PI / 180);
            return <circle key={d.id} cx={120 + r * Math.cos(a)} cy={120 + r * Math.sin(a)} r="9" fill={d.color} />;
          })}
        </svg>
      );
  }
}

/* ───────── pieces ───────── */

function SkillSet({ lead, large = false }: { lead: Lead; large?: boolean }) {
  return (
    <ul className={large ? "skills skills--lg" : "skills"} aria-label="Skill set">
      {DOMAINS.map((d, i) => {
        const Icon = ICON[d.id];
        const on = lead.arsenal.includes(d.id);
        return (
          <li
            key={d.id}
            className={`skill ${on ? "is-on" : ""}`}
            style={{ ["--c" as string]: d.color, ["--i" as string]: i }}
          >
            <span className="skill-icon">
              <Icon size={large ? 22 : 14} aria-hidden />
            </span>
            <span className="skill-label">
              {d.label}
              {!on && <span className="sr-only"> (not covered)</span>}
            </span>
          </li>
        );
      })}
    </ul>
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
    <div className="lead-links">
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${lead.name} on ${l.label}`}>
          {l.icon}
        </a>
      ))}
    </div>
  );
}

/* ───────── section ───────── */

// Every lead on screen at once; each card shows the domains that lead covers.
export default function LeadsRoster() {
  const [head, ...rest] = LEADS;
  const ref = useRef<HTMLDivElement>(null);
  // null on the server (skills simply show lit); false = waiting offscreen; true = light up
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSeen(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  const all = head.arsenal.length === TOTAL;

  return (
    <div ref={ref} className={`leads ${seen === false ? "is-waiting" : ""} ${seen ? "is-seen" : ""}`}>
      <style>{LEADS_CSS}</style>

      <article className="lead-hero">
        <Art domain="all" />
        <Holo className="lead-hero-photo-wrap">
          <div className="lead-photo" data-holo-card>
            <Image
              src={head.image}
              alt={head.name}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 272px, 7.5rem"
              className="object-cover"
              style={frameStyle(head)}
            />
          </div>
        </Holo>
        <div className="lead-hero-top">
          <p className="lead-role">{head.role}</p>
          <h3 className="lead-name lead-name--hero">{head.name}</h3>
          <p className="lead-area">{head.area}</p>
        </div>
        <div className="lead-hero-body">
          <div className="skills-head">
            <span className="skills-title">Skill set</span>
            <span className="skills-count">{all ? "Covers every domain" : `${head.arsenal.length} of ${TOTAL} domains`}</span>
          </div>
          <SkillSet lead={head} large />
          <div className="perks">
            {head.skills.map((s) => (
              <span key={s} className="perk">
                {s}
              </span>
            ))}
          </div>
          <p className="lead-bio">{head.description}</p>
          <Socials lead={head} />
        </div>
      </article>

      <ul className="lead-grid">
        {rest.map((lead) => (
          <li key={lead.id} className="lead-card" style={{ ["--c" as string]: colorOf(lead.arsenal[0]) }}>
            <Art domain={lead.arsenal[0]} />
            <Holo className="lead-card-photo-wrap">
              <div className="lead-photo" data-holo-card>
                <Image
                  src={lead.image}
                  alt={lead.name}
                  fill
                  sizes="(min-width: 1024px) 200px, (min-width: 768px) 136px, 104px"
                  className="object-cover"
                  style={frameStyle(lead)}
                />
              </div>
            </Holo>
            <div className="lead-card-info">
              <p className="lead-role">{lead.role}</p>
              <h3 className="lead-name">{lead.name}</h3>
              <p className="lead-area">{lead.area}</p>
            </div>
            <div className="lead-card-body">
              <p className="skills-title skills-title--sm">
                Skill set <span>· {lead.arsenal.map(labelOf).join(", ")}</span>
              </p>
              <SkillSet lead={lead} />
              <p className="lead-bio">{lead.description}</p>
              <Socials lead={lead} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LEADS_CSS = `
.lead-photo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 12px; background: #07090b; }
.lead-role { display: inline-block; padding: 3px 10px; border-radius: 999px; background: color-mix(in srgb, var(--c, var(--accent)) 14%, transparent); border: 1px solid color-mix(in srgb, var(--c, var(--accent)) 45%, transparent); font-family: var(--font-mono); font-size: 12px; color: var(--c, var(--accent-strong)); }
.lead-name { margin-top: 8px; font-family: var(--font-display); font-weight: 600; font-size: 1.2rem; line-height: 1.15; letter-spacing: -0.015em; color: var(--ink); }
.lead-area { margin-top: 4px; font-size: 14px; color: var(--ink-muted); }
.lead-bio { position: relative; margin-top: 14px; font-size: 15px; line-height: 1.65; color: rgba(243,245,247,0.86); }
.lead-links { display: flex; gap: 4px; margin-top: 12px; margin-left: -6px; }
.lead-links a { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 8px; color: var(--ink-muted); transition: color 0.2s ease, background-color 0.2s ease; }
.lead-links a:hover { color: var(--c, var(--accent)); background: rgba(255,255,255,0.05); }

/* background art: faint, in the card's domain colour, fading toward the text */
.lead-art { position: absolute; z-index: 0; right: -20px; bottom: -16px; width: 280px; height: auto; color: var(--c); opacity: 0.24; pointer-events: none; -webkit-mask-image: linear-gradient(135deg, transparent 10%, #000 60%); mask-image: linear-gradient(135deg, transparent 10%, #000 60%); transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.lead-card:hover .lead-art { opacity: 0.36; transform: translate(-6px, -6px); }
.lead-art--all { top: -80px; right: -80px; bottom: auto; width: 440px; opacity: 0.6; -webkit-mask-image: radial-gradient(circle at 70% 30%, #000 30%, transparent 70%); mask-image: radial-gradient(circle at 70% 30%, #000 30%, transparent 70%); animation: orbit 60s linear infinite; }
@keyframes orbit { to { transform: rotate(360deg); } }
.lead-hero > :not(.lead-art), .lead-card > :not(.lead-art) { position: relative; z-index: 1; }

/* skill set: every domain listed, the covered ones lit in their colour */
.skills-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-top: 22px; }
.skills-title { font-family: var(--font-display); font-weight: 600; font-size: 1rem; color: var(--ink); }
.skills-title span { font-family: var(--font-body); font-weight: 500; font-size: 14px; color: var(--c); }
.skills-title--sm { margin-top: 16px; font-size: 0.95rem; }
.skills-count { font-family: var(--font-mono); font-size: 13px; color: var(--accent-strong); }
.skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.skill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px 5px 7px; border-radius: 999px; border: 1px dashed var(--line-strong); font-size: 12.5px; color: var(--ink-faint); }
.skill-icon { display: grid; place-items: center; }
.skill.is-on { border: 1px solid var(--c); color: var(--ink); background: color-mix(in srgb, var(--c) 16%, transparent); box-shadow: 0 0 14px -4px color-mix(in srgb, var(--c) 70%, transparent); }
.skill.is-on .skill-icon { color: var(--c); }
.leads.is-waiting .skill.is-on { opacity: 0.3; transform: scale(0.85); box-shadow: none; }
.leads.is-seen .skill.is-on { animation: skill-on 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--i) * 110ms + 150ms); }
@keyframes skill-on { from { opacity: 0.3; transform: scale(0.85); box-shadow: none; } to { opacity: 1; transform: none; } }

.skills--lg { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
.skills--lg .skill { flex-direction: column; justify-content: center; gap: 8px; padding: 12px 4px; border-radius: 14px; font-size: 12.5px; text-align: center; }

/* club lead */
.lead-hero { position: relative; overflow: hidden; display: grid; grid-template-columns: 7.5rem minmax(0, 1fr); grid-template-areas: "photo top" "body body"; gap: 4px 16px; padding: 16px; border-radius: 20px; border: 1px solid var(--line-strong);
  background:
    radial-gradient(60% 50% at 100% 0%, rgba(40,194,255,0.14), transparent 70%),
    radial-gradient(40% 40% at 0% 100%, rgba(198,166,255,0.12), transparent 70%),
    radial-gradient(40% 40% at 60% 110%, rgba(255,191,127,0.10), transparent 70%),
    radial-gradient(30% 30% at 100% 70%, rgba(126,224,181,0.08), transparent 70%),
    var(--bg-elevated); }
.lead-hero-photo-wrap { grid-area: photo; perspective: 900px; }
.lead-hero-top { grid-area: top; align-self: end; }
.lead-hero-body { grid-area: body; }
.lead-name--hero { font-size: clamp(1.5rem, 5vw, 2.8rem); font-weight: 700; line-height: 1; letter-spacing: -0.03em; }
.perks { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.perk { padding: 5px 12px; border-radius: 999px; border: 1px solid var(--line-strong); background: rgba(7,9,11,0.4); font-size: 13px; color: var(--ink); }
.lead-hero .lead-bio { max-width: 62ch; }

/* the other leads */
.lead-grid { display: grid; gap: 12px; margin-top: 12px; }
.lead-card { position: relative; overflow: hidden; display: grid; grid-template-columns: 104px minmax(0, 1fr); grid-template-areas: "photo info" "body body"; gap: 4px 16px; padding: 14px; border-radius: 18px; border: 1px solid var(--line);
  background: radial-gradient(90% 70% at 100% 100%, color-mix(in srgb, var(--c) 12%, transparent), transparent 70%), var(--bg-elevated);
  transition: border-color 0.25s ease; }
.lead-card::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--c); }
.lead-card:hover { border-color: color-mix(in srgb, var(--c) 45%, transparent); }
.lead-card-photo-wrap { grid-area: photo; perspective: 700px; }
.lead-card-info { grid-area: info; align-self: end; }
.lead-card-body { grid-area: body; }

@media (min-width: 768px) {
  .lead-hero { grid-template-columns: minmax(0, 17rem) minmax(0, 1fr); grid-template-areas: "photo top" "photo body"; grid-template-rows: auto 1fr; gap: 0 32px; padding: 24px; }
  .lead-hero-top { align-self: start; }
  .lead-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 16px; }
  .lead-card { grid-template-columns: 136px minmax(0, 1fr); padding: 16px; }
}
@media (min-width: 1024px) {
  .lead-hero { grid-template-columns: minmax(0, 20rem) minmax(0, 1fr); gap: 0 48px; padding: 28px; }
  /* desktop: two per row, photo beside the text, same 4:5 frame as phones */
  .lead-grid { gap: 20px; margin-top: 20px; }
  .lead-card { grid-template-columns: 12.5rem minmax(0, 1fr); grid-template-areas: "photo info" "photo body"; grid-template-rows: auto 1fr; gap: 0 24px; padding: 20px; }
  .lead-card-info { align-self: start; }
}
@media (prefers-reduced-motion: reduce) {
  .leads.is-seen .skill.is-on, .lead-art--all { animation: none; }
}
`;
