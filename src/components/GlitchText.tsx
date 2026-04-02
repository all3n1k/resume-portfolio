"use client";

import { useState, useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
  triggerOnHover?: boolean;
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/\\`~0123456789";

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function GlitchText({ 
  text, 
  className = "", 
  intensity = "medium",
  triggerOnHover = false 
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startGlitchRef = useRef<() => void>(() => {});

  const glitchDuration = intensity === "low" ? 150 : intensity === "medium" ? 300 : 500;

  startGlitchRef.current = () => {
    if (intervalRef.current) return;
    setIsGlitching(true);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char) => {
            if (char === " ") return " ";
            return Math.random() > 0.7 ? randomChar() : char;
          })
          .slice(0, Math.floor(Math.random() * text.length) + 1)
          .join("")
      );
    }, 30);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayText(text);
      setIsGlitching(false);
    }, glitchDuration);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!triggerOnHover) {
      const interval = setInterval(() => {
        if (Math.random() > 0.97) startGlitchRef.current();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [triggerOnHover]);

  return (
    <span
      className={`inline-block relative ${className}`}
      onMouseEnter={triggerOnHover ? startGlitchRef.current : undefined}
    >
      {displayText}
      {isGlitching && (
        <span
          className="absolute inset-0 text-cyan-400 opacity-70 pointer-events-none"
          style={{
            clipPath: "inset(20% 0 60% 0)",
            transform: "translateX(-2px)",
          }}
          aria-hidden="true"
        >
          {text}
        </span>
      )}
      {isGlitching && (
        <span
          className="absolute inset-0 text-pink-400 opacity-70 pointer-events-none"
          style={{
            clipPath: "inset(60% 0 10% 0)",
            transform: "translateX(2px)",
          }}
          aria-hidden="true"
        >
          {text}
        </span>
      )}
    </span>
  );
}
