import { describe, expect, it } from "vitest";
import {
  MANIFESTO,
  COUNTERS,
  TECH_BADGES,
  CONTACT_EMAIL,
} from "@/lib/data/home";

describe("Home Data", () => {
  it("MANIFESTO 전체 카피 — '17년 Marketer + AI Builder' (한영 혼용)", () => {
    expect(MANIFESTO).toBe(
      "AI 시대를 만난 17년 Marketer가, AI Builder로 다시 태어났다",
    );
  });

  it("COUNTERS 4개 — Vibe Coding 43 + 자동화 시나리오 81 분리 표기", () => {
    expect(COUNTERS).toHaveLength(4);
    const labels = COUNTERS.map((c) => c.label);
    expect(labels).toContain("Career");
    expect(labels.some((l) => l.includes("Vibe Coding"))).toBe(true);
    expect(labels.some((l) => l.includes("자동화 시나리오"))).toBe(true);
    expect(labels.some((l) => l.includes("Live SaaS"))).toBe(true);
    // 합산 라벨 (예: "Total Systems") 금지
    expect(labels.some((l) => /total|combined|all systems/i.test(l))).toBe(
      false,
    );
  });

  it("COUNTERS — Vibe Coding = 43, 자동화 시나리오 = 81", () => {
    const vibe = COUNTERS.find((c) => c.label.includes("Vibe Coding"));
    expect(vibe?.value).toBe("43");
    const auto = COUNTERS.find((c) => c.label.includes("자동화 시나리오"));
    expect(auto?.value).toBe("81");
  });

  it("TECH_BADGES 풀세트", () => {
    expect(TECH_BADGES.length).toBeGreaterThanOrEqual(7);
    expect(TECH_BADGES).toContain("Claude");
    expect(TECH_BADGES).toContain("자동화 시나리오");
  });

  it("CONTACT_EMAIL 9843ohs", () => {
    expect(CONTACT_EMAIL).toBe("9843ohs@gmail.com");
  });
});
