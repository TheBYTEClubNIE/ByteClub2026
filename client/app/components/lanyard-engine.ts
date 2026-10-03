import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Hanging ID cards for one squad, drawn in a single WebGL canvas. Each card
// hangs from a rail on a short lanyard (a verlet rope); drag or fling a card
// and it swings, spins and settles. The loop sleeps once everything is still.
//
// Layout comes from the page: every [data-card] element in the wall is where a
// card rests, and the space above it (--rope) is its lanyard.

export interface LanyardMember {
  name: string;
  role: string;
  image: string;
  frame?: { position?: string; zoom?: number; origin?: string };
}

const FW = 420; // card face texture size
const FH = 640;
const STEP = 1 / 120;
const GRAVITY = 2600; // px/s²
const RING = 12; // the clip ring sits this far above the card

type Pt = { x: number; y: number; px: number; py: number; w: number }; // w: inverse mass, 0 = held

interface Card {
  pts: Pt[]; // anchor, rope, rope, ring, centre
  rope: number;
  half: number;
  yaw: number;
  yawV: number;
  group: THREE.Group;
  inner: THREE.Group;
  band: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
}

/* ───────── textures ───────── */

const images = new Map<string, Promise<HTMLImageElement | null>>();
function loadImage(src: string, w: number) {
  const key = `${src}@${w}`;
  if (!images.has(key)) {
    images.set(
      key,
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
      })
    );
  }
  return images.get(key)!;
}

const pct = (v: string | undefined, i: number) => (v ? parseFloat(v.split(" ")[i]) / 100 : 0.5);

// object-fit: cover + object-position + transform: scale(zoom) around transform-origin
function drawPhoto(x: CanvasRenderingContext2D, img: HTMLImageElement, m: LanyardMember, bx: number, by: number, bw: number, bh: number) {
  const f = m.frame ?? {};
  const s = Math.max(bw / img.width, bh / img.height);
  const dw = img.width * s;
  const dh = img.height * s;
  const ox = bx + bw * pct(f.origin, 0);
  const oy = by + bh * pct(f.origin, 1);
  const z = f.zoom ?? 1;
  x.save();
  x.translate(ox, oy);
  x.scale(z, z);
  x.translate(-ox, -oy);
  x.drawImage(img, bx + (bw - dw) * pct(f.position, 0), by + (bh - dh) * pct(f.position, 1), dw, dh);
  x.restore();
}

function lines(x: CanvasRenderingContext2D, text: string, maxW: number) {
  const out: string[] = [];
  for (const word of text.split(" ")) {
    const last = out[out.length - 1];
    if (last && x.measureText(`${last} ${word}`).width <= maxW) out[out.length - 1] = `${last} ${word}`;
    else out.push(word);
  }
  return out;
}

// Largest size (down to min) at which the text fits in `rows` lines.
function fitText(x: CanvasRenderingContext2D, text: string, font: (px: number) => string, px: number, min: number, maxW: number, rows: number) {
  for (let s = px; s >= min; s -= 2) {
    x.font = font(s);
    const ls = lines(x, text, maxW);
    if (ls.length <= rows && ls.every((l) => x.measureText(l).width <= maxW)) return { size: s, ls };
  }
  x.font = font(min);
  return { size: min, ls: lines(x, text, maxW).slice(0, rows) };
}

function cardBase(color: string) {
  const c = document.createElement("canvas");
  c.width = FW;
  c.height = FH;
  const x = c.getContext("2d")!;
  x.beginPath();
  x.roundRect(0, 0, FW, FH, 34);
  x.clip();
  const g = x.createLinearGradient(0, 0, 0, FH);
  g.addColorStop(0, "#192028");
  g.addColorStop(1, "#0d1114");
  x.fillStyle = g;
  x.fillRect(0, 0, FW, FH);
  const glow = x.createRadialGradient(FW, FH, 0, FW, FH, FW * 1.1);
  glow.addColorStop(0, `${color}30`);
  glow.addColorStop(1, `${color}00`);
  x.fillStyle = glow;
  x.fillRect(0, 0, FW, FH);
  x.fillStyle = color;
  x.fillRect(0, 0, FW, 46);
  x.fillStyle = "#0a0b0d";
  x.beginPath();
  x.roundRect(FW / 2 - 44, 16, 88, 14, 7);
  x.fill();
  return { c, x };
}

