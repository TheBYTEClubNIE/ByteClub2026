import * as THREE from "three";

// Single accent family (blue -> cyan) — several tonal stops for depth in the
// particle cloud, never a second hue. This is our equivalent of the
// reference's multicolor triangle field, kept disciplined to one brand hue.
// Biased toward the brighter end so the field reads as vivid, not muddy.
const TONES = [0x60afff, 0x28c2ff, 0x2af5ff, 0x2af5ff];

let triangleSprite: THREE.Texture | null = null;
function getTriangleSprite(): THREE.Texture {
  if (triangleSprite) return triangleSprite;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.08);
  ctx.lineTo(size * 0.92, size * 0.88);
  ctx.lineTo(size * 0.08, size * 0.88);
  ctx.closePath();
  // Bright translucent fill plus a crisp bright stroke — a bare 3px outline
  // read too dim once composited additively; the fill gives it real punch.
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,1)";
  ctx.lineWidth = 4;
  ctx.stroke();
  triangleSprite = new THREE.CanvasTexture(canvas);
  triangleSprite.needsUpdate = true;
  return triangleSprite;
}

/**
 * The persistent companion: the real logo, unmodified and uncropped, wrapped
 * in a dense constellation of small triangle particles — the technique from
 * the reference (thousands of tiny outlined triangles forming a field around
 * the brand mark), kept to our single accent hue family. Attached to the
 * camera in StoryCorridor so it stays on screen for the entire scroll.
 *
 * Visual hierarchy (deliberate, not accidental):
 *   1. Logo plane        — primary, always fully legible, nothing drawn over it.
 *   2. Constellation      — secondary, dense and alive, but thins out right
 *                           over the wordmark so it never obscures it.
 */
export interface Companion {
  group: THREE.Group;
  cloud: THREE.Points;
  badge: THREE.Mesh;
  shards: THREE.Group;
}

/**
 * A handful of real 3D wireframe shapes (tetrahedra — four-faced, so every
 * angle still reads as "a triangle") tumbling around the companion. Unlike
 * the flat billboard sprites in the main cloud, these are actual geometry —
 * they catch perspective and rotate in three axes, giving the field real
 * depth instead of a flat sheet of dots.
 */
function buildAmbientShards(count: number): THREE.Group {
  const group = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const radius = 0.14 + Math.random() * 0.22;
    const geo = new THREE.TetrahedronGeometry(radius, 0);
    const edges = new THREE.EdgesGeometry(geo);
    const material = new THREE.LineBasicMaterial({
      color: TONES[i % TONES.length],
      transparent: true,
      opacity: 0.9,
    });
    const shard = new THREE.LineSegments(edges, material);

    const angle = Math.random() * Math.PI * 2;
    const r = 1.6 + Math.random() * 2.6;
    shard.position.set(Math.cos(angle) * r, Math.sin(angle) * r * 0.9, (Math.random() - 0.5) * 1.4);
    shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    shard.userData.tumble = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
    };
    group.add(shard);
  }
  return group;
}

export function buildCompanion(logoTexture: THREE.Texture, particleCount = 1400): Companion {
  const group = new THREE.Group();

  // The real logo, full square image, no crop — this is already a complete
  // circular badge design (rings, wordmark, accent arcs baked in), so no
  // separate procedural ring is drawn on top of it.
  // Explicit color-space + toneMapped:false so the logo renders at its true
  // brightness/colors regardless of renderer tone-mapping defaults — without
  // this it was rendering washed-out gray instead of the real wordmark colors.
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  const badgeMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });
  badgeMaterial.toneMapped = false;
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), badgeMaterial);
  badge.userData.bob = { amp: 0.04, speed: 0.5, phase: 0, baseY: 0 };
  badge.renderOrder = 2;
  group.add(badge);

  // Dense constellation cloud: an annulus around the logo (inner radius
  // clears the wordmark, outer radius fades into sparse ambient particles),
  // with depth jitter so it reads as a volume, not a flat ring.
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Bias radius heavily toward the inner band so it reads as a halo
    // wrapped around the logo, not particles scattered across the whole
    // hero — only a small tail reaches the outer, sparse ambient edge.
    const t = Math.random();
    const r = 1.3 + Math.pow(t, 2.4) * 1.9;
    const depth = (Math.random() - 0.5) * 0.7;

    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.sin(angle) * r * 0.92;
    positions[i * 3 + 2] = depth;

    tmpColor.setHex(TONES[i % TONES.length]);
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;

    sizes[i] = 0.05 + Math.random() * 0.11;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const cloud = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.1,
      map: getTriangleSprite(),
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  cloud.userData.spinY = 0.0009;
  cloud.renderOrder = 1;
  group.add(cloud);

  // Real 3D tumbling shards for depth — the reference's ambient triangles
  // read as actual rotated geometry, not flat dots, so these are too.
  const shards = buildAmbientShards(12);
  group.add(shards);

  const light = new THREE.PointLight(TONES[2], 1.8, 12);
  light.position.set(0, 0, 1.5);
  group.add(light);

  return { group, cloud, badge, shards };
}

