"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useCodeExplosion } from "./CodeExplosion";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

const MOVIE_QUOTES = [
  { movie: "The Matrix", quote: "There is no spoon.", trigger: "spoon" },
  { movie: "Inception", quote: "You mustn't be afraid to dream a little bigger.", trigger: "dream" },
  { movie: "Fight Club", quote: "The first rule of Fight Club is: you do not talk about Fight Club.", trigger: "club" },
  { movie: "Jurassic Park", quote: "Life finds a way.", trigger: "life" },
  { movie: "Ghostbusters", quote: "Who you gonna call?", trigger: "call" },
  { movie: "Lord of the Rings", quote: "Not all those who wander are lost.", trigger: "wander" },
  { movie: "The Godfather", quote: "I'm gonna make him an offer he can't refuse.", trigger: "offer" },
  { movie: "Gladiator", quote: "Are you not entertained?", trigger: "entertain" },
];

interface SecretMessage {
  id: number;
  text: string;
  movie: string;
  x: number;
  y: number;
}

export default function EasterEggManager({ children }: { children: React.ReactNode }) {
  const [konamiActive, setKonamiActive] = useState(false);
  const [secretMessages, setSecretMessages] = useState<SecretMessage[]>([]);
  const [tripleClickHint, setTripleClickHint] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const inputRef = useRef<string[]>([]);
  const { explode, ExplosionComponent } = useCodeExplosion();
  const messageIdRef = useRef(0);

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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetKonami]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === "BUTTON" || target.closest("button")) {
        explode(e);
      }

      if (target.closest("[data-secret]")) {
        const secret = target.closest("[data-secret]") as HTMLElement;
        const trigger = secret.dataset.secret?.toLowerCase() || "";
        const quote = MOVIE_QUOTES.find(q => trigger.includes(q.trigger) || q.trigger.includes(trigger));
        
        if (quote) {
          setSecretMessages(prev => [...prev, {
            id: messageIdRef.current++,
            text: quote.quote,
            movie: quote.movie,
            x: e.clientX,
            y: e.clientY - 40,
          }]);
          
          setTimeout(() => {
            setSecretMessages(prev => prev.slice(1));
          }, 4000);
        }
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
  }, [explode]);

  return (
    <>
      {children}
      
      <ExplosionComponent />
      
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
      
      {secretMessages.map((msg) => (
        <div
          key={msg.id}
          className="fixed z-[100] animate-fadeIn"
          style={{
            left: msg.x,
            top: msg.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-black/90 border border-green-500/50 rounded-lg px-4 py-3 shadow-lg shadow-green-500/20 max-w-xs">
            <div className="text-green-400 text-sm font-mono italic">&ldquo;{msg.text}&rdquo;</div>
            <div className="text-green-600/60 text-xs mt-1 text-right">— {msg.movie}</div>
          </div>
          <div className="w-3 h-3 bg-black/90 border-r border-b border-green-500/50 rotate-45 mx-auto -mt-1.5" />
        </div>
      ))}
      
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
