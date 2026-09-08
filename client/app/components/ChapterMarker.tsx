"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ChapterMarker({
  index,
  title,
  quote,
}: {
  index: string;
  title: string;
  quote?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "top 42%",
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full flex flex-col items-center justify-center gap-6 py-16 sm:py-24 select-none text-center"
    >
      <div className="flex items-center gap-4">
        <span
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
          className="text-xs sm:text-sm tracking-[0.22em]"
        >
          {index}
        </span>
        <span className="h-px w-10 sm:w-16" style={{ background: "var(--line-strong)" }} />
        <span
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          className="text-lg sm:text-2xl font-bold"
        >
          {title}
        </span>
        <span className="h-px w-10 sm:w-16" style={{ background: "var(--line-strong)" }} />
      </div>

      {quote && (
        <p
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          className="max-w-2xl text-2xl sm:text-4xl font-semibold leading-snug"
        >
          &ldquo;{quote}&rdquo;
        </p>
      )}
    </div>
  );
}
