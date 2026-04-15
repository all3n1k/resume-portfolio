"use client";

import { useState, useEffect, useRef } from "react";

const SYSTEM_LOGS = [
  "[BOOT] Initializing Security Dossier...",
  "[OK] Connection established with ARCHITECT_DAEMON",
  "[WARN] Decrypting legacy hardware interfaces...",
  "[INFO] Root access granted to Subject: ALLEN",
  "[SCN] Port scanning local mesh nodes...",
  "[INFO] Node discovered: Ollamaped Quadruped V2",
  "[STAT] Traffic Classifier: Processing 450Mbps (92% accuracy)",
  "[INFO] Door bypass sequence ready",
  "[OK] Memory allocation stable @ 82.4%",
];

interface InteractiveTerminalProps {
  fullscreen?: boolean;
}

export default function InteractiveTerminal({ fullscreen = false }: InteractiveTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < SYSTEM_LOGS.length) {
        setLogs((prev) => [...prev, SYSTEM_LOGS[index]]);
        index++;
      } else {
        const ambient = `[PASS] Heartbeat at ${new Date().toLocaleTimeString()}`;
        setLogs((prev) => [...prev.slice(-20), ambient]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const entry = `> ${userInput}`;
      setLogs((prev) => [
        ...prev,
        entry,
        "[ERR] Command not recognized. Insufficient privileges.",
      ]);
      setUserInput("");
    }
  };

  const fontSize = fullscreen ? 15 : 20;
  const headerSize = fullscreen ? 20 : 28;
  const inputSize = fullscreen ? 16 : 24;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#000",
        color: "#00ff41",
        fontFamily: "'Courier New', Courier, monospace",
        padding: fullscreen ? "32px 40px" : "48px",
        overflow: "hidden",
        border: "1px solid rgba(0,255,65,0.25)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: fullscreen ? 20 : 32,
          paddingBottom: fullscreen ? 12 : 16,
          borderBottom: "1px solid rgba(0,255,65,0.3)",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: headerSize, fontWeight: 900, fontStyle: "italic", letterSpacing: "0.1em" }}>
          ARCHITECT OS v0.9
        </div>
        <div
          style={{
            fontSize: fullscreen ? 13 : 18,
            border: "1px solid rgba(0,255,65,0.2)",
            padding: "2px 8px",
            textTransform: "uppercase",
          }}
        >
          [ LIVE FEED ]
        </div>
      </div>

      {/* Log viewport */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: fullscreen ? 16 : 24,
          fontSize,
          lineHeight: 1.7,
          scrollbarWidth: "none",
        }}
      >
        {logs.map((log, i) => (
          <div
            key={i}
            style={{ color: (log ?? "").startsWith(">") ? "#22d3ee" : "#00ff41", marginBottom: 4 }}
          >
            {log ?? ""}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: inputSize, flexShrink: 0 }}>
        <span style={{ color: "#22d3ee" }}>$</span>
        <input
          autoFocus={fullscreen}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#00ff41",
            flex: 1,
            fontFamily: "inherit",
            fontSize: "inherit",
            caretColor: "#00ff41",
          }}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
        />
      </div>

      {/* CRT scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,1) 2px, rgba(0,255,65,1) 4px)",
        }}
      />
    </div>
  );
}
