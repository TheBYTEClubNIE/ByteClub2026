"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { isProfileUrl, photoStyle, zoomedSizes, type PhotoFrame } from "@/content/team";
import { GithubIcon, InstagramIcon, LinkedInIcon } from "./icons";
import { initials } from "./lanyard-initials";

export interface WallMember {
  id: number;
  name: string;
  role: string;
  insta: string;
  linkedin: string;
  github: string;
  image: string;
  frame?: PhotoFrame;
}

// A squad's ID cards. The HTML cards are the static version (and what screen
// readers get); once the 3D scene is ready it draws the same cards hanging on
// lanyards over them, and the HTML ones turn invisible.
export default function LanyardWall({ members, color, label }: { members: WallMember[]; color: string; label: string }) {
  const wall = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop: (() => void) | null | undefined;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("./lanyard-engine").then(({ mountLanyards }) => {
          if (!cancelled) stop = mountLanyards(wall.current!, canvas.current!, { color, label, members });
        });
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(wall.current!);
    return () => {
      cancelled = true;
      io.disconnect();
      stop?.();
    };
  }, [color, label, members]);

  return (
    <div ref={wall} className="lanyard-wall">
      <canvas ref={canvas} className="lanyard-canvas" aria-hidden />
      <ul className="badge-grid">
        {members.map((m) => {
          const links = [
            { href: m.insta, label: "Instagram", icon: <InstagramIcon /> },
            { href: m.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
            { href: m.github, label: "GitHub", icon: <GithubIcon /> },
          ].filter((l) => isProfileUrl(l.href));
          return (
            <li key={m.id} className="slot">
              <div className="badge" data-card>
                <div className="badge-photo">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt=""
                      fill
                      sizes={zoomedSizes("(min-width: 1024px) 150px, (min-width: 640px) 20vw, 26vw", m.frame?.zoom)}
                      quality={90}
                      className="object-cover"
                      style={photoStyle(m.frame)}
                    />
                  ) : (
                    <span className="badge-initials" aria-hidden>
                      {initials(m.name)}
                    </span>
                  )}
                </div>
                <p className="badge-name">{m.name}</p>
                <p className="badge-role">{m.role}</p>
              </div>
              {links.length > 0 && (
                <div className="badge-links">
                  {links.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on ${l.label}`}>
                      {l.icon}
                    </a>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
