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

export default function InteractiveTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const logEndRef = useRef<HTMLDivElement>(null);

  // Periodically add system logs
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < SYSTEM_LOGS.length) {
        setLogs((prev) => [...prev, SYSTEM_LOGS[index]]);
        index++;
      } else {
        // Random ambient logs after boot
        const ambient = `[PASS] Heartbeat at ${new Date().toLocaleTimeString()}`;
        setLogs((prev) => [...prev.slice(-15), ambient]); 
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
      setLogs((prev) => [...prev, entry, "[ERR] Command not recognized. Insufficient privileges."]);
      setUserInput("");
    }
  };

  return (
    <div className="w-[1024px] h-[768px] bg-black text-green-500 font-mono p-12 overflow-hidden border-[16px] border-[#1a1a1a]/80 select-none flex flex-col pointer-events-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-green-500/30">
        <div className="text-3xl font-black italic tracking-widest">ARCHITECT OS v0.9</div>
        <div className="text-xl animate-pulse ring-1 ring-green-500/20 px-2 uppercase">[ LIVE FEED ]</div>
      </div>

      {/* Log Viewport */}
      <div className="flex-1 overflow-y-auto mb-8 space-y-2 text-2xl leading-relaxed scrollbar-hide">
        {logs.map((log, i) => (
          <div key={i} className={log.startsWith(">") ? "text-cyan-400" : ""}>
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Input Line */}
      <div className="flex items-center gap-4 text-3xl">
        <span className="text-cyan-400">$</span>
        <input
          autoFocus
          className="bg-transparent border-none outline-none text-green-400 flex-1 caret-green-500"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
        />
      </div>

      {/* CRT Scanline styling overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,1) 2px, rgba(0,255,65,1) 4px)",
        }}
      />
    </div>
  );
}
