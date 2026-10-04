// Renders launch.html (with the footage from capture.mjs) to out/byte-club-launch.mp4.
//   node render-launch.mjs                    the full video
//   node render-launch.mjs --stills 2,9,30    just those moments as JPEGs
//   --file launch-chaos.html --out byte-club-launch-chaos   render another composition
import { spawn } from "node:child_process";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "out");
const FPS = 30;
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => existsSync(p));

const stillsArg = process.argv.indexOf("--stills");
const stills = stillsArg > -1 ? process.argv[stillsArg + 1].split(",").map(Number) : null;
const arg = (name, fallback) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback);
const FILE = arg("--file", "launch.html");
const NAME = arg("--out", "byte-club-launch");

// how many frames each clip really has
const clipLen = {};
for (const name of await readdir(path.join(OUT, "clips"))) clipLen[name] = (await readdir(path.join(OUT, "clips", name))).length;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--allow-file-access-from-files", "--hide-scrollbars", "--force-color-profile=srgb"],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
// "file.html?cut=30" passes options through to the composition
const [file, query] = FILE.split("?");
await page.goto(pathToFileURL(path.join(here, file)).href + (query ? `?${query}` : ""), { waitUntil: "networkidle0" });
await page.evaluate(() => window.ready);
await page.evaluate((len) => Object.assign(window.CLIPLEN, len), clipLen);
const duration = await page.evaluate(() => window.DURATION);

const frame = async (t) => {
  await page.evaluate((s) => window.seek(s), t);
  return page.screenshot({ type: "jpeg", quality: 95, optimizeForSpeed: true });
};

await mkdir(OUT, { recursive: true });
if (stills) {
  for (const t of stills) {
    await writeFile(path.join(OUT, `${NAME}-${t.toFixed(1)}.jpg`), await frame(t));
    console.log(`still ${t}s`);
  }
} else {
  const mp4 = path.join(OUT, `${NAME}.mp4`);
  const ff = spawn(ffmpegPath, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", mp4,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    const buf = await frame(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 60 === 0) process.stdout.write(`\rframe ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((resolve, reject) => ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)))));
  await writeFile(path.join(OUT, `${NAME}-poster.jpg`), await frame(duration - 3));
  console.log(`\rdone: ${mp4} (${duration.toFixed(1)}s)`);
}
await browser.close();
