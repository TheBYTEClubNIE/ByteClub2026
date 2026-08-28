'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  { id: 1, url: '/events/1.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Team Presentations' },
  { id: 2, url: '/events/2.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Audience Engagement' },
  { id: 3, url: '/events/3.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Team Briefing' },
  { id: 4, url: '/events/4.jpg', eventName: 'Beyond BYTE Ideathon', date: 'Q&A Session' },
  { id: 5, url: '/events/5.png', eventName: 'Beyond BYTE Ideathon', date: 'Event Logo' },

  { id: 6, url: '/events/bits-1.jpg', eventName: 'Bits to Bytes', date: 'Student Audience' },
  { id: 7, url: '/events/bits-2.jpg', eventName: 'Bits to Bytes', date: 'Event Engagement' },
  { id: 8, url: '/events/bits-3.png', eventName: 'Bits to Bytes', date: 'Official Poster' },
  { id: 9, url: '/events/bits-4.jpg', eventName: 'Bits to Bytes', date: 'The Byte Club Organizers' },

  { id: 10, url: '/events/group-1.jpg', eventName: 'Annual Assembly', date: 'Mass Gathering' },
  { id: 11, url: '/events/group-2.png', eventName: 'Annual Assembly', date: 'Community Photo' },

  // Beyond Labs
  
  { id: 14, url: '/Events/beyondlabs3.jpg', eventName: 'Beyond Labs', date: 'Student Participation' },
  { id: 15, url: '/Events/beyondlabs4.jpg', eventName: 'Beyond Labs', date: 'Hands-on Activity' },
  { id: 16, url: '/Events/beyondlabs5.jpg', eventName: 'Beyond Labs', date: 'Interactive Learning' },
  { id: 17, url: '/Events/beyondlabs6.jpg', eventName: 'Beyond Labs', date: 'Technical Discussion' },
  { id: 18, url: '/Events/beyondlabs7.jpg', eventName: 'Beyond Labs', date: 'Team Collaboration' },
  { id: 19, url: '/Events/beyondlabs8.jpg', eventName: 'Beyond Labs', date: 'Closing Moments' },
];

function groupByEvent(images: PastEventImage[]) {
  return images.reduce<Record<string, PastEventImage[]>>((acc, img) => {
    if (!acc[img.eventName]) acc[img.eventName] = [];
    acc[img.eventName].push(img);
    return acc;
  }, {});
}

/* ───────────────── Animated Card ───────────────── */

