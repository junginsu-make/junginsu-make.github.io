import Link from "next/link";
import { SITE_LINKS } from "@/lib/data/site-nav";

/**
 * 푸터 — 페이지 목록과 연락처를 둔다.
 *
 * 원래는 이름·직함·작성일 세 줄뿐이라 링크가 하나도 없었다. 글을 끝까지 읽고
 * 내려온 사람에게 다음 갈 곳을 주지 않으면, 상단 메뉴까지 다시 올라가야 한다.
 * 모바일에서는 그 상단 메뉴마저 접혀 있다.
 */
export function Footer() {
  return (
    <footer className="px-6 md:px-10 lg:px-16 pt-14 pb-[calc(2.5rem+3.5rem+env(safe-area-inset-bottom,0px))] md:pb-10 md:pt-16 border-t border-[var(--line)]">
      <nav aria-label="페이지 이동" className="max-w-[1440px] mx-auto">
        <p className="text-meta opacity-50 mb-5">둘러보기</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 md:gap-x-12">
          {SITE_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group inline-flex items-baseline gap-2 text-body-lg md:text-display-md font-display leading-tight text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
              >
                <span>{l.ko}</span>
                <span className="text-meta opacity-40 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-opacity">
                  {l.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-[1440px] mx-auto mt-12 pt-6 border-t border-[var(--line)] flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="text-[26px] md:text-[30px] font-display leading-none">
            정인수
          </span>
          <span className="text-meta opacity-60">AI Builder · 마케터</span>
        </div>
        <a
          href="mailto:9843ohs@gmail.com"
          className="text-meta opacity-70 hover:opacity-100 hover:text-[var(--accent)] transition-colors"
        >
          9843OHS@GMAIL.COM
        </a>
      </div>

      <p className="max-w-[1440px] mx-auto mt-4 text-[11px] font-mono opacity-40 tracking-wider">
        작성일: 2026. 5. 5.
      </p>
    </footer>
  );
}
