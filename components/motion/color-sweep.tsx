"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type SweepLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  children: React.ReactNode;
};

export function SweepLink({ href, children, ...rest }: SweepLinkProps) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    if (typeof href !== "string") return;
    e.preventDefault();
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      // @ts-expect-error - View Transitions API not yet in lib.dom
      document.startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
