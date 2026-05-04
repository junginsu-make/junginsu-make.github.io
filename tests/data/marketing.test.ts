import { describe, expect, it } from "vitest";
import {
  AI_PL_CLIENTS,
  AI_CONTENT_OP_CLIENTS,
  CAPSULE_PM_PROJECTS,
  AD_CHANNELS,
  COMPANY_AD_BUDGET,
} from "@/lib/data/marketing";

describe("Marketing Data", () => {
  it("AI PL 클라이언트 4건 진행 중", () => {
    expect(AI_PL_CLIENTS).toHaveLength(4);
    expect(AI_PL_CLIENTS).toContain("호반그룹");
    expect(AI_PL_CLIENTS).toContain("서울법무법인");
  });

  it("AI Content Operation 7+ 클라이언트", () => {
    expect(AI_CONTENT_OP_CLIENTS.length).toBeGreaterThanOrEqual(7);
    expect(AI_CONTENT_OP_CLIENTS).toContain("성동청년이룸창업지원센터");
  });

  it("Capsule PM 4 명시 + 14건 추가", () => {
    expect(CAPSULE_PM_PROJECTS).toHaveLength(4);
    expect(
      CAPSULE_PM_PROJECTS.find((p) => p.name.includes("창업진흥원"))?.role,
    ).toContain("총괄 PM");
  });

  it("AD_CHANNELS owned + paid 분리", () => {
    expect(AD_CHANNELS.owned).toEqual(
      expect.arrayContaining(["Blog", "SNS", "YouTube"]),
    );
    expect(AD_CHANNELS.paid).toEqual(
      expect.arrayContaining(["Naver", "Kakao", "Google"]),
    );
  });

  it("COMPANY_AD_BUDGET 정확 — TMON ROAS 검증됨 (개인 포토폴리오-23.03.02.pdf), NGO 마음하나 X (여전히 미검증)", () => {
    const allText = JSON.stringify(COMPANY_AD_BUDGET);
    // NGO 마음하나는 여전히 미검증 — 사용 금지
    expect(allText).not.toContain("4,378");
    expect(allText).not.toContain("마음하나");
    // 정확한 임팩트 (정량 데이터)
    expect(allText).toContain("40~60억");
    expect(allText).toContain("20억");
    // TMON ROAS 7,404% 는 PDF로 검증되어 사용 가능
    expect(allText).toContain("7,404");
  });
});
