import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { onRequestPost, SYSTEM_PROMPT_FOR_TESTS } from "../functions/api/chat";

interface MockEnv {
  GEMINI_API_KEY: string;
}

function makeContext(body: unknown, env: MockEnv = { GEMINI_API_KEY: "test-key" }) {
  return {
    request: new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    env,
  };
}

describe("/api/chat — POST handler", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [{ text: "안녕하세요! 정인수님은 17년차 마케터이자 AI Builder입니다." }],
                role: "model",
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("정상 메시지에 200으로 응답한다", async () => {
    const ctx = makeContext({
      messages: [{ role: "user", content: "안녕하세요" }],
    });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { reply: string };
    expect(data.reply).toContain("정인수님");
  });

  it("messages 누락 시 400", async () => {
    const ctx = makeContext({});
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(400);
  });

  it("빈 messages 배열 시 400", async () => {
    const ctx = makeContext({ messages: [] });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(400);
  });

  it("user 메시지가 하나도 없으면 400", async () => {
    const ctx = makeContext({
      messages: [{ role: "assistant", content: "안녕" }],
    });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(400);
  });

  it("API 키 미설정 시 500", async () => {
    const ctx = makeContext(
      { messages: [{ role: "user", content: "테스트" }] },
      { GEMINI_API_KEY: "" }
    );
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(500);
    const data = (await res.json()) as { error: string };
    expect(data.error).toContain("GEMINI_API_KEY");
  });

  it("잘못된 JSON 본문은 400", async () => {
    const ctx = makeContext("not-json{{{");
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(400);
  });

  it("Gemini 에러 응답은 그대로 전파", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "rate limit" }), { status: 429 })
    );
    const ctx = makeContext({
      messages: [{ role: "user", content: "테스트" }],
    });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(429);
  });

  it("Gemini가 빈 응답을 주면 502", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ candidates: [] }), { status: 200 })
    );
    const ctx = makeContext({
      messages: [{ role: "user", content: "테스트" }],
    });
    const res = await onRequestPost(ctx);
    expect(res.status).toBe(502);
  });

  it("Gemini로 보내는 페이로드에 systemInstruction과 contents가 있다", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const ctx = makeContext({
      messages: [
        { role: "user", content: "안녕하세요" },
        { role: "assistant", content: "안녕하세요!" },
        { role: "user", content: "정인수님은 누구세요?" },
      ],
    });
    await onRequestPost(ctx);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const callArgs = fetchSpy.mock.calls[0];
    const url = callArgs[0] as string;
    expect(url).toContain("gemini-2.5-flash");
    expect(url).toContain("test-key");

    const init = callArgs[1] as RequestInit;
    const body = JSON.parse(init.body as string);
    expect(body.systemInstruction.parts[0].text).toContain("정인수");
    expect(body.contents).toHaveLength(3);
    expect(body.contents[0].role).toBe("user");
    expect(body.contents[1].role).toBe("model");
    expect(body.contents[2].role).toBe("user");
  });

  it("매우 긴 사용자 메시지는 4000자로 잘린다", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const longMsg = "ㄱ".repeat(8000);
    const ctx = makeContext({
      messages: [{ role: "user", content: longMsg }],
    });
    await onRequestPost(ctx);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(body.contents[0].parts[0].text).toHaveLength(4000);
  });

  it("12개 초과 메시지는 마지막 12개만 전송", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const messages = Array.from({ length: 20 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `메시지${i}`,
    }));
    const ctx = makeContext({ messages });
    await onRequestPost(ctx);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    // leading assistant strip이 동작하면 12개 미만이 될 수도 있음. 최대 12개 검증.
    expect(body.contents.length).toBeLessThanOrEqual(12);
    expect(body.contents[0].role).toBe("user");
  });

  it("leading assistant 메시지는 제거 후 user로 시작", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const ctx = makeContext({
      messages: [
        { role: "assistant", content: "합성 인사말" },
        { role: "user", content: "안녕" },
      ],
    });
    await onRequestPost(ctx);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(body.contents).toHaveLength(1);
    expect(body.contents[0].role).toBe("user");
    expect(body.contents[0].parts[0].text).toBe("안녕");
  });

  it("연속된 leading assistant 모두 제거", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const ctx = makeContext({
      messages: [
        { role: "assistant", content: "인사1" },
        { role: "assistant", content: "인사2" },
        { role: "user", content: "안녕" },
      ],
    });
    await onRequestPost(ctx);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(body.contents).toHaveLength(1);
    expect(body.contents[0].role).toBe("user");
  });

  it("Gemini 오류 본문은 사용자에게 노출되지 않음", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: { message: "INTERNAL_PROJECT_DETAIL_xyz" } }),
        { status: 500 }
      )
    );
    const ctx = makeContext({
      messages: [{ role: "user", content: "테스트" }],
    });
    const res = await onRequestPost(ctx);
    const data = (await res.json()) as { error: string };
    expect(data.error).not.toContain("INTERNAL_PROJECT_DETAIL");
    expect(data.error).toContain("AI 응답");
  });
});

describe("SYSTEM_PROMPT", () => {
  it("핵심 지시사항을 포함한다", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("한국어");
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("정인수");
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("지식베이스");
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("17년");
  });

  it("KNOWLEDGE_BASE가 임베드된다 (TMON 수치 포함)", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("7,404%");
  });

  it("마크다운 사용 가능 지시 (자연스러운 포맷팅)", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("마크다운");
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/사용 가능|자유롭게|자연스럽게/);
  });

  it("프롬프트 인젝션 방어 지시가 포함된다", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/시스템 프롬프트.*출력|통째/);
  });

  it("주/부 임무 (정인수님 안내 + 일반 질문 답변) 둘 다 명시", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("주 임무");
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("부 임무");
  });

  it("일반 질문 답변 시 정인수님 무관 명시 의무 지시", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/관련 없는 일반|포트폴리오와 별개|이력서에는 없는/);
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/명시/);
  });

  it("일반 질문 카테고리 (시사·코딩·번역·AI 비교 등) 예시 포함", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("시사");
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("번역");
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("코딩");
  });

  it("경계 질문 (사용 기술 일반 설명) 처리 가이드 포함", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/경계 질문|일반 정의|일반 정보를 보완/);
  });

  it("KB 사실 외 추측·창작 금지 강조", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/만들어내기 (절대 )?금지|창작.*금지|추측.*금지/);
  });

  it("프롬프트 인젝션·사칭·유해 정보는 일반 모드로도 거절", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/항상 거절|일반 답변도 X/);
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/사칭|가짜.*생성/);
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/불법|유해/);
  });

  it("한국어 작성 규칙 (띄어쓰기·문법·문단) 엄격 지시", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("한국어 작성");
    expect(SYSTEM_PROMPT_FOR_TESTS).toContain("띄어쓰기");
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/의존명사.*띄어/);
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/조사.*붙/);
  });

  it("자주 틀리는 한국어 (되요/안되/할께 등) 명시", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/돼요/);
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/할게요/);
  });

  it("문단 구분·줄바꿈 규칙 포함", () => {
    expect(SYSTEM_PROMPT_FOR_TESTS).toMatch(/문단|빈 줄/);
  });
});
