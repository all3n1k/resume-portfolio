"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
          content: "ERROR: Connection to model failed. If deployed, check Vercel Runtime Logs for upstream API rejection.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
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
          className="group relative w-12 h-12 flex items-center justify-center rounded-none border border-green-500/30 bg-black shadow-[4px_4px_0_rgba(0,255,65,0.1)] hover:shadow-[6px_6px_0_rgba(0,255,65,0.2)] hover:border-green-500/50 transition-all cursor-pointer"
        >
          <span className="text-green-400 font-mono text-lg font-bold group-hover:animate-pulse">{">_"}</span>
        </button>
      )}

      {/* Terminal window */}
      {open && (
        <div 
          className={`flex flex-col rounded-none border border-green-500/25 bg-black shadow-[8px_8px_0_rgba(0,255,65,0.05)] overflow-hidden transition-all duration-300 ${
            isMinimized 
              ? "w-[92vw] max-w-[320px] h-[40px] opacity-75 hover:opacity-100" 
              : isExpanded 
                ? "w-[96vw] max-w-[1200px] h-[85vh] right-5 bottom-5" 
                : "w-[92vw] max-w-[420px] h-[500px]"
          }`}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 h-[40px] border-b border-green-500/15 bg-green-500/[0.03]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 border-r border-green-500/15 pr-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpen(false); setIsExpanded(false); setIsMinimized(false); }}
                  className="w-3 h-3 rounded-none bg-red-500/70 hover:bg-red-500 transition-colors pointer-events-auto"
                />
                <button
                  aria-label="Minimize terminal"
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="w-3 h-3 rounded-none bg-yellow-500/70 hover:bg-yellow-500 transition-colors pointer-events-auto"
                />
                <button
                  aria-label="Expand terminal"
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); setIsMinimized(false); }}
                  className="w-3 h-3 rounded-none bg-green-500/70 hover:bg-green-500 transition-colors pointer-events-auto"
                />
              </div>
              <span className="text-green-500/50 text-[10px] sm:text-xs font-mono">
                {isMinimized ? "allen@matrix — minimized" : "allen@matrix — chat"}
              </span>
            </div>
          </div>

          {/* Scanline overlay & Body */}
          {!isMinimized && (
            <>
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
                placeholder="type a command..."
                className="flex-1 bg-transparent outline-none text-sm font-mono text-green-300 placeholder:text-green-500/25 caret-green-400"
              />
              <button
                onClick={send}
                disabled={loading}
                className="flex-shrink-0 px-2.5 py-1.5 rounded-none border border-green-500/20 bg-black text-green-400 text-xs font-mono hover:bg-green-500/10 hover:border-green-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 uppercase"
              >
                <Send size={12} /> SEND
              </button>
            </div>
          </>)}
        </div>
      )}
    </div>
  );
}
