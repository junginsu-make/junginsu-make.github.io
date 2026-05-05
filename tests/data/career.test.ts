import { describe, expect, it } from "vitest";
import { IMPACT_STREAMS, CAREER_FULL } from "@/lib/data/career";

describe("Career Data", () => {
  it("6 임팩트 스트림 정확히 정의", () => {
    expect(IMPACT_STREAMS).toHaveLength(6);
    expect(IMPACT_STREAMS[0].title).toContain("AI Builder");
    expect(IMPACT_STREAMS[3].title).toContain("광고 운영");
  });

  it("17 회사 풀 타임라인 정확히 정의 (이력서 기준)", () => {
    expect(CAREER_FULL).toHaveLength(17);
    expect(CAREER_FULL[0].company).toBe("팔레트 ㈜");
    expect(CAREER_FULL[0].current).toBe(true);
  });

  it("글로리아교육재단 임팩트 표현 — 자동화 X, 정확한 마케팅 표현", () => {
    const gloria = CAREER_FULL.find((c) => c.company.includes("글로리아"));
    expect(gloria).toBeDefined();
    expect(gloria!.impact).not.toContain("자동화");
    expect(gloria!.impact).toContain("블로그");
    expect(gloria!.impact).toContain("입학");
  });

  it("출처 미검증 데이터 사용 X (TMON ROAS / NGO 마음하나)", () => {
    const allText = JSON.stringify({ IMPACT_STREAMS, CAREER_FULL });
    expect(allText).not.toContain("7404");
    expect(allText).not.toContain("4,378");
    expect(allText).not.toContain("마음하나");
  });
});
