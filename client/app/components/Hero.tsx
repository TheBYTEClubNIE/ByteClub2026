"use client";

import { boardDate, boardTime, splitEvents } from "@/content/events";
import { useNow } from "./EventsBoard";
import { DecodeText, TypeLine } from "./effects";

// What the club actually runs (see content/events.ts), plus the beginner hook.
const TYPED = ["hands-on workshops", "ideathons", "hackathons", "build sessions", "your first commit"];

export default function Hero({ builtAt }: { builtAt: number }) {
  const now = useNow(builtAt);
  const next = splitEvents(now).upcoming[0];

  return (
    <section
      id="home"
      className="relative flex items-center min-h-[92svh] py-28 overflow-hidden"
    >
      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-1 { animation: heroRise 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-fade-2 { animation: heroRise 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .hero-fade-3 { animation: heroRise 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .hero-fade-4 { animation: heroRise 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        @media (prefers-reduced-motion: reduce) {
          .hero-fade-1, .hero-fade-2, .hero-fade-3, .hero-fade-4 { animation: none; }
        }
        .hero-next { display: flex; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid var(--line); font-family: var(--font-body); font-size: 14px; color: var(--ink-muted); }
        .hero-next strong { font-weight: 600; color: var(--ink); }
        .hero-next .arrow { margin-left: auto; color: var(--accent); transition: transform 0.2s ease; }
        .hero-next:hover .arrow { transform: translateX(3px); }
      `}</style>

      {/* The 3D portal (StoryCorridor) shows through here, no local background. */}
      <div className="w-full max-w-xl">
        <h1
          className="hero-fade-1 leading-[0.96]"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            fontSize: "clamp(3rem, 7.4vw, 6.4rem)",
            color: "var(--ink)",
          }}
        >
          <DecodeText text="The Byte Club." delay={250} />
        </h1>

        <div className="hero-fade-2 mt-6">
          <TypeLine prefix=">_ join us for" words={TYPED} />
        </div>

        <p
          className="hero-fade-2 mt-4 max-w-lg text-base sm:text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)" }}
        >
          NIE&apos;s student-run tech club. We run fun, hands-on events, no
          dry lectures. You&apos;ll write real code, build real things
          alongside people who&apos;ll actually help you get better, and
          leave every session a little more ready for what comes after
          college.
        </p>

        <div className="hero-fade-3 mt-9 flex flex-wrap items-center gap-3">
          <a href="#join" className="btn btn-primary">
            Join the club
          </a>
          <a href="#events" className="btn btn-ghost">
            See what&apos;s next
          </a>
        </div>

        <a href="#events" className="hero-fade-4 hero-next mt-12 max-w-md">
          <span>Next event</span>
          <strong>
            {next ? `${next.name} · ${boardDate(next.start)}, ${boardTime(next.start)}` : "To be announced"}
          </strong>
          <span className="arrow" aria-hidden>
            →
          </span>
        </a>
      </div>
    </section>
  );
}