export interface ShapeCloud {
  points: THREE.Points;
  sphere: Float32Array;
  lightbulb: Float32Array;
}

/** Evenly distributed points on a sphere surface (Fibonacci sphere). */
function sphereFormation(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    arr[i * 3] = Math.cos(theta) * r * radius;
    arr[i * 3 + 1] = y * radius;
    arr[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return arr;
}

/** A bulb-shaped dome sitting on a narrowing stem — a lightbulb silhouette. */
function lightbulbFormation(count: number, radius: number): Float32Array {
  const arr = new Float32Array(count * 3);
  const domeCount = Math.floor(count * 0.72);
  const domeCenterY = radius * 0.25;

  for (let i = 0; i < count; i++) {
    if (i < domeCount) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      // Bias phi so points mostly cover the dome (upper ~80% of a sphere),
      // leaving a narrower opening at the bottom that blends into the stem.
      const phi = Math.acos(1 - v * 1.6);
      const r = radius * (0.88 + Math.random() * 0.12);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) + domeCenterY;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    } else {
      const t = (i - domeCount) / Math.max(1, count - domeCount - 1);
      const stemRadius = radius * 0.26 * (1 - t * 0.45);
      const angle = Math.random() * Math.PI * 2;
      const rr = stemRadius * Math.sqrt(Math.random());
      arr[i * 3] = Math.cos(angle) * rr;
      arr[i * 3 + 1] = domeCenterY - radius * 0.55 - t * radius * 1.3;
      arr[i * 3 + 2] = Math.sin(angle) * rr;
    }
  }
  return arr;
}

/**
 * A second, larger particle field that morphs between two recognizable 3D
 * shapes (sphere -> lightbulb) as the user scrolls through the hero/story
 * zone — the literal "constellation forms a shape" technique from the
 * reference, kept to our single accent hue. This lives behind the logo
 * companion (bigger, further back) and is only around for that zone; the
 * caller fades it out afterward so it doesn't linger behind every section.
 */
export function buildShapeCloud(particleCount = 1800): ShapeCloud {
  const sphere = sphereFormation(particleCount, 4.4);
  const lightbulb = lightbulbFormation(particleCount, 4.2);

  const positions = sphere.slice();
  const colors = new Float32Array(particleCount * 3);
  const tmpColor = new THREE.Color();
  for (let i = 0; i < particleCount; i++) {
    tmpColor.setHex(TONES[i % TONES.length]);
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.075,
      map: getTriangleSprite(),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  points.userData.spinY = 0.0011;

  return { points, sphere, lightbulb };
}

/**
 * Plain ambient starfield — tertiary layer, dim and sparse, filling the void
 * far behind everything. No clustering, no representational content.
 */
export function buildStarfield(): THREE.Group {
  const group = new THREE.Group();
  const count = 180;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 55;
    positions[i * 3 + 2] = -20 - Math.random() * 120;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0x4a5560,
      size: 0.05,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
  );
  stars.userData.spinY = 0.00015;
  group.add(stars);
  return group;
}
