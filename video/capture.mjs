// Records footage of the live website for the launch video, frame by frame.
//
// The page runs on a virtual clock (timers, requestAnimationFrame,
// performance.now, Date.now and every CSS animation/transition), so each
// frame is captured exactly 1/30 s after the last no matter how slow the
// machine is. Scrolling, clicks, drags and typing are scripted per shot.
//
//   node capture.mjs              every shot
//   node capture.mjs hero events  just those
// Frames land in out/clips/<shot>/00000.jpg
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = process.env.SITE ?? "https://byteclubnie.vercel.app";
const FPS = 30;
const CLIPS = path.join(here, "out", "clips");
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => existsSync(p));

// Installed before any page script runs.
function virtualClock() {
  let now = 0;
  const base = Date.now();
  const realRAF = window.requestAnimationFrame.bind(window);
  let timers = new Map();
  let rafs = new Map();
  let seq = 0;
  const run = (fn, args) => {
    try {
      if (typeof fn === "function") fn(...args);
    } catch (e) {
      console.error(e);
    }
  };
  window.setTimeout = (fn, ms = 0, ...a) => {
    const id = ++seq;
    timers.set(id, { at: now + Math.max(0, +ms || 0), fn, a });
    return id;
  };
  window.setInterval = (fn, ms = 0, ...a) => {
    const id = ++seq;
    const every = Math.max(4, +ms || 0);
    timers.set(id, { at: now + every, every, fn, a });
    return id;
  };
  window.clearTimeout = window.clearInterval = (id) => void timers.delete(id);
  window.requestAnimationFrame = (fn) => {
    const id = ++seq;
    rafs.set(id, fn);
    return id;
  };
  window.cancelAnimationFrame = (id) => void rafs.delete(id);
  performance.now = () => now;
  Date.now = () => base + now;

  // wait for the browser to render a real frame (delivers scroll, IO, RO callbacks)
  window.__settle = () => new Promise((r) => realRAF(() => realRAF(r)));
  window.__advance = (dt) => {
    const end = now + dt;
    for (;;) {
      let pick = null;
      let pickId = 0;
      for (const [id, t] of timers) if (t.at <= end && (!pick || t.at < pick.at)) (pick = t), (pickId = id);
      if (!pick) break;
      now = Math.max(now, pick.at);
      if (pick.every) pick.at += pick.every;
      else timers.delete(pickId);
      run(pick.fn, pick.a);
    }
    now = end;
    const frame = rafs;
    rafs = new Map();
    for (const fn of frame.values()) run(fn, [now]);
    for (const an of document.getAnimations()) {
      if (an.__t0 === undefined) {
        an.__t0 = now - (an.currentTime || 0);
        an.pause();
      }
      an.currentTime = now - an.__t0;
    }
  };
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

async function session(browser, { url, width = 1920, height = 1080, dpr = 1, mobile = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  if (mobile)
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );
  await page.evaluateOnNewDocument(virtualClock);
  page.on("pageerror", (e) => console.warn("  page error:", e.message.slice(0, 120)));
  await page.goto(SITE + url, { waitUntil: "networkidle2", timeout: 90_000 });

  // load every image now (without scrolling, so nothing on the page "plays" early)
  await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager")));
  await Promise.race([
    page.evaluate(() =>
      Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => (i.onload = i.onerror = r))))
    ),
    new Promise((r) => setTimeout(r, 25_000)),
  ]).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  const api = makeApi(page, height);
  await api.pump(2.5); // let load-time timers and entrance animations settle
  return { page, api };
}

function makeApi(page, vh) {
  let y = 0;
  const api = {
    /** scroll instantly (not recorded) */
    async jump(to) {
      y = to;
      await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" }), to);
      await page.evaluate(() => window.__settle());
    },
    /** advance time without recording */
    async pump(seconds) {
      for (let i = 0; i < seconds * FPS; i++) {
        await page.evaluate(() => window.__settle());
        await page.evaluate((dt) => window.__advance(dt), 1000 / FPS);
      }
    },
    /** document y of an element's top */
    top: (sel, n = 0) => page.evaluate((s, k) => document.querySelectorAll(s)[k].getBoundingClientRect().top + scrollY, sel, n),
    rect: (sel, n = 0) =>
      page.evaluate((s, k) => {
        const r = document.querySelectorAll(s)[k].getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      }, sel, n),
    get y() {
      return y;
    },
    vh,
    page,
  };
  return api;
}

