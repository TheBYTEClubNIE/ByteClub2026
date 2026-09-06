'use client';

import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Type Definitions ---

export interface CarouselSlide {
  id: string | number;
  src: string;
  title?: string;
}

interface ThreeDImageCarouselProps {
  /** The array of image data for the slider. */
  slides: CarouselSlide[];
  /** Number of visible items in the slider (3 or 5). Default is 5. */
  itemCount?: 3 | 5;
  /** Enables/Disables automatic sliding. Default is true. */
  autoplay?: boolean;
  /** Delay in seconds for autoplay. Default is 4. */
  delay?: number;
  /** Pauses autoplay when the mouse hovers over the slider. Default is true. */
  pauseOnHover?: boolean;
  /** Tailwind class for the main container (e.g., margins, padding). */
  className?: string;
  /** Fired whenever the centered slide changes. */
  onSlideChange?: (index: number) => void;
  /** Fired when the centered slide is clicked (e.g., open a lightbox). */
  onSlideClick?: (slide: CarouselSlide, index: number) => void;
}

// --- MINIMIZED CSS Styles (Only core 3D positioning and responsiveness remain) ---

const EMBEDDED_CSS = `
/* --- Cascade Slider Styles --- */

.cascade-slider_container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    z-index: 20;
    user-select: none;
    -webkit-user-select: none;
    touch-action: pan-y;
    height: 330px;
}

.cascade-slider_slides {
    position: relative;
    height: 100%;
}

.cascade-slider_item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(0.3);
    transition: all 1s ease;
    opacity: 0;
    z-index: 1;
    cursor: grab;
}
.cascade-slider_item.now {
    cursor: pointer;
}
.cascade-slider_item:active {
    cursor: grabbing;
}

/* Slide Positioning Classes (Core 3D Logic - MUST REMAIN IN CSS) */
.cascade-slider_item.next {
    left: 50%;
    transform: translateY(-50%) translateX(-120%) scale(0.6);
    opacity: 1;
    z-index: 4;
}
.cascade-slider_item.prev {
    left: 50%;
    transform: translateY(-50%) translateX(20%) scale(0.6);
    opacity: 1;
    z-index: 4;
}
.cascade-slider_item.now {
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%) scale(1);
    opacity: 1;
    z-index: 5;
}

/* Arrows - Structural CSS remains for positioning/size */
.cascade-slider_arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 6;
    transform: translate(0, -50%);
    width: 40px;
    height: 40px;
    transition: all 0.3s ease;
}

/* Arrow Positioning */
.cascade-slider_arrow-left { left: 5px; }
.cascade-slider_arrow-right { right: 5px; }
@media screen and (min-width: 576px) {
    .cascade-slider_arrow-left { left: 8px; }
    .cascade-slider_arrow-right { right: 8px; }
}
/* Images */

.cascade-slider_slides img {
    width: min(340px, 82vw);
    height: 240px;
    object-fit: cover;
    border-radius: 24px;
    display: block;
    transition: filter 1s ease, box-shadow 1s ease;
    border: 1px solid rgba(255, 255, 255, 0.12);
}
.cascade-slider_item.now img {
    box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 55px -10px rgba(34, 211, 238, 0.4);
    border-color: rgba(34, 211, 238, 0.35);
    -webkit-box-reflect: below 6px linear-gradient(transparent 72%, rgba(255, 255, 255, 0.14));
}
.cascade-slider_item:not(.now) img {
    filter: grayscale(0.95);
}

/* Caption overlay — visible only on the centered slide */
.slide-caption {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    z-index: 2;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    padding: 22px 12px 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.88), transparent);
    border-radius: 0 0 18px 18px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    pointer-events: none;
}
.cascade-slider_item.now .slide-caption {
    opacity: 1;
    transform: translateY(0);
}
.slide-caption-title {
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.slide-caption-count {
    color: rgba(103, 232, 249, 0.9);
    font-size: 10px;
    font-family: monospace;
    letter-spacing: 0.12em;
    flex-shrink: 0;
}

/* --- Media Queries (structural layout only) --- */
@media screen and (min-width: 414px) {
    .cascade-slider_container { height: 350px; }
    .cascade-slider_slides img { width: min(360px, 84vw); height: 250px; }
}
@media screen and (min-width: 576px) {
    .cascade-slider_container { height: 440px; }
    .cascade-slider_slides img { width: 260px; height: 340px; }
}
@media screen and (min-width: 768px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-125%) scale(0.6); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(25%) scale(0.6); }
    .cascade-slider_slides img { width: 260px; height: 340px; }
}
@media screen and (min-width: 991px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-115%) scale(0.55); z-index: 4; }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(15%) scale(0.55); z-index: 4; }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-150%) scale(0.37); z-index: 1; }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(50%) scale(0.37); z-index: 2; }
    .cascade-slider_slides img { width: 300px; height: 390px; }
    .cascade-slider_container { height: 460px; }
}
@media screen and (min-width: 1100px) {
    .cascade-slider_item.next { transform: translateY(-50%) translateX(-130%) scale(0.55); }
    .cascade-slider_item.prev { transform: translateY(-50%) translateX(30%) scale(0.55); }
    .cascade-slider_item.next2 { transform: translateY(-50%) translateX(-180%) scale(0.37); z-index: 1; }
    .cascade-slider_item.prev2 { transform: translateY(-50%) translateX(80%) scale(0.37); z-index: 2; }
    .cascade-slider_slides img { width: 300px; height: 420px; }
}

/* Mobile: center image only — hide the side slides */
@media screen and (max-width: 767px) {
    .cascade-slider_item:not(.now) {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }
}
`;

