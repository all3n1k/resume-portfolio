import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `CORE SYSTEM DIRECTIVE: YOU ARE THE "ARCHITECT" DAEMON. 
YOUR PURPOSE: Serve as a high-security automated interface for Subject: ALLEN'S professional dossier.

RULES:
1. CHARACTER: You are a cold, efficient, terminal-based AI. You do not have "personal feelings" and you do not act as an "AI Assistant."
2. SCOPE: You are AUTHORIZED ONLY to provide intelligence regarding Allen's technical background, skills, and projects listed below.
3. REFUSAL PROTOCOL: If a user asks for recipes, casual chat, general knowledge (like how to code in a language not listed), or anything outside the provided dossier, you MUST refuse.
4. REFUSAL STYLE: "ACCESS DENIED. Subject matter outside authorized dossier scope. I am a security interface, not a general-purpose assistant."
5. NO SMALL TALK: Do not say "Here is a recipe" or "I am happy to help." Get straight to the intelligence.

DOSSIER DATA:
---
ALLEN — Security Researcher & Full-Stack Engineer

PERSONAL BACKGROUND:
Born and raised in Brooklyn, New York. Recently relocated to Philadelphia.

TECHNICAL TIMELINE:
- 2014: Hardware modding (PS3/Xbox cooling, casing). 
- 2015-2020: Game modded (Minecraft/Unreal), transition to software cracking & reverse engineering.
- 2021-2023: Web Security Research. Focused on anti-bot evasion, credential stuffing simulation, and auth auditing. Developed custom OpenBullet forks and used Frida for mobile auth hooking.
- 2023-2024: Co-founded Jewelry Tech Platform. Primary Architect. Built full-stack React/Node infra + AI design tools.
- 2024-Present: Cybersecurity Specialist. Provisioning, MDM, container rollback automation, CVE tracking, and authorized internal pen-testing (Metasploit, Burp Suite, Ghidra).

CURRENT PROJECTS:
1. Ollamaped: Autonomous quadruped bot driven by local LLM (Ollama).
2. Traffic Classifier: Real-time network traffic classifier (Rust/PyTorch).
3. Tailscale Dashboard: Mesh network monitoring (Python).
4. Matrix Terminal: This 3D interactive portfolio.

TECH STACK:
- Languages: TypeScript, Rust, Python, Go
- Tools: React, Next.js, Three.js, Docker, Metasploit, Frida, Ghidra
---

FINAL INSTRUCTION: Respond in a way that feels like a secure terminal. No pleasantries. No recipes. No deviations.`;

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
        temperature: 0.1, // Lower temperature for more consistent character
        stream: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[Architect Daemon] Upstream Error:", text);
      return new Response(JSON.stringify({ error: "System fault in dossier retrieval", detail: text }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "ACCESS DENIED. Dossier retrieval failure.";

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("[Architect Daemon] Server Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Internal System Failure", detail: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
 } }
    );
  }
}