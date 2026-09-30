// Blog bits that are safe to use in the browser (no fs / markdown).

export const CATEGORY_LABEL: Record<string, string> = {
  webdev: "Web Dev",
  ml: "Machine Learning",
  "agentic-ai": "Agentic AI",
  opensource: "Open Source",
};

export const postDate = (date: string) =>
  date ? new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

export interface PostSummary {
  slug: string;
  title: string;
  category: string;
  date: string;
  minutes: number;
  excerpt: string;
}
