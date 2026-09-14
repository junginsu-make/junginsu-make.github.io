import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { WHY_DIFFERENT, COUNTERS } from "@/lib/data/home";
import { SAAS_LIST } from "@/lib/data/saas";

describe("홈 — 왜 다른가 섹션", () => {
  it("모든 거부 기준이 실제 SaaS를 가리킨다", () => {
    const validSlugs = new Set(SAAS_LIST.map((s) => s.slug));
    const orphans = WHY_DIFFERENT.highlights
      .map((h) => h.slug)
      .filter((slug) => !validSlugs.has(slug));
    expect(orphans).toEqual([]);
  });

  it("거부 기준이 원본 시스템의 실제 거부 항목과 이어진다", () => {
    WHY_DIFFERENT.highlights.forEach((h) => {
      const saas = SAAS_LIST.find((s) => s.slug === h.slug);
      expect(saas, `${h.slug}: SaaS 없음`).toBeDefined();
      expect(
        saas?.differentiation?.refusals.length,
        `${h.slug}: 상세 페이지에 거부 기준이 없는데 홈에서 인용하고 있음`,
      ).toBeGreaterThan(0);
    });
  });

  it("항목마다 시스템명과 규칙이 비어있지 않다", () => {
    expect(WHY_DIFFERENT.highlights.length).toBeGreaterThanOrEqual(3);
    WHY_DIFFERENT.highlights.forEach((h, i) => {
      expect(h.system.trim(), `${i + 1}번 항목: system 비어있음`).not.toBe("");
      expect(h.rule.trim(), `${i + 1}번 항목: rule 비어있음`).not.toBe("");
    });
  });

  it("같은 시스템을 중복 인용하지 않는다", () => {
    const slugs = WHY_DIFFERENT.highlights.map((h) => h.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("홈 — SaaS 개수 동기화", () => {
  const homeDir = join(process.cwd(), "components", "home");

  it("Live SaaS 카운터가 실제 SaaS 개수와 일치한다", () => {
    const liveSaas = COUNTERS.find((c) => c.label === "Live SaaS");
    expect(liveSaas).toBeDefined();
    expect(Number(liveSaas?.value)).toBe(SAAS_LIST.length);
  });

  it("양면 섹션의 SaaS 개수가 실제 개수와 일치한다 (2026-08-16: 9로 어긋나 있었음)", () => {
    const src = readFileSync(join(homeDir, "duality.tsx"), "utf8");
    const match = src.match(
      /SaaS\s*<WordHighlight[^>]*>(\d+)<\/WordHighlight>\s*Live/,
    );
    expect(match, "duality.tsx에서 SaaS 개수 표기를 찾지 못함").not.toBeNull();
    expect(Number(match?.[1])).toBe(SAAS_LIST.length);
  });

  it("3분류 캡션의 SaaS 개수가 실제 개수와 일치한다", () => {
    const src = readFileSync(join(homeDir, "three-categories.tsx"), "utf8");
    const match = src.match(/SaaS\s*(\d+)\s*Live/);
    expect(match, "three-categories.tsx에서 SaaS 개수 표기를 찾지 못함").not.toBeNull();
    expect(Number(match?.[1])).toBe(SAAS_LIST.length);
  });

  // 2026-09-14: 목록 텍스트만 고치고 KPI 카운터(to: 10)를 놓쳐 빌더 히어로가 어긋났다.
  // 이제 개수를 주입받으므로, 다시 하드코딩되면 이 시험이 잡는다.
  it("빌더 히어로의 Live SaaS 수치가 하드코딩되어 있지 않다", () => {
    const src = readFileSync(
      join(process.cwd(), "components", "builder", "builder-hero.tsx"),
      "utf8",
    );
    expect(src, "KPI 카운터가 주입값을 쓰지 않는다").toContain(
      'to: saasCount, label: "Live SaaS"',
    );
    expect(src, "Live SaaS 카운터에 숫자가 하드코딩됐다").not.toMatch(
      /to:\s*\d+\s*,\s*label:\s*"Live SaaS"/,
    );
    expect(src, "히어로 문구의 SaaS 개수가 하드코딩됐다").not.toMatch(
      /SaaS\s\d+\sLive/,
    );
  });
});
