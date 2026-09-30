"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EVENTS, type ClubEvent, longDate, newestFirst, slugOf } from "@/content/events";

const GALLERY = EVENTS.filter((e) => e.photos?.length).sort(newestFirst);

const when = (e: ClubEvent) => `${longDate(e.start!)}${e.venue ? ` · ${e.venue}` : ""}`;

export default function PastEvents() {
  const [open, setOpen] = useState<ClubEvent | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="past" className="section">
      <style>{PAST_CSS}</style>

      <header className="section-head">
        <h2 className="section-title">Past events</h2>
        <p className="section-lede">
          Ideathons, first-timer workshops and build sessions. Open any of
          them for the photos.
        </p>
      </header>

      <div className="past-grid">
        {GALLERY.map((e, idx) => {
          const photos = e.photos!;
          return (
            <article
              key={e.code}
              id={`past-${slugOf(e)}`}
              className={idx === 0 ? "past-card past-card--lead" : "past-card"}
            >
              <button
                type="button"
                className="past-cover"
                onClick={() => setOpen(e)}
                aria-label={`View ${photos.length} photos from ${e.name}`}
              >
                <Image
                  src={photos[0].src}
                  alt=""
                  fill
                  sizes={idx === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 45vw, 100vw"}
                  className="object-cover"
                />
                <span className="past-count">{photos.length} photos</span>
              </button>
              <div className="past-meta">
                <h3 className="past-name">{e.name}</h3>
                {e.start && <p className="past-when">{when(e)}</p>}
                <p className="past-sum">{e.summary}</p>
              </div>
            </article>
          );
        })}
      </div>

      {open && <Lightbox event={open} onClose={close} />}
    </section>
  );
}

function Lightbox({ event, onClose }: { event: ClubEvent; onClose: () => void }) {
  const photos = event.photos!;
  const [i, setI] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const prev = useCallback(() => setI((v) => (v - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setI((v) => (v + 1) % photos.length), [photos.length]);

  // Focus goes into the dialog on open and back to the cover button on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
      if (ev.key === "ArrowLeft") prev();
      if (ev.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

const PAST_CSS = `
.past-grid { display: grid; gap: 40px 24px; }
.past-cover { position: relative; display: block; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 12px; background: var(--bg-elevated); cursor: zoom-in; }
.past-cover img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.past-cover:hover img { transform: scale(1.03); }
.past-count { position: absolute; left: 12px; bottom: 12px; padding: 6px 12px; border-radius: 999px; background: rgba(7, 9, 11, 0.82); color: var(--ink); font-family: var(--font-body); font-size: 13px; font-weight: 600; }
.past-meta { margin-top: 16px; }
.past-name { font-family: var(--font-display); font-weight: 600; font-size: clamp(1.25rem, 2.4vw, 1.6rem); line-height: 1.15; letter-spacing: -0.015em; color: var(--ink); }
.past-when { margin-top: 6px; font-family: var(--font-body); font-size: 14px; color: var(--accent); }
.past-sum { margin-top: 8px; max-width: 52ch; font-family: var(--font-body); font-size: 15px; line-height: 1.65; color: var(--ink-muted); }
.past-card { scroll-margin-top: 96px; }
@media (min-width: 768px) {
  .past-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .past-card--lead { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 32px; align-items: end; }
  .past-card--lead .past-meta { margin-top: 0; padding-bottom: 8px; }
  .past-card--lead .past-name { font-size: clamp(1.6rem, 3vw, 2.25rem); }
}

.lb { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(5, 6, 8, 0.94); }
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
