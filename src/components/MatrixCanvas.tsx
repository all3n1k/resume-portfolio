"use client";

import { useEffect, useRef, useCallback } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]=/";

interface MatrixCanvasProps {
  opacity?: number;
  speed?: number;
  density?: number;
}

export default function MatrixCanvas({ 
  opacity = 0.15, 
  speed = 35,
  density = 0.02 
}: MatrixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (timestamp - lastTimeRef.current < speed) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }
    lastTimeRef.current = timestamp;

    const W = canvas.width;
    const H = canvas.height;
    const FONT_SIZE = 14;
    const COL_W = FONT_SIZE * 1.2;

    ctx.fillStyle = `rgba(0, 0, 0, ${density})`;
    ctx.fillRect(0, 0, W, H);

    ctx.font = `bold ${FONT_SIZE}px monospace`;

    dropsRef.current.forEach((y, i) => {
      const x = i * COL_W;
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      const brightness = Math.random();
      if (brightness > 0.98) {
        ctx.fillStyle = "#ffffff";
      } else if (brightness > 0.85) {
        ctx.fillStyle = "#00ff41";
      } else if (brightness > 0.7) {
        ctx.fillStyle = "#00cc33";
      } else {
        ctx.fillStyle = "#009922";
      }

      ctx.fillText(char, x, y * FONT_SIZE);

      if (y * FONT_SIZE > H && Math.random() > 0.975) {
        dropsRef.current[i] = 0;
      }
      dropsRef.current[i]++;
    });

    rafRef.current = requestAnimationFrame(draw);
  }, [density, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const COL_W = 16.8;
      const cols = Math.ceil(window.innerWidth / COL_W);
      dropsRef.current = Array.from({ length: cols }, () => Math.random() * -50);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}
