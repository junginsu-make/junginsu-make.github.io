// Vercel/Next Route Handler — POST /api/chat
// 로직은 lib/chat-core.ts 공유 (Cloudflare functions/api/chat.ts 와 동일).
// 환경변수: GEMINI_API_KEY (Vercel Project Settings → Environment Variables)

import { chat } from "@/lib/chat-core";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return chat(request, process.env.GEMINI_API_KEY);
}
