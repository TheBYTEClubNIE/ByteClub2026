import { DOMAINS, type Domain } from "@/content/team";

// Faint background artwork per domain, drawn in the surrounding card's
// colour (`color: var(--c)`), positioned by the `.lead-art` styles.
export default function DomainArt({ domain }: { domain: Domain | "all" }) {
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
          <circle cx="60" cy="60" r="6" />
          <circle cx="170" cy="50" r="6" />
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
          <circle cx="50" cy="50" r="10" />
          <circle cx="200" cy="45" r="10" />
          <circle cx="60" cy="165" r="10" />
          <circle cx="195" cy="160" r="10" />
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
