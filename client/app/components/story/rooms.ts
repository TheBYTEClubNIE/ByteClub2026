import * as THREE from "three";

export const ROOM_SPACING = 46;
export const ROOM_COUNT = 7;

const TEAL = 0x5fe3c8;
const TEAL_BRIGHT = 0x8ff0da;

function makeLabelTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 120;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#071019";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(95,227,200,0.6)";
  ctx.lineWidth = 4;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  ctx.fillStyle = "#8ff0da";
  ctx.font = "700 26px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function buildPortal(z: number, logoTexture: THREE.Texture, bright: boolean): THREE.Group {
  const group = new THREE.Group();
  group.position.z = z;

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(bright ? 4.2 : 5.4, 0.12, 16, 96),
    new THREE.MeshStandardMaterial({
      color: TEAL,
      emissive: TEAL,
      emissiveIntensity: bright ? 2.2 : 1.1,
      roughness: 0.35,
      metalness: 0.2,
    })
  );
  ring.userData.spinY = 0.0025;
  group.add(ring);

  const badge = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true })
  );
  badge.userData.bob = { amp: 0.15, speed: 0.6, phase: 0, baseY: 0 };
  group.add(badge);

  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 6 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) * 0.4;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      color: bright ? TEAL_BRIGHT : TEAL,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  particles.userData.spinY = 0.0006;
  group.add(particles);

  const light = new THREE.PointLight(TEAL, bright ? 3 : 1.6, 30);
  light.position.set(0, 0, 4);
  group.add(light);

  return group;
}

function buildCircuit(z: number): THREE.Group {
  const group = new THREE.Group();
  group.position.z = z;

  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 7),
    new THREE.MeshStandardMaterial({ color: 0x0c1613, roughness: 0.8, metalness: 0.1 })
  );
  board.rotation.x = -0.12;
  group.add(board);

  const traceMat = new THREE.MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 1.4 });
  for (let i = 0; i < 12; i++) {
    const len = 1.2 + Math.random() * 2.4;
    const trace = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, 0.05), traceMat);
    trace.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, 0.1);
    trace.rotation.z = Math.random() > 0.5 ? 0 : Math.PI / 2;
    trace.rotation.x = -0.12;
    group.add(trace);

    if (Math.random() > 0.5) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), traceMat);
      dot.position.copy(trace.position);
      dot.position.x += len / 2;
      group.add(dot);
    }
  }

  const light = new THREE.PointLight(TEAL, 1.8, 25);
  light.position.set(0, 2, 5);
  group.add(light);

  return group;
}

function buildStage(z: number): THREE.Group {
  const group = new THREE.Group();
  group.position.z = z;

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(4.5, 4.8, 0.4, 48),
    new THREE.MeshStandardMaterial({ color: 0x0d1013, roughness: 0.6 })
  );
  platform.position.y = -2.6;
  group.add(platform);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.06, 12, 64),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 1.6 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -2.4;
  group.add(rim);

  const spot = new THREE.SpotLight(TEAL_BRIGHT, 6, 20, Math.PI / 6, 0.4);
  spot.position.set(0, 8, 2);
  spot.target.position.set(0, -2.6, 0);
  group.add(spot);
  group.add(spot.target);

  const labels = ["BEYOND THE LABS", "BITS TO BYTES", "BEYOND LABS"];
  labels.forEach((text, i) => {
    const tex = makeLabelTexture(text);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    const angle = (i / labels.length) * Math.PI * 2;
    screen.position.set(Math.cos(angle) * 5.5, 0.6 + i * 0.3, Math.sin(angle) * 5.5 - 3);
    screen.lookAt(0, 0.6, -3);
    screen.userData.bob = { amp: 0.12, speed: 0.5 + i * 0.1, phase: i, baseY: screen.position.y };
    group.add(screen);
  });

  return group;
}

function buildNetworkTable(z: number): THREE.Group {
  const group = new THREE.Group();
  group.position.z = z;

  const nodeMat = new THREE.MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 1.5 });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 20), nodeMat));

  const nodeCount = 6;
  const lineMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.35 });
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 4.6;
    const pos = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * 1.3) * 0.8, Math.sin(angle) * radius);
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), nodeMat);
    node.position.copy(pos);
    node.userData.bob = { amp: 0.18, speed: 0.4 + i * 0.05, phase: i, baseY: pos.y };
    group.add(node);

    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
    group.add(new THREE.Line(lineGeo, lineMat));
  }

  const light = new THREE.PointLight(TEAL, 2, 20);
  group.add(light);

  return group;
}

function buildGalleryWall(z: number, textures: THREE.Texture[]): THREE.Group {
  const group = new THREE.Group();
  group.position.z = z;

  const cols = 3;
  const spacingX = 3.6;
  const spacingY = 2.6;
  const count = textures.length > 0 ? textures.length : 6;
  const fallbackColors = [0x123b34, 0x175a4d, 0x0f2b27, 0x1d6e5d, 0x134238, 0x0c211d];

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const mat =
      textures.length > 0
        ? new THREE.MeshBasicMaterial({ map: textures[i] })
        : new THREE.MeshStandardMaterial({
            color: fallbackColors[i % fallbackColors.length],
            emissive: TEAL,
            emissiveIntensity: 0.15,
          });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), mat);
    plane.position.set((col - (cols - 1) / 2) * spacingX, (row - 0.5) * spacingY, (Math.random() - 0.5) * 1.5);
    plane.userData.bob = { amp: 0.08, speed: 0.3 + i * 0.03, phase: i, baseY: plane.position.y };
    group.add(plane);
  }

  const light = new THREE.PointLight(TEAL, 1.4, 25);
  light.position.set(0, 0, 6);
  group.add(light);

  return group;
}

function buildTerminal(z: number): THREE.Group {
  const group = new THREE.Group();
  group.position.z = z;

  group.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 4.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x0b0e11, roughness: 0.7 })
    )
  );

  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 3.6, 0.05),
    new THREE.MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 1.2 })
  );
  strip.position.z = 0.28;
  group.add(strip);

  const light = new THREE.PointLight(TEAL, 0.9, 15);
  light.position.set(0, 0, 3);
  group.add(light);

  return group;
}

export function buildRooms(logoTexture: THREE.Texture, galleryTextures: THREE.Texture[]): THREE.Group[] {
  return [
    buildPortal(0, logoTexture, false),
    buildCircuit(-ROOM_SPACING),
    buildStage(-ROOM_SPACING * 2),
    buildNetworkTable(-ROOM_SPACING * 3),
    buildGalleryWall(-ROOM_SPACING * 4, galleryTextures),
    buildTerminal(-ROOM_SPACING * 5),
    buildPortal(-ROOM_SPACING * 6, logoTexture, true),
  ];
}
