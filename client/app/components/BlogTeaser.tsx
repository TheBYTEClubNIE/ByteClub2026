import Link from "next/link";
import { CATEGORY_LABEL, postDate, type Post } from "@/lib/posts";

const BOOKS = [
  { label: "Web Dev", color: "#28c2ff", height: 128 },
  { label: "Machine Learning", color: "#7fb8ff", height: 108 },
  { label: "Agentic AI", color: "#c6a6ff", height: 122 },
  { label: "Open Source", color: "#ffbf7f", height: 112 },
];

export default function BlogTeaser({ posts }: { posts: Pick<Post, "slug" | "title" | "category" | "date">[] }) {
  return (
    <section id="blog" className="section">
      <header className="section-head">
        <h2 className="section-title">Byte Blog</h2>
        <p className="section-lede">
          Four books: Web Dev, Machine Learning, Agentic AI and Open Source.
          Notes on what the club&apos;s been building and learning.
        </p>
      </header>

      <div
        className="grid gap-10 rounded-xl p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)" }}>
            Latest posts
          </h3>
          {posts.length === 0 ? (
            <p className="mt-4 text-base" style={{ color: "var(--ink-muted)" }}>
              The first posts are being written.
            </p>
          ) : (
            <ul className="mt-2">
              {posts.map((post) => (
                <li key={post.slug} className="border-b last:border-b-0" style={{ borderColor: "var(--line)" }}>
                  <Link href={`/blog/${post.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                    <span>
                      <span
                        className="block text-lg font-medium leading-snug transition-colors group-hover:text-[var(--accent)]"
                        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                      >
                        {post.title}
                      </span>
                      <span className="mt-1 block text-sm" style={{ color: "var(--ink-muted)" }}>
                        {CATEGORY_LABEL[post.category]}
                        {post.date && ` · ${postDate(post.date)}`}
                      </span>
                    </span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1" style={{ color: "var(--accent)" }}>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link href="/blog" className="group flex flex-col items-start gap-5 md:items-center">
          <div aria-hidden>
            <div className="flex items-end gap-3">
              {BOOKS.map((book, i) => (
                <div
                  key={book.label}
                  className="relative w-12 overflow-hidden rounded-t-[3px] rounded-b-[1px] transition-transform duration-300 group-hover:-translate-y-2.5"
                  style={{
                    height: book.height,
                    transitionDelay: `${i * 45}ms`,
                    background: `linear-gradient(100deg, ${book.color} 0%, ${book.color} 80%, rgba(10,11,13,0.35) 81%, rgba(10,11,13,0.35) 84%, #f4efe4 85%, #f4efe4 100%)`,
                    boxShadow: "3px 7px 16px -6px rgba(0,0,0,0.7)",
                  }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center px-1 text-center uppercase"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: "rgba(10,11,13,0.68)",
                      writingMode: "vertical-rl",
                    }}
                  >
                    {book.label}
                  </span>
                </div>
              ))}
            </div>
            {/* shelf ledge the books rest on */}
            <div
              className="h-2 rounded-[2px]"
              style={{
                background: "linear-gradient(180deg, #3a2a1a 0%, #2a1d11 100%)",
                boxShadow: "0 6px 14px -4px rgba(0,0,0,0.6)",
              }}
            />
          </div>
          <span className="btn btn-ghost">
            Open the shelf
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
