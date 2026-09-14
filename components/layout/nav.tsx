"use client";
import { useState } from "react";
import { SITE_LINKS } from "@/lib/data/site-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

/** 상단 메뉴도 사이트 공용 목록을 쓴다 — 네 군데에 따로 적으면 반드시 어긋난다. */
const LINKS = SITE_LINKS;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between backdrop-blur-md bg-[var(--bg)]/70 border-b border-[var(--line)]">
      <Link
        href="/"
        className="inline-flex items-baseline gap-2 text-[var(--fg)]"
      >
        <span className="text-[24px] md:text-[28px] font-display tracking-tight">
          Jung In su
        </span>
        <span className="hidden md:inline text-meta tracking-[0.15em] uppercase text-[var(--accent)] opacity-80">
          Portfolio
        </span>
      </Link>

      {/* desktop links — viewport 중앙 정렬 */}
      <ul className="hidden md:flex gap-8 text-meta text-[var(--fg)] absolute left-1/2 -translate-x-1/2">
        {LINKS.map((l) => {
          const active = isActive(pathname, l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "transition-opacity duration-200 relative",
                  active
                    ? "opacity-100 text-[var(--accent)]"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                {l.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--accent)]"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* right cluster */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border border-current/30 hover:bg-current/5 text-[var(--fg)] text-meta font-semibold tracking-[0.08em] transition-colors"
              aria-label="메뉴 열기"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <line x1="3" y1="6" x2="19" y2="6" />
                <line x1="3" y1="11" x2="19" y2="11" />
                <line x1="3" y1="16" x2="19" y2="16" />
              </svg>
              MENU
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[80vw] sm:max-w-sm flex flex-col bg-[var(--bg)] border-l border-[var(--line)]"
          >
            <SheetTitle className="sr-only">사이트 메뉴</SheetTitle>
            <p className="text-meta opacity-50 mb-8 mt-2 tracking-[0.2em]">
              MENU
            </p>
            <ul className="flex flex-col gap-1">
              {LINKS.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-3 text-display-md font-display leading-[1.1] tracking-[-0.02em] transition-colors duration-300",
                        active
                          ? "text-[var(--accent)]"
                          : "text-[var(--fg)] hover:text-[var(--accent)]",
                      )}
                    >
                      <span className="text-meta opacity-40 mr-3 tabular-nums">
                        {(LINKS.findIndex((x) => x.href === l.href) + 1)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto pt-8 border-t border-[var(--line)] space-y-5">
              <div>
                <p className="text-meta opacity-50 mb-3 tracking-[0.2em]">
                  CONTACT
                </p>
                <a
                  href="mailto:9843ohs@gmail.com"
                  className="font-mono text-body hover:text-[var(--accent)] transition-colors"
                >
                  9843ohs@gmail.com
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
