"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildCompanion, buildStarfield } from "./story/rooms";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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

    scene.add(buildStarfield());

    // Persistent logo + constellation companion, attached to the camera so
    // it stays on screen for the entire scroll instead of living in one spot.
    const { group: companion, cloud, badge, shards } = buildCompanion(logoTexture, isMobile ? 500 : 1400);
    const shardMaterials = shards.children.map((s) => (s as THREE.LineSegments).material as THREE.LineBasicMaterial);
    const shardBaseOpacities = shardMaterials.map((m) => m.opacity);
    const badgeMaterial = badge.material as THREE.MeshBasicMaterial;
    const HERO_POS = new THREE.Vector3(isMobile ? 0 : 2.3, -0.9, -5.2);
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
            obj.rotation.x += x;
            obj.rotation.y += y;
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
        });

        // Dock progress is scoped to the Hero section itself (dockState),
        // so it completes exactly as the hero scrolls away — independent of
        // total page length — then holds at 1 for the rest of the page.
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
