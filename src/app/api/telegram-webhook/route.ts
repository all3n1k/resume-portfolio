import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

const SESSION_PREFIX = "terminal_session:";

interface SessionMessage {
  from: "recruiter" | "allen";
  text: string;
  ts: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message?.text) {
      return new Response("OK", { status: 200 });
    }

    const text: string = message.text;

    // Expect Allen to reply in format: [SESSION_ID] reply text here
    // e.g., "[a3f2b1c4] Hey, thanks for reaching out!"
    const match = text.match(/^\[([a-f0-9-]{8,36})\]\s+([\s\S]+)$/);
    if (!match) {
      return new Response("OK", { status: 200 });
    }

    const [, sessionId, replyText] = match;

    // Find the matching session in Redis
    const keys = await redis.keys(`${SESSION_PREFIX}*`);
    let targetKey: string | null = null;
    
    const searchId = sessionId.toLowerCase();
    
    for (const key of keys) {
      const sid = key.replace(SESSION_PREFIX, "");
      if (sid.startsWith(searchId) || sid.slice(0, 8) === searchId.slice(0, 8)) {
        targetKey = key;
        break;
      }
    }

    if (!targetKey) {
      console.warn(`No session found matching ID: ${sessionId}`);
      return new Response("OK", { status: 200 });
    }

    const replyMessage: SessionMessage = {
      from: "allen",
      text: replyText.trim(),
      ts: Date.now(),
    };

    // Append reply to the Redis list
    await redis.rpush(targetKey, JSON.stringify(replyMessage));
    // Reset expiry (extend by another 24h on activity)
    await redis.expire(targetKey, 60 * 60 * 24);

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Webhook POST error:", e);
    return new Response("OK", { status: 200 });
  }
}
