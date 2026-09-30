"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "github-markdown-css/github-markdown.css";
import { marked } from "marked";
import { BooksShowcase, BookCfg } from "@/components/ui/books-showcase";

marked.setOptions({ gfm: true, breaks: true });

export interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  image?: string;
  content: string;
}

const CATEGORY_META: Record<
  string,
  { label: string; desc: string; spineBg: string; spineInk: string; backBg: string; backInk: string; edge: string }
> = {
  webdev: {
    label: "Web Dev",
    desc: "Frontend, backend, and everything in between: how we actually build things.",
    spineBg: "#0d3b34",
    spineInk: "#eafff8",
    backBg: "#0d3b34",
    backInk: "230,255,248",
    edge: "#cfe9e0",
  },
  ml: {
    label: "Machine Learning",
    desc: "Models, data, and the math underneath: notes from the ML side of the club.",
    spineBg: "#122a45",
    spineInk: "#e8f1ff",
    backBg: "#122a45",
    backInk: "220,235,255",
    edge: "#cdd9ea",
  },
  "agentic-ai": {
    label: "Agentic AI",
    desc: "Agents, tools, and autonomous systems: the newest chapter in tech.",
    spineBg: "#241a3a",
    spineInk: "#f1e9ff",
    backBg: "#241a3a",
    backInk: "235,220,255",
    edge: "#d8cdea",
  },
  opensource: {
    label: "Open Source",
    desc: "Contributions, projects, and lessons from building in the open.",
    spineBg: "#3a2712",
    spineInk: "#fff2e0",
    backBg: "#3a2712",
    backInk: "255,235,210",
    edge: "#ead9c0",
  },
};

const CATEGORY_ORDER = ["webdev", "ml", "agentic-ai", "opensource"];

