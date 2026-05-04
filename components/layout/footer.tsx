export function Footer() {
  return (
    <footer className="px-6 md:px-10 lg:px-16 py-16 border-t border-[var(--line)]">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="text-[40px] font-display mb-4">정인수</p>
          <p className="text-meta opacity-60">AI Builder · 17년 마케터 · 정부 부처·기관 강사</p>
        </div>
        <div className="text-meta space-y-2 opacity-80">
          <p>
            <a
              href="mailto:9843ohs@gmail.com"
              className="hover:text-[var(--accent)] transition-colors"
            >
              9843ohs@gmail.com
            </a>
          </p>
          <p>
            <a href="/resume.pdf" download className="hover:text-[var(--accent)] transition-colors">
              이력서 PDF
            </a>
          </p>
        </div>
      </div>
      <p className="mt-12 text-meta opacity-40">© 2026 정인수 (ls.Jung)</p>
    </footer>
  );
}
