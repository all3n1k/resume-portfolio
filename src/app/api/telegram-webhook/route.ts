import { NextRequest } from "next/server";

// ─── In-memory session store (shared with /api/terminal) ──────────────────────
// NOTE: This is a module-level singleton. In production Vercel, serverless
// functions share state within the same warm instance only. For true persistence
// use Upstash Redis. For a portfolio (low traffic) this works fine.
interface SessionMessage {
  from: "recruiter" | "allen";
  text: string;
  ts: number;
}

// Shared via Next.js module cache within the same process
declare global {
  // eslint-disable-next-line no-var
  var __terminalSessions: Map<string, SessionMessage[]> | undefined;
}
const sessions: Map<string, SessionMessage[]> =
  globalThis.__terminalSessions ??
  (globalThis.__terminalSessions = new Map());

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Telegram sends updates as { update_id, message: { text, from, ... } }
    const message = body?.message;
    if (!message?.text) {
      return new Response("OK", { status: 200 });
    }

    const text: string = message.text;

    // Expect Allen to reply in format: [SESSION_ID] reply text here
    // e.g., "[a3f2b1c4] Hey, thanks for reaching out!"
    const match = text.match(/^\[([a-f0-9\-]{8,36})\]\s+(.+)$/s);
    if (!match) {
      // Not a session reply — ignore or send back usage hint
      return new Response("OK", { status: 200 });
    }

    const [, sessionId, replyText] = match;

    // Find the matching session (prefix match to 8 chars)
    let targetKey: string | null = null;
    for (const key of sessions.keys()) {
      if (key.startsWith(sessionId) || key.slice(0, 8) === sessionId.slice(0, 8)) {
        targetKey = key;
        break;
      }
    }

    if (!targetKey) {
      return new Response("OK", { status: 200 });
    }

    sessions.get(targetKey)!.push({
      from: "allen",
      text: replyText.trim(),
      ts: Date.now(),
    });

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("OK", { status: 200 }); // Always 200 to Telegram
  }
}
