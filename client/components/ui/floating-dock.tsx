"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

/**
 * A single dock that always renders directly (no hamburger-style collapse
 * hidden behind a tap, and no separate desktop/mobile variant) — most of
 * this site's traffic is mobile, so the nav needs to be visible outright,
 * not one extra tap away. Sized small enough (34px rest / 60px on hover)
 * that all 7 items comfortably fit even a narrow phone screen without
 * overflowing — the original larger Aceternity sizing (40-80px) added up
 * to more than a 375px-wide screen could hold and dragged the whole fixed
 * header (and the page) into horizontal overflow.
 */
export const FloatingDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string; active?: boolean }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-12 sm:h-14 items-end gap-1.5 sm:gap-2.5 rounded-2xl px-2.5 sm:px-3.5 pb-2 sm:pb-2.5 max-w-full overflow-x-auto",
        className,
      )}
      style={{
        background: "rgba(16,19,23,0.85)",
        border: "1px solid var(--line)",
        backdropFilter: "blur(14px)",
      }}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  active,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  // Rest/peak sizes are deliberately small (not the original 40/80) so
  // 7 of these side by side always fit within a phone-width screen.
  let widthTransform = useTransform(distance, [-150, 0, 150], [30, 52, 30]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [30, 52, 30]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [15, 26, 15]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [15, 26, 15],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} className="shrink-0">
      <motion.div
        ref={ref}
        style={{
          width,
          height,
          background: active ? "var(--accent-soft)" : "var(--bg-elevated)",
          border: `1px solid ${active ? "var(--accent-border)" : "var(--line)"}`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md px-2 py-0.5 text-xs whitespace-pre hidden sm:block"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              }}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{
            width: widthIcon,
            height: heightIcon,
            color: active ? "var(--accent)" : "var(--ink-muted)",
          }}
          className="flex items-center justify-center transition-colors"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
