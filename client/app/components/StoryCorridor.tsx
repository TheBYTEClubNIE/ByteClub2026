"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildCompanion, buildAmbientDust, buildAmbientShards } from "./story/rooms";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Per-point hover-scatter AND scroll-drift for bulk THREE.Points clouds
// (the ambient dust field) — unlike the per-object userData.home/displace
// pattern used for discrete shards, a Points object is hundreds of vertices
// sharing one transform, so each individual triangle needs its own home,
// heading, and motion state tracked in parallel Float32Arrays and written
// back into the position buffer every frame.
//
// Two separate motions are layered on top of home:
//  - `displace` is the hover-scatter spring: an instant push away from the
//    mouse that decays quickly back to zero once the mouse moves off.
//  - `driftVel`/`driftPos` is the scroll wander: scrolling adds velocity
//    along the point's fixed heading, velocity only damps gradually, and
//    position keeps integrating that velocity — so a triangle actually
//    travels to a new spot and keeps drifting for a bit after you stop
//    scrolling, instead of springing straight back to its home position
//    (which read as "basically static"). A soft radius bounce keeps it
//    from wandering off into the middle distance forever.
const scatterWorldPos = new THREE.Vector3();
const DRIFT_MAX = 0.55;
function updatePointScatter(
  points: THREE.Points,
  camera: THREE.Camera,
  mouseNDC: { x: number; y: number },
  hoverEnabled: boolean,
  scrollDelta: number
) {
  const homePositions = points.userData.homePositions as Float32Array | undefined;
  if (!homePositions) return;
  const n = homePositions.length;
  let displace = points.userData.displace as Float32Array | undefined;
  if (!displace || displace.length !== n) {
    displace = new Float32Array(n);
    points.userData.displace = displace;
  }
  let driftDirs = points.userData.driftDirs as Float32Array | undefined;
  if (!driftDirs) {
    driftDirs = new Float32Array(n);
    for (let i = 0; i < n; i += 3) {
      driftDirs[i] = (Math.random() - 0.5) * 2;
      driftDirs[i + 1] = (Math.random() - 0.5) * 2;
      driftDirs[i + 2] = (Math.random() - 0.5) * 0.8;
    }
    points.userData.driftDirs = driftDirs;
  }
  let driftVel = points.userData.driftVel as Float32Array | undefined;
  if (!driftVel || driftVel.length !== n) {
    driftVel = new Float32Array(n);
    points.userData.driftVel = driftVel;
  }
  let driftPos = points.userData.driftPos as Float32Array | undefined;
  if (!driftPos || driftPos.length !== n) {
    driftPos = new Float32Array(n);
    points.userData.driftPos = driftPos;
  }
  const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;
  const threshold = 0.26;
  const scrolling = scrollDelta > 0.00003;
  for (let i = 0; i < n; i += 3) {
    if (scrolling) {
      driftVel[i] += driftDirs[i] * scrollDelta * 14;
      driftVel[i + 1] += driftDirs[i + 1] * scrollDelta * 14;
      driftVel[i + 2] += driftDirs[i + 2] * scrollDelta * 14;
    }
    driftVel[i] *= 0.97;
    driftVel[i + 1] *= 0.97;
    driftVel[i + 2] *= 0.97;
    driftPos[i] += driftVel[i];
    driftPos[i + 1] += driftVel[i + 1];
    driftPos[i + 2] += driftVel[i + 2];
    const dlen = Math.sqrt(driftPos[i] * driftPos[i] + driftPos[i + 1] * driftPos[i + 1] + driftPos[i + 2] * driftPos[i + 2]);
    if (dlen > DRIFT_MAX) {
      const s = DRIFT_MAX / dlen;
      driftPos[i] *= s;
      driftPos[i + 1] *= s;
      driftPos[i + 2] *= s;
      driftVel[i] *= -0.4;
      driftVel[i + 1] *= -0.4;
      driftVel[i + 2] *= -0.4;
    }

    if (hoverEnabled) {
      scatterWorldPos.set(
        homePositions[i] + driftPos[i] + displace[i],
        homePositions[i + 1] + driftPos[i + 1] + displace[i + 1],
        homePositions[i + 2] + driftPos[i + 2] + displace[i + 2]
      );
      points.localToWorld(scatterWorldPos);
      scatterWorldPos.project(camera);
      const dx = scatterWorldPos.x - mouseNDC.x;
      const dy = scatterWorldPos.y - mouseNDC.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        const force = 1 - dist / threshold;
        const invDist = dist > 0.0001 ? 1 / dist : 0;
        displace[i] += dx * invDist * force * 0.16;
        displace[i + 1] += dy * invDist * force * 0.16;
      }
    }
    displace[i] *= 0.94;
    displace[i + 1] *= 0.94;
    displace[i + 2] *= 0.94;
    arr[i] = homePositions[i] + driftPos[i] + displace[i];
    arr[i + 1] = homePositions[i + 1] + driftPos[i + 1] + displace[i + 1];
    arr[i + 2] = homePositions[i + 2] + driftPos[i + 2] + displace[i + 2];
  }
  posAttr.needsUpdate = true;
}

