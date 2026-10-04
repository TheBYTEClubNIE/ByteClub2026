// Renders composition.html to out/byte-club-hero.mp4 (+ a poster image).
//   npm run render            full 15s video
//   npm run render -- --stills 1.2,5.6,9.2   just those moments as JPEGs
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "out");
const FPS = 30;
const DURATION = 15;
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => existsSync(p));

const stillsArg = process.argv.indexOf("--stills");
const stills = stillsArg > -1 ? process.argv[stillsArg + 1].split(",").map(Number) : null;

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--allow-file-access-from-files", "--hide-scrollbars", "--force-color-profile=srgb"],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(here, "composition.html")).href, { waitUntil: "networkidle0" });
await page.evaluate(() => window.ready);

const frame = async (t) => {
  await page.evaluate((s) => window.seek(s), t);
  return page.screenshot({ type: "jpeg", quality: 95, optimizeForSpeed: true });
};

if (stills) {
  for (const t of stills) {
    await writeFile(path.join(OUT, `still-${t.toFixed(2)}.jpg`), await frame(t));
    console.log(`still ${t}s`);
  }
} else {
  const mp4 = path.join(OUT, "byte-club-hero.mp4");
  const ff = spawn(ffmpegPath, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", mp4,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const total = FPS * DURATION;
  for (let i = 0; i < total; i++) {
    const buf = await frame(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 30 === 0) process.stdout.write(`\rframe ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((resolve, reject) => ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))));
  await writeFile(path.join(OUT, "byte-club-hero-poster.jpg"), await frame(14.3));
  console.log(`\rdone: ${mp4}`);
}
await browser.close();
