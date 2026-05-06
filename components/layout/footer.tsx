export function Footer() {
  return (
    <footer className="px-6 md:px-10 lg:px-16 py-6 border-t border-[var(--line)]">
      <div className="flex items-baseline justify-center gap-3">
        <span className="text-[28px] md:text-[32px] font-display leading-none">
          정인수
        </span>
        <span className="text-meta opacity-60">
          AI Builder · 마케터
        </span>
      </div>
      <p className="mt-3 text-center text-[11px] font-mono opacity-40 tracking-wider">
        작성일: 2026. 5. 5.
      </p>
    </footer>
  );
}
