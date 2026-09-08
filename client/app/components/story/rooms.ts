import * as THREE from "three";

// Single accent family (blue -> cyan) — several tonal stops for depth in the
// particle cloud, never a second hue. This is our equivalent of the
// reference's multicolor triangle field, kept disciplined to one brand hue.
const TONES = [0x3066be, 0x60afff, 0x28c2ff, 0x2af5ff];

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
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 3;
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
      size: 0.09,
      map: getTriangleSprite(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  cloud.userData.spinY = 0.0009;
  cloud.renderOrder = 1;
  group.add(cloud);

  const light = new THREE.PointLight(TONES[2], 1.1, 10);
  light.position.set(0, 0, 1.5);
  group.add(light);

  return { group, cloud, badge };
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
