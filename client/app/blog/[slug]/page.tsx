import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "github-markdown-css/github-markdown-dark.css";
import "highlight.js/styles/github-dark-dimmed.css";
import { CATEGORY_LABEL, excerpt, postDate, readPosts, renderPost } from "@/lib/posts";
import { ReadingProgress, ShareButton, Toc } from "./PostTools";

// Only the .md files in content/blog exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return readPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = readPosts().find((p) => p.slug === slug);
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
  const { slug } = await params;
  const posts = readPosts(); // newest first
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const { html, toc } = renderPost(post.content);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <style>{POST_CSS}</style>
      <ReadingProgress />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logo/logo-128.png" alt="" className="h-9 w-9 object-contain" />
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            The Byte Club
          </span>
        </Link>
        <Link href="/blog" className="btn btn-ghost" style={{ minHeight: 40, fontSize: 14 }}>
          All posts
        </Link>
      </header>

      <div className="post-layout mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <article className="min-w-0">
          <p className="text-sm" style={{ color: "var(--accent)" }}>
            {CATEGORY_LABEL[post.category]}
            <span style={{ color: "var(--ink-muted)" }}>
              {post.date && ` · ${postDate(post.date)}`} · {post.minutes} min read
            </span>
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
          <div className="mt-6">
            <ShareButton title={post.title} />
          </div>

          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image} alt="" className="mt-10 w-full rounded-xl object-cover" style={{ maxHeight: 440 }} />
          )}

          <div className="mt-10 lg:hidden">
            <Toc items={toc} compact />
          </div>

          <div
            id="post-body"
            className="markdown-body mt-10 border-t pt-10"
            style={{ borderColor: "var(--line)" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {(newer || older) && (
            <nav aria-label="More posts" className="mt-16 grid gap-3 sm:grid-cols-2">
              {older && (
                <Link href={`/blog/${older.slug}`} className="post-nav">
                  <span>← Older</span>
                  {older.title}
                </Link>
              )}
              {newer && (
                <Link href={`/blog/${newer.slug}`} className="post-nav sm:col-start-2 sm:text-right">
                  <span>Newer →</span>
                  {newer.title}
                </Link>
              )}
            </nav>
          )}

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={{ borderColor: "var(--line)" }}>
            <Link href="/blog" className="text-sm font-medium" style={{ color: "var(--accent)" }}>
              ← Back to the shelf
            </Link>
            <Link href="/#join" className="btn btn-primary">
              Join the club
            </Link>
          </div>
        </article>

        <aside className="post-aside hidden lg:block">
          <Toc items={toc} />
        </aside>
      </div>
    </div>
  );
}

const POST_CSS = `
.read-progress { position: fixed; top: 0; left: 0; right: 0; z-index: 60; height: 3px; background: var(--accent); transform: scaleX(0); transform-origin: left; box-shadow: 0 0 10px rgba(40,194,255,0.6); }

.post-layout { display: grid; gap: 64px; }
@media (min-width: 1024px) { .post-layout { grid-template-columns: minmax(0, 46rem) 15rem; justify-content: space-between; } }
.post-aside nav { position: sticky; top: 32px; }

#post-body { font-size: 17px; line-height: 1.75; }
#post-body h2, #post-body h3 { position: relative; scroll-margin-top: 24px; font-family: var(--font-display); letter-spacing: -0.015em; color: var(--ink); border: 0; }
#post-body h2 { font-size: 1.6rem; margin-top: 3rem; }
#post-body h3 { font-size: 1.25rem; }
#post-body p, #post-body li { color: rgba(243,245,247,0.86); }
#post-body a { color: var(--accent); }
#post-body ul { list-style: disc; }
#post-body ol { list-style: decimal; }
#post-body li::marker { color: var(--accent); }
#post-body code:not(pre code) { background: rgba(40,194,255,0.1); color: var(--accent-strong); padding: 0.15em 0.4em; border-radius: 6px; font-size: 0.88em; }
.heading-anchor { position: absolute; left: -1.1em; padding-right: 0.3em; color: var(--accent) !important; text-decoration: none; opacity: 0; transition: opacity 0.2s ease; }
#post-body h2:hover .heading-anchor, #post-body h3:hover .heading-anchor { opacity: 1; }

#post-body pre { position: relative; padding: 18px 20px; border-radius: 12px; background: #1c2128 !important; border: 1px solid var(--line); font-size: 14px; line-height: 1.6; }
#post-body pre code.hljs { background: transparent; padding: 0; }
#post-body pre[data-lang]:not([data-lang=""])::before { content: attr(data-lang); position: absolute; top: 10px; right: 76px; font-family: var(--font-mono); font-size: 12px; color: var(--ink-faint); text-transform: lowercase; }
.code-copy { position: absolute; top: 8px; right: 8px; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--line-strong); background: #0d1117; color: var(--ink-muted); font-family: var(--font-body); font-size: 12px; font-weight: 600; transition: color 0.2s ease, border-color 0.2s ease; }
.code-copy:hover { color: var(--ink); border-color: var(--accent); }

.toc-title, .toc-compact summary { font-size: 13px; font-weight: 600; color: var(--ink); }
.toc-list { display: grid; gap: 2px; margin-top: 12px; border-left: 1px solid var(--line); }
.toc-list a { display: block; margin-left: -1px; padding: 6px 0 6px 14px; border-left: 2px solid transparent; font-size: 14px; line-height: 1.4; color: var(--ink-muted); transition: color 0.2s ease, border-color 0.2s ease; }
.toc-list a:hover { color: var(--ink); }
.toc-list a.is-active { color: var(--accent); border-left-color: var(--accent); }
.toc-sub a { padding-left: 26px; font-size: 13px; }
.toc-compact { padding: 14px 16px; border-radius: 12px; border: 1px solid var(--line); background: var(--bg-elevated); }
.toc-compact summary { cursor: pointer; }

.post-nav { display: grid; gap: 6px; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--line); background: var(--bg-elevated); font-family: var(--font-display); font-weight: 500; color: var(--ink); transition: border-color 0.2s ease; }
.post-nav span { font-family: var(--font-body); font-size: 13px; font-weight: 500; color: var(--ink-muted); }
.post-nav:hover { border-color: var(--accent-border); }
`;
