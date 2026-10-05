"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The 3D background (three.js + gsap) is the heaviest script on the page, so
// it isn't even downloaded until the page has loaded and the browser is idle:
// text, images and buttons come first, and the background fades in after.
const StoryCorridor = dynamic(() => import("./StoryCorridor"), { ssr: false });

export default function LazyCorridor() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Safari has no requestIdleCallback; a short timer stands in
    const ric = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
    let idle = 0;
    let timer = 0;
    const start = () => {
      if (ric) idle = ric(() => setReady(true), { timeout: 2500 });
      else timer = window.setTimeout(() => setReady(true), 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  return ready ? <StoryCorridor /> : null;
}
