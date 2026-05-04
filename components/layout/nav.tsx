"use client";
import { useState } from "react";
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

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/career", label: "Career" },
  { href: "/builder", label: "AI Builder" },
  { href: "/marketing", label: "Marketing" },
  { href: "/contact", label: "Contact" },
];

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
        className="text-[24px] md:text-[28px] font-display tracking-tight text-[var(--fg)]"
      >
        Jung In su
      </Link>

      {/* desktop links */}
      <ul className="hidden md:flex gap-8 text-meta text-[var(--fg)]">
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
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-[var(--fg)]"
              aria-label="메뉴 열기"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                aria-hidden
              >
                <line x1="3" y1="7" x2="19" y2="7" />
                <line x1="3" y1="15" x2="19" y2="15" />
              </svg>
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

            <div className="mt-auto pt-8 border-t border-[var(--line)]">
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
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
