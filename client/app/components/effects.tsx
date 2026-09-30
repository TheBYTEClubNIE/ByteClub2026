"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───────── DecodeText: resolves out of glyph noise, left to right, once ───────── */

const GLYPHS = "01<>/{}[]#*+=";

export function DecodeText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [noise, setNoise] = useState<string[] | null>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const shown = Math.floor(Math.max(0, now - start) / 60);
      if (shown >= text.length) return setNoise(null);
      setNoise(text.split("").map((c, i) => (i < shown || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {noise
          ? text.split("").map((c, i) =>
              c === " " ? (
                " "
              ) : (
                // The real character keeps its width (transparent) so the
                // headline never reflows while the noise glyph sits on top.
                <span key={i} className="relative inline-block">
                  <span style={{ color: noise[i] === c ? undefined : "transparent" }}>{c}</span>
                  {noise[i] !== c && (
                    <span className="absolute inset-0 text-center" style={{ color: "var(--accent)" }}>
                      {noise[i]}
                    </span>
                  )}
                </span>
              )
            )
          : text}
      </span>
    </>
  );
}

/* ───────── TypeLine: a terminal prompt that types through a list ───────── */

export function TypeLine({ prefix, words }: { prefix: string; words: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (reducedMotion()) return;
    let i = 0;
    let len = words[0].length;
    let dir = -1;
    let timer = 0;
    let visible = true;

    const step = () => {
      timer = 0;
      if (!visible) return;
      len += dir;
      if (len < 0) {
        i = (i + 1) % words.length;
        len = 0;
        dir = 1;
      }
      setText(words[i].slice(0, len));
      let wait = dir < 0 ? 35 : 75;
      if (dir > 0 && len === words[i].length) {
        dir = -1;
        wait = 2000;
      }
      timer = window.setTimeout(step, wait);
    };

    // Pause while scrolled away, pick up where it left off on return.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !timer) timer = window.setTimeout(step, 600);
    });
    io.observe(ref.current!);
    timer = window.setTimeout(step, 2000);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [words]);

  return (
    <p ref={ref} className="type-line">
      <span className="sr-only">
        {prefix} {words.join(", ")}.
      </span>
      <span aria-hidden>
        <span style={{ color: "var(--ink-muted)" }}>{prefix} </span>
        {text}
        <span className="type-caret" />
      </span>
    </p>
  );
}

/* ───────── KineticBand: giant type that drifts, faster as you scroll ───────── */

export function KineticBand({ items, reverse = false, tilt = -2 }: { items: string[]; reverse?: boolean; tilt?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const track = trackRef.current!;
    if (reducedMotion()) return;

    let raf = 0;
    let x = 0;
    let last = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    let sign = 1;
    const base = reverse ? 1 : -1;

    const frame = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (dy) sign = dy > 0 ? 1 : -1;
      // px/s: a slow idle drift plus a kick from scroll speed, eased out.
      velocity += (Math.min(1400, (Math.abs(dy) / dt) * 1000 * 0.45) - velocity) * 0.08;
      x += base * sign * (45 + velocity) * (dt / 1000);
      const half = track.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      lastY = window.scrollY;
      if (entry.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reverse]);

  const run = [...items, ...items];
  return (
    <div ref={rootRef} className="band-clip" aria-hidden>
      <div className="band" style={{ transform: `rotate(${tilt}deg)` }}>
        <div ref={trackRef} className="band-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="band-group">
              {run.map((word, i) => (
                <span key={i} className="band-item">
                  <span className={i % 2 ? "band-word band-word--solid" : "band-word"}>{word}</span>
                  <span className="band-star">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── ScrollWords: a paragraph that lights up word by word on scroll ───────── */

export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const words = [...el.querySelectorAll<HTMLSpanElement>("[data-w]")];
    if (reducedMotion()) return;

    let raf = 0;
    let listening = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      const lit = p * words.length * 1.1;
      words.forEach((w, i) => {
        w.style.opacity = String(0.2 + 0.8 * Math.min(1, Math.max(0, lit - i)));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        listening = true;
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else if (!entry.isIntersecting && listening) {
        listening = false;
        window.removeEventListener("scroll", onScroll);
      }
    });
    io.observe(el);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} data-w style={{ transition: "opacity 0.25s linear" }}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

/* ───────── Holo: foil shine + tilt that follows the mouse over any [data-holo-card] ───────── */

export function Holo({ children, className }: { children: ReactNode; className?: string }) {
  const cardOf = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>("[data-holo-card]") : null);

  return (
    <div
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const card = cardOf(e.target);
        if (!card) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        card.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
        card.style.setProperty("--ry", `${(px - 0.5) * 16}deg`);
        card.dataset.holo = "on";
      }}
      onPointerOut={(e) => {
        const card = cardOf(e.target);
        if (!card || card.contains(e.relatedTarget as Node | null)) return;
        card.dataset.holo = "off";
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </div>
  );
}
