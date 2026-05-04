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
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between">
      <Link
        href="/"
        className="text-[28px] font-display tracking-tight mix-blend-difference text-white"
      >
        정인수
      </Link>
      <ul className="hidden md:flex gap-8 text-meta mix-blend-difference text-white">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:opacity-70 transition-opacity">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* ThemeToggle은 mix-blend-difference 효과에서 격리 (button 클릭 안정성) */}
      <div className="isolate mix-blend-normal">
        <ThemeToggle />
      </div>
    </nav>
  );
}
