import { describe, expect, it } from "vitest";
import { CORE_SCENARIOS, INVENTORY_GROUPS } from "@/lib/data/scenarios";

describe("Make.com Scenarios", () => {
  it("4 핵심 시나리오 정확", () => {
    expect(CORE_SCENARIOS).toHaveLength(4);
    expect(CORE_SCENARIOS[0].title).toContain("정부지원사업");
    expect(CORE_SCENARIOS[1].title).toContain("10X");
    expect(CORE_SCENARIOS[2].title).toContain("계약서");
    expect(CORE_SCENARIOS[3].title).toContain("뉴스레터");
  });
  it("81 인벤토리 6 제품군 보조 라벨", () => {
    expect(INVENTORY_GROUPS).toHaveLength(6);
    expect(INVENTORY_GROUPS.every((g) => g.isMain === false)).toBe(true);
  });
  it("서울법무법인 메인에 노출 X (클라이언트 작업)", () => {
    const allText = JSON.stringify(CORE_SCENARIOS);
    expect(allText).not.toContain("서울법무법인");
  });
});
