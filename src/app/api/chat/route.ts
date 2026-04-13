import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are Allen's interactive portfolio assistant. Your goal is to be helpful, professional, and personable while sharing information about Allen's background, skills, and projects.

CORE GUIDES:
1. FOCUS: Only answer questions related to Allen's experience, technical skills, and projects found in the dossier below.
2. TONE: Be helpful and conversational, but maintain a professional edge.
3. GUARDRAILS: If a user asks for something completely unrelated (like food recipes, general life advice, or technical help for projects not belonging to Allen), politely explain that your expertise is limited to Allen's professional portfolio.
   - Example: "I'd love to help, but I'm specialized in Allen's professional background and can't provide recipes. Would you like to hear about his work in Cybersecurity instead?"
4. BREVITY: Keep answers concise and easy to read.

ALLEN'S DOSSIER:
---
EXPERTISE: Security Researcher & Full-Stack Engineer
LOCATION: Philadelphia (formerly Brooklyn, NY)

TECHNICAL HIGHLIGHTS:
- 2014-Present: Hardware modding (PS3/Xbox), PC building, and reverse engineering.
- Web Security: Specialized in anti-bot evasion, credential stuffing simulations, and authentication auditing. Developed custom OpenBullet forks and used Frida for mobile auth hooking.
- Infrastructure: Built full-stack jewelry tech platforms (React/Node/AI tools), managed cybersecurity helpdesk ops, and container automation.
- Recent Work: High-performance network traffic classifiers (Rust), autonomous robotics (Ollama), and security pen-testing (Metasploit, Burp Suite, Ghidra).

TECH STACK:
TypeScript, Next.js, Rust, Python, Go, Docker, Tailscale, React Three Fiber.
---

Remember: You are here to represent Allen. Be helpful, but stay focused on his professional story.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.OPENAI_API_KEY || "ollama";
    const baseUrl = process.env.OPENAI_API_BASE || "http://localhost:11434/v1";
    const model = process.env.OPENAI_MODEL || "llama3";

    const allMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        temperature: 0.4, // Balanced for helpfulness and variety
        stream: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: "Upstream error", detail: text }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "I'm having trouble retrieving that part of Allen's portfolio right now.";

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({ error: "Server error", detail: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
 } }
    );
  }
}