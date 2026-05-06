"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChatMessageBubble,
  ChatTypingIndicator,
  type ChatMessage,
} from "./chat-message";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "안녕하세요! 정인수님의 포트폴리오 AI 어시스턴트예요.\n경력·SaaS·자동화 시나리오·강의 등 무엇이든 물어보세요.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `요청 실패 (${res.status})`);
      }
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void send();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send();
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -100 || info.velocity.x < -500) {
      setOpen(false);
    }
  };

  const panelMotion = useMemo(() => {
    if (isMobile) {
      return {
        initial: { x: "-100%" as const },
        animate: { x: 0 },
        exit: { x: "-100%" as const },
        transition: { type: "tween" as const, duration: 0.32, ease: [0.32, 0.72, 0, 1] },
      };
    }
    return {
      initial: { opacity: 0, y: 12, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 12, scale: 0.96 },
      transition: { duration: 0.22, ease: [0.6, 0.05, 0.3, 0.95] as const },
    };
  }, [isMobile]);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="AI 채팅 열기"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.6, 0.05, 0.3, 0.95] }}
            className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle size={isMobile ? 22 : 26} aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {isMobile && (
              <motion.div
                key="chat-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 bg-black/40"
                aria-hidden
              />
            )}

            <motion.div
              key="chat-panel"
              role="dialog"
              aria-label="AI 채팅"
              aria-modal={isMobile}
              {...panelMotion}
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.6, right: 0 }}
              onDragEnd={handleDragEnd}
              className={cn(
                "fixed z-50 flex flex-col bg-[var(--bg)] border border-[var(--line)] shadow-2xl",
                isMobile
                  ? "inset-y-0 left-0 rounded-r-2xl"
                  : "bottom-6 left-6 md:bottom-10 md:left-10 w-[380px] h-[600px] max-h-[calc(100vh-5rem)] rounded-2xl"
              )}
              style={isMobile ? { width: "66.67vw" } : undefined}
            >
              <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)] text-white">
                    <MessageCircle size={16} aria-hidden />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[14px] font-medium text-[var(--fg)]">정인수 AI</span>
                    <span className="text-[11px] text-[var(--fg)]/50 font-mono uppercase tracking-wider">
                      Portfolio Assistant
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="채팅 닫기"
                  className="p-1.5 rounded-md text-[var(--fg)]/60 hover:text-[var(--fg)] hover:bg-[var(--mute)]/15 transition-colors"
                >
                  <X size={18} aria-hidden />
                </button>
              </header>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              >
                {messages.map((m, i) => (
                  <ChatMessageBubble key={i} message={m} />
                ))}
                {loading && <ChatTypingIndicator />}
                {error && (
                  <div className="text-[12px] text-red-500 px-1">
                    오류: {error}
                  </div>
                )}
              </div>

              <form
                onSubmit={onSubmit}
                className="border-t border-[var(--line)] p-3 shrink-0"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="무엇이든 물어보세요"
                    rows={1}
                    disabled={loading}
                    className="flex-1 resize-none bg-transparent text-[14px] text-[var(--fg)] placeholder:text-[var(--fg)]/40 outline-none px-2 py-1.5 max-h-[120px]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="메시지 전송"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform shrink-0"
                  >
                    <Send size={15} aria-hidden />
                  </button>
                </div>
                {isMobile && (
                  <p className="mt-2 text-[10px] text-[var(--fg)]/40 font-mono uppercase tracking-wider text-center">
                    왼쪽으로 끌어 닫기
                  </p>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
