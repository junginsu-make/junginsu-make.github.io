// Cloudflare Pages Function — POST /api/chat (Cloudflare 배포용 얇은 래퍼)
// 실제 로직은 lib/chat-core.ts 에서 공유 (Vercel app/api/chat/route.ts 와 동일).
// 환경변수: GEMINI_API_KEY (Cloudflare Pages Settings → Environment variables)

import { chat, SYSTEM_PROMPT } from "../../lib/chat-core";

interface Env {
  GEMINI_API_KEY: string;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
}

export const onRequestPost = (context: PagesFunctionContext): Promise<Response> =>
  chat(context.request, context.env.GEMINI_API_KEY);

export const SYSTEM_PROMPT_FOR_TESTS = SYSTEM_PROMPT;
