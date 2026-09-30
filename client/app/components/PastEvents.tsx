'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ThreeDImageCarousel from './ThreeDImageCarousel';
import { EVENTS, type ClubEvent, longDate, oldestFirst, slugOf } from '@/content/events';

// Every event in content/events.ts that has photos gets a milestone,
// oldest first.
const TIMELINE = EVENTS.filter((e) => e.photos?.length).sort(oldestFirst);

/* ───────────────── Timeline Node ───────────────── */

function TimelineEntry({
  event,
  seq,
  side,
  onOpen,
}: {
  event: ClubEvent;
  seq: number;
  side: 'left' | 'right';
  onOpen: (index: number) => void;
}) {
  const isLeft = side === 'left';
  const header = <TimelineHeader event={event} align={isLeft ? 'right' : 'left'} />;

  return (
    <div id={`past-${slugOf(event)}`} className="relative" style={{ scrollMarginTop: 96 }}>
      {/* node dot: mobile on the left rail, desktop on the centre spine */}
      <div className="absolute left-[15px] md:left-1/2 top-1 md:-translate-x-1/2 z-10">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2af5ff]/50 bg-[#020812] text-xs font-semibold text-[#2af5ff]"
          style={{ fontFamily: 'var(--font-mono)', boxShadow: '0 0 0 6px rgba(40,194,255,0.08), 0 0 20px rgba(40,194,255,0.35)' }}
        >
          {String(seq).padStart(2, '0')}
        </span>
      </div>

      {/* alternating header column on desktop */}
      <div className="ml-14 md:ml-0 md:grid md:grid-cols-2 md:gap-14">
        {isLeft ? (
          <>
            {header}
            <div className="hidden md:block" />
          </>
        ) : (
          <>
            <div className="hidden md:block" />
            {header}
          </>
        )}
      </div>

      {/* full-width album */}
      <div className="ml-14 md:ml-0 mt-8">
        <EventCarousel event={event} onOpen={onOpen} />
      </div>
    </div>
  );
}

function TimelineHeader({ event, align }: { event: ClubEvent; align: 'left' | 'right' }) {
  const reduce = useReducedMotion();
  const meta = [event.start && longDate(event.start), event.venue, `${event.photos!.length} photos`]
    .filter(Boolean)
    .join(' · ');

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: align === 'right' ? -60 : 60, y: 30 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={align === 'right' ? 'md:text-right' : ''}
    >
      <h3
        className="text-2xl sm:text-3xl font-semibold leading-tight"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', letterSpacing: '-0.015em' }}
      >
        {event.name}
      </h3>
      <p className="mt-2 text-sm" style={{ color: 'var(--accent)' }}>
        {meta}
      </p>
      <p
        className={`mt-3 max-w-xl text-[15px] leading-relaxed ${align === 'right' ? 'md:ml-auto' : ''}`}
        style={{ color: 'var(--ink-muted)' }}
      >
        {event.summary}
      </p>
    </motion.div>
  );
}

function EventCarousel({ event, onOpen }: { event: ClubEvent; onOpen: (index: number) => void }) {
  const reduce = useReducedMotion();
  const photos = event.photos!;
  const [focused, setFocused] = useState(0);
  const slides = photos.map((p, i) => ({ id: `${slugOf(event)}-${i}`, src: p.src, title: p.caption }));
  const current = photos[Math.min(focused, photos.length - 1)];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="relative">
        {/* ambient glow behind the carousel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 45% at 50% 40%, rgba(40,194,255,0.12), transparent 70%)' }}
        />
        <div className="relative w-full">
          <ThreeDImageCarousel
            slides={slides}
            itemCount={5}
            autoplay={false}
            onSlideChange={setFocused}
            onSlideClick={(_slide, index) => onOpen(index)}
          />
        </div>
      </div>

      {/* current caption */}
      <div className="flex items-center justify-center mt-1 select-none">
        <div className="flex items-center gap-3 max-w-full rounded-full border border-[#28c2ff]/20 bg-[#020812]/85 px-4 py-2">
          <span className="min-w-0 truncate text-[13px]" style={{ color: 'var(--ink)' }}>
            {current?.caption}
          </span>
          <span className="h-3 w-px shrink-0 bg-[#28c2ff]/25" />
          <span className="shrink-0 text-[13px] tabular-nums" style={{ color: 'var(--accent-strong)', fontFamily: 'var(--font-mono)' }}>
            {Math.min(focused + 1, photos.length)} / {photos.length}
          </span>
          <button
            type="button"
            onClick={() => onOpen(focused)}
            className="shrink-0 text-[13px] font-semibold underline underline-offset-4 decoration-[#28c2ff]/40 hover:decoration-[#28c2ff]"
            style={{ color: 'var(--accent)' }}
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
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

/* ───────────────── Main Component : Scroll Timeline ───────────────── */

export default function PastEvents() {
  const [open, setOpen] = useState<{ event: ClubEvent; index: number } | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start center', 'end center'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <section id="past" className="section">
      <style>{LIGHTBOX_CSS}</style>

      <header className="section-head">
        <h2 className="section-title">Past events</h2>
        <p className="section-lede">
          Everything from ideathons to first-timer workshops. Scroll through
          what we&apos;ve run so far, milestone by milestone.
        </p>
      </header>

      <div ref={timelineRef} className="relative overflow-x-hidden">
        {/* rail */}
        <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 origin-top"
            style={{
              scaleY: progress,
              background: 'linear-gradient(180deg, #28c2ff, #2af5ff, #28c2ff)',
              boxShadow: '0 0 16px rgba(40,194,255,0.6)',
            }}
          />
        </div>

        <div className="space-y-16 md:space-y-24">
          {TIMELINE.map((event, i) => (
            <TimelineEntry
              key={event.code}
              event={event}
              seq={i + 1}
              side={i % 2 === 0 ? 'left' : 'right'}
              onOpen={(index) => setOpen({ event, index })}
            />
          ))}
        </div>

        {/* end cap */}
        <div className="relative flex justify-start md:justify-center mt-14 pl-[14px] md:pl-0">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-[#28c2ff]/25 bg-[#020812] px-5 py-2 text-xs text-[#2af5ff]"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}
          >
            ◉ END OF TIMELINE
          </span>
        </div>
      </div>

      {open && <Lightbox event={open.event} start={open.index} onClose={close} />}
    </section>
  );
}

const LIGHTBOX_CSS = `
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
