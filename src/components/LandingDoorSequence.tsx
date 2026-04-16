"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ArchitectScene from "./ArchitectScene";
import MatrixCanvas from "./MatrixCanvas";

// ─── WebGL Capability Detection ───────────────────────────────────────────────

type WebGLTier = "ok" | "low" | "none";

function detectWebGLTier(): WebGLTier {
  if (typeof window === "undefined") return "ok"; // SSR — assume fine
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);

    if (!gl) return "none";

    // Check for software renderers — these will white-screen on complex scenes
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
      const lower = renderer.toLowerCase();
      const isSoftware =
        lower.includes("swiftshader") ||
        lower.includes("llvmpipe") ||
        lower.includes("softpipe") ||
        lower.includes("microsoft basic render") ||
        lower.includes("mesa");
      if (isSoftware) return "low";
    }

    // No WebGL2 support = old hardware, flag as low
    if (!canvas.getContext("webgl2")) return "low";

    return "ok";
  } catch {
    return "none";
  }
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  // Combine viewport width check and touch point check for reliable mobile detection
  return window.innerWidth < 768 || (navigator.maxTouchPoints > 0 && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
}

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
  const [isMobile, setIsMobile] = useState(false);
  const [webGLTier, setWebGLTier] = useState<WebGLTier>("ok");
  const [bypassDismissed, setBypassDismissed] = useState(false);

  // Detect WebGL capability and mobile status once on mount (client-only)
  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    setWebGLTier(detectWebGLTier());

    // On mobile, trigger the "entry" transition automatically
    if (mobile) {
      transitionAction.current = "enter";
      setShowTransition(true);
    }
  }, []);

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
      const t = Math.min(Math.max((now - start) / DURATION, 0), 1);
      audio.volume = Math.min(Math.max(t * TARGET, 0), 1);
      if (t < 1) raf = requestAnimationFrame(ramp);
    };
    raf = requestAnimationFrame(ramp);
    return () => cancelAnimationFrame(raf);
  }, [entered]);

  return (
    <>
      {/* Audio always mounted so ref is attached before effect fires */}
      <audio ref={audioRef} src="/audio/synthwave.mp3" loop className="hidden" />

      {showTransition && (
        <MatrixRain onMidpoint={handleMidpoint} onComplete={handleComplete} />
      )}

      {/* ── WebGL Bypass Mode ── */}
      {(webGLTier !== "ok" && !isMobile) ? (
        <div className="relative">
          {/* Dismissible warning banner */}
          {!bypassDismissed && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 200,
                background: "rgba(0,0,0,0.92)",
                borderBottom: "1px solid rgba(0,255,65,0.3)",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "monospace",
                fontSize: 12,
                color: "rgba(0,255,65,0.8)",
                gap: 12,
              }}
            >
              <span>
                {webGLTier === "none"
                  ? "[WARN] WebGL unavailable — 3D scene disabled. Portfolio mode active."
                  : "[WARN] Low-power GPU detected — 3D scene bypassed for stability. Portfolio mode active."}
              </span>
              <button
                onClick={() => setBypassDismissed(true)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,255,65,0.4)",
                  color: "#00ff41",
                  fontFamily: "monospace",
                  fontSize: 11,
                  padding: "3px 10px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ✕ DISMISS
              </button>
            </div>
          )}
          {children}
        </div>
      ) : entered ? (
        <div className="relative">
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
