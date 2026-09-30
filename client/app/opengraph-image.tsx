import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "The Byte Club, NIE's student-run tech club";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    label: "NIE",
    title: "Write real code. Build real things.",
    sub: "Hands-on tech events for NIE students, open to all years.",
  });
}