function wrapLines(x: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (x.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// Category cover with the titles of its posts listed under the name, so
// you can see what's in a book without opening it.
function paintCover(label: string, bg: string, ink: string, titles: string[]) {
  return (x: CanvasRenderingContext2D, w: number, h: number) => {
    x.fillStyle = bg;
    x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(255,255,255,0.4)";
    x.lineWidth = 3;
    x.strokeRect(60, 60, w - 120, h - 120);
    x.fillStyle = ink;
    x.textAlign = "center";

    x.globalAlpha = 0.7;
    x.font = "600 30px Georgia";
    x.fillText("THE BYTE CLUB", w / 2, 170);
    x.globalAlpha = 1;

    x.font = "700 96px Georgia";
    let y = 330;
    for (const l of wrapLines(x, label, w * 0.76)) {
      x.fillText(l, w / 2, y);
      y += 104;
    }
    x.globalAlpha = 0.4;
    x.fillRect(w / 2 - 80, y - 40, 160, 3);
    x.globalAlpha = 1;
    y += 60;

    x.font = "italic 52px Georgia";
    if (titles.length === 0) {
      x.globalAlpha = 0.6;
      x.fillText("Coming soon", w / 2, y);
      x.globalAlpha = 1;
      return;
    }
    for (const title of titles.slice(0, 3)) {
      const lines = wrapLines(x, title, w * 0.74);
      const shown = lines.slice(0, 3);
      if (lines.length > 3) shown[2] += "…";
      for (const l of shown) {
        x.fillText(l, w / 2, y);
        y += 62;
      }
      y += 44;
    }
    if (titles.length > 3) {
      x.globalAlpha = 0.7;
      x.fillText(`+ ${titles.length - 3} more`, w / 2, y);
      x.globalAlpha = 1;
    }
  };
}

export default function BlogShelf({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openPost, setOpenPost] = useState<Post | null>(null);

  const postsByCategory = useMemo(() => {
    const map: Record<string, Post[]> = {};
    for (const cat of CATEGORY_ORDER) map[cat] = [];
    for (const post of posts) map[CATEGORY_ORDER.includes(post.category) ? post.category : "webdev"].push(post);
    return map;
  }, [posts]);

  const books: BookCfg[] = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => {
        const meta = CATEGORY_META[cat];
        const titles = postsByCategory[cat].map((p) => p.title);
        return {
          id: cat,
          title: meta.label,
          author: "The Byte Club",
          year: String(new Date().getFullYear()),
          stars: 5,
          desc: meta.desc,
          spineBg: meta.spineBg,
          spineInk: meta.spineInk,
          spineFont: "700 42px 'Bricolage Grotesque', Georgia, serif",
          backBg: meta.backBg,
          backInk: meta.backInk,
          edge: meta.edge,
          front: paintCover(meta.label, meta.spineBg, meta.spineInk, titles),
          chapters: titles.length > 0 ? titles : ["Nothing posted yet, check back soon"],
        };
      }),
    [postsByCategory]
  );

  const activePosts = selectedCategory ? postsByCategory[selectedCategory] : [];
  const activeMeta = selectedCategory ? CATEGORY_META[selectedCategory] : null;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-5 sm:px-8 py-5">
        <Link href="/" className="flex items-center gap-3">
          <img src="/Logo/logo-transparent.png" alt="The Byte Club" className="w-9 h-9 rounded-full object-cover" />
          <span style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }} className="font-bold text-sm hidden sm:inline">
            The Byte Club
          </span>
        </Link>
        <Link
          href="/#blogs"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border"
          style={{ borderColor: "var(--line-strong)", color: "var(--ink)", fontFamily: "var(--font-body)" }}
        >
          ← Back to site
        </Link>
      </header>

      {openPost ? (
        <PostReader post={openPost} onBack={() => setOpenPost(null)} />
      ) : (
        <div className="relative h-screen w-full">
          <BooksShowcase
            books={books}
            heroTitle="Byte Blog"
            showNav={false}
            showDetailPanel={false}
            className="h-full min-h-0"
            onBookSelect={(book) => setSelectedCategory(book?.id ?? null)}
            themeColors={{
              bg: "var(--bg)",
              foregroundLight: "var(--ink)",
              foregroundDark: "var(--ink)",
              navy: "var(--bg-elevated)",
              cream: "var(--ink)",
              peri: "var(--accent)",
              pink: "var(--accent-strong)",
              lav: "var(--ink-muted)",
            }}
          />

          {activeMeta && (
            <div
              className="fixed right-4 sm:right-10 bottom-6 sm:bottom-10 z-30 w-[min(90vw,380px)] rounded-2xl p-6"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)", backdropFilter: "blur(12px)" }}
            >
              <p style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }} className="text-[10px] tracking-[0.18em] uppercase mb-2">
                {activeMeta.label}
              </p>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)" }} className="text-xs leading-relaxed mb-4">
                {activeMeta.desc}
              </p>
              <div className="flex flex-col gap-1.5 max-h-[40vh] overflow-y-auto">
                {activePosts.length === 0 ? (
                  <span style={{ color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }} className="text-[11px]">
                    Nothing posted here yet.
                  </span>
                ) : (
                  activePosts.map((post) => (
                    <button
                      key={post.slug}
                      onClick={() => setOpenPost(post)}
                      className="text-left rounded-lg px-3 py-2 text-xs transition-colors"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-body)", background: "rgba(255,255,255,0.03)" }}
                    >
                      {post.title} →
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PostReader({ post, onBack }: { post: Post; onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-28 pb-20">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-xs"
        style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
      >
        ← Back to the shelf
      </button>

      <div className="rounded-[24px] p-8 md:p-12" style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--ink-faint)" }} className="text-[11px] tracking-widest uppercase mb-3">
          {(CATEGORY_META[post.category] ?? CATEGORY_META.webdev).label}
          {post.date && ` · ${new Date(post.date + "T00:00:00").toDateString()}`}
        </p>
        <h1
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          className="text-3xl md:text-5xl font-bold leading-tight mb-8"
        >
          {post.title}
        </h1>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-2xl mb-8 object-cover"
            style={{ maxHeight: 420 }}
          />
        )}
        <div className="h-px mb-8" style={{ background: "var(--line)" }} />
        <article className="markdown-body" style={{ background: "transparent" }} dangerouslySetInnerHTML={{ __html: marked(post.content) as string }} />
      </div>
    </div>
  );
}
