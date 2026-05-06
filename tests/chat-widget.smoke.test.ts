import { describe, it, expect } from "vitest";

// Smoke 테스트 — 실제 렌더링은 pnpm build (Next.js TS + 번들링)으로 검증.
// 여기선 모듈이 import되고 export 시그니처가 유지되는지만 확인.

describe("chat-widget — smoke", () => {
  it("ChatWidget 컴포넌트를 export한다", async () => {
    const mod = await import("@/components/chat/chat-widget");
    expect(mod.ChatWidget).toBeTypeOf("function");
  });

  it("ChatMessageBubble과 ChatTypingIndicator를 export한다", async () => {
    const mod = await import("@/components/chat/chat-message");
    expect(mod.ChatMessageBubble).toBeTypeOf("function");
    expect(mod.ChatTypingIndicator).toBeTypeOf("function");
  });
});
