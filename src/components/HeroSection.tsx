"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

interface HeroSectionProps {
  name: string;
  tagline: string;
}


function FloatingCodeSnippet({ code, x, y, delay }: { code: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      className="absolute hidden lg:block pointer-events-none select-none"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-2 rounded-none bg-black border border-green-500/20 font-mono text-[11px] text-green-500/40 whitespace-pre shadow-[4px_4px_0_rgba(0,255,65,0.1)]">
        {code}
      </div>
    </motion.div>
  );
}

export default function HeroSection({ name, tagline }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Removed soft radial glow and local grid for structural UI style */}

      {/* Floating code snippets — positioned in far margins to avoid content overlap */}
      <FloatingCodeSnippet code={"const status = 'online';"} x="1%" y="12%" delay={1.5} />
      <FloatingCodeSnippet code={"// TODO: hack the planet"} x="82%" y="8%" delay={2.0} />
      <FloatingCodeSnippet code={"await deploy(future);"} x="88%" y="78%" delay={2.5} />
      <FloatingCodeSnippet code={"if (problem) solve();"} x="1%" y="82%" delay={1.8} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left — Identity */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none border border-green-500/30 bg-black">
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse absolute inline-flex h-full w-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-green-400" />
                </span>
                <span className="text-green-400 text-xs font-mono tracking-widest uppercase">[ STATUS: ONLINE ]</span>
              </div>
            </motion.div>




            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-6"
            >
              <GlitchText text={name} intensity="low" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-white/50 max-w-md leading-relaxed mb-8"
            >
              {tagline}
            </motion.p>

            {/* Stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {[
                { value: "8+", label: "Years" },
                { value: "50+", label: "Projects" },
                { value: "1M+", label: "Users Impacted" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline gap-2 px-4 py-2 rounded-none border border-white/10 bg-black shadow-[2px_2px_0_rgba(255,255,255,0.05)]"
                >
                  <span className="text-xl font-bold text-white">{stat.value}</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#achievements"
                className="group relative font-mono inline-flex items-center gap-2 px-7 py-3.5 rounded-none text-green-400 bg-black border border-green-500/40 hover:bg-green-500/10 transition-all uppercase tracking-widest text-sm"
              >
                $ execute --view-work
                <span className="w-2 h-4 bg-green-400 animate-pulse ml-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex font-mono items-center gap-2 px-7 py-3.5 rounded-none border border-white/20 bg-black hover:bg-white/5 text-white/80 transition-all uppercase tracking-widest text-sm"
              >
                initiate_contact()
              </a>
            </motion.div>
          </div>

          {/* Right — Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="relative flex items-end justify-center"
          >
            {/* Ambient glow removed for structural UI style */}
            
            {/* Portrait container */}
            <div className="relative w-full max-w-[420px] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/allen-portrait.png" 
                alt="Allen - Security Researcher & Full-Stack Engineer"
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                style={{ 
                  filter: "contrast(1.08) saturate(0.9)",
                  maxHeight: "75vh",
                }}
              />
              
              {/* CRT scanline overlay */}
              <div 
                className="absolute inset-0 z-20 pointer-events-none opacity-[0.08]"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.08) 2px, rgba(0,255,65,0.08) 4px)",
                }}
              />

              {/* Bottom fade into page background */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

              {/* Subtle green edge glow on hover */}
              <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  boxShadow: "inset 0 0 80px rgba(0,255,65,0.07)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-mono">scroll</span>
          <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
