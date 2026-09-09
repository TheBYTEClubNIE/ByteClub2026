"use client";

import Link from "next/link";

const BOOKS = [
  { label: "Web Dev", color: "#28c2ff", height: 128 },
  { label: "Machine Learning", color: "#7fb8ff", height: 108 },
  { label: "Agentic AI", color: "#c6a6ff", height: 122 },
  { label: "Open Source", color: "#ffbf7f", height: 112 },
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
            Web Dev, Machine Learning, Agentic AI, and Open Source: pick a
            book, flip it open, and read what the club's been building and
            learning.
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex items-end gap-3">
            {BOOKS.map((book, i) => (
              <div
                key={book.label}
                className="relative w-12 rounded-t-[3px] rounded-b-[1px] overflow-hidden transition-transform duration-300 group-hover:-translate-y-2.5"
                style={{
                  height: book.height,
                  transitionDelay: `${i * 45}ms`,
                  background: `linear-gradient(100deg, ${book.color} 0%, ${book.color} 80%, rgba(10,11,13,0.35) 81%, rgba(10,11,13,0.35) 84%, #f4efe4 85%, #f4efe4 100%)`,
                  boxShadow: "3px 7px 16px -6px rgba(0,0,0,0.7)",
                }}
                title={book.label}
              >
                <span
                  className="absolute inset-0 flex items-center justify-center uppercase text-center px-1"
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
            className="mt-0 h-2 rounded-[2px]"
            style={{
              background: "linear-gradient(180deg, #3a2a1a 0%, #2a1d11 100%)",
              boxShadow: "0 6px 14px -4px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </div>

      <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ink)" }}>
        Open the shelf
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
