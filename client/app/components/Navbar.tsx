"use client";

import React, { useRef, useEffect, useState } from 'react';

export interface GooeyNavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };
  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {}
        }, t);
      }, 30);
    }
  };
  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
  };
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const liEl = (e.currentTarget.closest('li') || e.currentTarget) as HTMLElement;
    if (activeIndex === index) return;
    setActiveIndex(index);
    updateEffectPosition(liEl);
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => filterRef.current!.removeChild(p));
      makeParticles(filterRef.current);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        handleClick(
          {
            currentTarget: liEl
          } as React.MouseEvent<HTMLAnchorElement>,
          index
        );
      }
    }
  };
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
    }
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>
        {`
          :root {
            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
            --color-1: #5fe3c8;
            --color-2: #8ff0da;
            --color-3: #7fb8ac;
            --color-4: #ffffff;
          }
          .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }
          .effect.text {
            color: #ffffff;
            transition: color 0.3s ease;
            font-weight: 500;
          }
          .effect.text.active {
            color: #030712;
            font-weight: 600;
          }
          .effect.filter {
            filter: blur(6px) contrast(80) blur(0);
            mix-blend-mode: screen;
            pointer-events: none;
          }
          .effect.filter::before {
            display: none;
          }
          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--ink, #f3f5f7);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 18px;
            height: 18px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 8px);
            left: calc(50% - 8px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          li {
            position: relative;
            border-radius: 9999px;
            transition: all 0.3s ease;
          }
          li.active {
            color: #030712;
            text-shadow: none;
            font-weight: 600;
          }
          li.active::after {
            opacity: 1;
            transform: scale(1);
          }
          li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: linear-gradient(135deg, #ffffff 0%, #e5f9f2 100%);
            box-shadow: 0 0 20px rgba(95, 227, 200, 0.35), 0 0 8px rgba(255, 255, 255, 0.5);
            opacity: 0;
            transform: scale(0.85);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: -1;
          }
        `}
      </style>
      <div className="relative inline-block" ref={containerRef}>
        <nav
          className="flex relative items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
          style={{ transform: 'translate3d(0,0,0.01px)' }}
        >
          <ul
            ref={navRef}
            className="flex items-center gap-1 sm:gap-1.5 list-none p-0 m-0 relative z-[3]"
            style={{
              color: 'white',
            }}
          >
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <li
                  key={index}
                  className={`rounded-full relative cursor-pointer transition-all duration-300 ease group ${
                    isActive ? 'active' : 'text-slate-300 hover:text-[var(--accent)]'
                  }`}
                >
                  <a
                    href={item.href}
                    onClick={e => handleClick(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    aria-label={item.label}
                    title={item.label}
                    className="outline-none p-2 sm:p-2.5 md:px-3.5 md:py-2.5 flex items-center justify-center transition-all duration-200"
                  >
                    {item.icon ? (
                      <span className={`transition-transform duration-200 group-hover:scale-115 flex items-center justify-center ${isActive ? 'text-slate-950' : ''}`}>
                        {item.icon}
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                    )}
                  </a>

                  {/* Floating Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-50">
                    <span
                      className="px-2 py-0.5 rounded-md bg-black/95 text-[10px] tracking-wider border border-white/10 whitespace-nowrap shadow-xl backdrop-blur-md"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                    >
                      {item.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
      </div>
    </>
  );
};

export default GooeyNav;
