'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EVENTS, type ClubEvent, boardDate, boardYear, longDate, oldestFirst, slugOf } from '@/content/events';

// Every event in content/events.ts that has photos is a stop on the route,
// oldest first.
const TIMELINE = EVENTS.filter((e) => e.photos?.length).sort(oldestFirst);

// Plane silhouette pointing along +x, centred on the origin.
const PLANE =
  'M12 0 L-6 -3.2 L-9.5 -10 L-12.5 -10 L-9.5 -2.6 L-14.5 -2.2 L-16.5 -5.5 L-18.5 -5.5 L-17 0 L-18.5 5.5 L-16.5 5.5 L-14.5 2.2 L-9.5 2.6 L-12.5 10 L-9.5 10 L-6 3.2 Z';

/* ───────────────── Postcard (one stop) ───────────────── */

function Postcard({ event, onOpen }: { event: ClubEvent; onOpen: (index: number) => void }) {
  const photos = event.photos!;
  const ref = useRef<HTMLElement>(null);
  // null = server render (stamp simply shows), false = waiting offscreen, true = stamp it
  const [landed, setLanded] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLanded(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLanded(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  const meta = [event.start && longDate(event.start), event.venue, `${photos.length} photos`].filter(Boolean).join(' · ');
  const thumbs = photos.slice(1, 5);

  return (
    <article
      ref={ref}
      id={`past-${slugOf(event)}`}
      className={`postcard ${landed === false ? 'is-waiting' : ''} ${landed ? 'is-landed' : ''}`}
    >
      <button
        type="button"
        className="postcard-photo"
        onClick={() => onOpen(0)}
        aria-label={`View ${photos.length} photos from ${event.name}`}
      >
        <Image src={photos[0].src} alt="" fill sizes="(min-width: 900px) 42vw, 88vw" className="object-cover" />
      </button>

      <div className="stamp" aria-hidden>
        <span className="stamp-code">{event.code}</span>
        <span className="stamp-date">{event.start ? `${boardDate(event.start)} ${boardYear(event.start).slice(2)}` : 'ARRIVED'}</span>
      </div>

      <div className="postcard-body">
        <h3 className="postcard-name">{event.name}</h3>
        <p className="postcard-meta">{meta}</p>
        <p className="postcard-sum">{event.summary}</p>
        {thumbs.length > 0 && (
          <ul className="thumbs">
            {thumbs.map((p, i) => (
              <li key={p.src}>
                <button type="button" onClick={() => onOpen(i + 1)} aria-label={`Open photo: ${p.caption}`}>
                  <Image src={p.src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              </li>
            ))}
            {photos.length > 5 && (
              <li>
                <button type="button" className="thumb-more" onClick={() => onOpen(5)} aria-label={`${photos.length - 5} more photos`}>
                  +{photos.length - 5}
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
}

/* ───────────────── Lightbox ───────────────── */

function Lightbox({ event, start, onClose }: { event: ClubEvent; start: number; onClose: () => void }) {
  const photos = event.photos!;
  const [i, setI] = useState(start);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const prev = useCallback(() => setI((v) => (v - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setI((v) => (v + 1) % photos.length), [photos.length]);

  // Focus moves into the dialog on open and back to where it was on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
      if (ev.key === 'ArrowLeft') prev();
      if (ev.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  const photo = photos[i];

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${event.name} photos`} onClick={onClose}>
      <div
        className="lb-inner"
        onClick={(ev) => ev.stopPropagation()}
        onTouchStart={(ev) => (touchX.current = ev.touches[0].clientX)}
        onTouchEnd={(ev) => {
          if (touchX.current === null) return;
          const dx = ev.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        }}
      >
        <div className="lb-top">
          <p className="lb-title">
            {event.name}
            <span>
              {i + 1} / {photos.length}
            </span>
          </p>
          <button ref={closeRef} type="button" className="lb-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={photo.src} src={photo.src} alt={photo.caption} className="lb-img" />

        <div className="lb-bottom">
          <button type="button" className="lb-btn" onClick={prev} aria-label="Previous photo">
            <ChevronLeft size={22} />
          </button>
          <p className="lb-caption">{photo.caption}</p>
          <button type="button" className="lb-btn" onClick={next} aria-label="Next photo">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Flight log ───────────────── */

export default function PastEvents() {
  const [open, setOpen] = useState<{ event: ClubEvent; index: number } | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const routeRef = useRef<HTMLDivElement>(null);
  const flownRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const [d, setD] = useState('');

  // Route: smooth vertical S-curves through every stop marker, rebuilt
  // whenever the layout changes size.
  useEffect(() => {
    const route = routeRef.current!;
    const build = () => {
      const box = route.getBoundingClientRect();
      const pts = [...route.querySelectorAll<HTMLElement>('[data-marker]')].map((m) => {
        const r = m.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const half = (b.y - a.y) / 2;
        path += ` C ${a.x} ${a.y + half}, ${b.x} ${b.y - half}, ${b.x} ${b.y}`;
      }
      setD(path);
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(route);
    return () => ro.disconnect();
  }, []);

  // The plane sits where the route crosses the reading line (55% down the
  // screen); everything behind it is lit as contrail.
  useEffect(() => {
    if (!d) return;
    const route = routeRef.current!;
    const flown = flownRef.current!;
    const plane = planeRef.current!;
    const len = flown.getTotalLength();
    flown.style.strokeDasharray = `${len}`;

    let raf = 0;
    let listening = false;
    const update = () => {
      raf = 0;
      const targetY = window.innerHeight * 0.55 - route.getBoundingClientRect().top;
      // y only ever increases along the route, so binary-search the length.
      let lo = 0;
      let hi = len;
      for (let k = 0; k < 14; k++) {
        const mid = (lo + hi) / 2;
        if (flown.getPointAtLength(mid).y < targetY) lo = mid;
        else hi = mid;
      }
      const at = lo;
      const p = flown.getPointAtLength(at);
      const a = flown.getPointAtLength(Math.max(0, at - 2));
      const b = flown.getPointAtLength(Math.min(len, at + 2));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      flown.style.strokeDashoffset = `${len - at}`;
      plane.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        listening = true;
        window.addEventListener('scroll', onScroll, { passive: true });
      } else if (!entry.isIntersecting && listening) {
        listening = false;
        window.removeEventListener('scroll', onScroll);
      }
      update();
    });
    io.observe(route);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [d]);

  return (
    <section id="past" className="section">
      <style>{FLIGHT_CSS}</style>

      <header className="section-head">
        <h2 className="section-title">Flight log</h2>
        <p className="section-lede">
          Every event we&apos;ve run, stop by stop. Scroll to fly the route,
          tap a postcard for the photos.
        </p>
      </header>

      <div ref={routeRef} className="route">
        <svg className="route-svg" aria-hidden>
          <path d={d} className="route-base" />
          <path ref={flownRef} d={d} className="route-flown" />
          <g ref={planeRef} className="route-plane">
            <path d={PLANE} />
          </g>
        </svg>

        <ol className="stops">
          <li className="stop stop--edge stop--start">
            <span className="marker" data-marker />
            <span className="edge-pill">Takeoff · 2023</span>
            <p className="edge-text">A handful of first-years who wanted tech events that didn&apos;t feel like lectures.</p>
          </li>

          {TIMELINE.map((event, i) => (
            <li key={event.code} className={`stop ${i % 2 === 0 ? 'stop--left' : 'stop--right'}`}>
              <span className="marker" data-marker />
              <Postcard event={event} onOpen={(index) => setOpen({ event, index })} />
            </li>
          ))}

          <li className="stop stop--edge">
            <span className="marker marker--next" data-marker />
            <span className="edge-pill edge-pill--next">Next stop</span>
            <a href="#events" className="edge-link">
              See what&apos;s boarding →
            </a>
          </li>
        </ol>
      </div>

      {open && <Lightbox event={open.event} start={open.index} onClose={close} />}
    </section>
  );
}

const FLIGHT_CSS = `
.route { position: relative; }
.route-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.route-base { fill: none; stroke: rgba(255, 255, 255, 0.22); stroke-width: 2; stroke-dasharray: 1 9; stroke-linecap: round; }
.route-flown { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(40, 194, 255, 0.65)); }
.route-plane { fill: var(--accent-strong); filter: drop-shadow(0 0 8px rgba(42, 245, 255, 0.85)); }

.stops { position: relative; display: flex; flex-direction: column; gap: clamp(4.5rem, 10vw, 7rem); }
.stop { position: relative; padding-left: 56px; }
.marker { position: absolute; left: 14px; top: 34px; z-index: 2; width: 16px; height: 16px; border-radius: 50%; transform: translate(-50%, -50%); background: #07090b; border: 2px solid var(--accent); box-shadow: 0 0 0 6px rgba(40, 194, 255, 0.12); }
.marker--next { border-style: dashed; border-color: var(--ink-muted); box-shadow: none; }
.stop--edge .marker { top: 14px; }

.edge-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; border: 1px solid var(--accent-border); background: var(--accent-soft); color: var(--accent-strong); font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; }
.edge-pill--next { border-style: dashed; border-color: var(--line-strong); background: transparent; color: var(--ink); }
.edge-text { margin-top: 12px; max-width: 34ch; font-size: 15px; line-height: 1.6; color: var(--ink-muted); }
.edge-link { display: inline-block; margin-top: 12px; font-size: 15px; font-weight: 600; color: var(--accent); }
.edge-link:hover { color: var(--accent-strong); }

.postcard { position: relative; padding: 10px; border-radius: 16px; background: var(--bg-elevated); border: 1px solid var(--line); scroll-margin-top: 96px; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease; }
.postcard-photo { position: relative; display: block; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 10px; background: #07090b; cursor: zoom-in; }
.postcard-photo img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.postcard-photo:hover img { transform: scale(1.03); }
.postcard-body { padding: 18px 10px 10px; }
.postcard-name { font-family: var(--font-display); font-weight: 600; font-size: clamp(1.3rem, 2.4vw, 1.7rem); line-height: 1.15; letter-spacing: -0.015em; color: var(--ink); }
.postcard-meta { margin-top: 6px; font-size: 14px; color: var(--accent); }
.postcard-sum { margin-top: 8px; font-size: 15px; line-height: 1.6; color: var(--ink-muted); }
.thumbs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.thumbs button { position: relative; display: block; width: 52px; height: 52px; overflow: hidden; border-radius: 8px; border: 1px solid var(--line); transition: border-color 0.2s ease, transform 0.2s ease; }
.thumbs button:hover { border-color: var(--accent); transform: translateY(-2px); }
.thumb-more { display: grid !important; place-items: center; background: rgba(255, 255, 255, 0.05); color: var(--ink); font-size: 14px; font-weight: 600; }

/* Passport stamp that slams onto the postcard when it scrolls in. */
.stamp { position: absolute; top: -18px; right: -12px; z-index: 3; width: 104px; height: 104px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; border: 2.5px solid var(--accent); outline: 1px solid rgba(40, 194, 255, 0.7); outline-offset: -9px; background: rgba(7, 9, 11, 0.6); color: var(--accent); transform: rotate(-14deg); pointer-events: none; }
.stamp-code { font-family: var(--font-display); font-weight: 700; font-size: 26px; line-height: 1; }
.stamp-date { margin-top: 5px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.06em; }
.is-waiting .stamp { opacity: 0; }
.is-landed .stamp { animation: stamp-in 0.55s cubic-bezier(0.2, 1.3, 0.4, 1) 0.1s both; }
@keyframes stamp-in {
  from { opacity: 0; transform: rotate(-34deg) scale(1.9); }
  65% { opacity: 1; transform: rotate(-12deg) scale(0.93); }
  to { opacity: 1; transform: rotate(-14deg) scale(1); }
}

@media (max-width: 899px) {
  /* the route wiggles down a slim left gutter */
  .stop:nth-child(even) .marker { left: 34px; }
}
@media (min-width: 900px) {
  .stop { padding-left: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 7rem; }
  .stop--left .postcard { grid-column: 1; transform: rotate(-1deg); }
  .stop--right .postcard { grid-column: 2; transform: rotate(1deg); }
  .stop--left .marker { left: 75%; top: 50%; }
  .stop--right .marker { left: 25%; top: 50%; }
  .postcard:hover { transform: rotate(0deg) translateY(-4px); box-shadow: 0 30px 70px -30px rgba(40, 194, 255, 0.4); }
  .stop--edge { display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 34px; }
  .stop--edge .marker { left: 50%; top: 0; }
  /* route leaves from under the takeoff label, not through it */
  .stop--start { padding-top: 0; padding-bottom: 34px; }
  .stop--start .marker { top: auto; bottom: 0; transform: translate(-50%, 50%); }
  .stamp { width: 116px; height: 116px; top: -22px; right: -18px; }
}
@media (prefers-reduced-motion: reduce) {
  .is-landed .stamp { animation: none; }
}

.lb { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(5, 6, 8, 0.95); }
.lb-inner { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 1100px; max-height: 100%; }
.lb-top, .lb-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.lb-title { display: flex; align-items: baseline; gap: 12px; font-family: var(--font-display); font-weight: 600; font-size: 1rem; color: var(--ink); }
.lb-title span { font-family: var(--font-mono); font-weight: 400; font-size: 13px; color: var(--ink-muted); }
.lb-img { display: block; width: 100%; max-height: 72vh; object-fit: contain; border-radius: 8px; animation: lbIn 0.25s ease both; }
@keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
.lb-caption { font-family: var(--font-body); font-size: 14px; color: var(--ink-muted); text-align: center; }
.lb-btn { display: grid; place-items: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 999px; border: 1px solid var(--line-strong); color: var(--ink); transition: background-color 0.2s ease; }
.lb-btn:hover { background: rgba(255, 255, 255, 0.06); }
`;
