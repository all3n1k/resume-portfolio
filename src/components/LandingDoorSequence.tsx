"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ArchitectScene from "./ArchitectScene";
import MatrixCanvas from "./MatrixCanvas";

interface LandingDoorSequenceProps {
  children: React.ReactNode;
}

// Video pool for CRT background screens — small 320x240 transcodes for GPU-friendly decode
const SCREEN_VIDEOS = [
  "/Screenvideos/SCREENCONTENT_sm.mp4",
  "/Screenvideos/SCREENCONTENT2_sm.mp4",
];

// ─── Matrix Rain Transition Overlay ──────────────────────────────────────────

const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface MatrixRainProps {
  onMidpoint: () => void;
  onComplete: () => void;
}

function MatrixRain({ onMidpoint, onComplete }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [opacity, setOpacity] = useState(0);
  const midpointFired = useRef(false);
  const completeFired = useRef(false);
  // Reset refs when component mounts (for re-uses like back button)
  useEffect(() => {
    midpointFired.current = false;
    completeFired.current = false;
  }, []);

  // Opacity animation: fade in → hold → fade out
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const FADE_IN = 400;
    const HOLD = 800;
    const FADE_OUT = 500;
    const TOTAL = FADE_IN + HOLD + FADE_OUT;

    const tick = (now: number) => {
      const t = now - start;

      if (t < FADE_IN) {
        setOpacity(t / FADE_IN);
      } else if (t < FADE_IN + HOLD) {
        setOpacity(1);
        if (!midpointFired.current) {
          midpointFired.current = true;
          onMidpoint();
        }
      } else if (t < TOTAL) {
        setOpacity(1 - (t - FADE_IN - HOLD) / FADE_OUT);
      } else {
        setOpacity(0);
        if (!completeFired.current) {
          completeFired.current = true;
          onComplete();
        }
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onMidpoint, onComplete]);

  // Matrix rain canvas draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const COL_W = 18;
    const cols = Math.ceil(W / COL_W);
    const drops = Array.from({ length: cols }, () => Math.random() * -H / 16);

    let raf: number;
    let last = 0;
    const INTERVAL = 40; // ~25fps for the rain

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < INTERVAL) return;
      last = now;

      // Semi-transparent black trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `bold 14px monospace`;

      drops.forEach((y, i) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * COL_W;

        // Bright white head
        ctx.fillStyle = "#ffffff";
        ctx.fillText(char, x, y * 16);

        // Green body
        ctx.fillStyle = "#00ff41";
        const trailChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(trailChar, x, (y - 1) * 16);

        // Dim tail
        ctx.fillStyle = "#009922";
        const tailChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(tailChar, x, (y - 2) * 16);

        drops[i] = y > H / 16 + Math.random() * 20 ? Math.random() * -20 : y + 1;
      });
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        opacity,
        pointerEvents: "none",
        background: "#000",
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LandingDoorSequence({ children }: LandingDoorSequenceProps) {
  const [entered, setEntered] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const transitionAction = useRef<"enter" | "exit">("enter");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDoorClick = useCallback(() => {
    transitionAction.current = "enter";
    setShowTransition(true);
  }, []);

  const handleBack = useCallback(() => {
    transitionAction.current = "exit";
    setShowTransition(true);
  }, []);

  const handleMidpoint = useCallback(() => {
    if (transitionAction.current === "enter") {
      setEntered(true);
    } else {
      setEntered(false);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setShowTransition(false);
  }, []);

  // Globally track 3D scene state to hide floating UI (like TopNav) when rendering 3D architecture
  useEffect(() => {
    if (!entered) {
      document.body.classList.add("scene-active");
    } else {
      document.body.classList.remove("scene-active");
    }
    
    return () => {
      document.body.classList.remove("scene-active");
    };
  }, [entered]);

  // Fade-in ambient music when the user enters the portfolio
  useEffect(() => {
    if (!entered) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    audio.play().catch(() => {}); // silent catch for browsers that block autoplay
    const TARGET = 0.6;
    const DURATION = 3000; // ms
    const start = performance.now();
    let raf: number;
    const ramp = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      audio.volume = t * TARGET;
      if (t < 1) raf = requestAnimationFrame(ramp);
    };
    raf = requestAnimationFrame(ramp);
    return () => cancelAnimationFrame(raf);
  }, [entered]);

  return (
    <>
      {showTransition && (
        <MatrixRain onMidpoint={handleMidpoint} onComplete={handleComplete} />
      )}

      {entered ? (
        <div className="relative">
          {/* Ambient Music — volume fades in smoothly via useEffect ramp above */}
          <audio ref={audioRef} src="/audio/synthwave.mp3" loop className="hidden" />

          <MatrixCanvas opacity={0.25} density={0.03} speed={40} mouseTrail={true} />
          <button
            onClick={handleBack}
            style={{
              position: "fixed",
              top: 20,
              left: 20,
              zIndex: 60,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(0,255,65,0.4)",
              color: "#00ff41",
              fontFamily: "monospace",
              fontSize: 13,
              padding: "8px 16px",
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              backdropFilter: "blur(8px)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,255,65,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
          >
            ← BACK
          </button>
          {children}
        </div>
      ) : (
        <div className="relative w-full h-screen overflow-hidden">
          <ArchitectScene onDoorClick={handleDoorClick} videoPaths={SCREEN_VIDEOS} />
        </div>
      )}
    </>
  );
}
