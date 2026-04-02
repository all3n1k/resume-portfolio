"use client";

import { useEffect, useRef, useCallback } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]=/";

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  age: number;
}

interface MatrixCanvasProps {
  opacity?: number;
  speed?: number;
  density?: number;
  mouseTrail?: boolean;
}

export default function MatrixCanvas({ 
  opacity = 0.15, 
  speed = 35,
  density = 0.02,
  mouseTrail = true 
}: MatrixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const mouseTrailRef = useRef<TrailPoint[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

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

    // Draw mouse trail
    if (mouseTrail && mouseTrailRef.current.length > 0) {
      mouseTrailRef.current.forEach((point, idx) => {
        const trailOpacity = point.opacity * 0.6;
        const brightness = point.opacity;
        
        // Bright head of trail
        ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity * brightness})`;
        ctx.font = `bold ${FONT_SIZE + 2}px monospace`;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], point.x, point.y);
        
        // Green body
        ctx.fillStyle = `rgba(0, 255, 65, ${trailOpacity * 0.8})`;
        ctx.font = `bold ${FONT_SIZE}px monospace`;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], point.x - 2, point.y - FONT_SIZE);
        
        // Dim tail
        ctx.fillStyle = `rgba(0, 204, 51, ${trailOpacity * 0.5})`;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], point.x + 2, point.y - FONT_SIZE * 2);
        
        // Update point
        point.age++;
        point.opacity = Math.max(0, point.opacity - 0.015);
      });
      
      // Remove dead points
      mouseTrailRef.current = mouseTrailRef.current.filter(p => p.opacity > 0);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [density, speed, mouseTrail]);

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

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseTrail) return;
      
      const current = { x: e.clientX, y: e.clientY };
      
      if (lastMouseRef.current) {
        const dx = current.x - lastMouseRef.current.x;
        const dy = current.y - lastMouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const numPoints = Math.min(Math.floor(distance / 8), 20);
        
        for (let i = 1; i <= numPoints; i++) {
          const t = i / (numPoints + 1);
          mouseTrailRef.current.push({
            x: lastMouseRef.current.x + dx * t,
            y: lastMouseRef.current.y + dy * t,
            opacity: 1,
            age: 0,
          });
        }
      }
      
      lastMouseRef.current = current;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw, mouseTrail]);

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