function AnimatedCard({
  event,
  index,
  onClick,
}: {
  event: PastEventImage;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        transitionDelay: `${(index % 8) * 60}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(28px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
      }}
      className="
        break-inside-avoid
        relative
        group
        cursor-pointer
        rounded-3xl
        overflow-hidden
        border border-cyan-400/10
        bg-[#020812]/80
        backdrop-blur-md
        hover:border-cyan-400/30
        transition-all duration-500
      "
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,212,255,0.08), transparent 60%)",
        }}
      />

      <img
        src={event.url}
        alt={event.eventName}
        className="
          w-full
          h-auto
          object-cover
          block
          transition-all duration-700
          group-hover:scale-[1.05]
          group-hover:brightness-[0.65]
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/90
          via-black/10
          to-transparent
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-400
          flex flex-col justify-end
          p-5
        "
      >
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.15em",
          }}
          className="text-[10px] text-cyan-300 uppercase"
        >
          {event.eventName}
        </span>

        <h3
          style={{
            fontFamily: "'Orbitron', sans-serif",
          }}
          className="text-white font-semibold text-sm mt-1"
        >
          {event.date}
        </h3>

        <span className="text-cyan-200 text-[11px] mt-2 opacity-80">
          ⊕ view
        </span>
      </div>
    </div>
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

    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/85 backdrop-blur-md p-4
      "
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center w-full max-w-5xl gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="w-full flex items-center justify-between">
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
            }}
            className="text-cyan-400 text-xs"
          >
            {current + 1} / {total}
          </span>

          <button
            onClick={onClose}
            className="
              px-4 py-1.5 rounded-full
              border border-cyan-400/20
              text-cyan-300 text-xs
              hover:bg-cyan-400/10
              transition-all duration-300
            "
          >
            ✕ close
          </button>
        </div>

        {/* Image */}
        <div className="flex items-center gap-4 w-full">

          <button
            onClick={onPrev}
            className="
              w-10 h-10 rounded-full
              border border-cyan-400/20
              text-cyan-300
              hover:bg-cyan-400/10
              transition-all duration-300
            "
          >
            ←
          </button>

          <img
            src={image.url}
            alt={image.eventName}
            className="
              flex-1
              max-h-[75vh]
              object-contain
              rounded-2xl
              border border-cyan-400/10
            "
          />

          <button
            onClick={onNext}
            className="
              w-10 h-10 rounded-full
              border border-cyan-400/20
              text-cyan-300
              hover:bg-cyan-400/10
              transition-all duration-300
            "
          >
            →
          </button>

        </div>

        {/* Caption */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-white">{image.eventName}</span>
          <span className="text-cyan-500">•</span>
          <span className="text-cyan-300">{image.date}</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Main Component ───────────────── */

export default function PastEvents({
  images = PLACEHOLDER_IMAGES,
}: PastEventsProps) {

  const grouped = groupByEvent(images);
  const eventNames = Object.keys(grouped);
  const filters = ['All', ...eventNames];

  const [activeFilter, setActiveFilter] = useState('All');
  const [displayedImages, setDisplayedImages] = useState(images);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleFilter = (filter: string) => {
    if (filter === activeFilter) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setActiveFilter(filter);

      setDisplayedImages(
        filter === 'All'
          ? images
          : images.filter((img) => img.eventName === filter)
      );

      setIsTransitioning(false);
    }, 250);
  };

  const openLightbox = (index: number) => setLightboxIndex(index);

  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + displayedImages.length) % displayedImages.length
        : null
    );

  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev + 1) % displayedImages.length
        : null
    );

  return (
    <div className="min-h-screen bg-transparent text-white px-5 py-16 md:px-12">

      {/* ───────────────── Title ───────────────── */}

      <div className="max-w-7xl mx-auto mb-14">

        <div
          className="
            relative overflow-hidden rounded-[28px]
            border border-cyan-400/20
            bg-[#020812]/90
            backdrop-blur-xl
            p-8 md:p-10
          "
          style={{
            boxShadow:
              "0 0 40px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.04)",
          }}
        >

          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,212,255,0.05) 0%, transparent 50%, rgba(0,255,200,0.03) 100%)",
            }}
          />

          {/* Top Line */}
          <div
            className="absolute top-0 left-10 right-10 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), rgba(0,255,200,0.4), transparent)",
            }}
          />

          {/* Label */}
          <p
            className="mb-3"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "11px",
              color: "rgba(0,212,255,0.65)",
              letterSpacing: "0.18em",
            }}
          >
            ARCHIVE.LOG
          </p>

          {/* Heading */}
          <h2
            className="
              relative inline-block
              text-5xl md:text-7xl
              font-black
              text-white
              leading-none
              mb-6
            "
            style={{
              fontFamily: "'Orbitron', sans-serif",
              textShadow:
                "0 0 16px rgba(255,255,255,0.22), 0 0 40px rgba(0,212,255,0.18)",
            }}
          >
            Past Events
          </h2>

          {/* Description */}
          <p
            className="max-w-xl leading-relaxed"
            style={{
              color: "rgba(180,220,230,0.7)",
              fontSize: "14px",
            }}
          >
            Relive our hackathons, workshops, and unforgettable community moments.
          </p>

        </div>
      </div>

      {/* ───────────────── Filters ───────────────── */}

      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap gap-3 items-center">

        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilter(filter)}
            className="
              px-5 py-2 rounded-full
              text-xs transition-all duration-300
            "
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.12em",

              background:
                activeFilter === filter
                  ? "linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,255,200,0.08))"
                  : "rgba(255,255,255,0.03)",

              border:
                activeFilter === filter
                  ? "1px solid rgba(0,212,255,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",

              color:
                activeFilter === filter
                  ? "#67e8f9"
                  : "rgba(180,220,230,0.65)",
            }}
          >
            {filter}
          </button>
        ))}

        <span
          className="ml-auto text-[11px]"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(180,220,230,0.45)",
            letterSpacing: "0.12em",
          }}
        >
          {displayedImages.length} PHOTOS
        </span>
      </div>

      {/* ───────────────── Grid ───────────────── */}

      <div
        className="max-w-7xl mx-auto"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning
            ? 'translateY(10px)'
            : 'translateY(0)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {displayedImages.map((event, index) => (
            <AnimatedCard
              key={`${event.id}-${activeFilter}`}
              event={event}
              index={index}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      </div>

      {/* ───────────────── Lightbox ───────────────── */}

      {lightboxIndex !== null && (
        <Lightbox
          image={displayedImages[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          current={lightboxIndex}
          total={displayedImages.length}
        />
      )}
    </div>
  );
}