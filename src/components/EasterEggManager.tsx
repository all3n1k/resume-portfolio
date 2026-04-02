"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

export default function EasterEggManager({ children }: { children: React.ReactNode }) {
  const [konamiActive, setKonamiActive] = useState(false);
  const [tripleClickHint, setTripleClickHint] = useState(false);
  const [clickFlash, setClickFlash] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const inputRef = useRef<string[]>([]);

  const resetKonami = useCallback(() => {
    inputRef.current = [];
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      inputRef.current.push(e.key);
      inputRef.current = inputRef.current.slice(-KONAMI_CODE.length);

      const isMatch = KONAMI_CODE.every((key, i) => {
        const input = inputRef.current[i];
        if (!input) return false;
        if (key === "b" || key === "a") return input.toLowerCase() === key;
        return input === key;
      });

      if (isMatch) {
        setKonamiActive(true);
        setTimeout(() => setKonamiActive(false), 5000);
        resetKonami();
      }
    };

    const handleKeyUp = () => {
      if (konamiActive) {
        setKonamiActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [resetKonami, konamiActive]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest("[data-secret]")) {
        return;
      }
      
      if (target.tagName === "BUTTON" || target.closest("button")) {
        setClickFlash(true);
        setTimeout(() => setClickFlash(false), 100);
      }
    };

    const handleTripleClick = () => {
      clickCountRef.current++;
      
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current >= 3) {
          setTripleClickHint(true);
          setTimeout(() => setTripleClickHint(false), 3000);
        }
        clickCountRef.current = 0;
      }, 500);
    };

    window.addEventListener("click", handleClick);
    document.addEventListener("dblclick", handleTripleClick);

    return () => {
      window.removeEventListener("click", handleClick);
      document.removeEventListener("dblclick", handleTripleClick);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {children}
      
      {clickFlash && (
        <div 
          className="fixed inset-0 pointer-events-none z-[99] bg-green-500/5 animate-pulse"
        />
      )}
      
      {konamiActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-pulse">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-400 mb-4 animate-bounce" style={{ textShadow: "0 0 30px #00ff41" }}>
              WAKE UP, NEO...
            </div>
            <div className="text-2xl text-green-600">
              The Matrix has you...
            </div>
            <div className="text-xl text-green-500/60 mt-4 font-mono">
              Follow the white rabbit.
            </div>
            <div className="mt-8 text-green-400/40 text-sm">
              (Press any key to close)
            </div>
          </div>
        </div>
      )}
      
      {tripleClickHint && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-black/80 border border-cyan-500/50 rounded-lg px-4 py-2 text-cyan-400 text-sm font-mono">
            Try the Konami Code: ↑↑↓↓←→←→BA
          </div>
        </div>
      )}
    </>
  );
}
