"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";
import TypewriterText from "./TypewriterText";

interface HeroSectionProps {
  name: string;
  tagline: string;
}

export default function HeroSection({ name, tagline }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5">
            <span className="text-green-400 text-sm font-mono tracking-wider">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              SYSTEM ONLINE
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter"
        >
          <GlitchText text={name} intensity="low" />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl text-green-400/80 font-mono">
            <TypewriterText 
              text={tagline} 
              speed={40} 
              delay={800}
              cursorChar={showCursor ? "█" : " "}
            />
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {[
            { label: "Experience", value: "8+", unit: "Years" },
            { label: "Projects", value: "50+", unit: "Shipped" },
            { label: "Impact", value: "1M+", unit: "Users" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
              <div className="relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                  <span className="text-green-400 text-lg ml-1">{stat.unit}</span>
                </div>
                <div className="text-sm text-white/50 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a 
            href="#achievements"
            className="group relative px-8 py-4 rounded-xl font-semibold text-black overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400" />
            <div className="absolute inset-[2px] bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl" />
            <span className="relative flex items-center gap-2">
              Enter the Matrix
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
          
          <button className="group relative px-8 py-4 rounded-xl font-semibold border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
            <span className="flex items-center gap-2">
              Download CV
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-16"
        >
          <div className="text-xs text-white/30 uppercase tracking-widest mb-4">Scroll to explore</div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block"
          >
            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
