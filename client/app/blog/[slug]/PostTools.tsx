"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Share2 } from "lucide-react";
import type { TocItem } from "@/lib/posts";

const BODY_ID = "post-body";

/* Reading progress bar + copy buttons on code blocks. */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = document.getElementById(BODY_ID);
    if (!body) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = body.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight * 0.6)));
      barRef.current!.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    // Copy button on every code block (added here so the server HTML stays plain).
    const buttons = [...body.querySelectorAll("pre")].map((pre) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector("code")?.innerText ?? pre.innerText);
          btn.textContent = "Copied";
        } catch {
          btn.textContent = "Press Ctrl+C";
        }
        setTimeout(() => (btn.textContent = "Copy"), 1600);
      });
      pre.appendChild(btn);
      return btn;
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      buttons.forEach((b) => b.remove());
    };
  }, []);

  return <div ref={barRef} className="read-progress" aria-hidden />;
}

/* "On this page" list that follows the heading you're reading. */
export function Toc({ items, compact = false }: { items: TocItem[]; compact?: boolean }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const list = (
    <ol className="toc-list">
      {items.map((item) => (
        <li key={item.id} className={item.depth === 3 ? "toc-sub" : ""}>
          <a href={`#${item.id}`} className={active === item.id ? "is-active" : ""} aria-current={active === item.id ? "location" : undefined}>
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return compact ? (
    <details className="toc-compact">
      <summary>On this page</summary>
      {list}
    </details>
  ) : (
    <nav aria-label="On this page">
      <p className="toc-title">On this page</p>
      {list}
    </nav>
  );
}

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) return await navigator.share({ title, url });
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // share sheet dismissed
    }
  };
  return (
    <button type="button" onClick={share} className="btn btn-ghost" style={{ minHeight: 40, fontSize: 14 }}>
      {copied ? <Link2 size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
