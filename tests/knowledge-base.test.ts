import { describe, it, expect } from "vitest";
import { KNOWLEDGE_BASE, KNOWLEDGE_BASE_VERSION } from "@/lib/data/knowledge-base";
import { RESUME_TEXT } from "@/lib/data/resume";

describe("knowledge-base", () => {
  it("크기가 충분히 크다 (5KB 이상)", () => {
    expect(KNOWLEDGE_BASE.length).toBeGreaterThan(5_000);
  });

  it("Gemini 1M 토큰 한도보다 훨씬 작다 (100KB 이내)", () => {
    expect(KNOWLEDGE_BASE.length).toBeLessThan(100_000);
  });

  it("핵심 식별자를 포함한다", () => {
    expect(KNOWLEDGE_BASE).toContain("정인수");
    expect(KNOWLEDGE_BASE).toContain("Vibe Coding");
    expect(KNOWLEDGE_BASE).toContain("17년");
    expect(KNOWLEDGE_BASE).toContain("팔레트");
    expect(KNOWLEDGE_BASE).toContain("AI Builder");
  });

  it("4 핵심 지표가 모두 포함된다", () => {
    expect(KNOWLEDGE_BASE).toContain("17년");
    expect(KNOWLEDGE_BASE).toContain("43");
    expect(KNOWLEDGE_BASE).toContain("81");
    expect(KNOWLEDGE_BASE).toContain("8 Live SaaS");
  });

  it("주요 SaaS 라이브 URL이 포함된다", () => {
    expect(KNOWLEDGE_BASE).toContain("tickpoint.co.kr");
    expect(KNOWLEDGE_BASE).toContain("isjung.mktinsight.kr");
  });

  it("TMON ROAS 7404 수치가 포함된다", () => {
    expect(KNOWLEDGE_BASE).toContain("7,404%");
  });

  it("이력서 텍스트가 정상 임베드된다", () => {
    expect(KNOWLEDGE_BASE).toContain(RESUME_TEXT.trim().slice(0, 100));
  });

  it("자격증·교육 정보가 포함된다", () => {
    expect(KNOWLEDGE_BASE).toContain("AIPOT");
    expect(KNOWLEDGE_BASE).toContain("검색광고마케터");
    expect(KNOWLEDGE_BASE).toContain("KOICA");
  });

  it("버전 식별자가 노출된다", () => {
    expect(KNOWLEDGE_BASE_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });
});
