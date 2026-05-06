"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  type PanInfo,
} from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
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
const DESKTOP_LEFT_INSET = 24;
const MOBILE_LEFT_INSET = 16;
const RIGHT_INSET = 18;
const MOBILE_CLOSE_DRAG_OFFSET = 42;
const MOBILE_CLOSE_DRAG_VELOCITY = 260;
const MOBILE_PANEL_DRAG_CONSTRAINTS = { left: -280, right: 0 };
const PROMPT_WALK_MS = 6200;
const PROMPT_PAUSE_MS = 2600;
const TURN_TO_FRONT_MS = 1000;

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [travelDistance, setTravelDistance] = useState(0);
  const [characterFacing, setCharacterFacing] = useState<1 | -1>(1);
  const [characterPose, setCharacterPose] = useState<
    "walk" | "turn-front" | "front"
  >("walk");
  const [promptVisible, setPromptVisible] = useState(false);
  const characterControls = useAnimationControls();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef(false);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

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

  useEffect(() => {
    const apply = () => {
      const size = isMobile ? MOBILE_CHARACTER_SIZE : DESKTOP_CHARACTER_SIZE;
      const leftInset = isMobile ? MOBILE_LEFT_INSET : DESKTOP_LEFT_INSET;
      setTravelDistance(
        Math.max(0, window.innerWidth - leftInset - RIGHT_INSET - size)
      );
    };

    apply();
    window.addEventListener("resize", apply);

    return () => window.removeEventListener("resize", apply);
  }, [isMobile]);

  const walkDuration = useMemo(() => {
    if (prefersReducedMotion) return 0;
    return Math.min(58, Math.max(28, travelDistance / (isMobile ? 18 : 22)));
  }, [isMobile, prefersReducedMotion, travelDistance]);

  useEffect(() => {
    let cancelled = false;
    const legDuration = walkDuration / 2;
    const speed = legDuration > 0 ? travelDistance / legDuration : 0;

    const run = async () => {
      if (
        prefersReducedMotion ||
        open ||
        travelDistance <= 0 ||
        legDuration <= 0 ||
        speed <= 0
      ) {
        setCharacterFacing(1);
        setCharacterPose("walk");
        setPromptVisible(false);
        characterControls.set({ opacity: 1, x: 0 });
        return;
      }

      let x = 0;
      let direction: 1 | -1 = 1;
      const maxSegmentDistance = speed * (PROMPT_WALK_MS / 1000);

      characterControls.set({ opacity: 1, x: 0 });

      while (!cancelled) {
        setCharacterPose("walk");
        setPromptVisible(false);
        setCharacterFacing(direction);

        const target = direction === 1 ? travelDistance : 0;
        const distanceToTarget = Math.abs(target - x);
        const distance = Math.min(distanceToTarget, maxSegmentDistance);
        const nextX = x + direction * distance;

        await characterControls.start({
          opacity: 1,
          x: nextX,
          transition: {
            opacity: { duration: 0.3, ease: [0.6, 0.05, 0.3, 0.95] },
            x: { duration: distance / speed, ease: "linear" },
          },
        });
        if (cancelled) break;

        x = nextX;
        if (Math.abs(x - target) < 0.5) {
          direction = direction === 1 ? -1 : 1;
        }

        setCharacterPose("turn-front");
        setPromptVisible(true);
        await delay(TURN_TO_FRONT_MS);
        if (cancelled) break;

        setCharacterFacing(1);
        setCharacterPose("front");
        await delay(Math.max(0, PROMPT_PAUSE_MS - TURN_TO_FRONT_MS));
      }
    };

    void run();

    return () => {
      cancelled = true;
      characterControls.stop();
    };
  }, [
    characterControls,
    open,
    prefersReducedMotion,
    travelDistance,
    walkDuration,
  ]);

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
    if (
      info.offset.x < -MOBILE_CLOSE_DRAG_OFFSET ||
      info.velocity.x < -MOBILE_CLOSE_DRAG_VELOCITY
    ) {
      setOpen(false);
    }
  };

  const handlePanelPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePanelPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!isMobile || !start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (
      dx < -MOBILE_CLOSE_DRAG_OFFSET &&
      Math.abs(dx) > Math.abs(dy) * 1.1
    ) {
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
            initial={{ opacity: 0, x: 0 }}
            animate={characterControls}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="fixed bottom-3 left-4 md:bottom-6 md:left-6 z-50 w-[100px] h-[100px] md:w-32 md:h-32 cursor-pointer p-0 border-0 bg-transparent"
          >
            {!prefersReducedMotion && promptVisible && (
              <motion.span
                className="absolute left-1/2 bottom-[86%] md:bottom-[84%] whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--bg)]/95 px-3 py-1.5 text-[11px] md:text-[12px] font-medium leading-none text-[var(--fg)] shadow-lg backdrop-blur-sm"
                aria-hidden
                initial={{ opacity: 0, y: 6, x: "-50%", scale: 0.94 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: -2, x: "-50%", scale: 0.98 }}
                transition={{ duration: 0.24, ease: "easeInOut" }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span>무엇이든 물어보세요</span>
                  <Sparkles
                    size={13}
                    strokeWidth={2.2}
                    className="text-[var(--accent)]"
                    aria-hidden
                  />
                </span>
                <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[var(--line)] bg-[var(--bg)]/95" />
              </motion.span>
            )}
            <motion.span
              className="block w-full h-full"
              animate={{ scaleX: prefersReducedMotion ? 1 : characterFacing }}
              transition={{ duration: 0 }}
            >
              <WalkingCharacter
                className="w-full h-full drop-shadow-[0_5px_14px_rgba(0,0,0,0.20)] dark:drop-shadow-[0_5px_16px_rgba(0,0,0,0.50)] pointer-events-none"
                animated={!prefersReducedMotion && characterPose === "walk"}
                pose={characterPose}
              />
            </motion.span>
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
              dragConstraints={
                isMobile ? MOBILE_PANEL_DRAG_CONSTRAINTS : { left: 0, right: 0 }
              }
              dragDirectionLock
              dragElastic={{ left: 0.18, right: 0 }}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              onPointerDown={handlePanelPointerDown}
              onPointerUp={handlePanelPointerUp}
              onPointerCancel={() => {
                swipeStartRef.current = null;
              }}
              className={cn(
                "fixed z-50 flex flex-col bg-[var(--bg)] border border-[var(--line)] shadow-2xl",
                isMobile
                  ? "inset-y-0 left-0 rounded-r-2xl"
                  : "bottom-6 left-6 md:bottom-10 md:left-10 w-[380px] h-[600px] max-h-[calc(100vh-5rem)] rounded-2xl"
              )}
              style={
                isMobile ? { width: "66.67vw", touchAction: "pan-y" } : undefined
              }
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
