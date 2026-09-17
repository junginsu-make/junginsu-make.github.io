import { describe, expect, it, vi } from "vitest";
import type { Redis } from "@upstash/redis";
import {
  VISIT_COOKIE,
  countVisit,
  isBot,
  kstDay,
  parseVisitCookie,
  readCookie,
  readCounts,
} from "@/lib/visits";

const UUID = "3f2a91c4-8b0d-4e27-9a55-1c6de0f7b842";

describe("kstDay — 한국시간 기준 날짜", () => {
  it("UTC 15:00 을 넘기면 한국은 다음 날이다", () => {
    expect(kstDay(new Date("2026-09-17T15:00:00Z"))).toBe("2026-09-18");
  });

  it("UTC 14:59 까지는 같은 날이다", () => {
    expect(kstDay(new Date("2026-09-17T14:59:59Z"))).toBe("2026-09-17");
  });

  it("UTC 00:00 은 한국 오전 9시 — 날짜가 바뀌지 않는다", () => {
    expect(kstDay(new Date("2026-09-17T00:00:00Z"))).toBe("2026-09-17");
  });

  it("연말에도 해를 넘긴다", () => {
    expect(kstDay(new Date("2026-12-31T15:00:00Z"))).toBe("2027-01-01");
  });
});

describe("isBot — 사람이 아닌 요청", () => {
  it.each([
    ["Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"],
    ["curl/8.4.0"],
    ["python-requests/2.31.0"],
    ["Mozilla/5.0 AhrefsBot/7.0"],
    ["HeadlessChrome/120.0.0.0"],
  ])("걸러낸다: %s", (ua) => {
    expect(isBot(ua)).toBe(true);
  });

  it("User-Agent 가 없으면 사람이 아니다", () => {
    expect(isBot(null)).toBe(true);
    expect(isBot("")).toBe(true);
  });

  it.each([
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    ],
  ])("사람은 통과시킨다: %s", (ua) => {
    expect(isBot(ua)).toBe(false);
  });
});

describe("readCookie", () => {
  it("여러 쿠키 중 이름으로 하나를 꺼낸다", () => {
    expect(readCookie(`theme-v2=dark; ${VISIT_COOKIE}=abc; x=1`, VISIT_COOKIE)).toBe("abc");
  });

  it("없으면 undefined", () => {
    expect(readCookie("theme-v2=dark", VISIT_COOKIE)).toBeUndefined();
    expect(readCookie(null, VISIT_COOKIE)).toBeUndefined();
  });

  it("이름이 부분 일치하는 쿠키에 속지 않는다", () => {
    expect(readCookie(`xpv=other; ${VISIT_COOKIE}=mine`, VISIT_COOKIE)).toBe("mine");
  });
});

describe("parseVisitCookie — 방문자가 고칠 수 있는 값이다", () => {
  it("id 와 날짜를 꺼낸다", () => {
    expect(parseVisitCookie(`${UUID}.2026-09-17`)).toEqual({
      id: UUID,
      lastDay: "2026-09-17",
    });
  });

  it("날짜가 비어 있어도 id 는 살린다", () => {
    expect(parseVisitCookie(`${UUID}.`)).toEqual({ id: UUID, lastDay: null });
  });

  it("uuid 모양이 아니면 통째로 버린다 — 저장소에 아무 문자열이나 쌓이면 안 된다", () => {
    expect(parseVisitCookie("../../etc/passwd.2026-09-17").id).toBeNull();
    expect(parseVisitCookie(`${"x".repeat(5000)}.2026-09-17`).id).toBeNull();
    expect(parseVisitCookie("2026-09-17").id).toBeNull();
  });

  it("날짜 모양이 아니면 날짜만 버린다", () => {
    expect(parseVisitCookie(`${UUID}.9999`)).toEqual({ id: UUID, lastDay: null });
  });

  it("빈 쿠키", () => {
    expect(parseVisitCookie(undefined)).toEqual({ id: null, lastDay: null });
  });
});

describe("countVisit — 집계", () => {
  it("Lua 에 집합키·일별키·전체키와 방문자 id 를 넘긴다", async () => {
    const evalFn = vi.fn().mockResolvedValue([7, 1234]);
    const redis = { eval: evalFn } as unknown as Redis;

    const counts = await countVisit(redis, "2026-09-17", UUID);

    expect(counts).toEqual({ today: 7, total: 1234 });
    const [script, keys, args] = evalFn.mock.calls[0];
    expect(keys).toEqual(["visits:uv:2026-09-17", "visits:day:2026-09-17", "visits:total"]);
    expect(args[0]).toBe(UUID);
    expect(Number(args[1])).toBe(48 * 60 * 60);
    // 한 번의 왕복으로 끝나야 틈이 없다 — SADD 와 INCR 이 같은 스크립트 안에 있다.
    expect(script).toContain("SADD");
    expect(script).toContain("INCR");
  });

  it("문자열로 돌아와도 숫자로 만든다", async () => {
    const redis = { eval: vi.fn().mockResolvedValue(["3", "9"]) } as unknown as Redis;
    expect(await countVisit(redis, "2026-09-17", UUID)).toEqual({ today: 3, total: 9 });
  });
});

describe("readCounts — 이미 센 방문자", () => {
  it("일별키와 전체키를 읽는다", async () => {
    const mget = vi.fn().mockResolvedValue([12, 500]);
    const redis = { mget } as unknown as Redis;

    expect(await readCounts(redis, "2026-09-17")).toEqual({ today: 12, total: 500 });
    expect(mget).toHaveBeenCalledWith("visits:day:2026-09-17", "visits:total");
  });

  it("아직 아무도 안 온 날은 0 이다 (null 이 아니라)", async () => {
    const redis = { mget: vi.fn().mockResolvedValue([null, null]) } as unknown as Redis;
    expect(await readCounts(redis, "2026-09-17")).toEqual({ today: 0, total: 0 });
  });
});

describe("푸터 카운터 — 화면에 붙는 쪽", () => {
  it("VisitorCounter 를 export 한다", async () => {
    const mod = await import("@/components/layout/visitor-counter");
    expect(mod.VisitorCounter).toBeTypeOf("function");
  });

  /**
   * 한 번 당했던 자리다. Counter 는 기본적으로 뷰포트 가운데 40% 안에 들어와야
   * 숫자를 올리는데, 이 카운터는 푸터 맨 아랫줄(1440×900 에서 y=840)이라 그
   * 조건이 영영 만족되지 않는다. 화면에는 멀쩡히 그려지고 숫자만 0 이라
   * 눈으로 훑어서는 못 잡는다 — startOnMount 가 빠지면 여기서 걸린다.
   */
  it("두 숫자 모두 startOnMount 로 센다", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync("components/layout/visitor-counter.tsx", "utf-8");
    const counters = src.match(/<Counter[^>]*\/>/g) ?? [];
    expect(counters).toHaveLength(2);
    counters.forEach((tag) => expect(tag).toContain("startOnMount"));
  });

  it("Counter 는 startOnMount 없이도 예전처럼 동작한다 (기본값 false)", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync("components/motion/counter.tsx", "utf-8");
    expect(src).toContain("startOnMount = false");
  });
});
