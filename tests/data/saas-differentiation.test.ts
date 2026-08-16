import { describe, expect, it } from "vitest";
import { SAAS_LIST } from "@/lib/data/saas";
import { SAAS_DIFFERENTIATION } from "@/lib/data/saas-differentiation";

describe("SaaS Differentiation Data", () => {
  it("10개 SaaS 전부 차별화 데이터 보유", () => {
    const missing = SAAS_LIST.filter((s) => !s.differentiation).map(
      (s) => s.slug,
    );
    expect(missing).toEqual([]);
  });

  it("차별화 맵의 slug가 전부 실제 SaaS를 가리킨다 (오타 가드)", () => {
    const validSlugs = new Set(SAAS_LIST.map((s) => s.slug));
    const orphans = Object.keys(SAAS_DIFFERENTIATION).filter(
      (slug) => !validSlugs.has(slug),
    );
    expect(orphans).toEqual([]);
  });

  it("파이프라인 4단계 이상 — 각 단계에 이름 · 내용 · 존재 이유", () => {
    SAAS_LIST.forEach((s) => {
      const diff = s.differentiation;
      expect(diff, `${s.slug}: differentiation 없음`).toBeDefined();
      if (!diff) return;

      expect(
        diff.pipeline.length,
        `${s.slug}: 파이프라인 단계 부족`,
      ).toBeGreaterThanOrEqual(4);

      diff.pipeline.forEach((stage, i) => {
        expect(stage.name.trim(), `${s.slug} 단계 ${i + 1}: name 비어있음`)
          .not.toBe("");
        expect(stage.detail.trim(), `${s.slug} 단계 ${i + 1}: detail 비어있음`)
          .not.toBe("");
        expect(stage.why.trim(), `${s.slug} 단계 ${i + 1}: why 비어있음`)
          .not.toBe("");
      });
    });
  });

  it("일반 접근보다 단계가 많다 — 대조가 성립해야 한다", () => {
    SAAS_LIST.forEach((s) => {
      const diff = s.differentiation;
      if (!diff) return;
      expect(
        diff.genericSteps.length,
        `${s.slug}: 일반 접근 단계 부족`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        diff.pipeline.length,
        `${s.slug}: 대조 불성립 (일반 접근보다 단계가 적거나 같음)`,
      ).toBeGreaterThan(diff.genericSteps.length);
      expect(diff.genericLabel.trim(), `${s.slug}: genericLabel 비어있음`)
        .not.toBe("");
    });
  });

  it("거부 기준 2개 이상 — 규칙과 이유가 모두 있다", () => {
    SAAS_LIST.forEach((s) => {
      const diff = s.differentiation;
      if (!diff) return;
      expect(
        diff.refusals.length,
        `${s.slug}: 거부 기준 부족`,
      ).toBeGreaterThanOrEqual(2);
      diff.refusals.forEach((r, i) => {
        expect(r.rule.trim(), `${s.slug} 거부 ${i + 1}: rule 비어있음`)
          .not.toBe("");
        expect(r.reason.trim(), `${s.slug} 거부 ${i + 1}: reason 비어있음`)
          .not.toBe("");
      });
    });
  });

  it("고객사 실명 노출 금지 (기밀 보호)", () => {
    const allText = JSON.stringify(SAAS_DIFFERENTIATION);
    ["호반", "서울법무법인", "아주그룹", "한이룸", "한이룬"].forEach((name) => {
      expect(allText, `실명 "${name}" 노출됨`).not.toContain(name);
    });
  });

  it("자리표시자 텍스트가 남아있지 않다", () => {
    const allText = JSON.stringify(SAAS_DIFFERENTIATION);
    ["TODO", "TBD", "FIXME", "근거 없음", "lorem"].forEach((marker) => {
      expect(allText, `자리표시자 "${marker}" 남아있음`).not.toContain(marker);
    });
  });
});
