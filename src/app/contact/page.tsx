"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TerminalLine {
  id: number;
  text: string;
  type: "system" | "user" | "allen" | "prompt" | "blank";
  typed?: boolean; // system lines type character by character
}


// ─── Boot sequence lines ──────────────────────────────────────────────────────

const BOOT_SEQUENCE = [
  { text: "ARCHITECT TERMINAL  v2.091", delay: 0 },
  { text: "────────────────────────────────────────────────────────────", delay: 400 },
  { text: "INITIALIZING SECURE CHANNEL...", delay: 800 },
  { text: "ROUTING THROUGH MATRIX RELAY NODE #7...", delay: 1400 },
  { text: "CONNECTION ESTABLISHED", delay: 2200 },
  { text: "────────────────────────────────────────────────────────────", delay: 2600 },
];

// ─── Shared session store (module-level) ─────────────────────────────────────

let __sessionId: string | null = null;
let __sessionName: string | null = null;

// ─── Main terminal component ──────────────────────────────────────────────────

export default function TerminalContact() {
  const router = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"booting" | "name" | "chat" | "terminated">("booting");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [senderName, setSenderName] = useState("");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const idCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenReplies = useRef<Set<number>>(new Set());

  const nextId = () => ++idCounter.current;

  const addLine = useCallback((text: string, type: TerminalLine["type"], typed = false) => {
    setLines((prev) => [...prev, { id: nextId(), text, type, typed }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click
  const focusInput = () => inputRef.current?.focus();

  // Boot sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_SEQUENCE.forEach(({ text, delay }) => {
      timers.push(setTimeout(() => addLine(text, "system", true), delay));
    });

    timers.push(
      setTimeout(() => {
        addLine("", "blank");
        addLine("IDENTIFY YOURSELF:", "system", true);
        addLine("", "blank");
        setPhase("name");
        inputRef.current?.focus();
      }, 3200)
    );

    return () => timers.forEach(clearTimeout);
  }, [addLine]);

  // Poll for Allen's replies
  const startPolling = useCallback((sid: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/terminal?session=${sid}`);
        const data = await res.json();
        (data.messages as Array<{ text: string; ts: number }>).forEach((m) => {
          if (!seenReplies.current.has(m.ts)) {
            seenReplies.current.add(m.ts);
            addLine("ALLEN :: " + m.text, "allen", true);
          }
        });
      } catch {
        // ignore poll errors silently
      }
    }, 2500);
  }, [addLine]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const handleTerminate = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    __sessionId = null;
    __sessionName = null;
    setPhase("terminated");
    addLine("", "blank");
    addLine("SESSION TERMINATED BY USER", "system", true);
    addLine("────────────────────────────────────────────────────────────", "system", true);
    addLine("CLOSING SECURE CHANNEL...", "system", true);
    addLine("GOODBYE.", "system", true);
    setTimeout(() => router.push("/"), 2400);
  }, [addLine, router]);

  const handleSubmit = async () => {
    if (!input.trim() || isTransmitting) return;
    const text = input.trim();
    setInput("");

    if (phase === "name") {
      const name = text.toUpperCase();
      setSenderName(name);
      __sessionName = name;
      addLine(`> ${text}`, "user");
      addLine("", "blank");
      addLine(`AUTHENTICATION ACCEPTED`, "system", true);
      addLine(`WELCOME, ${name}.`, "system", true);
      addLine("", "blank");
      addLine("STATE YOUR INQUIRY:", "system", true);
      addLine("", "blank");
      setPhase("chat");
      return;
    }

    if (phase === "chat") {
      addLine(`> ${text}`, "user");
      setIsTransmitting(true);

      const isFirst = !sessionId;
      const name = senderName || __sessionName || "UNKNOWN";

      try {
        const res = await fetch("/api/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId || __sessionId,
            senderName: name,
            message: text,
            isFirst,
          }),
        });
        const data = await res.json();
        if (data.sessionId) {
          setSessionId(data.sessionId);
          __sessionId = data.sessionId;
          if (isFirst) startPolling(data.sessionId);
        }
        addLine("TRANSMISSION RECEIVED // STANDING BY...", "system", true);
      } catch {
        addLine("// TRANSMISSION FAILED — CHECK YOUR CONNECTION", "system", true);
      } finally {
        setIsTransmitting(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const isInputActive = phase === "name" || phase === "chat";
  const promptPrefix = phase === "name" ? "NAME: " : "// ";

  return (
    <div
      className="terminal-root"
      onClick={focusInput}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        color: "#00FF41",
        fontFamily: "'VT323', 'Courier New', monospace",
        fontSize: "clamp(14px, 1.8vw, 20px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "text",
        userSelect: "none",
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* CRT flicker */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        @keyframes flicker {
          0%   { opacity: 1; }
          92%  { opacity: 1; }
          93%  { opacity: 0.85; }
          94%  { opacity: 1; }
          97%  { opacity: 0.9; }
          100% { opacity: 1; }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .terminal-root {
          animation: flicker 6s infinite;
        }
        .glow {
          text-shadow:
            0 0 4px #00FF41,
            0 0 10px rgba(0,255,65,0.6),
            0 0 20px rgba(0,255,65,0.2);
        }
        .allen-glow {
          text-shadow:
            0 0 4px #00ccff,
            0 0 12px rgba(0,200,255,0.6),
            0 0 24px rgba(0,200,255,0.2);
        }
        .cursor-blink {
          animation: blink 1s step-start infinite;
        }
        .input-line {
          background: transparent;
          border: none;
          outline: none;
          color: #00FF41;
          font-family: inherit;
          font-size: inherit;
          caret-color: transparent;
          width: 1px;
          position: absolute;
          opacity: 0;
        }
      `}</style>

      {/* Back button */}
      <button
        onClick={(e) => { e.stopPropagation(); router.push("/"); }}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 20,
          background: "transparent",
          border: "none",
          color: "rgba(0,255,65,0.3)",
          fontFamily: "inherit",
          fontSize: "0.85em",
          cursor: "pointer",
          letterSpacing: "0.1em",
          padding: "4px 8px",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#00FF41")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,255,65,0.3)")}
      >
        ← EXIT
      </button>

      {/* Terminate session — top-right, red, only in chat phase */}
      {phase === "chat" && (
        <button
          onClick={(e) => { e.stopPropagation(); handleTerminate(); }}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 20,
            background: "transparent",
            border: "1px solid rgba(255,40,40,0.25)",
            color: "rgba(255,40,40,0.4)",
            fontFamily: "inherit",
            fontSize: "0.85em",
            cursor: "pointer",
            letterSpacing: "0.12em",
            padding: "4px 14px",
            transition: "color 0.2s, border-color 0.2s, text-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ff2828";
            e.currentTarget.style.borderColor = "rgba(255,40,40,0.6)";
            e.currentTarget.style.textShadow = "0 0 8px rgba(255,40,40,0.8)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,40,40,0.4)";
            e.currentTarget.style.borderColor = "rgba(255,40,40,0.25)";
            e.currentTarget.style.textShadow = "none";
          }}
        >
          TERMINATE SESSION
        </button>
      )}

      {/* Line log */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "clamp(24px, 4vw, 48px)",
          paddingTop: "clamp(48px, 6vw, 80px)",
          paddingBottom: "80px",
          scrollbarWidth: "none",
        }}
      >
        {lines.map((line) => (
          <TerminalLineRenderer key={line.id} line={line} />
        ))}

        {/* Live input line */}
        {isInputActive && (
          <div className="glow" style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
            <span style={{ opacity: 0.5 }}>{promptPrefix}</span>
            <span>{input}</span>
            <span
              className="cursor-blink"
              style={{
                display: "inline-block",
                width: "0.55em",
                height: "1.1em",
                background: "#00FF41",
                verticalAlign: "text-top",
                boxShadow: "0 0 8px #00FF41",
              }}
            />
          </div>
        )}

        {isTransmitting && (
          <div className="glow" style={{ opacity: 0.5, marginTop: "4px", letterSpacing: "0.15em" }}>
            TRANSMITTING
            <TransmitDots />
          </div>
        )}
      </div>

      {/* Hidden real input */}
      <input
        ref={inputRef}
        className="input-line"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!isInputActive}
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

// ─── Animated transmit dot ellipsis ──────────────────────────────────────────

function TransmitDots() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const iv = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 350);
    return () => clearInterval(iv);
  }, []);
  return <span>{dots}</span>;
}

// ─── Individual line renderer ─────────────────────────────────────────────────

function TerminalLineRenderer({ line }: { line: TerminalLine }) {
  const isAllen = line.type === "allen";
  const color = isAllen ? "#00ccff" : "#00FF41";
  const glowClass = isAllen ? "allen-glow" : "glow";

  if (line.type === "blank") return <div style={{ height: "0.6em" }} />;

  if (line.typed) {
    return <TypedLine text={line.text} color={color} glowClass={glowClass} />;
  }

  return (
    <div
      className={glowClass}
      style={{
        color,
        letterSpacing: "0.08em",
        lineHeight: 1.55,
        opacity: line.type === "user" ? 0.85 : 1,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {line.text}
    </div>
  );
}

// ─── Typewriter effect per line ───────────────────────────────────────────────

function TypedLine({ text, color, glowClass }: { text: string; color: string; glowClass: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 18);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <div
      className={glowClass}
      style={{
        color,
        letterSpacing: "0.08em",
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {displayed}
    </div>
  );
}
