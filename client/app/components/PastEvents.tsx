'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import ThreeDImageCarousel from './ThreeDImageCarousel';

export interface PastEventImage {
  id: string | number;
  url: string;
  eventName: string;
  date: string;
}

interface PastEventsProps {
  images?: PastEventImage[];
}

const PLACEHOLDER_IMAGES: PastEventImage[] = [
  { id: 1, url: '/Events/1.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Team Presentations' },
  { id: 2, url: '/Events/2.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Audience Engagement' },
  { id: 3, url: '/Events/3.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Team Briefing' },
  { id: 4, url: '/Events/4.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Q&A Session' },
  { id: 5, url: '/Events/5.png', eventName: 'Beyond BYTE Ideathon', date: 'Event Logo' },

  { id: 6, url: '/Events/bits-1.jpg', eventName: 'Bits to Bytes', date: 'Student Audience' },
  { id: 7, url: '/Events/bits-2.jpg', eventName: 'Bits to Bytes', date: 'Event Engagement' },
  { id: 8, url: '/Events/bits-3.png', eventName: 'Bits to Bytes', date: 'Official Poster' },
  { id: 9, url: '/Events/bits-4.jpg', eventName: 'Bits to Bytes', date: 'The Byte Club Organizers' },

  { id: 10, url: '/Events/group-1.jpg', eventName: 'Annual Assembly', date: 'Mass Gathering' },
  { id: 11, url: '/Events/group-2.png', eventName: 'Annual Assembly', date: 'Community Photo' },

  // Beyond Labs
  { id: 14, url: '/Events/beyondlabs3.jpg', eventName: 'Beyond Labs', date: 'Student Participation' },
  { id: 15, url: '/Events/beyondlabs4.jpg', eventName: 'Beyond Labs', date: 'Hands-on Activity' },
  { id: 16, url: '/Events/beyondlabs5.jpg', eventName: 'Beyond Labs', date: 'Interactive Learning' },
  { id: 17, url: '/Events/beyondlabs6.jpg', eventName: 'Beyond Labs', date: 'Technical Discussion' },
  { id: 18, url: '/Events/beyondlabs7.jpg', eventName: 'Beyond Labs', date: 'Team Collaboration' },
  { id: 19, url: '/Events/beyondlabs8.jpg', eventName: 'Beyond Labs', date: 'Closing Moments' },
];

const EVENT_DESCRIPTIONS: Record<string, string> = {
  'Beyond BYTE Ideathon':
    'Our flagship ideathon where student teams pitched bold ideas beyond the classroom. From high-energy team presentations and a buzzing audience to intense Q&A rounds, the event celebrated creativity, collaboration, and out-of-the-box problem solving.',
  'Bits to Bytes':
    'A welcoming community event that walked newcomers from the basics of tech to building real things. Packed with curious faces, live engagement, and the organizers who started it all: the perfect first step into the Byte Club journey.',
  'Annual Assembly':
    'The biggest gathering of our community, members old and new under one roof. A day of reflection, celebration, and group photos that capture the true scale and spirit of the Byte Club family.',
  'Beyond Labs':
    'A hands-on learning series that took members beyond theory into real building. Through interactive sessions, technical discussions, and team collaboration, participants experimented, broke things, and learned together.',
};

function groupByEvent(images: PastEventImage[]) {
  return images.reduce<Record<string, PastEventImage[]>>((acc, img) => {
    if (!acc[img.eventName]) acc[img.eventName] = [];
    acc[img.eventName].push(img);
    return acc;
  }, {});
}

/* ───────────────── Timeline Node ───────────────── */