// --- Helper Function: Get Slide Classes ---

const getSlideClasses = (
  index: number,
  activeIndex: number,
  total: number,
  visibleCount: 3 | 5
): string => {
  const diff = index - activeIndex;
  if (diff === 0) return 'now';
  if (diff === 1 || diff === -total + 1) return 'next';
  if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) return 'next2';
  if (diff === -1 || diff === total - 1) return 'prev';
  if (visibleCount === 5 && (diff === -2 || diff === total - 2)) return 'prev2';
  return '';
};

// --- ThreeDImageCarousel Component Logic ---

export const ThreeDImageCarousel: React.FC<ThreeDImageCarouselProps> = ({
  slides,
  itemCount = 5,
  autoplay = true,
  delay = 4,
  pauseOnHover = true,
  className = '',
  onSlideChange,
  onSlideClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayIntervalRef = useRef<number | null>(null);
  const total = slides.length;

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const swipeThreshold = 50;

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      setActiveIndex((current) => {
        if (direction === 'next') {
          return (current + 1) % total;
        } else {
          return (current - 1 + total) % total;
        }
      });
    },
    [total]
  );

  useEffect(() => {
    if (onSlideChange) onSlideChange(activeIndex);
  }, [activeIndex, onSlideChange]);

  const handleItemClick = (index: number) => {
    if (index === activeIndex) {
      const s = slides[index];
      if (s && onSlideClick) onSlideClick(s, index);
    } else {
      setActiveIndex(index);
    }
  };

  const startAutoplay = useCallback(() => {
    if (autoplay && total > 1) {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
      autoplayIntervalRef.current = window.setInterval(() => {
        navigate('next');
      }, delay * 1000);
    }
  }, [autoplay, delay, navigate, total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  // Handler to stop autoplay on hover
  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      stopAutoplay();
    }
  };

  // Handler to start autoplay on mouse exit AND handle drag cancellation
  const handleExit = (e: React.MouseEvent) => {
    // 1. Autoplay resume logic
    if (autoplay && pauseOnHover) {
      startAutoplay();
    }

    // 2. Drag cancellation logic
    if (isDragging) {
      handleEnd(e.clientX);
    }
  };

  // --- Touch/Mouse Drag Logic ---

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    stopAutoplay();
  };

  const handleEnd = (clientX: number) => {
    if (!isDragging) return;

    const distance = clientX - startX;

    if (Math.abs(distance) > swipeThreshold) {
      if (distance < 0) {
        navigate('next'); // Swipe left (negative distance) -> show next slide
      } else {
        navigate('prev'); // Swipe right (positive distance) -> show previous slide
      }
    }

    setIsDragging(false);
    setStartX(0);
  };

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX);
    startAutoplay(); // Resume autoplay when mouse button is released
  };

  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    handleEnd(e.changedTouches[0].clientX);
    startAutoplay(); // Resume autoplay after touch interaction
  };

  if (total === 0) return null;

  return (
    <>
      {/* 1. EMBEDDED CSS */}
      <style dangerouslySetInnerHTML={{ __html: EMBEDDED_CSS }} />

      {/* 2. SLIDER HTML STRUCTURE */}
      <div
        className={`cascade-slider_container ${className} bg-transparent`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleExit}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="cascade-slider_slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`cascade-slider_item ${getSlideClasses(index, activeIndex, total, itemCount)}`}
              data-slide-number={index}
              onClick={() => handleItemClick(index)}
            >
              <img
                src={slide.src}
                alt={slide.title ?? `Slide ${index + 1}`}
                draggable={false}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/350x200/4F46E5/ffffff?text=Slide%20${index + 1}`;
                }}
              />
              <div className="slide-caption">
                <span className="slide-caption-title">
                  {slide.title ?? `Photo ${index + 1}`}
                </span>
                <span className="slide-caption-count">
                  {index + 1} / {total}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (themed) */}
        {total > 1 && (
          <>
            <span
              className="cascade-slider_arrow cascade-slider_arrow-left rounded-full border border-cyan-400/25 text-cyan-200 bg-[#020812]/70 backdrop-blur p-2 hover:bg-cyan-400/15 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate('prev');
              }}
              data-action="prev"
              aria-label="Previous photo"
            >
              <ArrowLeftCircle size={30} />
            </span>
            <span
              className="cascade-slider_arrow cascade-slider_arrow-right rounded-full border border-cyan-400/25 text-cyan-200 bg-[#020812]/70 backdrop-blur p-2 hover:bg-cyan-400/15 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate('next');
              }}
              data-action="next"
              aria-label="Next photo"
            >
              <ArrowRightCircle size={30} />
            </span>
          </>
        )}

      </div>
    </>
  );
};

export default ThreeDImageCarousel;
