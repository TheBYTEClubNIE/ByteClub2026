import type { Metadata } from "next";
import BlogShelf from "./BlogShelf";
import { readPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Byte Blog",
  description: "Notes from The Byte Club on web dev, machine learning, agentic AI and open source.",
};

export default function BlogPage() {
  // The shelf only needs titles; post bodies stay on their own pages.
  const posts = readPosts().map(({ content: _content, ...post }) => post);
  return <BlogShelf posts={posts} />;
}
