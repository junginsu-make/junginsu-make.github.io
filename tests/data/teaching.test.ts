import { describe, expect, it } from "vitest";
import { TIER1, TIER2, TIER3 } from "@/lib/data/teaching";

describe("Teaching Tiers", () => {
  it("Tier 1 정부 · 대학 · AI 6 카드", () => {
    expect(TIER1).toHaveLength(6);
    expect(TIER1.find((t) => t.name.includes("KOICA"))).toBeDefined();
  });
  it("Tier 2 협회 · 기업 8 카드", () => expect(TIER2).toHaveLength(8));
  it("Tier 3 개인 텍스트 15+", () =>
    expect(TIER3.length).toBeGreaterThanOrEqual(15));
});
