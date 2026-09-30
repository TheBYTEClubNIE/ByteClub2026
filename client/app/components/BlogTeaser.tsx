"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_LABEL, postDate, type PostSummary } from "@/lib/blog-meta";

// Same colours as the 3D shelf on /blog, so the books match across pages.
const BOOKS = [
  { id: "webdev", bg: "#0d3b34", ink: "#eafff8", band: "#28c2ff", h: 212, desc: "Frontend, backend, and everything in between." },
  { id: "ml", bg: "#122a45", ink: "#e8f1ff", band: "#7fb8ff", h: 188, desc: "Models, data, and the maths underneath." },
  { id: "agentic-ai", bg: "#241a3a", ink: "#f1e9ff", band: "#c6a6ff", h: 202, desc: "Agents, tools, and autonomous systems." },
  { id: "opensource", bg: "#3a2712", ink: "#fff2e0", band: "#ffbf7f", h: 178, desc: "Contributions and lessons from building in the open." },
];

export default function BlogTeaser({ posts }: { posts: PostSummary[] }) {
  const [open, setOpen] = useState(posts[0]?.category ?? "webdev");
  const book = BOOKS.find((b) => b.id === open) ?? BOOKS[0];
  const shelfPosts = posts.filter((p) => p.category === open);

  return (
    <section id="blog" className="section">
      <style>{SHELF_CSS}</style>

      {/* phones: header, shelf, posts. desktop: header + posts left, shelf right */}
      <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <header className="section-head lg:col-start-1 lg:row-start-1" style={{ marginBottom: 0 }}>
          <h2 className="section-title">Byte Blog</h2>
          <p className="section-lede">
            Notes on what the club&apos;s been building and learning. Pull a
            book off the shelf to see what&apos;s inside.
          </p>
        </header>

        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-2">
          <div key={open} className="bs-panel mt-8" aria-live="polite">
            <p className="bs-count" style={{ color: book.band }}>
              {shelfPosts.length} {shelfPosts.length === 1 ? "post" : "posts"}
            </p>
            <h3 className="bs-title">{CATEGORY_LABEL[open]}</h3>
            <p className="bs-desc">{book.desc}</p>

            {shelfPosts.length > 0 ? (
              <ul className="bs-posts">
                {shelfPosts.slice(0, 3).map((post, i) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="bs-post group">
                      <span className="bs-post-title">{post.title}</span>
                      <span className="bs-post-meta">
                        {[postDate(post.date), `${post.minutes} min read`].filter(Boolean).join(" · ")}
                      </span>
                      {i === 0 && post.excerpt && <span className="bs-post-excerpt">{post.excerpt}</span>}
                      <span className="bs-post-go" aria-hidden>
                        Read →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bs-empty">
                <p>Nothing on this shelf yet.</p>
                <a href="#contact" className="bs-empty-link">
                  Write the first {CATEGORY_LABEL[open]} post →
                </a>
              </div>
            )}

            <Link href="/blog" className="btn btn-ghost mt-8">
              Open the full shelf
            </Link>
          </div>
        </div>

        <div className="bs-stage order-1 mt-4 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <div className="bs-shelf" role="group" aria-label="Blog categories">
            {BOOKS.map((b) => {
              const count = posts.filter((p) => p.category === b.id).length;
              const isOpen = b.id === open;
              return (
                <button
                  key={b.id}
                  type="button"
                  className={`book3d ${isOpen ? "is-open" : ""}`}
                  style={{ ["--bg" as string]: b.bg, ["--ink" as string]: b.ink, ["--band" as string]: b.band, ["--h" as string]: `${b.h}px` }}
                  onClick={() => setOpen(b.id)}
                  aria-pressed={isOpen}
                  aria-label={`${CATEGORY_LABEL[b.id]}, ${count} ${count === 1 ? "post" : "posts"}`}
                >
                  <span className="book-face book-spine" aria-hidden>
                    <span className="book-band" />
                    <span className="book-spine-text">{CATEGORY_LABEL[b.id]}</span>
                    <span className="book-band book-band--low" />
                  </span>
                  <span className="book-face book-cover" aria-hidden>
                    <span className="book-cover-frame">
                      <span className="book-cover-kicker">The Byte Club</span>
                      <span className="book-cover-title">{CATEGORY_LABEL[b.id]}</span>
                      <span className="book-cover-count">
                        {count} {count === 1 ? "post" : "posts"}
                      </span>
                    </span>
                  </span>
                  <span className="book-face book-back" aria-hidden />
                  <span className="book-face book-top" aria-hidden />
                </button>
              );
            })}
          </div>
          <div className="bs-plank" aria-hidden />
        </div>
      </div>
    </section>
  );
}

const SHELF_CSS = `
.bs-panel { animation: bs-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes bs-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.bs-count { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em; }
.bs-title { margin-top: 6px; font-family: var(--font-display); font-weight: 600; font-size: clamp(1.5rem, 3vw, 2rem); letter-spacing: -0.02em; color: var(--ink); }
.bs-desc { margin-top: 6px; font-size: 15px; color: var(--ink-muted); }
.bs-posts { margin-top: 20px; display: grid; gap: 10px; }
.bs-post { display: grid; gap: 4px; padding: 16px 18px; border-radius: 12px; background: var(--bg-elevated); border: 1px solid var(--line); transition: border-color 0.2s ease, transform 0.2s ease; }
.bs-post:hover { border-color: var(--accent-border); transform: translateY(-2px); }
.bs-post-title { font-family: var(--font-display); font-weight: 500; font-size: 1.05rem; line-height: 1.3; color: var(--ink); }
.bs-post-meta { font-size: 13px; color: var(--ink-muted); }
.bs-post-excerpt { margin-top: 4px; font-size: 14.5px; line-height: 1.55; color: rgba(243,245,247,0.78); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.bs-post-go { margin-top: 6px; font-size: 14px; font-weight: 600; color: var(--accent); }
.bs-empty { margin-top: 20px; padding: 18px; border-radius: 12px; border: 1px dashed var(--line-strong); }
.bs-empty p { font-size: 15px; color: var(--ink-muted); }
.bs-empty-link { display: inline-block; margin-top: 6px; font-size: 15px; font-weight: 600; color: var(--accent); }

/* 3D books: spine faces you, the front cover is the right-hand side face,
   so turning a book on its axis swings the cover into view. */
.bs-stage { --w: 38px; --d: 104px; padding-top: 30px; }
.bs-shelf { display: flex; align-items: flex-end; justify-content: center; gap: 8px; min-height: 250px; perspective: 1100px; perspective-origin: 50% 20%; }
.book3d { position: relative; flex-shrink: 0; width: var(--w); height: var(--h); transform-style: preserve-3d; transform: translateZ(calc(var(--d) / -2)); transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), margin 0.75s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
.book3d:hover { transform: translateZ(calc(var(--d) / -2)) translateY(-8px); }
.book3d.is-open { margin-inline: calc(var(--d) * 0.36); transform: translateZ(calc(var(--d) / -2 + 26px)) translateY(-18px) rotateY(-64deg); }
.book-face { position: absolute; top: 0; backface-visibility: hidden; }
.book-spine { left: 0; width: var(--w); height: var(--h); transform: translateZ(calc(var(--d) / 2)); background: linear-gradient(90deg, rgba(0,0,0,0.35), transparent 20%, transparent 80%, rgba(0,0,0,0.3)), var(--bg); border-radius: 3px 3px 2px 2px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 12px 0; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06); }
.book-spine-text { writing-mode: vertical-rl; transform: rotate(180deg); font-family: var(--font-display); font-weight: 600; font-size: 12px; letter-spacing: 0.04em; color: var(--ink); white-space: nowrap; }
.book-band { width: 70%; height: 3px; border-radius: 2px; background: var(--band); }
.book-band--low { width: 40%; }
.book-cover { left: calc((var(--w) - var(--d)) / 2); width: var(--d); height: var(--h); transform: rotateY(90deg) translateZ(calc(var(--w) / 2)); background: radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,0.12), transparent 50%), var(--bg); border-radius: 2px 6px 6px 2px; padding: 10px; }
.book-cover-frame { display: flex; flex-direction: column; height: 100%; padding: 12px 10px; border: 1px solid color-mix(in srgb, var(--band) 55%, transparent); border-radius: 3px; }
.book-cover-kicker { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: color-mix(in srgb, var(--ink) 70%, transparent); }
.book-cover-title { margin-top: auto; font-family: var(--font-display); font-weight: 700; font-size: 17px; line-height: 1.1; color: var(--ink); }
.book-cover-count { margin-top: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--band); }
.book-back { left: calc((var(--w) - var(--d)) / 2); width: var(--d); height: var(--h); transform: rotateY(-90deg) translateZ(calc(var(--w) / 2)); background: var(--bg); filter: brightness(0.7); }
.book-top { left: 0; top: calc((var(--h) - var(--d)) / 2); width: var(--w); height: var(--d); transform: rotateX(90deg) translateZ(calc(var(--h) / 2)); background: repeating-linear-gradient(90deg, #efe9dc 0 2px, #d9d2c3 2px 3px); box-shadow: inset 0 0 0 2px var(--bg); }
.bs-plank { height: 14px; margin-top: -2px; border-radius: 3px; background: linear-gradient(180deg, #2a3138, #161a1e); box-shadow: 0 18px 30px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08); }

@media (min-width: 640px) { .bs-stage { --w: 48px; --d: 140px; } .book-spine-text { font-size: 13px; } .book-cover-title { font-size: 20px; } .bs-shelf { gap: 12px; min-height: 290px; } }
@media (prefers-reduced-motion: reduce) {
  .book3d, .bs-panel { transition: none; animation: none; }
  .book3d.is-open { margin-inline: 0; transform: translateZ(calc(var(--d) / -2)) translateY(-18px); }
}
`;
