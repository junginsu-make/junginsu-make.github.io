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
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChatMessageBubble,
  ChatTypingIndicator,
  type ChatMessage,
} from "./chat-message";
import { WalkingCharacter } from "./walking-character";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "안녕하세요!\n정인수님의 포트폴리오 AI 어시스턴트예요.\n\n경력·SaaS·자동화 시나리오·강의 등\n무엇이든 물어보세요.",
};

const DESKTOP_CHARACTER_SIZE = 128;
const MOBILE_CHARACTER_SIZE = 100;

type WanderTarget = {
  x: number;
  y: number;
  scaleX: 1 | -1;
  rotate: number;
  duration: number;
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [characterMoving, setCharacterMoving] = useState(false);
  const [wanderTarget, setWanderTarget] = useState<WanderTarget>({
    x: 0,
    y: 0,
    scaleX: 1,
    rotate: 0,
    duration: 8,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef(false);
  const wanderPauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const nextWanderTarget = useCallback(
    (current: WanderTarget): WanderTarget => {
      if (typeof window === "undefined" || prefersReducedMotion) {
        return { x: 0, y: 0, scaleX: 1, rotate: 0, duration: 0 };
      }

      const size = isMobile ? MOBILE_CHARACTER_SIZE : DESKTOP_CHARACTER_SIZE;
      const leftInset = isMobile ? 16 : 24;
      const rightInset = 18;
      const maxLift = isMobile ? 14 : 22;
      const maxX = Math.max(0, window.innerWidth - leftInset - rightInset - size);
      const nextX = Math.round(Math.random() * maxX);
      const nextY = -Math.round(Math.random() * maxLift);
      const distance = Math.hypot(nextX - current.x, nextY - current.y);

      return {
        x: nextX,
        y: nextY,
        scaleX: nextX >= current.x ? 1 : -1,
        rotate: Math.round((Math.random() - 0.5) * 2),
        duration: Math.min(20, Math.max(8, distance / (isMobile ? 22 : 26))),
      };
    },
    [isMobile, prefersReducedMotion]
  );

  useEffect(() => {
    if (open || prefersReducedMotion) {
      if (wanderPauseRef.current) {
        clearTimeout(wanderPauseRef.current);
        wanderPauseRef.current = null;
      }
      setCharacterMoving(false);
      return;
    }

    const queueNextMove = (pauseMs: number) => {
      if (wanderPauseRef.current) {
        clearTimeout(wanderPauseRef.current);
      }

      wanderPauseRef.current = setTimeout(() => {
        setWanderTarget((current) => {
          const next = nextWanderTarget(current);

          wanderPauseRef.current = setTimeout(() => {
            setCharacterMoving(false);
            queueNextMove(1400 + Math.random() * 1600);
          }, next.duration * 1000);

          return next;
        });

        setCharacterMoving(true);
      }, pauseMs);
    };

    queueNextMove(550);

    return () => {
      if (wanderPauseRef.current) {
        clearTimeout(wanderPauseRef.current);
        wanderPauseRef.current = null;
      }
      setCharacterMoving(false);
    };
  }, [open, nextWanderTarget, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (wanderPauseRef.current) {
        clearTimeout(wanderPauseRef.current);
      }
    };
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
    if (!text || loading || sendingRef.current) return;
    sendingRef.current = true;

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
      sendingRef.current = false;
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
    const mobileEase: [number, number, number, number] = [0.32, 0.72, 0, 1];
    const desktopEase: [number, number, number, number] = [0.6, 0.05, 0.3, 0.95];
    if (isMobile) {
      return {
        initial: { x: "-100%" as const },
        animate: { x: 0 },
        exit: { x: "-100%" as const },
        transition: { type: "tween" as const, duration: 0.32, ease: mobileEase },
      };
    }
    return {
      initial: { opacity: 0, y: 12, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 12, scale: 0.96 },
      transition: { duration: 0.22, ease: desktopEase },
    };
  }, [isMobile]);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="정인수 AI 채팅 열기"
            initial={{ opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1, x: 0, y: 0, scaleX: 1, rotate: 0 }
                : {
                    opacity: 1,
                    x: wanderTarget.x,
                    y: wanderTarget.y,
                    scaleX: wanderTarget.scaleX,
                    rotate: wanderTarget.rotate,
                  }
            }
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.3, ease: [0.6, 0.05, 0.3, 0.95] },
              x: { duration: wanderTarget.duration, ease: "easeInOut" },
              y: { duration: wanderTarget.duration, ease: "easeInOut" },
              scaleX: { duration: 0.18, ease: "linear" },
              rotate: { duration: wanderTarget.duration, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="fixed bottom-3 left-4 md:bottom-6 md:left-6 z-50 w-[100px] h-[100px] md:w-32 md:h-32 cursor-pointer p-0 border-0 bg-transparent"
          >
            <WalkingCharacter
              className="w-full h-full drop-shadow-[0_5px_14px_rgba(0,0,0,0.20)] dark:drop-shadow-[0_5px_16px_rgba(0,0,0,0.50)] pointer-events-none"
              animated={characterMoving && !prefersReducedMotion}
            />
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
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--mute)]/20 overflow-hidden shrink-0">
                    <WalkingCharacter className="w-full h-full" animated={false} />
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