interface Fonts {
  body: string;
  display: string;
}

function drawFront(m: LanyardMember, color: string, fonts: Fonts, scale: number, img: HTMLImageElement | null) {
  const { c, x } = cardBase(color);
  const px = 40;
  const py = 72;
  const pw = FW - 80;
  const ph = 320;
  x.save();
  x.beginPath();
  x.roundRect(px, py, pw, ph, 22);
  x.clip();
  x.fillStyle = "#07090b";
  x.fillRect(px, py, pw, ph);
  if (img) drawPhoto(x, img, m, px, py, pw, ph);
  x.restore();

  // text sized for the card's size on screen: ~14px names, ~11px roles
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  x.textAlign = "center";
  x.fillStyle = "#f3f5f7";
  const name = fitText(x, m.name, (s) => `600 ${s}px ${fonts.body}`, clamp(14 / scale, 38, 62), 34, FW - 44, 2);
  let y = py + ph + 22 + name.size;
  for (const l of name.ls) {
    x.fillText(l, FW / 2, y);
    y += name.size * 1.08;
  }
  x.fillStyle = color;
  const role = fitText(x, m.role, (s) => `500 ${s}px ${fonts.body}`, clamp(11.5 / scale, 28, 48), 26, FW - 40, 1);
  x.fillText(role.ls[0] ?? "", FW / 2, y + role.size * 0.35);
  return c;
}

function drawBack(color: string, label: string, fonts: Fonts, logo: HTMLImageElement | null) {
  const { c, x } = cardBase(color);
  if (logo) {
    const s = 230;
    x.drawImage(logo, FW / 2 - s / 2, 150, s, s);
  }
  x.textAlign = "center";
  x.fillStyle = "#f3f5f7";
  x.font = `700 40px ${fonts.display}`;
  x.fillText("THE BYTE CLUB", FW / 2, 450);
  x.fillStyle = color;
  x.font = `600 28px ${fonts.body}`;
  x.fillText(label.toUpperCase(), FW / 2, 500);
  return c;
}

function drawBand(color: string, fonts: Fonts) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 64;
  const x = c.getContext("2d")!;
  x.fillStyle = color;
  x.fillRect(0, 0, 512, 64);
  x.fillStyle = "rgba(0,0,0,0.18)";
  x.fillRect(0, 0, 512, 6);
  x.fillRect(0, 58, 512, 6);
  x.fillStyle = "#0a0b0d";
  x.font = `700 30px ${fonts.display}`;
  x.textBaseline = "middle";
  x.fillText("THE BYTE CLUB  •", 18, 33);
  return c;
}

function texture(c: HTMLCanvasElement, renderer: THREE.WebGLRenderer) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

function fontOf(el: HTMLElement, cssVar: string) {
  const probe = document.createElement("span");
  probe.style.fontFamily = `var(${cssVar})`;
  el.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  return family;
}

/* ───────── geometry ───────── */

function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function faceGeometry(shape: THREE.Shape, w: number, h: number) {
  const g = new THREE.ShapeGeometry(shape, 6);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  return g;
}

/* ───────── engine ───────── */

