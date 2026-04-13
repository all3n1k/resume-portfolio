"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type Achievement = {
  id: string;
  year: string;
  title: string;
  description: string;
};

interface Props {
  items: Achievement[];
}

export default function AchievementSpotlight({ items }: Props) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -40% 0px", threshold: 0.4 }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-5 sticky top-6">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass p-6 md:p-8"
        >
          <div className="text-sm uppercase tracking-wide opacity-70">{items[active]?.year}</div>
          <h3 className="text-2xl font-semibold mt-1">{items[active]?.title}</h3>
          <p className="mt-3 opacity-90 leading-relaxed">{items[active]?.description}</p>
        </motion.div>
      </div>

      <div className="md:col-span-7 space-y-4">
        {items.map((ach, idx) => (
          <div
            key={ach.id}
            data-idx={idx}
            ref={(el) => { refs.current[idx] = el; }}
            className={`rounded-none border border-white/10 p-4 sm:p-5 transition-colors ${
              idx === active ? "bg-white/5" : "bg-white/2"
            }`}
          >
            <div className="text-xs opacity-60">{ach.year}</div>
            <div className="font-medium">{ach.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}