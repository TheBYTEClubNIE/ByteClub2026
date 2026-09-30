import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Bytle, the daily tech word game by The Byte Club";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    label: "Bytle",
    title: "One tech word a day. Six tries.",
    sub: "Crack it, learn what it means, share your grid.",
  });
}
