// Beat and section analysis for the soundtrack: tempo, beat grid, loud sections.
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const file = process.argv[2] ?? "out/song.mp3";
const SR = 11025;
const pcm = (filter) => {
  const r = spawnSync(ffmpegPath, ["-loglevel", "error", "-i", file, "-ac", "1", "-ar", String(SR), ...(filter ? ["-af", filter] : []), "-f", "f32le", "-"], { maxBuffer: 1 << 30 });
  return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.byteLength / 4);
};
const full = pcm();
const bass = pcm("lowpass=f=150,lowpass=f=150");
const HOP = 110; // 10ms
const env = (x) => { const n = Math.floor(x.length / HOP); const e = new Float32Array(n); for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < HOP; j++) s += x[i * HOP + j] ** 2; e[i] = Math.sqrt(s / HOP); } return e; };
const E = env(full), B = env(bass);
const dur = full.length / SR;
// onset strength: positive change in log bass energy
const on = new Float32Array(B.length);
for (let i = 1; i < B.length; i++) on[i] = Math.max(0, Math.log(B[i] + 1e-4) - Math.log(B[i - 1] + 1e-4));
// tempo by autocorrelation (70..180 bpm)
let best = 0, bestLag = 0;
for (let lag = Math.round(6000 / 180); lag <= Math.round(6000 / 70); lag++) {
  let s = 0; for (let i = lag; i < on.length; i++) s += on[i] * on[i - lag];
  if (s > best) { best = s; bestLag = lag; }
}
// refine with fractional lag around best
let bpm = 6000 / bestLag;
let bestScore = -1, bestBpm = bpm, bestPhase = 0;
for (let b = bpm - 2; b <= bpm + 2; b += 0.02) {
  const period = 6000 / b; // in 10ms frames
  for (let ph = 0; ph < period; ph += 1) {
    let s = 0; for (let k = ph; k < on.length; k += period) s += on[Math.round(k)] || 0;
    if (s > bestScore) { bestScore = s; bestBpm = b; bestPhase = ph; }
  }
}
const beat = 60 / bestBpm;
const first = bestPhase / 100;
console.log(`duration ${dur.toFixed(2)}s  bpm ${bestBpm.toFixed(2)}  beat ${beat.toFixed(4)}s  first beat ${first.toFixed(3)}s`);
// loudness per 2s, to find sections and the drop
const per = 200;
let line = "";
for (let i = 0; i < E.length; i += per) {
  let s = 0, b = 0; for (let j = i; j < Math.min(E.length, i + per); j++) { s += E[j]; b += B[j]; }
  line += `${(i / 100).toFixed(0).padStart(3)}s ${"#".repeat(Math.round((s / per) * 120)).padEnd(40)} bass ${"=".repeat(Math.round((b / per) * 160))}\n`;
}
console.log(line);
// strongest 39s window (by mean bass energy), on a bar boundary
const bar = beat * 4;
let bw = -1, bt = 0;
for (let t = first; t + 39 < dur; t += bar) {
  let s = 0; const a = Math.round(t * 100), z = Math.round((t + 39) * 100);
  for (let i = a; i < z; i++) s += B[i];
  if (s > bw) { bw = s; bt = t; }
}
console.log(`loudest 39s window starts ${bt.toFixed(3)}s (bar ${((bt - first) / bar).toFixed(1)})`);
