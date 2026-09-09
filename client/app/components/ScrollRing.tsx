"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";

const R = 17;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function ScrollRing() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  return (
    <Link
      href="#home"
      aria-label="Back to top"
      className="relative flex items-center justify-center w-10 h-10 rounded-full shrink-0"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--line)" }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" className="absolute inset-0">
        <circle cx="20" cy="20" r={R} fill="none" stroke="var(--line)" strokeWidth="1.5" />
        <motion.circle
          cx="20"
          cy="20"
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{ pathLength: progress, rotate: -90, transformOrigin: "50% 50%" }}
        />
      </svg>
      <img
        src="/Logo/logo-transparent.png"
        alt="The Byte Club"
        className="w-[27px] h-[27px] object-contain select-none pointer-events-none"
        draggable={false}
      />
    </Link>
  );
}
