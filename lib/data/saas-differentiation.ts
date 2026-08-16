/**
 * SaaS 차별화 데이터 — "왜 아무나 못 만드는가"
 *
 * 각 SaaS의 실제 저장소 코드 분석(docs/superpowers/research/<slug>-facts.md)에서
 * 추출한 사실만 담는다. 추측·창작 금지.
 *
 * saas.ts가 800줄 제한에 가까워 별도 파일로 분리 — SAAS_LIST 조립 시 slug로 병합된다.
 */

/** 파이프라인 한 단계 — 무엇을 하는지(detail)와 왜 존재하는지(why)를 분리한다. */
export type PipelineStage = {
  /** 단계 이름 */
  name: string;
  /** 이 시스템이 실제로 하는 일 */
  detail: string;
  /** 이 단계가 존재하는 이유 — 도메인 판단이 들어가는 자리 */
  why: string;
};

/** 이 시스템이 하지 않는 것 — 거부 기준이 곧 품질 기준이다. */
export type Refusal = {
  rule: string;
  reason: string;
};

export type Differentiation = {
  /** 대조 대상 (예: "ChatGPT에 글을 시키면") */
  genericLabel: string;
  /** 일반 접근의 단계 — 3개 내외 */
  genericSteps: string[];
  /** 실제 파이프라인 — 5~10단계 */
  pipeline: PipelineStage[];
  /** 거부 기준 — 2개 이상 */
  refusals: Refusal[];
  /** 시스템별 서사 확장 문단 */
  narrative?: string[];
};

export const SAAS_DIFFERENTIATION: Record<string, Differentiation> = {};
