"use client";

import { motion } from "framer-motion";

export default function Logo() {
  return (
    <div className="relative w-90 h-90 flex items-center justify-center">
      
      {/* 🔹 Base Image (static) */}
      <img
        src="/Logo/image.png"
        alt="base logo"
        className="relative top-5 w-full h-full object-contain"
      />
            
      {/* 🔹 Blue Layer (rotating) */}
      <motion.img
        src="/Logo/blue.webp"
        alt="blue layer"
        className="absolute w-[80%] h-[80%] object-contain"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          rotate: {
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          },
        }}
      />

      {/* 🔹 White Layer (outer, same rotation) */}
      <motion.img
        src="/Logo/whitepng.webp"
        alt="white layer"
        className="absolute w-[300%] h-[300%] object-contain"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, rotate: -360 }}
        transition={{
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
          rotate: {
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          },
        }}
      />

    </div>
  );
}