"use client";

import { useState } from "react";

export default function NewCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
        .card-mount { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .byte-about-line { height: 1px; background: var(--line); }
      `}</style>

      <div
        className="w-full max-w-2xl cursor-pointer card-mount"
        style={{ perspective: "1400px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        >

          {/* FRONT — story */}
          <div
            className="tbc-card w-full flex flex-col px-7 py-8 sm:px-9 sm:py-10 gap-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="tbc-card-corner tbc-card-corner--tl" />
            <span className="tbc-card-corner tbc-card-corner--br" />

            <div className="flex items-center justify-between">
              <span className="tbc-eyebrow tbc-eyebrow--muted">The Byte Club</span>
              <span
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-faint)", letterSpacing: "0.14em" }}
              >
                TAP TO FLIP ↻
              </span>
            </div>

            <div className="flex items-start gap-4">
              <span className="tbc-index text-5xl sm:text-6xl leading-none select-none">01</span>
              <div>
                <p className="tbc-eyebrow" style={{ marginBottom: 8 }}>Our story</p>
                <h2 className="tbc-heading" style={{ fontWeight: 700, fontSize: "clamp(1.6rem,4.4vw,2.4rem)" }}>
                  Started small in 2023.<br />Still learning out loud.
                </h2>
              </div>
            </div>

            <div className="byte-about-line" />

            <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)", fontSize: "15px", lineHeight: "1.7", margin: 0, maxWidth: "52ch" }}>
              The Byte Club began in 2023 as a handful of first-years who
              wanted tech events that didn&apos;t feel like another lecture.
              It&apos;s grown into a full community, but the idea hasn&apos;t
              changed: get people writing code, building things, and helping
              each other get better at it, one fun event at a time.
            </p>

            <div className="flex gap-x-6 gap-y-2 flex-wrap">
              {["Hands-on", "Student-run", "Open to all years"].map((t) => (
                <span key={t} className="tbc-eyebrow tbc-eyebrow--muted">{t}</span>
              ))}
            </div>
          </div>

          {/* BACK — mission */}
          <div
            className="tbc-card flex flex-col items-center justify-center text-center px-8 py-12 sm:px-12 gap-5"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <span className="tbc-card-corner tbc-card-corner--tl" />
            <span className="tbc-card-corner tbc-card-corner--br" />

            <span className="tbc-index text-6xl select-none" style={{ WebkitTextStroke: "1px var(--accent-border)" }}>
              02
            </span>

            <div className="byte-about-line w-full" />

            <h2 className="tbc-heading" style={{ fontWeight: 700, fontSize: "clamp(1.4rem,3.6vw,2rem)" }}>
              Why we exist
            </h2>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink-muted)", lineHeight: "1.7", margin: 0, maxWidth: "46ch" }}>
              To make tech feel approachable for whoever&apos;s just starting
              out, and to make sure that by the time you graduate, the skills
              you picked up here helped you get where you wanted to go.
            </p>

            <div className="byte-about-line w-full" />

            <div className="tbc-eyebrow tbc-eyebrow--muted">The Byte Club · NIE</div>
          </div>

        </div>
      </div>
    </>
  );
}
