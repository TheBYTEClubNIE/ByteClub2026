"use client";

import dynamic from "next/dynamic";

// The 3D background (three.js + gsap) is the heaviest script on the page.
// Loading it separately lets the text and buttons appear and respond first;
// the background fades in a moment later.
const StoryCorridor = dynamic(() => import("./StoryCorridor"), { ssr: false });

export default function LazyCorridor() {
  return <StoryCorridor />;
}
