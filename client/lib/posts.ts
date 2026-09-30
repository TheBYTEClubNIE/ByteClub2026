import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import hljs from "highlight.js";
import { CATEGORY_LABEL, postDate } from "./blog-meta";

// To publish a post: drop a .md file into client/content/blog/.
// Optional frontmatter at the top of the file:
//   ---
//   category: webdev        (webdev | ml | agentic-ai | opensource, default webdev)
//   date: 2026-09-24
//   title: Overrides the first "# Heading"
//   image: /blog/cover.jpg  (optional cover, file goes in client/public/)
//   ---

export interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  image?: string;
  content: string;
  minutes: number;
}

export { CATEGORY_LABEL, postDate };

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export function readPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");

      const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
      const meta: Record<string, string> = {};
      for (const line of frontmatter?.[1].split(/\r?\n/) ?? []) {
        const i = line.indexOf(":");
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      }

      let content = frontmatter ? raw.slice(frontmatter[0].length) : raw;
      const heading = content.match(/^\s*#\s+(.+)\r?\n?/);
      if (heading) content = content.slice(heading[0].length);

      return {
        slug,
        title: meta.title || heading?.[1].trim() || slug.replace(/[-_]/g, " "),
        category: CATEGORY_LABEL[meta.category] ? meta.category : "webdev",
        date: meta.date || "",
        image: meta.image || undefined,
        content: content.trim(),
        minutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s: string) => s.replace(/\]\([^)]*\)/g, "]").replace(/[`*_~[\]]/g, "").trim();

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

// Markdown -> HTML with linkable headings (collected into a table of
// contents) and code highlighted here on the server, so readers download
// no highlighter.
export function renderPost(markdown: string) {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const md = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      heading({ tokens, depth, text }) {
        const base = plain(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
        const n = used.get(base) ?? 0;
        used.set(base, n + 1);
        const id = n ? `${base}-${n}` : base;
        if (depth === 2 || depth === 3) toc.push({ id, text: plain(text), depth });
        return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const language = lang && hljs.getLanguage(lang) ? lang : "";
        const body = language ? hljs.highlight(text, { language }).value : escapeHtml(text);
        return `<pre data-lang="${escapeHtml(language || lang || "")}"><code class="hljs${language ? ` language-${language}` : ""}">${body}</code></pre>\n`;
      },
    },
  });
  return { html: md.parse(markdown, { async: false }), toc };
}

// First paragraph of plain text, for previews and link cards.
export function excerpt(markdown: string, max = 160) {
  const para =
    markdown
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .find((p) => p && !/^(#|!\[|```|>|\||[-*] )/.test(p)) ?? "";
  const text = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}
