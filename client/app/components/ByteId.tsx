"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { Holo } from "./effects";

const TRACKS = ["Web Dev", "Machine Learning", "Agentic AI", "Open Source", "Design", "Just curious"];
const W = 1080;
const H = 1350; // 4:5, fits an Instagram post and sits cleanly in a story

type Fonts = { display: string; mono: string };

// FNV-1a: same name always gets the same ID number.
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function paint(ctx: CanvasRenderingContext2D, rawName: string, track: string, fonts: Fonts, logo: HTMLImageElement) {
  const name = rawName.trim() || "Your Name";
  const id = String(hash(name.toLowerCase()) % 10000).padStart(4, "0");
  const now = new Date();
  const issued = `${now.toLocaleString("en-GB", { month: "short" }).slice(0, 3).toUpperCase()} ${now.getFullYear()}`;
  const label = (text: string, x: number, y: number) => {
    ctx.fillStyle = "#7c848c";
    ctx.font = `500 26px ${fonts.mono}`;
    ctx.fillText(text, x, y);
  };

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // base, grid, glows
  ctx.fillStyle = "#07090b";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  for (let x = 54; x < W; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 54; y < H; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };
  glow(W * 0.88, H * 0.1, 720, "rgba(40,194,255,0.30)");
  glow(W * 0.05, H * 0.98, 700, "rgba(198,166,255,0.20)");

  // foil frame
  const foil = ctx.createLinearGradient(0, 0, W, H);
  foil.addColorStop(0, "#28c2ff");
  foil.addColorStop(0.35, "#c6a6ff");
  foil.addColorStop(0.65, "#ffbf7f");
  foil.addColorStop(1, "#2af5ff");
  ctx.strokeStyle = foil;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(30, 30, W - 60, H - 60, 40);
  ctx.stroke();

  // header
  ctx.drawImage(logo, 84, 84, 116, 116);
  ctx.fillStyle = "#f3f5f7";
  ctx.font = `600 40px ${fonts.display}`;
  ctx.fillText("The Byte Club", 224, 136);
  ctx.fillStyle = "#9aa2ab";
  ctx.font = `400 26px ${fonts.mono}`;
  ctx.fillText("NIE · STUDENT TECH CLUB", 224, 180);
  ctx.textAlign = "right";
  ctx.fillStyle = "#28c2ff";
  ctx.font = `500 26px ${fonts.mono}`;
  ctx.fillText("BYTE ID", W - 84, 128);
  ctx.fillStyle = "#f3f5f7";
  ctx.font = `700 56px ${fonts.display}`;
  ctx.fillText(`#${id}`, W - 84, 192);
  ctx.textAlign = "left";

  // name, shrunk until it fits in two lines
  label("NAME", 84, 470);
  const maxW = W - 168;
  let size = 150;
  let lines: string[] = [];
  for (; size >= 48; size -= 4) {
    ctx.font = `700 ${size}px ${fonts.display}`;
    lines = wrap(ctx, name, maxW);
    if (lines.length <= 2 && lines.every((l) => ctx.measureText(l).width <= maxW)) break;
  }
  ctx.fillStyle = "#f3f5f7";
  let y = 490 + size * 0.95;
  for (const line of lines.slice(0, 2)) {
    ctx.fillText(line, 84, y);
    y += size * 1.02;
  }

  // track
  label("TRACK", 84, 900);
  ctx.fillStyle = "#28c2ff";
  ctx.font = `600 64px ${fonts.display}`;
  ctx.fillText(track, 84, 980);

  // fields
  label("ISSUED", 84, 1080);
  label("STATUS", 440, 1080);
  ctx.fillStyle = "#f3f5f7";
  ctx.font = `500 38px ${fonts.mono}`;
  ctx.fillText(issued, 84, 1128);
  ctx.fillText("SHOWING UP", 440, 1128);

  // barcode from the name, so every card's is different
  let seed = hash(name) || 1;
  let x = 84;
  ctx.fillStyle = "#f3f5f7";
  for (let i = 0; x < 600; i++) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const w = 3 + (Math.abs(seed) % 4) * 3;
    if (i % 2 === 0) ctx.fillRect(x, 1180, w, 84);
    x += w + 3;
  }
  ctx.textAlign = "right";
  ctx.fillStyle = "#28c2ff";
  ctx.font = `500 30px ${fonts.mono}`;
  ctx.fillText("@thebyteclubnie", W - 84, 1222);
  ctx.fillStyle = "#9aa2ab";
  ctx.font = `400 24px ${fonts.mono}`;
  ctx.fillText("byteclubnie.vercel.app", W - 84, 1262);
  ctx.textAlign = "left";
}

