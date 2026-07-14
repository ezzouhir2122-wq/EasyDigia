"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const body = document.getElementById("article-body");
    if (!body) return;

    const nodes = body.querySelectorAll("h2, h3");
    const items: Heading[] = [];

    nodes.forEach((node, i) => {
      const id = node.id || `heading-${i}`;
      if (!node.id) node.id = id;
      items.push({
        id,
        text: node.textContent ?? "",
        level: parseInt(node.tagName[1]),
      });
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-120px)] overflow-y-auto xl:block">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[#9BA1B0]/50">
        Dans cet article
      </p>
      <ul className="flex flex-col gap-1.5">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "12px" : "0" }}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block text-[13px] leading-[1.4] transition ${
                active === h.id
                  ? "font-semibold text-[#8FD400]"
                  : "text-[#9BA1B0] hover:text-[#F5F6FA]"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
