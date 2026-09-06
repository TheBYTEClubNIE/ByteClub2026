"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StaticSpaceBackground from "../components/AnimatedBackground";
import BlogsPage from "../components/Blog";
import { BooksShowcase, BookCfg } from "@/components/ui/books-showcase";

const BYTE_BOOKS: BookCfg[] = [
  {
    id: "blog1",
    title: "Web Dev Insights",
    author: "The Byte Club",
    year: "2026",
    stars: 5,
    desc: "A deep dive into modern web development — frameworks, tooling, performance, and best practices from our community.",
    spineBg: "#00d4ff",
    spineInk: "#020812",
    spineFont: "700 36px Georgia",
    backBg: "#020812",
    backInk: "0,212,255",
    edge: "#00d4ff",
    front: (ctx, w, h) => {
      ctx.fillStyle = "#020812";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "rgba(0,212,255,0.3)");
      grad.addColorStop(1, "rgba(0,255,200,0.1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(0,212,255,0.5)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, w - 60, h - 60);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 56px Georgia";
      ctx.fillText("WEB", w / 2, h * 0.38);
      ctx.fillText("DEV", w / 2, h * 0.48);
      ctx.font = "italic 30px Georgia";
      ctx.fillStyle = "rgba(0,212,255,0.9)";
      ctx.fillText("Insights", w / 2, h * 0.6);
      ctx.font = "20px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("The Byte Club", w / 2, h * 0.75);
    },
  },
  {
    id: "blog2",
    title: "Machine Learning",
    author: "The Byte Club",
    year: "2026",
    stars: 5,
    desc: "Demystifying ML — from regression to deep learning, our members break down algorithms, experiments, and real-world applications.",
    spineBg: "#0f172a",
    spineInk: "#f59e0b",
    spineFont: "700 36px Georgia",
    backBg: "#0f172a",
    backInk: "245,158,11",
    edge: "#f59e0b",
    front: (ctx, w, h) => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, w * 0.8);
      grad.addColorStop(0, "rgba(245,158,11,0.25)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(245,158,11,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, w - 60, h - 60);
      ctx.fillStyle = "#f59e0b";
      ctx.textAlign = "center";
      ctx.font = "bold 48px Georgia";
      ctx.fillText("MACHINE", w / 2, h * 0.38);
      ctx.fillText("LEARNING", w / 2, h * 0.5);
      ctx.font = "18px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText("The Byte Club", w / 2, h * 0.72);
    },
  },
  {
    id: "blog3",
    title: "Agentic AI",
    author: "The Byte Club",
    year: "2026",
    stars: 5,
    desc: "Autonomous agents, multi-agent systems, LLM tool-use and the future of AI that acts — explored by The Byte Club.",
    spineBg: "#1a0a2e",
    spineInk: "#a78bfa",
    spineFont: "700 36px serif",
    backBg: "#1a0a2e",
    backInk: "167,139,250",
    edge: "#a78bfa",
    front: (ctx, w, h) => {
      ctx.fillStyle = "#1a0a2e";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "rgba(167,139,250,0.3)");
      grad.addColorStop(1, "rgba(99,102,241,0.08)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(167,139,250,0.55)";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, w - 60, h - 60);
      ctx.fillStyle = "#a78bfa";
      ctx.textAlign = "center";
      ctx.font = "bold 52px serif";
      ctx.fillText("AGENTIC", w / 2, h * 0.38);
      ctx.fillStyle = "#ffffff";
      ctx.fillText("AI", w / 2, h * 0.52);
      ctx.font = "18px Arial";
      ctx.fillStyle = "rgba(167,139,250,0.7)";
      ctx.fillText("The Byte Club", w / 2, h * 0.72);
    },
  },
  {
    id: "blog4",
    title: "Open Source",
    author: "The Byte Club",
    year: "2026",
    stars: 5,
    desc: "Contributing to open source, building tools for the community, and everything in between from our dev team.",
    spineBg: "#052e16",
    spineInk: "#4ade80",
    spineFont: "700 36px monospace",
    backBg: "#052e16",
    backInk: "74,222,128",
    edge: "#4ade80",
    front: (ctx, w, h) => {
      ctx.fillStyle = "#052e16";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, h, w, 0);
      grad.addColorStop(0, "rgba(74,222,128,0.2)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(74,222,128,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, w - 60, h - 60);
      ctx.fillStyle = "#4ade80";
      ctx.textAlign = "center";
      ctx.font = "bold 44px monospace";
      ctx.fillText("OPEN", w / 2, h * 0.38);
      ctx.fillText("SOURCE", w / 2, h * 0.5);
      ctx.font = "18px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText("The Byte Club", w / 2, h * 0.72);
    },
  },
];

export default function BlogRoute() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Background */}
      <StaticSpaceBackground />

      {/* Navbar */}
      <div className="p-8"><Navbar /></div>

      {/* ───────────────── BOOKS SHOWCASE HERO ───────────────── */}
      <section className="w-full" style={{ height: "680px" }}>
        <BooksShowcase
          books={BYTE_BOOKS}
          heroTitle=""
          navTitle=""
          showNav={false}
          showDetailPanel={true}
          showCarousel={true}
          themeColors={{
            bg: "#ffffff",
            bgLight: "#ffffff",
            bgDark: "#ffffff",
          }}
          className="h-full"
        />
      </section>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">

        {/* ───────────────── BLOGS LIST ───────────────── */}
        <section id="blogs" className="w-full py-12 sm:py-16 md:py-20">
          <div className="flex justify-center mb-10 sm:mb-14">
            <h2
              className="
                relative inline-block
                text-3xl sm:text-4xl md:text-5xl
                font-bold
                text-white
                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[3px]
                after:w-0
                hover:after:w-full
                after:bg-cyan-400
                after:transition-all
                after:duration-700
                hover:tracking-wide
                transition-all
                duration-500
              "
              style={{
                fontFamily: "'Orbitron', sans-serif",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.25), 0 0 30px rgba(0,212,255,0.15)",
              }}
            >
              Byte Blogs
            </h2>
          </div>
          <BlogsPage />
        </section>
      </div>

      {/* ───────────────── FOOTER ───────────────── */}
      <section className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </section>
    </div>
  );
}
