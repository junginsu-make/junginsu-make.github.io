import { describe, expect, it } from "vitest";
import {
  MANIFESTO,
  COUNTERS,
  TECH_BADGES,
  CTA_QUOTE,
  CONTACT_EMAIL,
} from "@/lib/data/home";

describe("Home Data", () => {
  it("MANIFESTO 단순 카피 — '마케터 + AI 빌더'", () => {
    expect(MANIFESTO).toBe("마케터 + AI 빌더");
  });

  it("COUNTERS 4개 — GitHub 43 + make.com 81 시스템(4 핵심) 분리 표기", () => {
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

  it("COUNTERS — GitHub = 43, Make.com = 81 (4 핵심 부제)", () => {
    const github = COUNTERS.find((c) => c.label.includes("GitHub"));
    expect(github?.value).toBe("43");
    const make = COUNTERS.find((c) => c.label.includes("Make.com"));
    expect(make?.value).toBe("81");
    expect(make?.label).toContain("4 핵심");
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
