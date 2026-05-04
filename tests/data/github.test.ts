import { describe, expect, it } from "vitest";
import {
  GITHUB_TOTAL,
  GITHUB_PROFILE,
  GITHUB_CATEGORIES,
  GOLDEN_PRINCIPLES,
} from "@/lib/data/github";

describe("GitHub Data", () => {
  it("GITHUB_TOTAL = 43 (2026-05-04 외부 공개 기준, api.github.com/users/junginsu-make → public_repos)", () => {
    expect(GITHUB_TOTAL).toBe(43);
  });

  it("GITHUB_PROFILE 정확", () => {
    expect(GITHUB_PROFILE).toBe("https://github.com/junginsu-make");
  });

  it("GITHUB_CATEGORIES 5 메인 그룹 (A~E)", () => {
    expect(GITHUB_CATEGORIES.length).toBeGreaterThanOrEqual(5);
    for (const id of ["A", "B", "C", "D", "E"]) {
      expect(GITHUB_CATEGORIES.find((c) => c.id === id)).toBeDefined();
    }
  });

  it("GITHUB_CATEGORIES 합계 = GITHUB_TOTAL (gap 없음, 정확히 43)", () => {
    const sum = GITHUB_CATEGORIES.reduce((acc, c) => acc + c.count, 0);
    expect(sum).toBe(GITHUB_TOTAL);
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
