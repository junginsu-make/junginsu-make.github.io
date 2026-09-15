import Link from "next/link";
import { nextLink, prevLink } from "@/lib/data/site-nav";

/**
 * 페이지 끝에서 다음 읽을 곳을 크게 내민다.
 *
 * SaaS 상세 페이지(`/builder/[slug]`)가 이미 쓰고 있는 PREV/NEXT 방식과 같은
 * 결이다. 상단 메뉴는 늘 떠 있지만 작고, 글을 다 읽은 사람은 시선이 아래에 있다.
 * 그 자리에서 다음 갈 곳을 주면 위로 되돌아갈 이유가 없어진다.
 */
export function NextRead({ current }: { current: string }) {
  const prev = prevLink(current);
  const next = nextLink(current);

  return (
    <section className="px-6 md:px-10 lg:px-16 xl:px-24 py-16 md:py-24 border-t border-[var(--line)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between mb-8 md:mb-10">
          <p className="text-meta opacity-50 tracking-[0.2em]">이어서 보기</p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
          <Link
            href={prev.href}
            className="group bg-[var(--bg)] p-6 md:p-10 hover:bg-[var(--accent)] transition-colors duration-300"
          >
            <p className="text-meta opacity-50 group-hover:opacity-90 group-hover:text-[var(--bg)] transition-colors">
              ← 이전
            </p>
            <p className="mt-4 text-display-md font-display leading-tight group-hover:text-[var(--bg)] transition-colors">
              {prev.ko}
            </p>
            <p className="mt-3 text-body opacity-70 group-hover:opacity-90 group-hover:text-[var(--bg)] transition-colors">
              {prev.blurb}
            </p>
          </Link>

          <Link
            href={next.href}
            className="group bg-[var(--bg)] p-6 md:p-10 md:text-right hover:bg-[var(--accent)] transition-colors duration-300"
          >
            <p className="text-meta opacity-50 group-hover:opacity-90 group-hover:text-[var(--bg)] transition-colors">
              다음 →
            </p>
            <p className="mt-4 text-display-md font-display leading-tight group-hover:text-[var(--bg)] transition-colors">
              {next.ko}
            </p>
            <p className="mt-3 text-body opacity-70 group-hover:opacity-90 group-hover:text-[var(--bg)] transition-colors">
              {next.blurb}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
