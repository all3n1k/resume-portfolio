"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! Ask me anything about the resume." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user" as const, content: text }];
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
          content:
            "I ran into a problem reaching the model. Check your LM Studio settings and API variables.",
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
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="glass h-12 w-12 flex items-center justify-center shadow-lg hover:scale-[1.03] transition"
        >
          <MessageCircle size={20} />
        </button>
      )}

      {open && (
        <div className="glass w-[92vw] max-w-[360px] h-[460px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="font-medium">Assistant</div>
            <button aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${m.role === "user" ? "ml-auto" : "mr-auto"
                  } max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${m.role === "user"
                    ? "bg-white/10 border border-white/15"
                    : "bg-black/20 border border-white/10"
                  }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="text-xs opacity-70">Thinking…</div>
            )}
          </div>

          <div className="hairline px-3 py-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about experience, skills, etc. (Ctrl/Cmd+Enter)"
              className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-60"
            />
            <button
              onClick={send}
              disabled={loading}
              className="btn-accent rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}