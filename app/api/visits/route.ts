// Vercel/Next Route Handler — POST /api/visits
// 로직은 lib/visits.ts. 환경변수: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
// (Vercel 마켓플레이스에서 Upstash for Redis 를 연결하면 자동으로 꽂힌다)

import { Redis } from "@upstash/redis";
import {
  VISIT_COOKIE,
  VISIT_COOKIE_MAX_AGE,
  countVisit,
  isBot,
  kstDay,
  parseVisitCookie,
  readCookie,
  readCounts,
} from "@/lib/visits";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const day = kstDay();
  const cookie = parseVisitCookie(
    readCookie(request.headers.get("cookie"), VISIT_COOKIE),
  );

  // 오늘 이미 센 사람은 읽기만 한다. 봇도 마찬가지 — 숫자는 보여주되 세지 않는다.
  const shouldCount =
    !isBot(request.headers.get("user-agent")) && cookie.lastDay !== day;
  const visitorId = cookie.id ?? crypto.randomUUID();

  try {
    const redis = Redis.fromEnv();
    const counts = shouldCount
      ? await countVisit(redis, day, visitorId)
      : await readCounts(redis, day);

    const headers = new Headers({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    headers.append(
      "set-cookie",
      visitCookie(
        `${visitorId}.${shouldCount ? day : (cookie.lastDay ?? "")}`,
        request.url.startsWith("https://"),
      ),
    );
    return new Response(JSON.stringify(counts), { status: 200, headers });
  } catch (error) {
    // 저장소가 죽어도 페이지는 살아야 한다. 0 을 지어내지 않고 실패를 알린다 —
    // 화면 쪽은 이 응답을 받으면 카운터를 아예 그리지 않는다.
    console.error("[visits] 집계 실패:", error);
    return new Response(JSON.stringify({ error: "counter_unavailable" }), {
      status: 503,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
}

function visitCookie(value: string, secure: boolean): string {
  const parts = [
    `${VISIT_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${VISIT_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
    "HttpOnly",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
