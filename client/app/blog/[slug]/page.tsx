import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import "github-markdown-css/github-markdown-dark.css";
import { CATEGORY_LABEL, excerpt, postDate, readPosts } from "@/lib/posts";

// Only the .md files in content/blog exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return readPosts().map((post) => ({ slug: post.slug }));
}

const findPost = (slug: string) => readPosts().find((post) => post.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = findPost((await params).slug);
  if (!post) return {};
  const description = excerpt(post.content);
  return {
    title: post.title,
    description,
    openGraph: { type: "article", title: post.title, description, publishedTime: post.date || undefined },
    twitter: { card: "summary_large_image", title: post.title, description },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  const html = marked(post.content, { gfm: true, breaks: true, async: false });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logo/logo-transparent.png" alt="" className="h-9 w-9 object-contain" />
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            The Byte Club
          </span>
        </Link>
        <Link href="/blog" className="btn btn-ghost" style={{ minHeight: 40, fontSize: 14 }}>
          All posts
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <p className="text-sm" style={{ color: "var(--accent)" }}>
          {CATEGORY_LABEL[post.category]}
          {post.date && <span style={{ color: "var(--ink-muted)" }}> · {postDate(post.date)}</span>}
        </p>
        <h1
          className="mt-3 text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(2rem, 6vw, 3.25rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
          }}
        >
          {post.title}
        </h1>

        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt="" className="mt-10 w-full rounded-xl object-cover" style={{ maxHeight: 440 }} />
        )}

        <div
          className="markdown-body mt-10 border-t pt-10"
          style={{ borderColor: "var(--line)", fontSize: 17 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={{ borderColor: "var(--line)" }}>
          <Link href="/blog" className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            ← Back to the shelf
          </Link>
          <Link href="/#join" className="btn btn-primary">
            Join the club
          </Link>
        </div>
      </article>
    </div>
  );
}
