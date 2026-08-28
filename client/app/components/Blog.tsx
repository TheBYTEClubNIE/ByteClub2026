"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "github-markdown-css/github-markdown.css";
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

interface Blog {
  blog_id: number;
  title: string;
  content: string;
  created_at: string;
  full_name: string;
}

function getExcerpt(markdown: string, maxLength = 200): string {
  // Strip markdown syntax for plain text preview
  const plain = markdown
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*|__|\*|_|~~|`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/>\s+/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > maxLength ? plain.slice(0, maxLength) + "…" : plain;
}

function BlogCard({ blog, onClick }: { blog: Blog; onClick: () => void }) {
  const excerpt = getExcerpt(blog.content);
  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-[24px] border border-cyan-400/10 bg-[#020812]/80 backdrop-blur-xl p-7 md:p-9 cursor-pointer transition-all duration-300"
      style={{
        boxShadow: "0 0 20px rgba(0,212,255,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 40px rgba(0,212,255,0.12), inset 0 0 20px rgba(0,212,255,0.04)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(0,212,255,0.25)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px rgba(0,212,255,0.04)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(0,212,255,0.1)";
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-10 right-10 h-[1px] transition-opacity duration-300 opacity-40 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(0,255,200,0.4), transparent)",
        }}
      />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,212,255,0.04), transparent 60%)",
        }}
      />

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className="text-cyan-300 text-xs"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {blog.full_name}
        </span>
        <span className="text-cyan-500">•</span>
        <span
          className="text-cyan-200/60 text-xs"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {new Date(blog.created_at).toDateString()}
        </span>
        <span className="text-cyan-500">•</span>
        <span
          className="text-cyan-200/50 text-xs"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {readTime} min read
        </span>
      </div>

      {/* Title */}
      <h2
        className="text-2xl md:text-3xl text-white mb-4 leading-tight transition-colors duration-200 group-hover:text-cyan-100"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          textShadow: "0 0 12px rgba(255,255,255,0.1)",
        }}
      >
        {blog.title}
      </h2>

      {/* Excerpt */}
      <p
        className="text-sm leading-relaxed mb-6"
        style={{
          color: "rgba(180,220,230,0.65)",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        {excerpt}
      </p>

      {/* Read more */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          READ FULL ARTICLE
        </span>
        <svg
          className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

function BlogDetail({ blog, onBack }: { blog: Blog; onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 group"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        <svg
          className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-xs text-cyan-400 group-hover:text-cyan-300 transition-colors">
          BACK TO BLOGS
        </span>
      </button>

      {/* Article card */}
      <div
        className="relative overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[#020812]/90 backdrop-blur-xl p-8 md:p-12"
        style={{
          boxShadow:
            "0 0 60px rgba(0,212,255,0.08), inset 0 0 30px rgba(0,212,255,0.03)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-10 right-10 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,255,0.5), rgba(0,255,200,0.4), transparent)",
          }}
        />

        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.05), transparent 50%)",
          }}
        />

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className="text-cyan-300 text-xs"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {blog.full_name}
          </span>
          <span className="text-cyan-500">•</span>
          <span
            className="text-cyan-200/60 text-xs"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            {new Date(blog.created_at).toDateString()}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-6xl text-white mb-10 leading-tight"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow:
              "0 0 16px rgba(255,255,255,0.18), 0 0 40px rgba(0,212,255,0.15)",
          }}
        >
          {blog.title}
        </h1>

        {/* Divider */}
        <div
          className="w-full h-[1px] mb-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,212,255,0.3), rgba(0,255,200,0.2), transparent)",
          }}
        />

        {/* Full content */}
        <article
          className="markdown-body"
          style={{ background: "transparent" }}
          dangerouslySetInnerHTML={{
            __html: marked(blog.content) as string,
          }}
        />
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://byteclub2026.onrender.com/blog");
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-20 text-white">
      {!selectedBlog ? (
        <>
          {/* ── HEADER ── */}
          <div className="max-w-6xl mx-auto mb-16">
            <div
              className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[#020812]/90 backdrop-blur-xl p-8 md:p-10"
              style={{
                boxShadow:
                  "0 0 40px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.04)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,212,255,0.05), transparent 50%)",
                }}
              />
              <div
                className="absolute top-0 left-10 right-10 h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), rgba(0,255,200,0.4), transparent)",
                }}
              />
              <p
                className="mb-3"
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(0,212,255,0.65)",
                  letterSpacing: "0.18em",
                }}
              >
                BYTE.BLOGS
              </p>
              <h1
                className="text-5xl md:text-7xl font-black text-white leading-none mb-6"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow:
                    "0 0 16px rgba(255,255,255,0.22), 0 0 40px rgba(0,212,255,0.18)",
                }}
              >
                BYTE ARTICLES
              </h1>
              <p
                className="max-w-2xl leading-relaxed"
                style={{ color: "rgba(180,220,230,0.7)", fontSize: "15px" }}
              >
                Read technical blogs, tutorials, cybersecurity insights,
                hackathon experiences, and innovation stories from The Byte Club
                community.
              </p>
              <div
                className="absolute -bottom-6 left-20 right-20 h-10 rounded-full blur-3xl"
                style={{ background: "rgba(0,212,255,0.08)" }}
              />
            </div>
          </div>

          {/* ── BLOG CARDS ── */}
          <div className="max-w-6xl mx-auto space-y-6">
            {loading ? (
              <div
                className="text-center text-cyan-300 py-20"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                Loading blogs...
              </div>
            ) : blogs.length === 0 ? (
              <div
                className="text-center text-cyan-300/70 py-20"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                No blogs available.
              </div>
            ) : (
              blogs.map((blog) => (
                <BlogCard
                  key={blog.blog_id}
                  blog={blog}
                  onClick={() => setSelectedBlog(blog)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <BlogDetail
          blog={selectedBlog}
          onBack={() => setSelectedBlog(null)}
        />
      )}
    </div>
  );
}
