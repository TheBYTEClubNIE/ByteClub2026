'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EVENTS, type ClubEvent, longDate, oldestFirst, slugOf } from '@/content/events';

// Every event in content/events.ts that has photos is a release, oldest first.
const TIMELINE = EVENTS.filter((e) => e.photos?.length).sort(oldestFirst);
const N = TIMELINE.length;
const SEGMENTS = Math.max(1, N - 1);

const version = (i: number) => `v${i + 1}.0`;

// Short "commit hash" per event, stable from its name (FNV-1a).
function commitOf(e: ClubEvent) {
  let h = 2166136261;
  for (let i = 0; i < e.name.length; i++) {
    h ^= e.name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

// Where the floating polaroids sit (desktop shows all three, phones two).
const FLOATERS = [
  { right: '6%', top: '20%', w: 'clamp(118px, 17vw, 230px)', rot: 6, speed: 1 },
  { right: '27%', top: '14%', w: 'clamp(96px, 13vw, 180px)', rot: -7, speed: 1.7 },
  { right: '15%', top: '52%', w: 'clamp(90px, 11vw, 160px)', rot: 3, speed: 2.3 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/* ───────────────── One full-screen stop ───────────────── */

function Scene({
  event,
  index,
  active,
  onOpen,
  sceneRef,
}: {
  event: ClubEvent;
  index: number;
  active: boolean;
  onOpen: (photo: number) => void;
  sceneRef: (el: HTMLDivElement | null) => void;
}) {
  const photos = event.photos!;
  const meta = [event.start && longDate(event.start), event.venue].filter(Boolean).join(' · ');
  let letter = 0;

  return (
    <div
      ref={sceneRef}
      className={`scene ${index === 0 ? 'scene--first' : ''} ${active ? 'is-active' : ''}`}
      inert={!active}
    >
      <div className="scene-bg">
        <Image src={photos[0].src} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="scene-scrim" />
      <div className="scene-scan" aria-hidden />

      {photos.slice(1, 4).map((p, k) => {
        const f = FLOATERS[k];
        return (
          <button
            key={p.src}
            type="button"
            className={`floater floater--${k}`}
            style={{ right: f.right, top: f.top, width: f.w, ['--rot' as string]: `${f.rot}deg`, ['--speed' as string]: f.speed }}
            onClick={() => onOpen(k + 1)}
            aria-label={`Open photo: ${p.caption}`}
          >
            <span className="floater-img">
              <Image src={p.src} alt="" fill sizes="230px" className="object-cover" />
            </span>
          </button>
        );
      })}

      <div className="scene-content">
        <p className="scene-count">
          <span className="scene-tag">{version(index)}</span> commit {commitOf(event)}
        </p>
        <h3 className="scene-name" aria-label={event.name}>
          {event.name.split(' ').map((word, w) => (
            <span key={w} className="word" aria-hidden>
              {word.split('').map((ch) => (
                <span key={letter} className="ltr" style={{ ['--i' as string]: letter++ }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h3>
        {meta && <p className="scene-meta">{meta}</p>}
        <p className="scene-sum">{event.summary}</p>
        <button type="button" className="btn btn-primary scene-cta" onClick={() => onOpen(0)}>
          View {photos.length} photos
        </button>

        <div className="stamp" aria-hidden>
          <span className="stamp-code">{version(index)}</span>
          <span className="stamp-date">SHIPPED</span>
        </div>
      </div>
    </div>
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

/* ───────────────── Changelog: a pinned, scroll-driven release history ───────────────── */

export default function PastEvents() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<{ event: ClubEvent; index: number } | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scenes = useRef<(HTMLDivElement | null)[]>([]);

  // One scroll handler drives everything through CSS variables:
  //   --p      0..1 across the whole history (commit graph, HEAD marker)
  //   --enter  0..1 as a release scans in over the previous one
  //   --life   0..1 across a release's time on screen (zoom, polaroid drift)
  useEffect(() => {
    const track = trackRef.current!;
    const stage = stageRef.current!;
    let raf = 0;
    let listening = false;

    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      const p = clamp01(-r.top / travel);
      const s = p * SEGMENTS;
      stage.style.setProperty('--p', p.toFixed(4));
      let current = 0;
      scenes.current.forEach((el, i) => {
        if (!el) return;
        const enter = i === 0 ? 1 : smooth((s - (i - 0.6)) / 0.6);
        const life = clamp01((s - (i - 0.6)) / 1.6);
        el.style.setProperty('--enter', enter.toFixed(4));
        el.style.setProperty('--life', life.toFixed(4));
        if (enter > 0.5) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        listening = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
      } else if (!entry.isIntersecting && listening) {
        listening = false;
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
      update();
    });
    io.observe(track);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jump = (i: number) => {
    const track = trackRef.current!;
    const travel = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY + (i / SEGMENTS) * travel;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section id="past" className="section" style={{ paddingBottom: 0 }}>
      <style>{CHANGELOG_CSS}</style>

      <header className="section-head mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <h2 className="section-title">Changelog</h2>
        <p className="section-lede">
          Every event we&apos;ve shipped, release by release. Keep scrolling
          through the history, or tap a version to jump to it.
        </p>
      </header>

      <div ref={trackRef} className="cl-track" style={{ height: `calc(${SEGMENTS * 110 + 100} * 1svh)` }}>
        {/* anchor per release, so the board's "N photos →" links land on it */}
        {TIMELINE.map((e, i) => (
          <span
            key={e.code}
            id={`past-${slugOf(e)}`}
            className="cl-anchor"
            style={{ top: `calc(${i / SEGMENTS} * (100% - 100svh))` }}
          />
        ))}

        <div ref={stageRef} className="cl-stage">
          {TIMELINE.map((event, i) => (
            <Scene
              key={event.code}
              event={event}
              index={i}
              active={i === active}
              onOpen={(photo) => setOpen({ event, index: photo })}
              sceneRef={(el) => {
                scenes.current[i] = el;
              }}
            />
          ))}

          {/* commit graph: HEAD rides along as you scroll */}
          <nav className="cl-map" aria-label="Changelog releases">
            <span className="cl-origin">
              <span className="cl-origin-long">git init · </span>2023
            </span>
            <div className="cl-route">
              <span className="cl-line" />
              <span className="cl-line cl-line--lit" />
              {TIMELINE.map((e, i) => (
                <button
                  key={e.code}
                  type="button"
                  className={`cl-stop ${i <= active ? 'is-past' : ''} ${i === active ? 'is-here' : ''}`}
                  style={{ left: `${(i / SEGMENTS) * 100}%` }}
                  onClick={() => jump(i)}
                  aria-label={`Jump to ${version(i)}, ${e.name}`}
                  aria-current={i === active ? 'step' : undefined}
                >
                  <span className="cl-dot" />
                  <span className="cl-code">{version(i)}</span>
                </button>
              ))}
              <span className="cl-head" aria-hidden>
                HEAD
              </span>
            </div>
            <a href="#events" className="cl-next">
              next <span aria-hidden>→</span>
            </a>
          </nav>
        </div>
      </div>

      {open && <Lightbox event={open.event} start={open.index} onClose={close} />}
    </section>
  );
}

const CHANGELOG_CSS = `
.cl-track { position: relative; }
.cl-anchor { position: absolute; left: 0; width: 1px; height: 1px; scroll-margin-top: -84px; }
.cl-stage { position: sticky; top: 0; height: 100svh; overflow: hidden; background: #07090b; }

/* each release scans in from the bottom, like a screen redrawing */
.scene { position: absolute; inset: 0; isolation: isolate; clip-path: inset(calc((1 - var(--enter, 0)) * 100%) 0 0 0); }
.scene--first { clip-path: none; }
.scene-scan { position: absolute; left: 0; right: 0; z-index: 4; top: calc((1 - var(--enter, 0)) * 100%); height: 2px; background: var(--accent-strong); box-shadow: 0 0 24px 6px rgba(42,245,255,0.55); opacity: calc(var(--enter, 0) * (1 - var(--enter, 0)) * 4); pointer-events: none; }
.scene--first .scene-scan { display: none; }
.scene-bg { position: absolute; inset: 0; transform: scale(calc(1.16 - var(--life, 0) * 0.16)) translate3d(0, calc(var(--life, 0) * -2%), 0); will-change: transform; }
.scene-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,9,11,0.75) 0%, rgba(7,9,11,0.15) 28%, rgba(7,9,11,0.25) 50%, rgba(7,9,11,0.94) 82%, #07090b 100%); }
.scene-scrim::after { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px); }

.floater { position: absolute; z-index: 2; padding: 6px 6px 22px; background: #eef1f4; border-radius: 4px; box-shadow: 0 24px 50px -12px rgba(0,0,0,0.7); cursor: zoom-in; transform: translate3d(0, calc((0.5 - var(--life, 0)) * 55vh * var(--speed, 1)), 0) rotate(var(--rot, 0deg)); transition: box-shadow 0.3s ease; }
.floater:hover { box-shadow: 0 30px 60px -10px rgba(40,194,255,0.5); }
.floater-img { position: relative; display: block; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; background: #d9dee3; }
.floater--2 { display: none; }

.scene-content { position: absolute; z-index: 3; left: 0; right: 0; bottom: 0; padding: 0 16px calc(28px + env(safe-area-inset-bottom)); max-width: 80rem; margin-inline: auto; }
.scene-count { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em; color: var(--accent); }
.scene-tag { display: inline-block; margin-right: 8px; padding: 2px 8px; border-radius: 999px; background: var(--accent); color: #031018; font-weight: 500; }
.scene-name { margin-top: 10px; max-width: 14ch; font-family: var(--font-display); font-weight: 700; font-size: clamp(2.3rem, 9vw, 6.5rem); line-height: 0.98; letter-spacing: -0.035em; color: var(--ink); }
.word { display: inline-block; overflow: hidden; margin-right: 0.22em; vertical-align: top; padding-bottom: 0.06em; }
.ltr { display: inline-block; transform: translate3d(0, 105%, 0); transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: calc(var(--i) * 22ms); }
.is-active .ltr { transform: none; }
.scene-meta { margin-top: 12px; font-size: 14px; color: var(--accent); }
.scene-sum { margin-top: 8px; max-width: 46ch; font-size: 15px; line-height: 1.6; color: rgba(243,245,247,0.82); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.scene-cta { margin-top: 18px; }
.scene-meta, .scene-sum, .scene-cta, .scene-count { opacity: 0; transform: translate3d(0, 14px, 0); transition: opacity 0.5s ease 0.25s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s; }
.is-active .scene-meta, .is-active .scene-sum, .is-active .scene-cta, .is-active .scene-count { opacity: 1; transform: none; }

/* SHIPPED stamp slams on each time a release lands */
.stamp { position: absolute; right: 16px; bottom: calc(100% - 40px); width: 96px; height: 96px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; border: 2.5px solid var(--accent); outline: 1px solid rgba(40,194,255,0.7); outline-offset: -9px; color: var(--accent); background: rgba(7,9,11,0.55); opacity: 0; transform: rotate(-14deg) scale(1.9); }
.is-active .stamp { animation: stamp-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both; }
.stamp-code { font-family: var(--font-display); font-weight: 700; font-size: 24px; line-height: 1; }
.stamp-date { margin-top: 5px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.06em; }
@keyframes stamp-in {
  from { opacity: 0; transform: rotate(-34deg) scale(1.9); }
  65% { opacity: 1; transform: rotate(-12deg) scale(0.93); }
  to { opacity: 1; transform: rotate(-14deg) scale(1); }
}

/* commit graph */
.cl-map { position: absolute; z-index: 5; top: 84px; left: 16px; right: 16px; display: flex; align-items: center; gap: 14px; max-width: 64rem; margin-inline: auto; padding: 34px 16px 26px; border-radius: 14px; background: rgba(7,9,11,0.78); border: 1px solid var(--line-strong); }
.cl-origin, .cl-next { flex-shrink: 0; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; color: var(--ink-muted); }
.cl-next { padding: 4px 10px; border: 1px dashed var(--line-strong); border-radius: 999px; color: var(--ink); transition: border-color 0.2s ease, color 0.2s ease; }
.cl-next:hover { border-color: var(--accent); color: var(--accent); }
.cl-route { position: relative; flex: 1; height: 2px; margin-inline: 12px; }
.cl-line { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 2px, transparent 2px 8px); }
.cl-line--lit { background: var(--accent); transform-origin: left; transform: scaleX(var(--p, 0)); box-shadow: 0 0 10px rgba(40,194,255,0.7); }
.cl-stop { position: absolute; top: 50%; transform: translate(-50%, -50%); display: grid; place-items: center; width: 32px; height: 32px; }
.cl-dot { width: 10px; height: 10px; border-radius: 50%; background: #07090b; border: 2px solid rgba(255,255,255,0.4); transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease; }
.cl-stop.is-past .cl-dot { border-color: var(--accent); background: var(--accent); }
.cl-stop.is-here .cl-dot { box-shadow: 0 0 0 5px rgba(40,194,255,0.25); }
.cl-code { position: absolute; top: 26px; font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.06em; color: var(--ink-muted); transition: color 0.3s ease; }
.cl-stop.is-here .cl-code { color: var(--ink); }
.cl-stop:hover .cl-code { color: var(--accent); }
.cl-head { position: absolute; bottom: 12px; left: calc(var(--p, 0) * 100%); transform: translateX(-50%); padding: 2px 7px; border-radius: 5px; background: var(--accent-strong); color: #031018; font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.04em; box-shadow: 0 0 14px rgba(42,245,255,0.6); pointer-events: none; }
.cl-head::after { content: ""; position: absolute; left: 50%; top: 100%; width: 1px; height: 7px; background: var(--accent-strong); }
.cl-origin-long { display: none; }
@media (min-width: 640px) { .cl-origin-long { display: inline; } }

@media (min-width: 768px) {
  .floater--2 { display: block; }
  .scene-content { padding: 0 32px 56px; }
  .stamp { right: 32px; width: 116px; height: 116px; bottom: calc(100% - 60px); }
  .stamp-code { font-size: 28px; }
  .cl-map { top: 96px; padding: 36px 22px 28px; }
  .scene-sum { -webkit-line-clamp: 4; font-size: 16px; }
}
@media (min-width: 1024px) { .scene-content { padding: 0 48px 64px; } }

@media (prefers-reduced-motion: reduce) {
  .scene { clip-path: none; opacity: var(--enter, 0); }
  .scene-scan { display: none; }
  .scene-bg, .floater { transform: rotate(var(--rot, 0deg)); }
  .ltr, .scene-meta, .scene-sum, .scene-cta, .scene-count { transition: none; }
  .is-active .stamp { animation: none; opacity: 1; transform: rotate(-14deg); }
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
