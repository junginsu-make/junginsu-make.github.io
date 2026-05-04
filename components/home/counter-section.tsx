"use client";
import { Counter } from "@/components/motion/counter";
import { COUNTERS, TECH_BADGES } from "@/lib/data/home";

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
      <div className="mt-24 text-meta opacity-50 max-w-3xl flex flex-wrap gap-x-3 gap-y-2">
        {TECH_BADGES.map((b) => (
          <span key={b}>· {b}</span>
        ))}
      </div>
    </section>
  );
}
