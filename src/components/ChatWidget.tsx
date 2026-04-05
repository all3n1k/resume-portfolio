"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "> SYSTEM ONLINE\n> Ask me anything about Allen's experience, skills, or background." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const content = data?.content ?? "(No response)";
      setMessages((m) => [...m, { role: "assistant", content }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "ERROR: Connection to model failed. Is your local Ollama instance fully running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Toggle button */}
      {!open && (
        <button
          aria-label="Open terminal"
          onClick={() => setOpen(true)}
          className="group relative w-12 h-12 flex items-center justify-center rounded-lg border border-green-500/30 bg-black/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,65,0.15)] hover:shadow-[0_0_25px_rgba(0,255,65,0.3)] hover:border-green-500/50 transition-all"
        >
          <span className="text-green-400 font-mono text-lg font-bold group-hover:animate-pulse">{">_"}</span>
        </button>
      )}

      {/* Terminal window */}
      {open && (
        <div className="w-[92vw] max-w-[420px] h-[500px] flex flex-col rounded-lg border border-green-500/25 bg-black/95 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,65,0.1),inset_0_1px_0_rgba(0,255,65,0.05)] overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-green-500/15 bg-green-500/[0.03]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <button
                  aria-label="Close terminal"
                  onClick={() => setOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-green-500/50 text-xs font-mono">allen@matrix — chat</span>
            </div>
            <button
              aria-label="Close terminal"
              onClick={() => setOpen(false)}
              className="text-green-500/30 hover:text-green-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Scanline overlay */}
          <div className="relative flex-1 overflow-hidden">
            {/* CRT scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)",
              }}
            />

            {/* Messages */}
            <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((m, i) => (
                <div key={i} className="font-mono text-[13px] leading-relaxed">
                  {m.role === "user" ? (
                    <div>
                      <span className="text-green-400">{">"} </span>
                      <span className="text-green-300/90">{m.content}</span>
                    </div>
                  ) : (
                    <div className="text-green-500/70 whitespace-pre-wrap pl-1">
                      {m.content}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="font-mono text-[13px] text-green-500/50 flex items-center gap-1">
                  <span className="inline-block w-2 h-4 bg-green-400/60 animate-pulse" />
                  <span>processing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-green-500/15 px-3 py-2.5 flex items-center gap-2 bg-green-500/[0.02]">
            <span className="text-green-400 font-mono text-sm flex-shrink-0">{">"}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="type a command... (Ctrl+Enter)"
              className="flex-1 bg-transparent outline-none text-sm font-mono text-green-300 placeholder:text-green-500/25 caret-green-400"
            />
            <button
              onClick={send}
              disabled={loading}
              className="flex-shrink-0 px-2.5 py-1.5 rounded border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-mono hover:bg-green-500/20 hover:border-green-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
            >
              <Send size={12} /> SEND
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
