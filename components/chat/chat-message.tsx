import { cn } from "@/lib/utils";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "bg-[var(--accent)] text-[var(--bg)] rounded-br-sm"
            : "bg-[var(--mute)]/15 text-[var(--fg)] border border-[var(--line)] rounded-bl-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

export function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[var(--mute)]/15 border border-[var(--line)] rounded-2xl rounded-bl-sm px-4 py-3 inline-flex gap-1.5 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg)]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg)]/40 animate-bounce" style={{ animationDelay: "120ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg)]/40 animate-bounce" style={{ animationDelay: "240ms" }} />
      </div>
    </div>
  );
}
