import { describe, expect, it } from "vitest";
import { MANIFESTO, COUNTERS } from "@/lib/data/home";
import { GITHUB_TOTAL } from "@/lib/data/github";
import { AI_PL_CLIENTS } from "@/lib/data/marketing";

describe("Data Integration", () => {
  it("home manifesto 정의", () => expect(MANIFESTO).toContain("AI 시대"));
  it("home counters 4개", () => expect(COUNTERS).toHaveLength(4));
  it("GitHub total 84", () => expect(GITHUB_TOTAL).toBe(84));
  it("AI PL 4 클라이언트", () => expect(AI_PL_CLIENTS).toHaveLength(4));
});
