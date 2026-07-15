"use client";

import { useState } from "react";

type Question = { q: string; a: string };
type Category = { label: string; questions: Question[] };

export function FAQAccordion({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-10">
      {categories.map((cat) => (
        <div key={cat.label}>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full border border-[#8FD400]/25 bg-[#8FD400]/[0.07] px-3 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#C6FF00]">
              {cat.label}
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="flex flex-col gap-2">
            {cat.questions.map((item) => {
              const id = `${cat.label}-${item.q}`;
              const isOpen = open === id;
              return (
                <div
                  key={id}
                  className="overflow-hidden rounded-[14px] border border-white/[0.07] bg-[#12141C]"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-white/[0.02]"
                  >
                    <span className="text-[15px] font-semibold text-[#F5F6FA]">{item.q}</span>
                    <span
                      className={`shrink-0 text-[#8FD400] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      ▾
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/[0.05] px-6 pb-5 pt-4">
                      <p className="text-[14px] leading-[1.75] text-[#9BA1B0]">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
