"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

interface HeroSectionProps {
  name: string;
  tagline: string;
}

function TerminalBlock() {
  const lines = [
    { prefix: "~", cmd: "whoami", delay: 0 },
    { prefix: "", cmd: "allen — security researcher / full-stack engineer", delay: 600 },
    { prefix: "~", cmd: "cat skills.log", delay: 1200 },
    { prefix: "", cmd: "React · Node · Go · Python · AWS · Metasploit · Ghidra · Frida", delay: 1800 },
    { prefix: "~", cmd: "cat journey.log", delay: 2400 },
    { prefix: "", cmd: "hardware modder → reverse engineer → security researcher → full-stack architect", delay: 3000 },
    { prefix: "~", cmd: "uptime", delay: 3600 },
    { prefix: "", cmd: "10+ years building, breaking, and securing systems since 2014", delay: 4200 },
  ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = lines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), lines[i].delay)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative font-mono text-sm">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-green-500/20 via-green-500/5 to-transparent" />
      <div className="relative rounded-2xl border border-white/10 bg-black/80 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-white/30 text-xs ml-2">allen@matrix — zsh</span>
        </div>
        {/* Body */}
        <div className="p-5 space-y-1 min-h-[180px]">
          {lines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={line.prefix ? "text-white/80" : "text-green-400/70 pl-4"}
            >
              {line.prefix && (
                <span className="text-green-400 mr-2">
                  <span className="text-cyan-400">{">"}</span> {line.prefix}
                </span>
              )}
              {line.cmd}
            </motion.div>
          ))}
          {visibleLines < lines.length && (
            <span className="inline-block w-2.5 h-5 bg-green-400 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
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
      <div className="px-3 py-2 rounded-lg bg-green-500/[0.06] border border-green-500/10 font-mono text-[11px] text-green-500/40 whitespace-pre">
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
      {/* Radial glow behind name */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-green-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/[0.04]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-400 text-xs font-mono tracking-widest uppercase">Available for work</span>
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
                  className="flex items-baseline gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02]"
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
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-black bg-gradient-to-r from-green-400 to-emerald-400 hover:brightness-110 transition-all shadow-lg shadow-green-500/20"
              >
                View Work
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/80 transition-all"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>

          {/* Right — Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <TerminalBlock />
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
