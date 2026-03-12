"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MatrixOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center mix-blend-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        className="flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-widest text-[#00ff41] uppercase drop-shadow-[0_0_15px_rgba(0,255,65,0.8)]" style={{ fontFamily: "monospace" }}>
          Welcome to
        </h1>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-[#00ff41] uppercase drop-shadow-[0_0_20px_rgba(0,255,65,0.9)]" style={{ fontFamily: "monospace" }}>
          Allen&apos;s Mainframe
        </h1>
      </motion.div>
    </div>
  );
}
