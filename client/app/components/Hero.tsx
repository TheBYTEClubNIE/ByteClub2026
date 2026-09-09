"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex items-center min-h-[92vh] py-24 sm:py-28 overflow-hidden"
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
      `}</style>

      {/* The 3D portal (StoryCorridor) shows through here — no local background
          needed. (A fade-to-opaque overlay used to live here, but with the
          ambient field now persisting at a consistent look across the whole
          page, it just cut a hard-edged black box into the canvas instead of
          blending anything.) */}

      <div className="w-full flex items-center">
        {/* Copy */}
        <div className="w-full max-w-xl">
          <p
            className="hero-fade-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "var(--accent)" }}
            />
            NIE&apos;s Technical Club · Est. 2023
          </p>

          <h1
            className="hero-fade-2 mt-5 leading-[0.96]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontSize: "clamp(3rem, 7.4vw, 6.4rem)",
              color: "var(--ink)",
            }}
          >
            The Byte Club.
          </h1>

          <p
            className="hero-fade-3 mt-6 max-w-lg text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)" }}
          >
            We run fun, hands-on tech events for NIE students, no dry
            lectures. You&apos;ll write real code, build real things
            alongside people who&apos;ll actually help you get better, and
            leave every session a little more ready for what comes after
            college.
          </p>

          <div className="hero-fade-4 mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#write"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              Join the Club
            </Link>
            <Link
              href="#info"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border transition-colors duration-200"
              style={{
                borderColor: "var(--line-strong)",
                color: "var(--ink)",
              }}
            >
              See Upcoming Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
