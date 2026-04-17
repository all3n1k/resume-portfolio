"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EntrySplashProps {
  onInitializeAudio: () => void;
  onComplete: () => void;
}

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface Particle {
  x: number;
  y: number;
  char: string;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  life: number;
}

export default function EntrySplash({ onInitializeAudio, onComplete }: EntrySplashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicked, setClicked] = useState(false);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number | undefined>(undefined);

  // Particle system initialization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const spacing = 28;
    const cols = Math.floor(W / spacing);
    const rows = Math.floor(H / spacing);
    const offsetX = (W - cols * spacing) / 2;
    const offsetY = (H - rows * spacing) / 2;

    const pts: Particle[] = [];
    const centerX = W / 2;
    const centerY = H / 2;
    const safeZoneW = 320; // Width of the UI area to keep clear
    const safeZoneH = 180; // Height of the UI area to keep clear

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = offsetX + i * spacing;
        const y = offsetY + j * spacing;

        // Skip particles that would be directly behind the center UI button/text
        if (
          Math.abs(x - centerX) < safeZoneW / 2 &&
          Math.abs(y - centerY) < safeZoneH / 2
        ) {
          continue;
        }

        pts.push({
          x,
          y,
          char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          vx: 0,
          vy: 0,
          opacity: 0.4 + Math.random() * 0.4,
          size: 14 + Math.random() * 4,
          life: 1
        });
      }
    }
    particles.current = pts;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.font = "bold 16px monospace";

      particles.current.forEach((p) => {
        if (clicked) {
          p.x += p.vx;
          p.y += p.vy;
          p.opacity -= 0.015;
          p.life -= 0.015;
          // Add a bit of rotation/wobble
          p.vx *= 1.01;
          p.vy *= 1.01;
        }

        if (p.life > 0) {
          ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity})`;
          ctx.fillText(p.char, p.x, p.y);
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [clicked]);

  const handleEnter = () => {
    if (clicked) return;
    setClicked(true);
    onInitializeAudio();

    // Give particles an "explosion" velocity
    const W = window.innerWidth;
    const H = window.innerHeight;
    const centerX = W / 2;
    const centerY = H / 2;

    particles.current.forEach(p => {
      const dx = p.x - centerX;
      const dy = p.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = 4 + (Math.random() * 8); // Variation in speed
      
      // Normalized direction * force
      p.vx = (dx / (dist || 1)) * force;
      p.vy = (dy / (dist || 1)) * force;
    });

    // Cleanup splash after animation finishes
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: clicked ? "transparent" : "black" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      <AnimatePresence>
        {!clicked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 p-10 rounded-3xl backdrop-blur-md bg-black/40"
          >
            <button
              onClick={handleEnter}
              className="group relative px-12 py-5 bg-black border border-green-500/40 hover:border-green-400 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]"
            >
              <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-400/60" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-400/60" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-400/60" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-400/60" />

              <span className="relative flex items-center gap-4 text-green-400 font-mono text-sm sm:text-lg tracking-[0.3em] uppercase">
                <span className="text-xl font-bold opacity-50 group-hover:opacity-100 transition-opacity">{"["}</span>
                Enter the rabbit hole
                <span className="text-xl font-bold opacity-50 group-hover:opacity-100 transition-opacity">{"]"}</span>
              </span>

              {/* Matrix-style pulse behind */}
              <div className="absolute -inset-1 border border-green-500/20 animate-pulse pointer-events-none" />
            </button>
            
            <div className="mt-8 text-center">
              <span className="text-green-500/30 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                {"//"} Click to initialize visual + audio subsystem
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
