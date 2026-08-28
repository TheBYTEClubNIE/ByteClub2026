"use client";

import { useState } from "react";

export default function NewCard() {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=DM+Sans:wght@400;500&display=swap');

        @keyframes fadeUp { from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);} }
        @keyframes float { 0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);} }
        @keyframes rotateBinary { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
        @keyframes cyanPulse {
          0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.15),0 0 60px rgba(0,212,255,0.08),inset 0 1px 0 rgba(0,212,255,0.2);}
          50%{box-shadow:0 0 50px rgba(0,212,255,0.3),0 0 100px rgba(0,212,255,0.15),inset 0 1px 0 rgba(0,212,255,0.4);}
        }
        @keyframes scanline { 0%{transform:translateY(-100%);opacity:0.04;}100%{transform:translateY(400px);opacity:0.04;} }
        @keyframes blink { 0%,100%{opacity:1;}50%{opacity:0;} }
        @keyframes glitch {
          0%,90%,100%{transform:translateX(0);}
          92%{transform:translateX(-2px);}94%{transform:translateX(2px);}96%{transform:translateX(-1px);}
        }
        @keyframes shimmerCyan {
          0%{background-position:-300% center;}100%{background-position:300% center;}
        }

        .card-mount  { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .card-float  { animation: float 5s ease-in-out infinite; }
        .card-glow   { animation: cyanPulse 3s ease-in-out infinite; }
        .binary-ring { animation: rotateBinary 18s linear infinite; }
        .title-glitch { animation: glitch 6s ease-in-out infinite; }
        .cursor      { animation: blink 1s step-end infinite; }

        .shimmer-cyan {
          background: linear-gradient(90deg, #00d4ff 0%, #00d4ff 30%, #1affe4 50%, #00d4ff 70%, #00d4ff 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerCyan 4s linear infinite;
        }

        .byte-card {
          background: rgba(2,8,18,0.92);
          border: 1px solid rgba(0,212,255,0.25);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
        }
        .byte-card::before {
          content:'';position:absolute;inset:0;border-radius:24px;
          background:linear-gradient(135deg,rgba(0,212,255,0.06) 0%,transparent 50%,rgba(26,255,228,0.04) 100%);
          pointer-events:none;z-index:0;
        }
        .byte-card::after {
          content:'';position:absolute;top:-100%;left:0;right:0;height:40%;
          background:linear-gradient(transparent,rgba(0,212,255,0.03),transparent);
          animation:scanline 4s linear infinite;pointer-events:none;z-index:1;
        }
        .byte-card > * { position:relative;z-index:2; }

        .corner-tl,.corner-tr,.corner-bl,.corner-br { position:absolute;width:12px;height:12px;z-index:3; }
        .corner-tl{top:8px;left:8px;border-top:1.5px solid #00d4ff;border-left:1.5px solid #00d4ff;}
        .corner-tr{top:8px;right:8px;border-top:1.5px solid #00d4ff;border-right:1.5px solid #00d4ff;}
        .corner-bl{bottom:8px;left:8px;border-bottom:1.5px solid #00d4ff;border-left:1.5px solid #00d4ff;}
        .corner-br{bottom:8px;right:8px;border-bottom:1.5px solid #00d4ff;border-right:1.5px solid #00d4ff;}

        .neon-text { color:#00d4ff;text-shadow:0 0 10px rgba(0,212,255,0.8),0 0 30px rgba(0,212,255,0.4); }
        .tag-pill {
          font-family:'Share Tech Mono',monospace;font-size:10px;color:#00d4ff;
          border:1px solid rgba(0,212,255,0.35);background:rgba(0,212,255,0.08);
          padding:3px 10px;border-radius:20px;letter-spacing:0.1em;
        }
        .cyan-line { height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,255,0.4),rgba(26,255,228,0.4),transparent); }
      `}</style>

      <div
        className={`w-full max-w-2xl cursor-pointer card-mount ${hovered ? "card-float" : ""}`}
        style={{ perspective: "1400px" }}
        onClick={() => setFlipped(!flipped)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        >

          {/* ── FRONT ── */}
          <div
            className="byte-card card-glow w-full flex flex-col rounded-[24px] px-7 py-7 gap-4"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="corner-tl" /><div className="corner-tr" />
            <div className="corner-bl" /><div className="corner-br" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full block" style={{ background:"#00d4ff", boxShadow:"0 0 6px #00d4ff" }} />
                <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"10px", color:"rgba(0,212,255,0.6)", letterSpacing:"0.2em" }}>THE.BYTE.CLUB</span>
              </div>
              <span className="tag-pill">TAP TO FLIP</span>
            </div>

            <div className="flex flex-col gap-1">
              <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"10px", color:"rgba(0,212,255,0.45)", margin:0, letterSpacing:"0.18em" }}>OUR VISION</p>
              <h1 className="shimmer-cyan title-glitch" style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:"clamp(1.8rem,6vw,3rem)", margin:0, lineHeight:1 }}>
                Our View<span className="cursor" style={{ fontSize:"0.7em", WebkitTextFillColor:"#00d4ff" }}>_</span>
              </h1>
            </div>

            <div className="cyan-line" />

            <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(180,220,230,0.75)", fontSize:"13px", lineHeight:"1.75", margin:0 }}>
              Building a vibrant tech community that fosters creativity, inspires innovation, and develops future leaders in technology.
            </p>

            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"9px", color:"rgba(0,212,255,0.2)", letterSpacing:"0.08em", overflow:"hidden", whiteSpace:"nowrap" }}>
              01110110 01101001 01110011 01101001 01101111 01101110
            </div>

            <div className="flex justify-end">
              <span className="neon-text" style={{ fontSize:"14px" }}>→</span>
            </div>
          </div>

          {/* ── BACK ── */}
          <div
            className="byte-card card-glow flex flex-col items-center justify-center rounded-[24px] px-10 py-12 gap-5"
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
            <div className="corner-tl" /><div className="corner-tr" />
            <div className="corner-bl" /><div className="corner-br" />

            <div style={{ position:"relative", width:"90px", height:"90px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg className="binary-ring" width="90" height="90" viewBox="0 0 90 90" style={{ position:"absolute" }}>
                <defs><path id="rp2" d="M45,45 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"/></defs>
                <text fontFamily="Share Tech Mono,monospace" fontSize="6.5" fill="rgba(26,255,228,0.55)">
                  <textPath href="#rp2">0101001010011010100101001011010100101001010110</textPath>
                </text>
              </svg>
              <div style={{ width:"58px", height:"58px", borderRadius:"50%", background:"#000", border:"2px solid rgba(26,255,228,0.5)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 18px rgba(26,255,228,0.3)" }}>
                <span style={{ fontSize:"22px" }}>⚡</span>
              </div>
            </div>

            <div className="cyan-line w-full" />

            <h2 className="shimmer-cyan title-glitch" style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:"clamp(1.3rem,4vw,2rem)", margin:0, textAlign:"center" }}>
              Tech Club
            </h2>

            <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"12px", color:"rgba(26,255,228,0.7)", textAlign:"center", lineHeight:"1.9", margin:0 }}>
              Building the future,<br/>one byte at a time.<span className="cursor">_</span>
            </p>

            <div className="cyan-line w-full" />

            <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"10px", color:"rgba(0,212,255,0.35)", letterSpacing:"0.2em" }}>
              &lt;/THE.BYTE.CLUB&gt;
            </div>
          </div>

        </div>
      </div>
    </>
  );
}