"use client";

import { type ReactNode, useEffect, useRef } from "react";

// A badge on a lanyard: drag it (mouse/pen) or tap it (touch) and it pulls
// against a stretchy strap anchored at its hook, then springs back.
export default function PullBadge({ children }: { children: ReactNode }) {
  const slotRef = useRef<HTMLLIElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLSpanElement>(null);
  const s = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, sx: 0, sy: 0, moved: false, raf: 0, last: 0 });

  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);

  const paint = () => {
    const { x, y } = s.current;
    cardRef.current!.style.transform = `translate(${x}px, ${y}px) rotate(${x * -0.12}deg)`;
    const len = Math.hypot(x, y);
    strapRef.current!.style.height = `${len}px`;
    strapRef.current!.style.transform = `translateX(-50%) rotate(${-Math.atan2(x, y)}rad)`;
    slotRef.current!.classList.toggle("is-pulled", len > 0.5);
  };

  // Damped spring back to rest.
  const release = () => {
    const st = s.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Object.assign(st, { x: 0, y: 0, vx: 0, vy: 0 });
      return paint();
    }
    cancelAnimationFrame(st.raf);
    st.last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - st.last) / 1000);
      st.last = now;
      st.vx += (-220 * st.x - 14 * st.vx) * dt;
      st.vy += (-220 * st.y - 14 * st.vy) * dt;
      st.x += st.vx * dt;
      st.y += st.vy * dt;
      if (Math.abs(st.x) + Math.abs(st.y) < 0.3 && Math.abs(st.vx) + Math.abs(st.vy) < 3) {
        Object.assign(st, { x: 0, y: 0, vx: 0, vy: 0 });
        return paint();
      }
      paint();
      st.raf = requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
  };

  return (
    <li ref={slotRef} className="badge-slot">
      <span ref={strapRef} className="badge-strap" aria-hidden />
      <div
        ref={cardRef}
        className="badge"
        onPointerDown={(e) => {
          if (e.pointerType === "touch" || e.button !== 0 || (e.target as Element).closest("a")) return;
          const st = s.current;
          cancelAnimationFrame(st.raf);
          Object.assign(st, { dragging: true, moved: false, sx: e.clientX - st.x / 0.55, sy: e.clientY - st.y / 0.55 });
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // pointer already gone; the drag still works while the cursor stays on the badge
          }
          e.preventDefault();
        }}
        onPointerMove={(e) => {
          const st = s.current;
          if (!st.dragging) return;
          // rubber-band: the further you pull, the harder it gets
          st.x = Math.max(-70, Math.min(70, (e.clientX - st.sx) * 0.55));
          st.y = Math.max(-12, Math.min(120, (e.clientY - st.sy) * 0.55));
          st.moved = true;
          paint();
        }}
        onPointerUp={() => {
          if (!s.current.dragging) return;
          s.current.dragging = false;
          release();
        }}
        onPointerCancel={() => {
          s.current.dragging = false;
          release();
        }}
        onClick={(e) => {
          // touch: a tap gives the badge a quick tug
          const st = s.current;
          if (st.moved) {
            st.moved = false; // this click ended a drag
            return;
          }
          if ((e.target as Element).closest("a") || st.dragging) return;
          st.vy += 1150;
          st.vx += (Math.random() - 0.5) * 420;
          release();
        }}
      >
        {children}
      </div>
    </li>
  );
}
