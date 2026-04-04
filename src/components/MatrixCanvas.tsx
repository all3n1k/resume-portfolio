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
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const mouseTrailRef = useRef<TrailPoint[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  const draw = useCallback((timestamp: number) => {
    const rainCanvas = rainCanvasRef.current;
    const trailCanvas = trailCanvasRef.current;
    if (!rainCanvas) return;

    const rainCtx = rainCanvas.getContext("2d");
    if (!rainCtx) return;

    if (timestamp - lastTimeRef.current < speed) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }
    lastTimeRef.current = timestamp;

    const W = rainCanvas.width;
    const H = rainCanvas.height;
    const FONT_SIZE = 14;
    const COL_W = FONT_SIZE * 1.2;

    // --- Rain layer ---
    rainCtx.fillStyle = `rgba(0, 0, 0, ${density})`;
    rainCtx.fillRect(0, 0, W, H);

    rainCtx.font = `bold ${FONT_SIZE}px monospace`;

    dropsRef.current.forEach((y, i) => {
      const x = i * COL_W;
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      const brightness = Math.random();
      if (brightness > 0.98) {
        rainCtx.fillStyle = "#ffffff";
      } else if (brightness > 0.85) {
        rainCtx.fillStyle = "#00ff41";
      } else if (brightness > 0.7) {
        rainCtx.fillStyle = "#00cc33";
      } else {
        rainCtx.fillStyle = "#009922";
      }

      rainCtx.fillText(char, x, y * FONT_SIZE);

      if (y * FONT_SIZE > H && Math.random() > 0.975) {
        dropsRef.current[i] = 0;
      }
      dropsRef.current[i]++;
    });

    // --- Mouse trail layer (separate canvas, own opacity) ---
    if (mouseTrail && trailCanvas) {
      const trailCtx = trailCanvas.getContext("2d");
      if (trailCtx) {
        // Clear fully each frame — trail persistence comes from point lifespan only
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        // Cap max trail points to keep it short
        if (mouseTrailRef.current.length > 12) {
          mouseTrailRef.current = mouseTrailRef.current.slice(-12);
        }

        mouseTrailRef.current.forEach((point) => {
          const a = point.opacity;

          trailCtx.fillStyle = `rgba(0, 255, 65, ${a})`;
          trailCtx.font = `bold ${FONT_SIZE}px monospace`;
          trailCtx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], point.x, point.y);

          point.age++;
          point.opacity = Math.max(0, point.opacity - 0.06);
        });

        mouseTrailRef.current = mouseTrailRef.current.filter(p => p.opacity > 0);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [density, speed, mouseTrail]);

  useEffect(() => {
    const rainCanvas = rainCanvasRef.current;
    const trailCanvas = trailCanvasRef.current;
    if (!rainCanvas) return;

    const resize = () => {
      rainCanvas.width = window.innerWidth;
      rainCanvas.height = window.innerHeight;
      if (trailCanvas) {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
      }
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
        const numPoints = Math.min(Math.floor(distance / 14), 8);

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
    <>
      {/* Rain background — low opacity */}
      <canvas
        ref={rainCanvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          opacity,
          pointerEvents: "none",
        }}
      />
      {/* Mouse trail — higher opacity so it's actually visible */}
      {mouseTrail && (
        <canvas
          ref={trailCanvasRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            opacity: 0.45,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}
