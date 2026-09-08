"use client";

import Link from "next/link";

const BOOKS = [
  { label: "Web Dev", color: "#28c2ff" },
  { label: "Machine Learning", color: "#7fb8ff" },
  { label: "Agentic AI", color: "#c6a6ff" },
  { label: "Open Source", color: "#ffbf7f" },
];

export default function BlogTeaser() {
  return (
    <Link
      href="/blog"
      className="group block rounded-[24px] p-8 md:p-12 transition-colors duration-300"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--line)" }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-lg">
          <p
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
            className="text-[11px] uppercase tracking-[0.2em] mb-3"
          >
            The Byte Shelf
          </p>
          <h3
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            className="text-2xl md:text-3xl font-bold leading-tight mb-3"
          >
            Four books. Every post we've written.
          </h3>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-muted)" }} className="text-sm leading-relaxed">
            Web Dev, Machine Learning, Agentic AI, and Open Source — pick a
            book, flip it open, and read what the club's been building and
            learning.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {BOOKS.map((book) => (
            <div
              key={book.label}
              className="w-9 h-14 rounded-sm transition-transform duration-300 group-hover:-translate-y-1"
              style={{ background: book.color, opacity: 0.85 }}
              title={book.label}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ink)" }}>
        Open the shelf
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
