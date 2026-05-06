import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
  code: ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code className="bg-[var(--mute)]/25 px-1 py-0.5 rounded text-[12.5px] font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-[var(--mute)]/20 border border-[var(--line)] rounded-md p-2.5 my-1.5 text-[12.5px] font-mono whitespace-pre overflow-x-auto leading-snug">
        {children}
      </code>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  h1: ({ children }: { children?: React.ReactNode }) => (
    <p className="font-semibold mb-1.5 text-[15px]">{children}</p>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <p className="font-semibold mb-1.5 text-[14.5px]">{children}</p>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <p className="font-semibold mb-1.5">{children}</p>
  ),
  hr: () => <hr className="my-2 border-[var(--line)]" />,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-[var(--mute)] pl-3 my-1.5 opacity-80">
      {children}
    </blockquote>
  ),
};

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed break-words",
          isUser
            ? "bg-[var(--accent)] text-[var(--bg)] rounded-br-sm whitespace-pre-wrap"
            : "bg-[var(--mute)]/15 text-[var(--fg)] border border-[var(--line)] rounded-bl-sm"
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[var(--mute)]/15 border border-[var(--line)] rounded-2xl rounded-bl-sm px-4 py-3 inline-flex gap-1.5 items-center">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--fg)]/40 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--fg)]/40 animate-bounce"
          style={{ animationDelay: "120ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[var(--fg)]/40 animate-bounce"
          style={{ animationDelay: "240ms" }}
        />
      </div>
    </div>
  );
}
