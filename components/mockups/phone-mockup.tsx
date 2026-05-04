import { cn } from "@/lib/utils";

/**
 * 핸드폰 목업 — 시스템 컬러 톤 (--fg 베젤 + --bg 화면).
 * 9:19.5 비율 (iPhone 14 기준). 안에 children으로 콘텐츠 (carousel/iframe/img).
 */
export function PhoneMockup({
  children,
  className = "",
  showNotch = true,
}: {
  children: React.ReactNode;
  className?: string;
  showNotch?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto bg-[var(--fg)] p-2 md:p-2.5 rounded-[44px] md:rounded-[52px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      {/* 사이드 버튼 — volume + power (visual only) */}
      <span
        aria-hidden
        className="absolute -left-[3px] top-[18%] w-[3px] h-10 bg-[var(--fg)] rounded-l-sm"
      />
      <span
        aria-hidden
        className="absolute -left-[3px] top-[28%] w-[3px] h-16 bg-[var(--fg)] rounded-l-sm"
      />
      <span
        aria-hidden
        className="absolute -right-[3px] top-[24%] w-[3px] h-20 bg-[var(--fg)] rounded-r-sm"
      />

      {/* Inner screen */}
      <div className="relative overflow-hidden rounded-[36px] md:rounded-[44px] bg-[var(--bg)] aspect-[9/19.5]">
        {showNotch && (
          <span
            aria-hidden
            className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[28%] h-5 md:h-6 bg-[var(--fg)] rounded-full z-30"
          />
        )}
        {children}
      </div>
    </div>
  );
}
