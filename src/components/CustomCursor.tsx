"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TRAIL_CHARS = "01アイウエオ";
const TRAIL_LENGTH = 12;

interface TrailPoint {
  x: number;
  y: number;
  char: string;
  opacity: number;
  age: number;
}

export default function CustomCursor({
  enabled = true,
  color = "#00ff41",
  glowIntensity = 1,
}: {
  enabled?: boolean;
  color?: string;
  glowIntensity?: number;
}) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);
  const lastTrailRef = useRef<number>(0);

  const updateTrail = useCallback(() => {
    const now = performance.now();
    
    trailRef.current = trailRef.current
      .map((point) => ({
        ...point,
        age: point.age + 1,
        opacity: Math.max(0, 1 - point.age / TRAIL_LENGTH),
      }))
      .filter((p) => p.opacity > 0);

    if (now - lastTrailRef.current > 50) {
      trailRef.current.push({
        x: position.x,
        y: position.y,
        char: TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)],
        opacity: 1,
        age: 0,
      });
      lastTrailRef.current = now;
    }

    setTrail([...trailRef.current]);
    rafRef.current = requestAnimationFrame(updateTrail);
  }, [position]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    rafRef.current = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, updateTrail]);

  if (!enabled) return null;

  return (
    <>
      {trail.map((point, i) => (
        <span
          key={i}
          style={{
            position: "fixed",
            left: point.x,
            top: point.y,
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: "bold",
            color: color,
            opacity: point.opacity * 0.7,
            pointerEvents: "none",
            zIndex: 9998,
            transform: "translate(-50%, -50%)",
            textShadow: `0 0 ${5 * point.opacity * glowIntensity}px ${color}`,
          }}
        >
          {point.char}
        </span>
      ))}
      
      <span
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: isClicking ? 12 : 20,
          height: isClicking ? 12 : 20,
          border: `2px solid ${color}`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.1s, height 0.1s",
          boxShadow: `0 0 ${10 * glowIntensity}px ${color}, inset 0 0 ${5 * glowIntensity}px ${color}`,
        }}
      />
      
      <span
        style={{
          position: "fixed",
          left: position.x + (isClicking ? 18 : 24),
          top: position.y,
          fontFamily: "monospace",
          fontSize: 10,
          color: color,
          opacity: 0.6,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translateY(-50%)",
          textShadow: `0 0 5px ${color}`,
        }}
      >
        {position.x.toFixed(0)},{position.y.toFixed(0)}
      </span>
    </>
  );
}
