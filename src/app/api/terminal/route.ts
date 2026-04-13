import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { redis } from "@/lib/redis";

// ─── Redis persistence ──────────────────────────────────────────────────────────
// Each session is stored as a Redis list of JSON-stringified messages.
// Key format: `terminal_session:{sessionId}`
// Metadata (like recruiter name) is stored in a separate hash.

const SESSION_PREFIX = "terminal_session:";
const META_PREFIX = "terminal_meta:";
const EXPIRY = 60 * 60 * 24; // 24 hours persistence

interface SessionMessage {
  from: "recruiter" | "allen";
  text: string;
  ts: number;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, senderName, message, isFirst } = await req.json();

    // Create session on first message
    const sid = sessionId || randomUUID();
    const sessionKey = `${SESSION_PREFIX}${sid}`;
    const metaKey = `${META_PREFIX}${sid}`;

    const newMessage: SessionMessage = { from: "recruiter", text: message, ts: Date.now() };

    // Atomically push message and set expiry
    await redis.rpush(sessionKey, JSON.stringify(newMessage));
    await redis.expire(sessionKey, EXPIRY);

    // Store metadata if it's the first message or name is provided
    if (isFirst || senderName) {
      await redis.hset(metaKey, { name: senderName || "UNKNOWN" });
      await redis.expire(metaKey, EXPIRY);
    }

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
    console.error("Terminal POST error:", e);
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session");
    if (!sessionId) {
      return new Response(JSON.stringify({ messages: [] }), { status: 200 });
    }

    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    
    // Retrieve the full message log from Redis
    const logsRaw = await redis.lrange<string>(sessionKey, 0, -1);
    const logs: SessionMessage[] = logsRaw.map(l => 
      typeof l === 'string' ? JSON.parse(l) : l
    );

    // Return only Allen's replies (recruiter already has their own messages in state)
    const replies = logs.filter((m) => m.from === "allen");
    
    return new Response(JSON.stringify({ messages: replies }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Terminal GET error:", e);
    return new Response(JSON.stringify({ messages: [] }), { status: 200 });
  }
}
