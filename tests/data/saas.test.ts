import { describe, expect, it } from "vitest";
import { SAAS_LIST } from "@/lib/data/saas";

describe("SaaS Data", () => {
  it("10 SaaS 정확한 순서 (사용자 명시)", () => {
    expect(SAAS_LIST).toHaveLength(10);
    expect(SAAS_LIST.map((s) => s.slug)).toEqual([
      "os-agent",
      "lumio",
      "shopping-insight",
      "place-insight",
      "factto",
      "mkt-automation",
      "detail-page-studio",
      "tickpoint",
      "architect",
      "propintel",
    ]);
  });

  it("각 SaaS 5+ 능력 풀 (트렌디 룰)", () => {
    SAAS_LIST.forEach((s) =>
      expect(s.capabilities.length).toBeGreaterThanOrEqual(5)
    );
  });

  it("약어 풀어서 표현 (VCP · CF 금지)", () => {
    const allText = JSON.stringify(SAAS_LIST);
    expect(allText).not.toMatch(/\bVCP\b/);
    expect(allText).not.toMatch(/\bCF 모드\b/);
    expect(allText).toContain("변동성 수축 패턴");
    expect(allText).toContain("광고 영상");
  });
});
