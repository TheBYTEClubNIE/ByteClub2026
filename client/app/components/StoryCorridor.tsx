"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildRooms, ROOM_SPACING, ROOM_COUNT } from "./story/rooms";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GALLERY_IMAGES = [
  "/Events/beyondlabs4.jpg",
  "/Events/bits-1.jpg",
  "/Events/group-1.jpg",
  "/Events/1.jpg",
  "/Events/beyondlabs6.jpg",
  "/Events/event1.jpg",
];

export default function StoryCorridor() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Guard against a transient 0-width layout (e.g. a hidden/not-yet-laid-out
    // container) falsely matching the mobile media query at mount time.
    const isMobile = window.innerWidth > 0 && window.innerWidth <= 768;
    const skipCameraTravel = prefersReducedMotion || isMobile;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0b0d, 18, 62);

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

    scene.add(new THREE.AmbientLight(0x22332e, isMobile ? 0.9 : 0.55));
    const fillLight = new THREE.PointLight(0x5fe3c8, 0.5, 120);
    fillLight.position.set(0, 6, 6);
    scene.add(fillLight);

    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load("/Logo/image.png");
    const galleryTextures = isMobile
      ? []
      : GALLERY_IMAGES.map((src) => textureLoader.load(src));

    const rooms = buildRooms(logoTexture, galleryTextures);
    rooms.forEach((room) => scene.add(room));

    const scrollState = { progress: 0 };
    let scrollTriggerInstance: ScrollTrigger | null = null;
    const ctx = gsap.context(() => {
      if (!skipCameraTravel) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            scrollState.progress = self.progress;
          },
        });
      }
    });

    const totalDepth = ROOM_SPACING * (ROOM_COUNT - 1);
    const startZ = 10;
    const endZ = -(totalDepth - 6);

    let raf = 0;
    let isVisible = true;
    let tabVisible = document.visibilityState !== "hidden";
    let contextLost = false;
    const clock = new THREE.Clock();

    const render = () => {
      if (contextLost || !isVisible || !tabVisible) return;
      const elapsed = clock.getElapsedTime();

      scene.traverse((obj) => {
        if (obj.userData.spinY) obj.rotation.y += obj.userData.spinY as number;
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

      if (!skipCameraTravel) {
        const targetZ = THREE.MathUtils.lerp(startZ, endZ, scrollState.progress);
        camera.position.z += (targetZ - camera.position.z) * 0.08;
        camera.position.x = Math.sin(scrollState.progress * Math.PI * 2) * 0.6;
      }
      camera.lookAt(0, 0, camera.position.z - 25);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
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

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh | THREE.Points | THREE.Line;
        if ("geometry" in mesh && mesh.geometry) mesh.geometry.dispose();
        const material = (mesh as THREE.Mesh).material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) (material as THREE.Material).dispose();
      });
      logoTexture.dispose();
      galleryTextures.forEach((t) => t.dispose());
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
