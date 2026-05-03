import { describe, expect, it } from "vitest";
import { CERTS_VISUAL, CERTS_TEXT } from "@/lib/data/certifications";

describe("Certifications", () => {
  it("AI/마케팅 비주얼 카드 3개", () => {
    expect(CERTS_VISUAL).toHaveLength(3);
    expect(CERTS_VISUAL[0].name).toContain("AIPOT");
    expect(CERTS_VISUAL[1].name).toContain("검색광고");
    expect(CERTS_VISUAL[2].name).toContain("SNS광고");
  });
  it("나머지 텍스트 자격 7개", () => expect(CERTS_TEXT).toHaveLength(7));
});
