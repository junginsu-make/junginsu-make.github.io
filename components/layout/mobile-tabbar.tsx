"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Briefcase, Boxes, Megaphone } from "lucide-react";
import { SITE_LINKS } from "@/lib/data/site-nav";

/**
 * 모바일 하단 고정 바.
 *
 * 모바일에서 하위 페이지에 들어가면 보이는 페이지 이동 수단이 로고 하나뿐이었다
 * (실측: /career 390px 에서 주요 페이지 링크 1개). 나머지는 전부 햄버거를 열어야
 * 나왔다. 엄지가 닿는 자리에 항상 띄워 둔다.
 *
 * **모바일에만 띄운다.** PC 는 상단 메뉴가 fixed 로 늘 보이므로 필요 없다.
 */

const ICONS = {
  "/": Home,
  "/about": User,
  "/career": Briefcase,
  "/builder": Boxes,
  "/marketing": Megaphone,
} as const;

/** 하단 바 높이 + 안전영역. 챗 위젯·맨위로 버튼이 이만큼 올라간다. */
export const TABBAR_SPACE = "calc(56px + env(safe-area-inset-bottom, 0px))";

export function MobileTabbar() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="페이지 이동"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--line)] bg-[var(--bg)]/92 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex">
        {SITE_LINKS.map((l) => {
          const Icon = ICONS[l.href as keyof typeof ICONS] ?? Home;
          // 하위 경로(/builder/mcs)도 해당 탭으로 친다.
          const active =
            l.href === "/"
              ? pathname === "/"
              : pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <li key={l.href} className="flex-1">
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center gap-1 h-14 transition-colors",
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--fg)] opacity-55 hover:opacity-100",
                ].join(" ")}
              >
                <Icon size={19} strokeWidth={active ? 2.4 : 1.9} aria-hidden />
                <span className="text-[10px] tracking-[0.04em] font-semibold leading-none">
                  {l.ko}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