function TimelineEntry({
  eventName,
  photos,
  seq,
  side,
  onOpen,
}: {
  eventName: string;
  photos: PastEventImage[];
  seq: number;
  side: 'left' | 'right';
  onOpen: (img: PastEventImage) => void;
}) {
  const isLeft = side === 'left';

  return (
    <div className="relative">
      {/* node dot — mobile: left rail · desktop: centre spine */}
      <div className="absolute left-[19px] md:left-1/2 top-2 md:-translate-x-1/2 z-10">
        <span className="relative flex h-9 w-9 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#28c2ff]/20" />
          <span
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2af5ff]/50 bg-[#020812] text-[11px] font-bold text-[#2af5ff]"
            style={{
              fontFamily: "var(--font-mono)",
              boxShadow: '0 0 20px rgba(40,194,255,0.45)',
            }}
          >
            {String(seq).padStart(2, '0')}
          </span>
        </span>
      </div>

      {/* alternating header column on desktop */}
      <div className="ml-14 md:ml-0 md:grid md:grid-cols-2 md:gap-14">
        {isLeft ? (
          <>
            <TimelineHeader
              eventName={eventName}
              photos={photos}
              seq={seq}
              align="right"
              description={
                EVENT_DESCRIPTIONS[eventName] ??
                'Moments from this event: browse the gallery to relive them.'
              }
            />
            <div className="hidden md:block" />
          </>
        ) : (
          <>
            <div className="hidden md:block" />
            <TimelineHeader
              eventName={eventName}
              photos={photos}
              seq={seq}
              align="left"
              description={
                EVENT_DESCRIPTIONS[eventName] ??
                'Moments from this event: browse the gallery to relive them.'
              }
            />
          </>
        )}
      </div>

      {/* full-width album — room for a much bigger book */}
      <div className="ml-14 md:ml-0 mt-8">
        <EventCarousel eventName={eventName} photos={photos} onOpen={onOpen} />
      </div>
    </div>
  );
}

function TimelineHeader({
  eventName,
  photos,
  seq,
  align,
  description,
}: {
  eventName: string;
  photos: PastEventImage[];
  seq: number;
  align: 'left' | 'right';
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'right' ? -60 : 60, y: 30 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <p
        className="text-[10px] uppercase text-[#28c2ff]/70"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: '0.22em' }}
      >
        {String(seq).padStart(2, '0')} // MILESTONE
      </p>

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-1">
        <h3
          className="text-2xl sm:text-3xl font-black text-white leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            textShadow: '0 0 18px rgba(40,194,255,0.2)',
          }}
        >
          {eventName}
        </h3>
        <span
          className="text-[11px] text-[#60afff]/60"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: '0.14em' }}
        >
          {photos.length} PHOTOS
        </span>
      </div>
      <p className="text-[13px] sm:text-sm text-slate-300/80 leading-relaxed mt-3 max-w-xl">
        {description}
      </p>
    </motion.div>
  );
}

function EventCarousel({
  eventName,
  photos,
  onOpen,
}: {
  eventName: string;
  photos: PastEventImage[];
  onOpen: (img: PastEventImage) => void;
}) {
  const [focused, setFocused] = useState(0);

  // start from the first photo when the album changes
  useEffect(() => {
    setFocused(0);
  }, [eventName]);

  const slides = photos.map((p) => ({ id: p.id, src: p.url, title: p.date }));
  const current = photos[Math.min(focused, photos.length - 1)];

  if (photos.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-3xl"
    >

      {/* ── 3D carousel ── */}
      <div className="relative">
        {/* ambient glow behind the carousel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(55% 45% at 50% 40%, rgba(40,194,255,0.12), transparent 70%)',
          }}
        />
        <div className="relative w-full">
          <ThreeDImageCarousel
            slides={slides}
            itemCount={5}
            onSlideChange={setFocused}
            onSlideClick={(_slide, index) => {
              const photo = photos[index];
              if (photo) onOpen(photo);
            }}
          />
        </div>
      </div>

      {/* current caption */}
      <div className="flex items-center justify-center mt-1 select-none">
        <div
          className="flex items-center gap-3 max-w-full rounded-full border border-[#28c2ff]/20 bg-[#020812]/80 backdrop-blur px-4 py-2"
          style={{ boxShadow: '0 0 24px rgba(40,194,255,0.08)' }}
        >
          <span
            className="min-w-0 truncate text-[11px] text-slate-300"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: '0.08em' }}
          >
            {current ? current.date : ''}
          </span>
          <span className="h-3 w-px shrink-0 bg-[#28c2ff]/25" />
          <span
            className="shrink-0 text-[11px] text-[#2af5ff]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {Math.min(focused + 1, photos.length)} / {photos.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────────── Lightbox ───────────────── */

