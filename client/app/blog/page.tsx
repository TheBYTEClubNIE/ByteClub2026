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
    title: "Cybersecurity",
    author: "The Byte Club",
    year: "2026",
    stars: 5,
    desc: "Explore ethical hacking, CTF writeups, vulnerability research and the world of cybersecurity through our members' lens.",
    spineBg: "#0a0d1d",
    spineInk: "#ff4f6d",
    spineFont: "700 36px monospace",
    backBg: "#0a0d1d",
    backInk: "255,79,109",
    edge: "#ff4f6d",
    front: (ctx, w, h) => {
      ctx.fillStyle = "#0a0d1d";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
      grad.addColorStop(0, "rgba(255,79,109,0.2)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,79,109,0.6)";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, w - 60, h - 60);
      ctx.fillStyle = "#ff4f6d";
      ctx.textAlign = "center";
      ctx.font = "bold 48px monospace";
      ctx.fillText("CYBER", w / 2, h * 0.4);
      ctx.fillText("SEC", w / 2, h * 0.52);
      ctx.font = "18px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText("The Byte Club", w / 2, h * 0.72);
    },
  },
  {
    id: "blog3",
    title: "Hackathon Diaries",
    author: "The Byte Club",
    year: "2026",
    stars: 5,
    desc: "Stories, lessons, wins, and losses from hackathons attended by The Byte Club members across the country.",
    spineBg: "#1a0a2e",
    spineInk: "#c084fc",
    spineFont: "700 36px serif",
    backBg: "#1a0a2e",
    backInk: "192,132,252",
    edge: "#c084fc",
    front: (ctx, w, h) => {
      ctx.fillStyle = "#1a0a2e";
      ctx.fillRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "rgba(192,132,252,0.25)");
      grad.addColorStop(1, "rgba(99,102,241,0.1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(192,132,252,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, w - 60, h - 60);
      ctx.fillStyle = "#c084fc";
      ctx.textAlign = "center";
      ctx.font = "bold 44px serif";
      ctx.fillText("HACK-", w / 2, h * 0.38);
      ctx.fillText("ATHON", w / 2, h * 0.5);
      ctx.font = "italic 26px serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("Diaries", w / 2, h * 0.62);
      ctx.font = "18px Arial";
      ctx.fillStyle = "rgba(192,132,252,0.7)";
      ctx.fillText("The Byte Club", w / 2, h * 0.76);
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
          heroTitle="Byte Blogs"
          navTitle="Featured Topics"
          showNav={true}
          showDetailPanel={true}
          showCarousel={true}
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