/** Records `seconds` of footage; `each(t, i)` runs before every frame (t in seconds). */
async function record(name, api, seconds, each = async () => {}) {
  const dir = path.join(CLIPS, name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const { page } = api;
  const n = Math.round(seconds * FPS);
  for (let i = 0; i < n; i++) {
    await each(i / FPS, i);
    await page.evaluate(() => window.__settle());
    await page.evaluate((dt) => window.__advance(dt), 1000 / FPS);
    await page.screenshot({ path: path.join(dir, `${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
    if (i % 30 === 0) process.stdout.write(`\r  ${name} ${i}/${n}`);
  }
  process.stdout.write(`\r  ${name} ${n}/${n} frames\n`);
}

// scroll from a to b between t0 and t1 (seconds), eased
const scroller = (api, a, b, t0, t1) => async (t) => {
  if (t < t0 || t > t1 + 1 / FPS) return;
  const v = lerp(a, b, ease(Math.min(1, (t - t0) / (t1 - t0))));
  await api.page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), Math.round(v));
};

/* ───────── shots ───────── */

const SHOTS = {
  async desktop(browser, only) {
    const want = (n) => !only.length || only.includes(n);
    const { page, api } = await session(browser, { url: "/" });

    if (want("hero")) {
      await api.jump(0);
      const s = scroller(api, 0, 160, 3.6, 6);
      await record("hero", api, 6, s);
    }

    if (want("about")) {
      const a = (await api.top("#about")) - 140;
      await api.jump(a);
      const s = scroller(api, a, a + 760, 0.2, 4.8);
      await record("about", api, 5, s);
    }

    if (want("events")) {
      const e = (await api.top("#events")) - 30;
      await api.jump(e);
      const s = scroller(api, e, e + 150, 2.6, 3.8);
      let clicked = false;
      await record("events", api, 8.5, async (t) => {
        await s(t);
        if (!clicked && t >= 4.4) {
          clicked = true;
          await page.evaluate(() => [...document.querySelectorAll(".printer-pick button")].find((b) => b.textContent.includes("Dot"))?.click());
        }
      });
    }

    if (want("leads")) {
      const a = (await api.top("#team")) - 60;
      const b = (await api.top(".squad")) - 760;
      await api.jump(a);
      const s = scroller(api, a, b, 1.2, 9.4);
      await record("leads", api, 10, s);
    }

    if (want("core")) {
      const w = await api.top(".lanyard-wall");
      await api.jump(w - 1300); // mounts the 3D cards out of sight
      await api.pump(2);
      const a = (await api.top(".squad")) - 110;
      await api.jump(a);
      const drag = { done: false };
      const s = scroller(api, a, (await api.top(".squad", 1)) - 110, 5.6, 7.6);
      await record("core", api, 8.5, async (t) => {
        await s(t);
        // grab the third card and fling it
        if (t >= 2.6 && t < 3.6) {
          const r = await api.rect("[data-card]", 2);
          const cx = r.x + r.w / 2;
          const cy = r.y + r.h * 0.45;
          const k = (t - 2.6) / 1;
          if (!drag.done) {
            drag.done = true;
            await page.mouse.move(cx, cy);
            await page.mouse.down();
            drag.x = cx;
            drag.y = cy;
          }
          await page.mouse.move(drag.x + Math.sin(k * Math.PI) * 260, drag.y + Math.sin(k * Math.PI * 0.5) * 120);
        } else if (drag.done && !drag.up) {
          drag.up = true;
          await page.mouse.up();
        }
      });
    }

    if (want("changelog")) {
      const p = (await api.top("#past")) - 40;
      const track = await api.top(".cl-track");
      const h = await page.evaluate(() => document.querySelector(".cl-track").offsetHeight - innerHeight);
      await api.jump(p);
      const s1 = scroller(api, p, track, 0.6, 1.6);
      const s2 = scroller(api, track, track + h, 2.2, 11.8);
      await record("changelog", api, 12.6, async (t) => {
        await s1(t);
        await s2(t);
      });
    }

    if (want("blog")) {
      const b = (await api.top("#blog")) - 40;
      await api.jump(b);
      const picks = [
        [1.4, "Agentic AI"],
        [3.0, "Machine Learning"],
      ];
      await record("blog", api, 4.6, async (t) => {
        for (const p of picks)
          if (!p.done && t >= p[0]) {
            p.done = true;
            await page.evaluate((label) => [...document.querySelectorAll(".book3d")].find((x) => x.getAttribute("aria-label")?.startsWith(label))?.click(), p[1]);
          }
      });
    }

    if (want("byteid")) {
      const b = (await api.top("#byte-id")) - 40;
      await api.jump(b);
      const name = "Ada Lovelace";
      let typed = 0;
      await record("byteid", api, 5.5, async (t) => {
        if (t >= 1 && typed < name.length && Math.round(t * FPS) % 3 === 0) {
          if (typed === 0) await page.focus("#byte-id-name");
          await page.keyboard.type(name[typed++]);
        }
      });
    }

    if (want("join")) {
      const j = (await api.top("#join")) - 60;
      await api.jump(j);
      const s = scroller(api, j, j + 180, 0.5, 4);
      await record("join", api, 4.5, s);
    }
    await page.close();
  },

  async blogpage(browser) {
    const { page, api } = await session(browser, { url: "/blog" });
    await api.jump(0);
    let clicked = false;
    await record("blogpage", api, 6.5, async (t) => {
      if (!clicked && t >= 3.4) {
        clicked = true;
        await page.evaluate(() => document.querySelector('[aria-label="Next books"]')?.click());
      }
    });
    await page.close();
  },

  async bytle(browser) {
    const { page, api } = await session(browser, { url: "/bytle" });
    await api.jump(0);
    // the second guess waits for the first row to finish flipping
    const keys = [..."REACT", "Enter", ..."CACHE", "Enter"];
    const at = (k) => (k < 6 ? 0.6 + k * 0.14 : 3.4 + (k - 6) * 0.14);
    let k = 0;
    await record("bytle", api, 6.4, async (t) => {
      while (k < keys.length && t >= at(k)) await page.keyboard.press(keys[k++]);
    });
    await page.close();
  },

  async mobile(browser) {
    const { page, api } = await session(browser, { url: "/", width: 390, height: 844, dpr: 2, mobile: true });
    await api.jump(0);
    await record("m-hero", api, 3);
    const e = (await api.top("#events")) - 10;
    await api.jump(e);
    await record("m-events", api, 3.2, scroller(api, e, e + 380, 1.4, 3.2));
    const l = (await api.top(".crew")) - 70;
    await api.jump(l);
    await record("m-leads", api, 3.4, scroller(api, l, l + 900, 1.2, 3.4));
    const w = await api.top(".lanyard-wall");
    await api.jump(w - 1200);
    await api.pump(2);
    const c = (await api.top(".squad")) - 60;
    await api.jump(c);
    await record("m-core", api, 3, scroller(api, c, c + 260, 1.6, 3));
    await page.close();
  },
};

const only = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
try {
  const desktopShots = ["hero", "about", "events", "leads", "core", "changelog", "blog", "byteid", "join"];
  const d = only.filter((s) => desktopShots.includes(s));
  if (!only.length || d.length) await SHOTS.desktop(browser, d);
  if (!only.length || only.includes("blogpage")) await SHOTS.blogpage(browser);
  if (!only.length || only.includes("bytle")) await SHOTS.bytle(browser);
  if (!only.length || only.includes("mobile")) await SHOTS.mobile(browser);
} finally {
  await browser.close();
}
console.log("captured");
