import fs from "node:fs";
import path from "node:path";

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
}

export const CATEGORY_LABEL: Record<string, string> = {
  webdev: "Web Dev",
  ml: "Machine Learning",
  "agentic-ai": "Agentic AI",
  opensource: "Open Source",
};

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
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const postDate = (date: string) =>
  date ? new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

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