function Lightbox({
  image,
  onClose,
  onPrev,
  onNext,
  current,
  total,
}: {
  image: PastEventImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center w-full max-w-5xl gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[#28c2ff] text-xs"
          >
            {current + 1} / {total}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-[#28c2ff]/20 text-[#2af5ff] text-xs hover:bg-[#28c2ff]/10 transition-all duration-300"
          >
            ✕ close
          </button>
        </div>

        <div className="flex items-center gap-4 w-full">
          <button
            onClick={onPrev}
            className="w-10 h-10 shrink-0 rounded-full border border-[#28c2ff]/20 text-[#2af5ff] hover:bg-[#28c2ff]/10 transition-all duration-300"
          >
            ←
          </button>
          <motion.img
            key={String(image.id)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={image.url}
            alt={image.eventName}
            className="flex-1 min-w-0 max-h-[75vh] object-contain rounded-2xl border border-[#28c2ff]/10"
          />
          <button
            onClick={onNext}
            className="w-10 h-10 shrink-0 rounded-full border border-[#28c2ff]/20 text-[#2af5ff] hover:bg-[#28c2ff]/10 transition-all duration-300"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-white">{image.eventName}</span>
          <span className="text-[#3066be]">•</span>
          <span className="text-[#2af5ff]">{image.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────────── Main Component : Scroll Timeline ───────────────── */

export default function PastEvents({ images = PLACEHOLDER_IMAGES }: PastEventsProps) {
  const grouped = groupByEvent(images);
  const eventNames = Object.keys(grouped);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // Every milestone shows on the timeline
  const visibleEvents = eventNames.map((name) => ({ name, photos: grouped[name] }));

  const flatList = visibleEvents.flatMap((e) => e.photos);

  // Map flat index offsets so the lightbox can page across the whole filtered set
  const offsets: number[] = [];
  {
    let acc = 0;
    for (const e of visibleEvents) {
      offsets.push(acc);
      acc += e.photos.length;
    }
  }

  const openAtFlatIndex = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + flatList.length) % flatList.length : null
    );
  const nextImage = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % flatList.length : null));

  return (
    <div className="min-h-screen bg-transparent text-white px-5 py-16 md:px-12">
      {/* ── Title ── */}
      <div className="max-w-7xl mx-auto mb-14">
        <div
          className="relative overflow-hidden rounded-[28px] border border-[#28c2ff]/20 bg-[#020812]/90 backdrop-blur-xl p-8 md:p-10"
          style={{
            boxShadow:
              '0 0 40px rgba(40,194,255,0.08), inset 0 0 20px rgba(40,194,255,0.04)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(40,194,255,0.05) 0%, transparent 50%, rgba(42,245,255,0.03) 100%)',
            }}
          />
          <div
            className="absolute top-0 left-10 right-10 h-[1px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(40,194,255,0.4), rgba(42,245,255,0.4), transparent)',
            }}
          />
          <p
            className="mb-3"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: '11px',
              color: 'rgba(40,194,255,0.65)',
              letterSpacing: '0.18em',
            }}
          >
            THE ARCHIVE
          </p>
          <h2
            className="relative inline-block text-5xl md:text-7xl font-black leading-none mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink)",
            }}
          >
            Past Events
          </h2>
          <p className="max-w-xl leading-relaxed" style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>
            Everything from ideathons to first-timer workshops, scroll
            through what we&apos;ve run so far, milestone by milestone.
          </p>
        </div>
      </div>

      {/* ── Scroll Timeline ── */}
      <div className="max-w-7xl mx-auto">
        <div ref={timelineRef} className="relative overflow-x-hidden">
          {/* rail */}
          <div className="absolute left-[32px] md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 origin-top"
              style={{
                scaleY: progress,
                background:
                  'linear-gradient(180deg, #28c2ff, #2af5ff, #28c2ff)',
                boxShadow: '0 0 16px rgba(40,194,255,0.6)',
              }}
            />
          </div>

          <div className="space-y-10 md:space-y-16">
            {visibleEvents.map((entry, i) => (
              <TimelineEntry
                key={entry.name}
                eventName={entry.name}
                photos={entry.photos}
                seq={i + 1}
                side={i % 2 === 0 ? 'left' : 'right'}
                onOpen={(img) => {
                  const local = entry.photos.findIndex((p) => p.id === img.id);
                  openAtFlatIndex((offsets[i] ?? 0) + Math.max(local, 0));
                }}
              />
            ))}
          </div>

          {/* end cap */}
          <div className="relative flex justify-start md:justify-center mt-12 pl-[14px] md:pl-0">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#28c2ff]/25 bg-[#020812] px-5 py-2 text-[11px] text-[#2af5ff]"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: '0.15em' }}
            >
              ◉ END OF TIMELINE
            </span>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && flatList[lightboxIndex] && (
          <Lightbox
            image={flatList[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
            current={lightboxIndex}
            total={flatList.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
