import { OG_SIZE, ogCard } from "@/lib/og";
import { CATEGORY_LABEL, postDate, readPosts } from "@/lib/posts";

export const alt = "Byte Blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return readPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = readPosts().find((p) => p.slug === slug);
  return ogCard({
    label: "Byte Blog",
    title: post?.title ?? "Byte Blog",
    sub: post ? `${CATEGORY_LABEL[post.category]}${post.date ? ` · ${postDate(post.date)}` : ""}` : "",
  });
}
