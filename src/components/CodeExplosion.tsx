"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

const CODE_CHARS = [
  "{ }", "( )", "[ ]", "< >", "/ *", "+ -", "= =", "! =",
  "&&", "||", "=>", "++", "--", "??", "::",
  "0x", "0b", "///", "/*", "*/", ">>>", "<<=", ">>=",
  "ERR", "OK", "42", "404", "1337", "∞", "λ", "Σ",
  "Δ", "Ω", "α", "β", "γ", "δ", "ε", "ζ",
  "⊕", "⊗", "⊖", "⊙", "○", "●", "◐", "◑",
  "⌘", "⎋", "⌥", "⇧", "⌃", "⎇", "⎈", "⌥",
];

const COLORS = [
  "#00ff41", "#00ff88", "#00ffcc", "#00ccff", "#0099ff",
  "#00ff66", "#33ff00", "#66ff00", "#99ff00", "#ccff00",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CodeExplosion({ trigger }: { trigger?: { x: number; y: number } | null }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const frameRef = useRef<number>(0);

  const createExplosion = useCallback((x: number, y: number) => {
    const count = 40 + Math.floor(Math.random() * 30);
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 8;
      
      newParticles.push({
        id: idRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        char: randomFrom(CODE_CHARS),
        size: 8 + Math.random() * 14,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        opacity: 1,
        color: randomFrom(COLORS),
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    const startTime = performance.now();
    const duration = 1500 + Math.random() * 500;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
        return;
      }

      setParticles((prev) =>
        prev.map((p) => {
          if (!newParticles.includes(p)) return p;
          
          const gravity = 0.15;
          const friction = 0.98;
          
          return {
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy + gravity,
            vx: p.vx * friction,
            vy: p.vy * friction,
            rotation: p.rotation + p.rotationSpeed,
            opacity: 1 - progress,
          };
        })
      );

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (trigger) {
      createExplosion(trigger.x, trigger.y);
    }
  }, [trigger, createExplosion]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: p.opacity }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
            fontFamily: "monospace",
            fontSize: p.size,
            fontWeight: "bold",
            color: p.color,
            textShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
            pointerEvents: "none",
            zIndex: 9999,
            transform: `rotate(${p.rotation}deg)`,
            whiteSpace: "nowrap",
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </AnimatePresence>
  );
}

export function useCodeExplosion() {
  const [trigger, setTrigger] = useState<{ x: number; y: number } | null>(null);
  const [key, setKey] = useState(0);

  const explode = useCallback((e?: MouseEvent) => {
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    setTrigger({ x, y });
    setKey((k) => k + 1);
  }, []);

  const ExplosionComponent = useCallback(
    () => (
      <CodeExplosion key={key} trigger={trigger} />
    ),
    [key, trigger]
  );

  return { explode, ExplosionComponent };
}
