"use client";

import { useState } from "react";

export default function NewCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
        .card-mount { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .byte-about-card {
          background: var(--bg-elevated);
          border: 1px solid var(--line);
          border-radius: 22px;
          position: relative;
          overflow: hidden;
        }
        .byte-about-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--accent);
          border: 1px solid var(--accent-border);
          background: var(--accent-soft);
          padding: 4px 11px;
          border-radius: 20px;
          letter-spacing: 0.1em;
        }
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
            className="byte-about-card w-full flex flex-col rounded-[22px] px-7 py-8 sm:px-9 sm:py-10 gap-5"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between">
              <span
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink-faint)", fontSize: "10px", letterSpacing: "0.2em" }}
              >
                THE BYTE CLUB
              </span>
              <span className="byte-about-tag">TAP TO FLIP</span>
            </div>

            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent)", letterSpacing: "0.18em", margin: "0 0 6px" }}>
                OUR STORY
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.6rem,4.4vw,2.4rem)", color: "var(--ink)", margin: 0, lineHeight: 1.1 }}>
                Started small in 2023. Still learning out loud.
              </h2>
            </div>

            <div className="byte-about-line" />

            <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)", fontSize: "14px", lineHeight: "1.8", margin: 0 }}>
              The Byte Club began in 2023 as a handful of first-years who
              wanted tech events that didn&apos;t feel like another lecture.
              It&apos;s grown into a full community — but the idea hasn&apos;t
              changed: get people writing code, building things, and helping
              each other get better at it, one fun event at a time.
            </p>

            <div className="flex gap-2 flex-wrap">
              <span className="byte-about-tag">HANDS-ON</span>
              <span className="byte-about-tag">STUDENT-RUN</span>
              <span className="byte-about-tag">OPEN TO ALL YEARS</span>
            </div>
          </div>

          {/* BACK — mission */}
          <div
            className="byte-about-card flex flex-col items-center justify-center text-center rounded-[22px] px-8 py-12 sm:px-12 gap-5"
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
            <span
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ border: `1px solid var(--accent-border)`, background: "var(--accent-soft)" }}
            >
              <span style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "13px" }}>
                TBC
              </span>
            </span>

            <div className="byte-about-line w-full" />

            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.4rem,3.6vw,2rem)", color: "var(--ink)", margin: 0 }}>
              Why we exist
            </h2>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--ink-muted)", lineHeight: "1.8", margin: 0, maxWidth: "460px" }}>
              To make tech feel approachable for whoever&apos;s just starting
              out — and to make sure that by the time you graduate, the skills
              you picked up here helped you get where you wanted to go.
            </p>

            <div className="byte-about-line w-full" />

            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-faint)", letterSpacing: "0.2em" }}>
              THE BYTE CLUB · NIE
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
