import { describe, expect, it } from "vitest";
import {
  GITHUB_TOTAL,
  GITHUB_PROFILE,
  GITHUB_CATEGORIES,
  GOLDEN_PRINCIPLES,
} from "@/lib/data/github";

describe("GitHub Data", () => {
  it("GITHUB_TOTAL = 84 (2026-05-03 기준 정확)", () => {
    expect(GITHUB_TOTAL).toBe(84);
  });

  it("GITHUB_PROFILE 정확", () => {
    expect(GITHUB_PROFILE).toBe("https://github.com/junginsu-make");
  });

  it("GITHUB_CATEGORIES 5+ 메인 그룹 + NEW 그룹", () => {
    expect(GITHUB_CATEGORIES.length).toBeGreaterThanOrEqual(6);
    expect(GITHUB_CATEGORIES.find((c) => c.id === "A")).toBeDefined();
    expect(GITHUB_CATEGORIES.find((c) => c.id === "NEW")).toBeDefined();
  });

  it("GITHUB_CATEGORIES 합계 = GITHUB_TOTAL (gap 없음)", () => {
    const sum = GITHUB_CATEGORIES.reduce((acc, c) => acc + c.count, 0);
    expect(sum).toBe(GITHUB_TOTAL); // 합쳐서 정확히 84
  });

  it("GOLDEN_PRINCIPLES 12개", () => {
    expect(GOLDEN_PRINCIPLES).toHaveLength(12);
    expect(GOLDEN_PRINCIPLES[0]).toBe("Immutability");
  });

  it("make.com 핵심과 합산 표기 X (별도 정체성)", () => {
    const allText = JSON.stringify(GITHUB_CATEGORIES);
    expect(allText).not.toContain("100+ 시스템");
    expect(allText).not.toContain("100 시나리오");
  });
});
