import { describe, expect, it } from "vitest";
import {
  MANIFESTO,
  HERO_META,
  COUNTERS,
  TECH_BADGES,
  CTA_QUOTE,
  CONTACT_EMAIL,
} from "@/lib/data/home";

describe("Home Data", () => {
  it("MANIFESTO 정확한 카피", () => {
    expect(MANIFESTO).toBe(
      "AI 시대를 만난 17년 마케터가, 풀사이클 빌더로 다시 태어났다",
    );
  });

  it("HERO_META 4개 필드", () => {
    expect(HERO_META.name).toBe("정인수");
    expect(HERO_META.birth).toBe("1983");
    expect(HERO_META.role).toContain("Palette");
  });

  it("COUNTERS 4개 — GitHub와 make.com 절대 합산 X", () => {
    expect(COUNTERS).toHaveLength(4);
    const labels = COUNTERS.map((c) => c.label);
    expect(labels).toContain("Career");
    expect(labels.some((l) => l.includes("GitHub"))).toBe(true);
    expect(labels.some((l) => l.includes("Make.com"))).toBe(true);
    expect(labels.some((l) => l.includes("Live SaaS"))).toBe(true);
    // 합산 라벨 (예: "Total Systems") 금지
    expect(labels.some((l) => /total|combined|all systems/i.test(l))).toBe(
      false,
    );
  });

  it("TECH_BADGES 풀세트", () => {
    expect(TECH_BADGES.length).toBeGreaterThanOrEqual(7);
    expect(TECH_BADGES).toContain("Claude");
    expect(TECH_BADGES).toContain("Make.com");
  });

  it("CONTACT_EMAIL 9843ohs", () => {
    expect(CONTACT_EMAIL).toBe("9843ohs@gmail.com");
  });

  it("CTA_QUOTE 정의", () => {
    expect(CTA_QUOTE).toContain("커피");
  });
});