export default function StoryCorridor() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Guard against a transient 0-width layout (e.g. a hidden/not-yet-laid-out
    // container) falsely matching the mobile media query at mount time.
    const isMobile = window.innerWidth > 0 && window.innerWidth <= 768;
    // Wider than "mobile" but not full desktop — the hero logo should still
    // sit dead-center here (only true desktop pushes it right of center).
    const isTabletOrSmaller = window.innerWidth > 0 && window.innerWidth <= 1024;
    // Reduced motion disables all scroll-driven animation (camera drift,
    // dock/burst). Mobile only skips the camera dolly for perf — the
    // dock/burst transition is cheap and stays on so the logo still
    // travels to its corner on every device.
    const skipCameraTravel = prefersReducedMotion;
    const skipScrollTracking = prefersReducedMotion;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0b0d, 12, 40);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 10);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x2c4054, isMobile ? 1.0 : 0.7));
    const fillLight = new THREE.PointLight(0x28c2ff, 0.7, 60);
    fillLight.position.set(0, 6, 6);
    scene.add(fillLight);

    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load("/Logo/logo-transparent.png");

    // Persistent, deliberately minimal ambient field: quiet dust plus a
    // handful of big tumbling shards further out — all camera-attached so
    // they're present everywhere on the site, not just the hero. Kept
    // sparse on purpose (per "minimal, don't overuse").
    const ambientField = new THREE.Group();
    const ambientDust = buildAmbientDust();
    // buildAmbientShards was written to sit inside the hero companion, whose
    // parent group already carries a Z offset — added straight to the
    // camera here (no such parent), its shards' near-zero local Z would put
    // them essentially at the camera itself. Push the whole group back to a
    // sane depth, and keep the radius modest so it stays inside the frustum
    // on narrow/mobile aspect ratios too.
    const ambientShards = buildAmbientShards(6, { inner: 0.9, outer: 1.8 });
    ambientShards.position.z = -4;
    ambientField.add(ambientDust, ambientShards);
    camera.add(ambientField);

    const ambientDustMaterial = ambientDust.material as THREE.PointsMaterial;
    const ambientShardMaterials = ambientShards.children.map((s) => (s as THREE.LineSegments).material as THREE.LineBasicMaterial);
    const ambientDustBaseOpacity = ambientDustMaterial.opacity;
    const ambientShardBaseOpacities = ambientShardMaterials.map((m) => m.opacity);
    // Every individual triangle in the dust field gets its own hover-scatter
    // and scroll-drift physics, not just whole objects.
    const scatterClouds: THREE.Points[] = [ambientDust];

    // Hover-scatter physics: any object tagged with userData.home/displace
    // gets pushed away from the mouse and springs back when it moves off.
    // Desktop + motion-enabled only — skipped on touch devices and when the
    // user has asked for reduced motion.
    const hoverEnabled = !isMobile && !prefersReducedMotion;
    const mouseNDC = { x: 10, y: 10 }; // starts off-screen so nothing reacts before the first move
    const handleMouseMove = (e: MouseEvent) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (hoverEnabled) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    const hoverWorldPos = new THREE.Vector3();

    // Persistent logo + constellation companion, attached to the camera so
    // it stays on screen for the entire scroll instead of living in one spot.
    const { group: companion, cloud, badge, shards } = buildCompanion(logoTexture, isMobile ? 500 : 1400);
    const shardMaterials = shards.children.map((s) => (s as THREE.LineSegments).material as THREE.LineBasicMaterial);
    const shardBaseOpacities = shardMaterials.map((m) => m.opacity);
    const badgeMaterial = badge.material as THREE.MeshBasicMaterial;
    const HERO_POS = new THREE.Vector3(isTabletOrSmaller ? 0 : 2.3, 0, -5.2);
    const DOCK_POS = new THREE.Vector3(isMobile ? -1.15 : -2.7, 1.85, -4.2);
    const HERO_SCALE = isMobile ? 0.85 : 1;
    const DOCK_SCALE = 0.3;
    companion.position.copy(HERO_POS);
    companion.scale.setScalar(HERO_SCALE);
    camera.add(companion);
    scene.add(camera);
    const cloudMaterial = cloud.material as THREE.PointsMaterial;
    const cloudBaseOpacity = cloudMaterial.opacity;

    const scrollState = { progress: 0 };
    const dockState = { progress: 0 };
    let scrollTriggerInstance: ScrollTrigger | null = null;
    let dockTriggerInstance: ScrollTrigger | null = null;
    const ctx = gsap.context(() => {
      if (!skipScrollTracking) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            scrollState.progress = self.progress;
          },
        });

        // Docks relative to the Hero section's own height, not the whole
        // page — so it always completes right as the hero scrolls away,
        // regardless of how long the rest of the page is.
        const heroEl = document.getElementById("home");
        dockTriggerInstance = ScrollTrigger.create({
          trigger: heroEl ?? document.body,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            dockState.progress = self.progress;
          },
        });
      }
    });

    // A short, gentle forward drift — there's no room-to-room journey to
    // travel any more, just a subtle sense of depth as the page scrolls.
    const startZ = 10;
    const endZ = 2;

    let raf = 0;
    let isVisible = true;
    let tabVisible = document.visibilityState !== "hidden";
    let contextLost = false;
    let loopBroken = false;
    let smoothedProgress = 0;
    let lastProgress = 0;
    const clock = new THREE.Clock();

    const render = () => {
      if (contextLost || !isVisible || !tabVisible || loopBroken) return;

      try {
        const elapsed = clock.getElapsedTime();

        // How fast the user is actually scrolling right now — drives the
        // constellation's motion so it feels driven by scroll, not autoplay.
        smoothedProgress += (scrollState.progress - smoothedProgress) * 0.08;
        const scrollDelta = Math.abs(scrollState.progress - lastProgress);
        lastProgress = scrollState.progress;

        scene.traverse((obj) => {
          if (obj.userData.spinY) {
            const boost = 1 + scrollDelta * 400;
            obj.rotation.y += (obj.userData.spinY as number) * boost;
          }
          if (obj.userData.tumble) {
            const { x, y } = obj.userData.tumble as { x: number; y: number };
            const boost = 1 + scrollDelta * 400;
            obj.rotation.x += x * boost;
            obj.rotation.y += y * boost;
          }
          if (obj.userData.bob) {
            const { amp, speed, phase, baseY } = obj.userData.bob as {
              amp: number;
              speed: number;
              phase: number;
              baseY: number;
            };
            obj.position.y = baseY + Math.sin(elapsed * speed + phase) * amp;
          }
          if (obj.userData.home) {
            const home = obj.userData.home as THREE.Vector3;
            const displace = obj.userData.displace as THREE.Vector3;
            // Scroll-driven wander, same idea as the per-point dust field
            // below: scrolling adds velocity along the shard's own fixed
            // heading, velocity only damps gradually, and position keeps
            // integrating it — so a shard actually travels somewhere and
            // keeps drifting briefly after you stop scrolling, rather than
            // springing straight back to home (which read as "static").
            // A soft bounce off a max radius keeps it from wandering off
            // into the middle distance forever.
            const driftDir = obj.userData.driftDir as THREE.Vector3 | undefined;
            if (driftDir) {
              if (!obj.userData.driftVel) obj.userData.driftVel = new THREE.Vector3();
              if (!obj.userData.driftPos) obj.userData.driftPos = new THREE.Vector3();
              const driftVel = obj.userData.driftVel as THREE.Vector3;
              const driftPos = obj.userData.driftPos as THREE.Vector3;
              if (scrollDelta > 0.00003) {
                driftVel.addScaledVector(driftDir, scrollDelta * 14);
              }
              driftVel.multiplyScalar(0.97);
              driftPos.add(driftVel);
              const driftMax = 0.9;
              const dlen = driftPos.length();
              if (dlen > driftMax) {
                driftPos.multiplyScalar(driftMax / dlen);
                driftVel.multiplyScalar(-0.4);
              }
            }
            if (hoverEnabled) {
              obj.getWorldPosition(hoverWorldPos);
              hoverWorldPos.project(camera);
              const dx = hoverWorldPos.x - mouseNDC.x;
              const dy = hoverWorldPos.y - mouseNDC.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const threshold = 0.32;
              if (dist < threshold) {
                const force = 1 - dist / threshold;
                const invDist = dist > 0.0001 ? 1 / dist : 0;
                displace.x += dx * invDist * force * 0.1;
                displace.y += dy * invDist * force * 0.1;
              }
            }
            displace.multiplyScalar(0.88);
            obj.position.copy(home).add(displace);
            if (obj.userData.driftPos) obj.position.add(obj.userData.driftPos as THREE.Vector3);
          }
        });

        // Per-point scatter + scroll-drift for the bulk dust cloud — kept
        // out of the generic traverse above since it needs array-level
        // access to a whole Points object's position buffer, not just one
        // object's transform. Always runs (not just when hover is enabled)
        // so scroll-driven movement still happens on mobile/touch devices.
        scatterClouds.forEach((pts) => updatePointScatter(pts, camera, mouseNDC, hoverEnabled, scrollDelta));

        // Dock progress is scoped to the Hero section itself (dockState),
        // so it completes exactly as the hero scrolls away and reverses
        // cleanly when scrolling back up — independent of total page length.
        const dockEased = dockState.progress * dockState.progress * (3 - 2 * dockState.progress); // smoothstep

        // The constellation bursts outward and fades as the logo docks.
        const burstScale = 1 + dockEased * 2.4;
        cloud.scale.setScalar(burstScale);
        cloudMaterial.opacity = cloudBaseOpacity * (1 - dockEased);
        shards.scale.setScalar(burstScale);
        shardMaterials.forEach((m, i) => {
          m.opacity = shardBaseOpacities[i] * (1 - dockEased);
        });

        companion.position.lerpVectors(HERO_POS, DOCK_POS, dockEased);
        const scale = THREE.MathUtils.lerp(HERO_SCALE, DOCK_SCALE, dockEased);
        companion.scale.setScalar(scale);

        // The 3D logo dissolves in the final stretch of its dock travel
        // rather than trying to land exactly on the 2D "TBC" nav mark —
        // that mark is already correctly positioned and always visible, so
        // this just hands off to it instead of fighting for the same spot.
        const fadeStart = 0.55;
        const fadeT = THREE.MathUtils.clamp((dockEased - fadeStart) / (1 - fadeStart), 0, 1);
        badgeMaterial.opacity = 1 - fadeT;

        // Smooth handoff, not a hard cut: as the dense hero globe bursts
        // away, the persistent ambient field gently brightens to fill the
        // gap — a gradient between "hero spectacle" and "quiet site-wide
        // texture" rather than an abrupt switch from one to the other.
        ambientDustMaterial.opacity = ambientDustBaseOpacity * (0.5 + dockEased * 0.5);
        ambientShardMaterials.forEach((m, i) => {
          m.opacity = ambientShardBaseOpacities[i] * (0.4 + dockEased * 0.6);
        });

        if (!skipCameraTravel) {
          const targetZ = THREE.MathUtils.lerp(startZ, endZ, scrollState.progress);
          camera.position.z += (targetZ - camera.position.z) * 0.06;
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(render);
      } catch (err) {
        // A single bad frame must never permanently blank the canvas — stop
        // cleanly instead of leaving a broken half-rendered scene on screen.
        loopBroken = true;
        console.error("StoryCorridor render loop stopped:", err);
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };
    const handleContextRestored = () => {
      contextLost = false;
      loopBroken = false;
      raf = requestAnimationFrame(render);
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored);

    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !contextLost && tabVisible) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(render);
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    const handleVisibilityChange = () => {
      tabVisible = document.visibilityState !== "hidden";
      if (tabVisible && isVisible && !contextLost) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      if (hoverEnabled) window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
      io.disconnect();
      ctx.revert();
      scrollTriggerInstance?.kill();
      dockTriggerInstance?.kill();

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh | THREE.Points | THREE.Line;
        if ("geometry" in mesh && mesh.geometry) mesh.geometry.dispose();
        const material = (mesh as THREE.Mesh).material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) (material as THREE.Material).dispose();
      });
      logoTexture.dispose();
      renderer.dispose();
      try {
        container.removeChild(renderer.domElement);
      } catch {}
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 -z-40 pointer-events-none overflow-hidden"
      style={{ background: "var(--bg)" }}
    />
  );
}
