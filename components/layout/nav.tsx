"use client";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/career", label: "Career" },
  { href: "/marketing", label: "Marketing" },
  { href: "/builder", label: "AI Builder" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between backdrop-blur-md bg-[var(--bg)]/70 border-b border-[var(--line)]">
      <Link
        href="/"
        className="text-[24px] md:text-[28px] font-display tracking-tight text-[var(--fg)]"
      >
        Jung In su
      </Link>
      <ul className="hidden md:flex gap-8 text-meta text-[var(--fg)]">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:opacity-60 transition-opacity">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </nav>
  );
}
