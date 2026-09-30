import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 is used for faces and full-screen event photos, 75 everywhere else.
    qualities: [75, 90],
    // AVIF first: noticeably sharper than JPEG/WebP at the same file size.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
