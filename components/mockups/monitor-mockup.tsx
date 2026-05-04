import { cn } from "@/lib/utils";

/**
 * 모니터(브라우저) 목업 — 시스템 컬러 톤 (--fg 베젤 + --bg 화면).
 * 상단 윈도우 컨트롤 (3 dots) + 주소창 슬롯. 안 children으로 콘텐츠 (capture image).
 */
export function MonitorMockup({
  children,
  className = "",
  url,
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto bg-[var(--fg)] rounded-lg md:rounded-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      {/* 상단 윈도우 바 */}
      <div className="flex items-center gap-3 px-4 py-2.5 md:py-3">
        <div className="flex gap-1.5">
          <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-[var(--bg)]/70" />
          <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-[var(--bg)]/55" />
          <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-[var(--bg)]/40" />
        </div>
        {url ? (
          <div className="flex-1 mx-2 md:mx-4 px-3 py-1 rounded bg-[var(--bg)]/15 text-[10px] md:text-[11px] font-mono text-[var(--bg)]/70 truncate tracking-tight">
            {url}
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* Inner screen — 자연 비율 (캡처 이미지 100% 표시) */}
      <div className="relative overflow-hidden rounded-b-lg md:rounded-b-xl bg-[var(--bg)]">
        {children}
      </div>
    </div>
  );
}
