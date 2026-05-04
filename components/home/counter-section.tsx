"use client";
import { Counter } from "@/components/motion/counter";
import { COUNTERS, TECH_STACK } from "@/lib/data/home";

export function CounterSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-10 lg:px-16 py-32">
      <p className="text-meta opacity-50 mb-16">현재 임팩트</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8">
        {COUNTERS.map((c, i) => (
          <div key={i} className="border-t border-[var(--line)] pt-6">
            <p className="text-display-xl font-display">
              <Counter to={parseInt(c.value)} suffix={c.suffix} />
            </p>
            <p className="text-meta opacity-60 mt-3">{c.label}</p>
          </div>
        ))}
      </div>

      {/* 풍부한 기술 스택 — 6 카테고리 grid */}
      <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
        {TECH_STACK.map((cat) => (
          <div key={cat.category} className="border-t border-[var(--line)] pt-5">
            <p className="text-meta opacity-70 mb-4">{cat.category}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-meta opacity-60">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="hover:opacity-100 transition-opacity"
                >
                  · {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
