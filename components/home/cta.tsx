"use client";
import { Magnetic } from "@/components/motion/magnetic";
import { CONTACT_EMAIL, CTA_QUOTE } from "@/lib/data/home";

export function Cta() {
  return (
    <section className="min-h-screen bg-[var(--color-ink-dark)] text-[var(--color-paper-dark)] flex flex-col items-center justify-center px-6 md:px-10 lg:px-16 py-32 text-center">
      <p className="text-meta opacity-60 mb-8">{CTA_QUOTE}</p>
      <Magnetic strength={0.5}>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-display-mega font-display hover:text-[var(--color-orange-dark)] transition-colors break-all"
        >
          {CONTACT_EMAIL}
        </a>
      </Magnetic>
      <a
        href="/resume.pdf"
        download
        className="text-meta mt-16 underline-offset-4 hover:underline opacity-70 hover:opacity-100 transition-opacity"
      >
        이력서 PDF 다운로드 →
      </a>
    </section>
  );
}
