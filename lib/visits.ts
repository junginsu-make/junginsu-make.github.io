/**
 * 방문자 집계 — 「오늘 방문자 / 전체 방문자」.
 *
 * 은행 창구 번호표처럼 생각하면 된다. 처음 온 사람에게만 번호표를 주고, 그 사람이
 * 하루에 몇 번을 다시 들어오든 번호표는 하나다. 새로고침으로 숫자를 부풀릴 수
 * 없어야 한다는 게 이 기능의 요구사항이었다.
 *
 * 저장소는 Upstash Redis. 파일이나 서버 메모리에 세면 안 된다 — Vercel 은 요청마다
 * 다른 인스턴스에서 돌 수 있어 숫자가 어긋나고, 배포할 때마다 0 으로 돌아간다.
 */
import type { Redis } from "@upstash/redis";

/** 방문자 식별 쿠키. 값은 `<uuid>.<마지막으로 센 날짜>`. */
export const VISIT_COOKIE = "pv";

/** 쿠키 수명 — 브라우저가 400일에서 자른다. 그 상한에 맞춘다. */
export const VISIT_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

/** 하루치 방문자 집합은 이틀 뒤 스스로 지워진다. 자정 근처 요청까지만 살면 된다. */
const DAY_TTL_SEC = 48 * 60 * 60;

/** 전체 누적 = 일별 방문자의 합. 별도 집합을 두지 않아 무한히 커지지 않는다. */
const TOTAL_KEY = "visits:total";
const dayCountKey = (day: string) => `visits:day:${day}`;
const daySetKey = (day: string) => `visits:uv:${day}`;

export type VisitCounts = { today: number; total: number };

/**
 * 한국시간 기준 날짜(YYYY-MM-DD).
 *
 * 서버는 UTC 로 돈다. 그대로 쓰면 한국 오전 9시에 날짜가 바뀌어서, 아침에 들어온
 * 사람이 「어제」로 집계된다. 한국은 서머타임이 없어 +9 고정으로 충분하다.
 */
export function kstDay(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

/**
 * 사람이 아닌 요청.
 *
 * User-Agent 가 아예 없는 것도 제외한다 — 브라우저는 반드시 보낸다. 안 보내면
 * 스크립트다. 이 API 는 클라이언트 JS 에서만 호출되므로 자바스크립트를 실행하지
 * 않는 크롤러는 애초에 여기까지 오지 못한다. 이건 두 번째 그물이다.
 */
const BOT_UA =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|monitor|curl|wget|python-requests|okhttp|java\/|go-http|headless|lighthouse|pagespeed|pingdom|gtmetrix|semrush|ahrefs|mj12|dotbot|bytespider|petalbot|scrapy|phantomjs|puppeteer|playwright/i;

export function isBot(ua: string | null | undefined): boolean {
  if (!ua) return true;
  return BOT_UA.test(ua);
}

/** 요청 헤더의 쿠키 한 줄에서 이름 하나를 꺼낸다. */
export function readCookie(
  header: string | null | undefined,
  name: string,
): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return undefined;
}

/**
 * 쿠키 값에서 방문자 id 와 마지막 집계일을 꺼낸다.
 *
 * **형식을 검사한다.** 쿠키는 방문자가 마음대로 고칠 수 있는 값이라, 그대로
 * Redis 집합에 넣으면 아무 문자열이나 저장소에 쌓인다. uuid 모양이 아니면 버린다.
 */
export function parseVisitCookie(raw: string | undefined): {
  id: string | null;
  lastDay: string | null;
} {
  if (!raw) return { id: null, lastDay: null };
  const [id, lastDay] = raw.split(".");
  if (!id || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    return { id: null, lastDay: null };
  }
  return {
    id,
    lastDay: /^\d{4}-\d{2}-\d{2}$/.test(lastDay ?? "") ? lastDay : null,
  };
}

/**
 * 「중복 확인 → 집계 → 현재 값 읽기」를 한 덩어리로 실행한다.
 *
 * 명령을 나눠 보내면 SADD 는 성공했는데 INCR 이 실패하는 틈이 생긴다. 그 방문자는
 * 집합에 이름만 올라가고 숫자에는 영원히 반영되지 않는다 — 한 번 어긋나면 되돌릴
 * 방법도 없다. Lua 스크립트 안은 통째로 한 번에 돌아서 그런 틈이 없다.
 */
const COUNT_SCRIPT = `
local added = redis.call('SADD', KEYS[1], ARGV[1])
if added == 1 then
  redis.call('EXPIRE', KEYS[1], tonumber(ARGV[2]))
  return { redis.call('INCR', KEYS[2]), redis.call('INCR', KEYS[3]) }
end
return {
  tonumber(redis.call('GET', KEYS[2])) or 0,
  tonumber(redis.call('GET', KEYS[3])) or 0
}
`;

/** 오늘 처음 온 사람이면 세고, 아니면 현재 값만 돌려준다. */
export async function countVisit(
  redis: Redis,
  day: string,
  visitorId: string,
): Promise<VisitCounts> {
  const raw = await redis.eval(
    COUNT_SCRIPT,
    [daySetKey(day), dayCountKey(day), TOTAL_KEY],
    [visitorId, String(DAY_TTL_SEC)],
  );
  const [today, total] = raw as [number, number];
  return { today: Number(today) || 0, total: Number(total) || 0 };
}

/** 이미 센 방문자 — 숫자만 읽는다. */
export async function readCounts(
  redis: Redis,
  day: string,
): Promise<VisitCounts> {
  const [today, total] = await redis.mget<[number | null, number | null]>(
    dayCountKey(day),
    TOTAL_KEY,
  );
  return { today: Number(today) || 0, total: Number(total) || 0 };
}
