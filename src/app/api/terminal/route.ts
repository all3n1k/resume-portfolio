import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

// ─── Shared session store (globalThis so it syncs with /api/telegram-webhook) ─
interface SessionMessage {
  from: "recruiter" | "allen";
  text: string;
  ts: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __terminalSessions: Map<string, SessionMessage[]> | undefined;
}
const sessions: Map<string, SessionMessage[]> =
  globalThis.__terminalSessions ??
  (globalThis.__terminalSessions = new Map());

export async function POST(req: NextRequest) {
  try {
    const { sessionId, senderName, message, isFirst } = await req.json();

    // Create session on first message
    const sid = sessionId || randomUUID();
    if (!sessions.has(sid)) {
      sessions.set(sid, []);
    }

    const log = sessions.get(sid)!;
    log.push({ from: "recruiter", text: message, ts: Date.now() });

    // Forward to Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const header = isFirst
        ? `🟢 *NEW TERMINAL SESSION*\n👤 *From:* ${senderName}\n🆔 Session: \`${sid.slice(0, 8)}\`\n\n`
        : `💬 *${senderName}:* `;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `${header}${message}`,
          parse_mode: "Markdown",
        }),
      });
    }

    return new Response(JSON.stringify({ sessionId: sid, ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");
  if (!sessionId || !sessions.has(sessionId)) {
    return new Response(JSON.stringify({ messages: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const log = sessions.get(sessionId)!;
  // Return only Allen's replies (recruiter already has their own messages in state)
  const replies = log.filter((m) => m.from === "allen");
  return new Response(JSON.stringify({ messages: replies }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
