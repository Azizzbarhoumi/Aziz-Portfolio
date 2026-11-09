import { NextRequest, NextResponse } from "next/server";
import { CHAT_REQUEST_HISTORY_LIMIT } from "@/lib/chat-messages";
import { getPortfolioAnswer, type ChatMessage } from "@/lib/portfolio-chat";

export const runtime = "nodejs";

const requestLog = new Map<string, number[]>();
const LIMIT = 8;
const WINDOW_MS = 60_000;

function limited(ip: string) {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) {
    requestLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(ip, recent);
  if (requestLog.size > 500) {
    for (const [key, times] of requestLog) if (!times.some((time) => now - time < WINDOW_MS)) requestLog.delete(key);
  }
  return false;
}

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (item.role === "user" || item.role === "assistant") && typeof item.content === "string" && item.content.length <= 1200;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "You’ve sent several questions quickly. Please wait a minute and try again." }, { status: 429 });

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "I couldn’t read that message. Please try again." }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > CHAT_REQUEST_HISTORY_LIMIT || !body.messages.every(isMessage)) {
    return NextResponse.json({ error: "Please send a valid question." }, { status: 400 });
  }
  const messages = body.messages as ChatMessage[];
  if (!messages.some((message) => message.role === "user" && message.content.trim().length >= 2)) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }

  try {
    const { answer, finishReason, sources } = await getPortfolioAnswer(messages);
    if (finishReason === "length") {
      return NextResponse.json({ error: "That reply was too long and got cut off. Please ask a narrower question." }, { status: 502 });
    }
    return NextResponse.json({ answer, sources: sources?.map(({ title, source, href }) => ({ title, source, href })) ?? [] });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "unknown error";
    console.error("Qwen chat request failed", errorName);
    if (error instanceof Error && error.message === "QWEN_API_KEY is not configured") {
      return NextResponse.json({ error: "The assistant is not configured yet. Please contact Aziz by email instead." }, { status: 503 });
    }
    if (error instanceof Error && error.message === "GEMINI_API_KEY is not configured") {
      return NextResponse.json({ error: "Portfolio search is not configured yet. Please try again later." }, { status: 503 });
    }
    if (error instanceof Error && /Qwen request failed with status 429/.test(error.message)) {
      return NextResponse.json({ error: "The assistant has reached its current usage limit. Please try again later." }, { status: 429 });
    }
    if (error instanceof Error && /Qwen request failed with status 503/.test(error.message)) {
      return NextResponse.json({ error: "The assistant is temporarily busy. Please try again shortly." }, { status: 503 });
    }
    if (error instanceof Error && /Qwen embeddings request failed with status 400:.*quota/i.test(error.message)) {
      return NextResponse.json({ error: "Portfolio search is unavailable because the embedding provider’s quota is exhausted. Please try again after its quota is restored." }, { status: 503 });
    }
    if (error instanceof Error && /Gemini embeddings request failed with status (?:400|403|429):.*(?:quota|limit)|Gemini embeddings request failed with status (?:403|429)\b/i.test(error.message)) {
      return NextResponse.json({ error: "Portfolio search is temporarily unavailable because the embedding provider has reached its usage limit." }, { status: 503 });
    }
    return NextResponse.json({ error: "I couldn’t reach the assistant right now. Please try again shortly." }, { status: 502 });
  }
}