export default function ByteId() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayProbe = useRef<HTMLSpanElement>(null);
  const monoProbe = useRef<HTMLSpanElement>(null);
  const assets = useRef<{ fonts: Fonts; logo: HTMLImageElement } | null>(null);
  const [name, setName] = useState("");
  const [track, setTrack] = useState(TRACKS[0]);
  const [ready, setReady] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [busy, setBusy] = useState(false);

  // The foil drift on phones repaints every frame, so it only runs on screen.
  useEffect(() => {
    const card = canvasRef.current!.parentElement!;
    const io = new IntersectionObserver(([e]) => card.classList.toggle("is-near", e.isIntersecting));
    io.observe(card);
    return () => io.disconnect();
  }, []);

  // Canvas needs the real font files and the logo loaded before it can draw them.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fonts = {
        display: getComputedStyle(displayProbe.current!).fontFamily,
        mono: getComputedStyle(monoProbe.current!).fontFamily,
      };
      const logo = new Image();
      logo.src = "/Logo/logo-transparent.png";
      await Promise.allSettled([
        logo.decode(),
        document.fonts.load(`700 100px ${fonts.display}`),
        document.fonts.load(`600 100px ${fonts.display}`),
        document.fonts.load(`500 30px ${fonts.mono}`),
        document.fonts.load(`400 30px ${fonts.mono}`),
      ]);
      if (cancelled) return;
      assets.current = { fonts, logo };
      setReady(true);
      const probe = new File([new Blob()], "x.png", { type: "image/png" });
      setCanShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !assets.current) return;
    const raf = requestAnimationFrame(() =>
      paint(canvasRef.current!.getContext("2d")!, name, track, assets.current!.fonts, assets.current!.logo)
    );
    return () => cancelAnimationFrame(raf);
  }, [ready, name, track]);

  const fileName = `byte-id-${(name.trim() || "you").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;

  const download = () => {
    const a = document.createElement("a");
    a.href = canvasRef.current!.toDataURL("image/png");
    a.download = fileName;
    a.click();
  };

  const share = async () => {
    setBusy(true);
    try {
      const blob = await new Promise<Blob | null>((res) => canvasRef.current!.toBlob(res, "image/png"));
      if (!blob) return download();
      await navigator.share({
        files: [new File([blob], fileName, { type: "image/png" })],
        text: "Got my Byte ID. @thebyteclubnie",
      });
    } catch {
      // share sheet dismissed: nothing to do
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="byte-id" className="section">
      <span ref={displayProbe} aria-hidden className="sr-only" style={{ fontFamily: "var(--font-display)" }} />
      <span ref={monoProbe} aria-hidden className="sr-only" style={{ fontFamily: "var(--font-mono)" }} />

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-20">
        <div>
          <header className="section-head">
            <h2 className="section-title">Get your Byte ID</h2>
            <p className="section-lede">
              Type your name, pick a track, and you&apos;ve got a holo ID card
              to post. Tag @thebyteclubnie so we can find you.
            </p>
          </header>

          <label htmlFor="byte-id-name" className="block text-sm font-medium" style={{ color: "var(--ink)" }}>
            Your name
          </label>
          <input
            id="byte-id-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={22}
            autoComplete="name"
            placeholder="Your Name"
            className="mt-2 w-full max-w-md rounded-xl border px-4 py-3 text-lg outline-none transition-colors focus:border-[var(--accent)]"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "var(--line-strong)",
              color: "var(--ink)",
              fontFamily: "var(--font-display)",
            }}
          />

          <fieldset className="mt-7">
            <legend className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              Your track
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {TRACKS.map((t) => {
                const on = t === track;
                return (
                  <label
                    key={t}
                    className="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent)]"
                    style={{
                      borderColor: on ? "var(--accent)" : "var(--line-strong)",
                      background: on ? "var(--accent-soft)" : "transparent",
                      color: on ? "var(--accent-strong)" : "var(--ink-muted)",
                    }}
                  >
                    <input
                      type="radio"
                      name="byte-id-track"
                      value={t}
                      checked={on}
                      onChange={() => setTrack(t)}
                      className="sr-only"
                    />
                    {t}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {canShare && (
              <button type="button" onClick={share} disabled={!ready || busy} className="btn btn-accent">
                <Share2 size={18} aria-hidden />
                {busy ? "Opening…" : "Share"}
              </button>
            )}
            <button
              type="button"
              onClick={download}
              disabled={!ready}
              className={`btn ${canShare ? "btn-ghost" : "btn-accent"}`}
            >
              <Download size={18} aria-hidden />
              Download PNG
            </button>
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--ink-faint)" }}>
            Made on your device. Nothing gets uploaded.
          </p>
        </div>

        <Holo className="id-stage">
          <div className="id-card" data-holo-card>
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              role="img"
              aria-label={`Byte ID card for ${name.trim() || "you"}, track ${track}`}
            />
          </div>
        </Holo>
      </div>

      <style>{`
        .id-stage { max-width: 27rem; width: 100%; margin-inline: auto; perspective: 1000px; }
        .id-card { border-radius: 22px; box-shadow: 0 40px 90px -30px rgba(40,194,255,0.45), 0 0 0 1px rgba(255,255,255,0.06); }
        .id-card canvas { display: block; width: 100%; height: auto; aspect-ratio: 4 / 5; border-radius: 22px; background: #07090b; }
        @media (hover: none) {
          .id-card::after { opacity: 0.45; animation: foil-drift 5s ease-in-out infinite alternate paused; }
          .id-card.is-near::after { animation-play-state: running; }
        }
        @keyframes foil-drift {
          from { background-position: center, 0% 0%; }
          to { background-position: center, 100% 100%; }
        }
        @media (prefers-reduced-motion: reduce) { .id-card::after { animation: none; } }
      `}</style>
    </section>
  );
}