export function mountLanyards(wall: HTMLElement, canvas: HTMLCanvasElement, opts: { color: string; label: string; members: LanyardMember[] }) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch {
    return null;
  }
  const narrow = innerWidth < 768;
  renderer.setPixelRatio(Math.min(devicePixelRatio, narrow ? 1.75 : 2));

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  // ambient ~π shows the printed card at its true colours; the key light adds shading as it turns
  scene.add(new THREE.AmbientLight(0xffffff, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(-0.4, 0.6, 1);
  scene.add(key);
  const camera = new THREE.PerspectiveCamera(20, 1, 1, 50000);
  const hidden = new THREE.MeshBasicMaterial({ visible: false });

  const fonts: Fonts = { body: fontOf(wall, "--font-body"), display: fontOf(wall, "--font-display") };
  const slots = [...wall.querySelectorAll<HTMLElement>("[data-card]")];
  // only the metal parts reflect the room; the printed faces stay true to colour
  const metal = new THREE.MeshStandardMaterial({ color: 0xc9d1d9, metalness: 1, roughness: 0.28, envMap: env });
  const edge = new THREE.MeshStandardMaterial({ color: 0x232a31, metalness: 0.5, roughness: 0.4, envMap: env, envMapIntensity: 0.3 });
  const bandTex = texture(drawBand(opts.color, fonts), renderer);
  bandTex.wrapS = THREE.RepeatWrapping;
  const bandMat = new THREE.MeshStandardMaterial({ map: bandTex, roughness: 0.75, side: THREE.DoubleSide });
  const backTex = texture(drawBack(opts.color, opts.label, fonts, null), renderer);
  const physical = (map: THREE.Texture) =>
    new THREE.MeshPhysicalMaterial({ map, roughness: 0.5, metalness: 0, clearcoat: narrow ? 0 : 1, clearcoatRoughness: 0.22 });
  const backMat = physical(backTex);
  loadImage("/Logo/logo-transparent.png", 256).then((logo) => {
    if (!logo || disposed) return;
    backTex.image = drawBack(opts.color, opts.label, fonts, logo);
    backTex.needsUpdate = true;
    wake();
  });

  let W = 0;
  let H = 0;
  let cards: Card[] = [];
  let world = new THREE.Group();
  scene.add(world);
  let built = "";
  let disposed = false;

  const toWorld = (x: number, y: number, z = 0) => new THREE.Vector3(x - W / 2, H / 2 - y, z);

  function build() {
    const cr = canvas.getBoundingClientRect();
    W = cr.width;
    H = cr.height;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const dist = H / 2 / Math.tan(THREE.MathUtils.degToRad(10));
    camera.position.set(0, 0, dist);
    camera.near = dist - 600; // tight depth range keeps the thin card from flickering
    camera.far = dist + 600;
    camera.updateProjectionMatrix();

    const rope = parseFloat(getComputedStyle(wall).getPropertyValue("--rope")) || 48;
    const rects = slots.map((s) => {
      const r = s.getBoundingClientRect();
      return { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height };
    });
    const sig = rects.map((r) => `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.w)}`).join("|");
    if (sig === built) return;
    built = sig;

    // start over: free the old meshes
    world.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        for (const m of [o.material].flat() as (THREE.Material & { map?: THREE.Texture | null })[]) {
          if (m === backMat || m === metal || m === edge || m === bandMat || m === hidden) continue;
          m.map?.dispose();
          m.dispose();
        }
      }
    });
    scene.remove(world);
    world = new THREE.Group();
    scene.add(world);

    const w = rects[0].w;
    const h = rects[0].h;
    const scale = w / FW;
    const shape = roundedShape(w, h, w * 0.08);
    const body = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false, curveSegments: 6 });
    body.translate(0, 0, -1);
    const face = faceGeometry(shape, w, h);
    const back = face.clone().rotateY(Math.PI);
    const clipGeo = new THREE.BoxGeometry(w * 0.26, 9, 5);
    const ringGeo = new THREE.TorusGeometry(5.5, 1.6, 8, 20);
    const bandW = Math.max(7, w * 0.085);

    cards = rects.map((r, i) => {
      const m = opts.members[i];
      const tex = texture(drawFront(m, opts.color, fonts, scale, null), renderer);
      loadImage(m.image, 384).then((img) => {
        if (!img || disposed || !tex.image) return;
        tex.image = drawFront(m, opts.color, fonts, scale, img);
        tex.needsUpdate = true;
        wake();
      });

      const inner = new THREE.Group();
      inner.add(new THREE.Mesh(body, [hidden, edge])); // sides only; the faces are their own meshes
      const f = new THREE.Mesh(face, physical(tex));
      f.position.z = 1;
      inner.add(f);
      const b = new THREE.Mesh(back, backMat);
      b.position.z = -1;
      inner.add(b);
      const clip = new THREE.Mesh(clipGeo, metal);
      clip.position.y = h / 2 + 1;
      inner.add(clip);
      const ring = new THREE.Mesh(ringGeo, metal);
      ring.position.y = h / 2 + RING;
      inner.add(ring);
      const group = new THREE.Group();
      group.add(inner);
      world.add(group);

      // the lanyard: a flat ribbon rebuilt along the rope every frame
      const N = 22;
      const bandGeo = new THREE.BufferGeometry();
      bandGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 6), 3));
      bandGeo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(N * 4), 2));
      const idx: number[] = [];
      for (let k = 0; k < N - 1; k++) idx.push(k * 2, k * 2 + 1, k * 2 + 2, k * 2 + 1, k * 2 + 3, k * 2 + 2);
      bandGeo.setIndex(idx);
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.userData.width = bandW;
      band.frustumCulled = false;
      world.add(band);

      const cx = r.x + r.w / 2;
      const top = r.y - RING;
      const len = rope - RING;
      const pt = (y: number, wInv: number): Pt => ({ x: cx, y, px: cx, py: y, w: wInv });
      return {
        pts: [pt(r.y - rope, 0), pt(top - (len * 2) / 3, 1), pt(top - len / 3, 1), pt(top, 0.6), pt(top + RING + h / 2, 0.35)],
        rope: len / 3,
        half: RING + h / 2,
        yaw: 0,
        yawV: 0,
        group,
        inner,
        band,
        curve: new THREE.CatmullRomCurve3([0, 1, 2, 3].map(() => new THREE.Vector3()), false, "chordal"),
      };
    });

    // a rail along the top of each row, with a peg for every card
    const rows = new Map<number, number[]>();
    for (const c of cards) {
      const y = Math.round(c.pts[0].y);
      rows.set(y, [...(rows.get(y) ?? []), c.pts[0].x]);
    }
    const pegGeo = new THREE.CylinderGeometry(3.5, 3.5, 6, 14).rotateX(Math.PI / 2);
    for (const [y, xs] of rows) {
      const x0 = Math.min(...xs) - w * 0.45;
      const x1 = Math.max(...xs) + w * 0.45;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 3, 3), edge);
      rail.position.copy(toWorld((x0 + x1) / 2, y - 3, -4));
      world.add(rail);
      for (const x of xs) {
        const peg = new THREE.Mesh(pegGeo, metal);
        peg.position.copy(toWorld(x, y, -1));
        world.add(peg);
      }
    }
    draw();
  }

  /* physics */

  function step() {
    const damp = 0.992;
    for (const c of cards) {
      for (const p of c.pts) {
        if (!p.w) continue;
        const vx = (p.x - p.px) * damp;
        const vy = (p.y - p.py) * damp;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + GRAVITY * STEP * STEP;
      }
      if (drag && cards[drag.i] === c) {
        const p = c.pts[4];
        p.px = p.x;
        p.py = p.y;
        p.x += (drag.tx - p.x) * 0.35;
        p.y += (drag.ty - p.y) * 0.35;
      }
      for (let it = 0; it < 10; it++) {
        for (let k = 0; k < 4; k++) {
          const a = c.pts[k];
          const b = c.pts[k + 1];
          const len = k === 3 ? c.half : c.rope;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          if (k < 3 && d <= len) continue; // the lanyard can go slack; the card itself is rigid
          const wa = a.w;
          const wb = drag && cards[drag.i] === c && k === 3 ? 0 : b.w;
          if (wa + wb === 0) continue;
          const diff = (d - len) / d / (wa + wb);
          a.x += dx * diff * wa;
          a.y += dy * diff * wa;
          b.x -= dx * diff * wb;
          b.y -= dy * diff * wb;
        }
      }
      // spin about the vertical axis, settling face-forward
      const centre = c.pts[4];
      const vx = (centre.x - centre.px) / STEP;
      const held = drag && cards[drag.i] === c;
      const target = Math.round(c.yaw / (Math.PI * 2)) * Math.PI * 2 + (held ? THREE.MathUtils.clamp(vx * 0.0012, -0.7, 0.7) : 0);
      c.yawV += ((target - c.yaw) * 14 - c.yawV * 3) * STEP;
      c.yaw += c.yawV * STEP;
    }
  }

  function draw() {
    for (const [i, c] of cards.entries()) {
      const [a, q1, q2, ring, centre] = c.pts;
      c.group.position.copy(toWorld(centre.x, centre.y, drag?.i === i ? 8 : 0));
      c.group.rotation.z = Math.atan2(centre.x - ring.x, centre.y - ring.y);
      c.inner.rotation.y = c.yaw;
      [a, q1, q2, ring].forEach((p, k) => c.curve.points[k].copy(toWorld(p.x, p.y, -3)));
      const pts = c.curve.getPoints(21);
      const pos = c.band.geometry.attributes.position as THREE.BufferAttribute;
      const uv = c.band.geometry.attributes.uv as THREE.BufferAttribute;
      const hw = c.band.userData.width / 2;
      let run = 0;
      for (let k = 0; k < pts.length; k++) {
        const prev = pts[Math.max(0, k - 1)];
        const next = pts[Math.min(pts.length - 1, k + 1)];
        const tx = next.x - prev.x;
        const ty = next.y - prev.y;
        const tl = Math.hypot(tx, ty) || 1;
        const nx = (-ty / tl) * hw;
        const ny = (tx / tl) * hw;
        if (k) run += pts[k].distanceTo(pts[k - 1]);
        pos.setXYZ(k * 2, pts[k].x + nx, pts[k].y + ny, pts[k].z);
        pos.setXYZ(k * 2 + 1, pts[k].x - nx, pts[k].y - ny, pts[k].z);
        const u = run / (hw * 2 * 8);
        uv.setXY(k * 2, u, 1);
        uv.setXY(k * 2 + 1, u, 0);
      }
      pos.needsUpdate = true;
      uv.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }

  /* loop: runs while something moves, sleeps when still */

  let raf = 0;
  let last = 0;
  let acc = 0;
  let still = 0;
  let visible = false;
  const loop = (now: number) => {
    raf = 0;
    acc += Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    let moved = 0;
    while (acc >= STEP) {
      step();
      acc -= STEP;
    }
    for (const c of cards) {
      for (const p of c.pts) moved = Math.max(moved, Math.abs(p.x - p.px) + Math.abs(p.y - p.py));
      moved = Math.max(moved, Math.abs(c.yawV) * 0.5);
    }
    draw();
    still = moved < 0.02 && !drag ? still + 1 : 0;
    if (visible && still < 45) raf = requestAnimationFrame(loop);
    else last = 0;
  };
  function wake() {
    still = 0;
    if (!raf && visible && !disposed) raf = requestAnimationFrame(loop);
  }

  /* input: drag a card, or tap one to flick it */

  let drag: { i: number; id: number; ox: number; oy: number; tx: number; ty: number; x0: number; t0: number; moved: number } | null = null;
  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const hit = (x: number, y: number) => {
    for (let i = cards.length - 1; i >= 0; i--) {
      const c = cards[i];
      const ring = c.pts[3];
      const centre = c.pts[4];
      const roll = Math.atan2(centre.x - ring.x, centre.y - ring.y);
      const dx = x - centre.x;
      const dy = y - centre.y;
      const lx = dx * Math.cos(roll) - dy * Math.sin(roll);
      const ly = dx * Math.sin(roll) + dy * Math.cos(roll);
      const hw = (wallCardW() / 2) * Math.max(0.35, Math.abs(Math.cos(c.yaw)));
      if (Math.abs(lx) < hw && Math.abs(ly) < c.half - RING / 2) return i;
    }
    return -1;
  };
  const wallCardW = () => slots[0]?.getBoundingClientRect().width ?? 0;

  const onDown = (e: PointerEvent) => {
    if ((e.target as Element).closest("a") || drag) return;
    const p = local(e);
    const i = hit(p.x, p.y);
    if (i < 0) return;
    const centre = cards[i].pts[4];
    drag = { i, id: e.pointerId, ox: p.x - centre.x, oy: p.y - centre.y, tx: centre.x, ty: centre.y, x0: p.x, t0: performance.now(), moved: 0 };
    try {
      wall.setPointerCapture(e.pointerId);
    } catch {
      /* pointer already gone */
    }
    wake();
  };
  const onMove = (e: PointerEvent) => {
    const p = local(e);
    if (drag && e.pointerId === drag.id) {
      drag.tx = p.x - drag.ox;
      drag.ty = p.y - drag.oy;
      drag.moved = Math.max(drag.moved, Math.abs(p.x - drag.x0));
      wake();
    } else if (e.pointerType === "mouse") {
      wall.style.cursor = hit(p.x, p.y) >= 0 ? "grab" : "";
    }
  };
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const c = cards[drag.i];
    const centre = c.pts[4];
    if (drag.moved < 6 && performance.now() - drag.t0 < 300) {
      // a tap: flick the card so it swings and turns
      const dir = Math.random() < 0.5 ? -1 : 1;
      centre.px = centre.x - dir * 7;
      c.yawV += dir * 9;
    } else {
      c.yawV += ((centre.x - centre.px) / STEP) * 0.004;
    }
    drag = null;
    wake();
  };
  wall.addEventListener("pointerdown", onDown);
  wall.addEventListener("pointermove", onMove);
  wall.addEventListener("pointerup", onUp);
  // the browser took the gesture (a scroll): just let go
  const onCancel = () => {
    drag = null;
    wake();
  };
  wall.addEventListener("pointercancel", onCancel);

  const ro = new ResizeObserver(() => {
    build();
    wake();
  });
  ro.observe(wall);

  let entered = false;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !entered && cards.length) {
      // first look: the cards drop onto their lanyards and swing
      entered = true;
      cards.forEach((c, i) => {
        const dir = i % 2 ? 1 : -1;
        for (const p of c.pts.slice(1)) {
          p.y -= 40;
          p.py = p.y;
        }
        c.pts[4].px = c.pts[4].x - dir * (2 + Math.random() * 3);
        c.yawV = dir * (2 + Math.random() * 3);
      });
    }
    if (visible) wake();
  });

  document.fonts.ready.then(() => {
    if (disposed) return;
    build();
    io.observe(wall);
    wall.classList.add("is-3d");
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    wall.removeEventListener("pointerdown", onDown);
    wall.removeEventListener("pointermove", onMove);
    wall.removeEventListener("pointerup", onUp);
    wall.removeEventListener("pointercancel", onCancel);
    wall.classList.remove("is-3d");
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        for (const m of [o.material].flat() as (THREE.Material & { map?: THREE.Texture | null })[]) {
          m.map?.dispose();
          m.dispose();
        }
      }
    });
    env.dispose();
    renderer.dispose();
  };
}
