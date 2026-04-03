"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Cpu, Code2, Wrench, type LucideProps } from "lucide-react";

type LucideIcon = React.FC<LucideProps>;

const ICONS: Record<string, LucideIcon> = {
  Cybersecurity: Shield,
  "Co-Founded": Cpu,
  Web: Code2,
  Hardware: Wrench,
};

function getIcon(title: string): LucideIcon {
  for (const [key, Icon] of Object.entries(ICONS)) {
    if (title.includes(key)) return Icon;
  }
  return Terminal;
}

const MOVIE_REFERENCES = [
  {
    achievement: "Cybersecurity",
    movie: "Mr. Robot",
    quote: "Control is an illusion.",
  },
  {
    achievement: "Co-Founded",
    movie: "Silicon Valley",
    quote: "This is the 10xer.",
  },
  {
    achievement: "Web Security",
    movie: "Hackers",
    quote: "Hack the planet.",
  },
  {
    achievement: "Hardware",
    movie: "Wreck-It Ralph",
    quote: "I'm gonna wreck it.",
  },
];

export default function ModernAchievements({
  items,
}: {
  items: Array<{
    id: string;
    year: string;
    title: string;
    description: string;
  }>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getMovieRef = (title: string) =>
    MOVIE_REFERENCES.find((ref) => title.includes(ref.achievement));

  return (
    <section id="achievements" className="relative py-28 md:py-36">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-green-500 to-transparent" />
            <span className="text-green-400 text-xs font-mono tracking-[0.2em] uppercase">
              experience
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">What I&apos;ve </span>
            <span className="gradient-text">Built</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl">
            A decade of hacking, shipping, and securing systems — each chapter
            pushed the boundaries further.
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-[calc(50%-1px)] top-0 bottom-0 w-px bg-gradient-to-b from-green-500/40 via-green-500/10 to-transparent hidden md:block" />

        <div className="space-y-8 md:space-y-12">
          {items.map((item, idx) => {
            const Icon = getIcon(item.title);
            const movieRef = getMovieRef(item.title);
            const isExpanded = expandedId === item.id;
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${
                  isEven ? "" : "md:direction-rtl"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 z-10 hidden md:flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 ring-4 ring-black ring-offset-0 shadow-[0_0_12px_rgba(0,255,65,0.4)]" />
                </div>

                {/* Card */}
                <div
                  className={`relative group ${
                    isEven
                      ? "md:col-start-1 md:text-right md:pr-12"
                      : "md:col-start-2 md:text-left md:pl-12"
                  }`}
                  style={{ direction: "ltr" }}
                >
                  <div
                    className="relative p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.id)
                    }
                  >
                    {/* Hover glow */}
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />

                    <div
                      className={`flex items-start gap-4 ${
                        isEven ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Year badge */}
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-mono mb-3">
                          {item.year}
                        </span>

                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-green-400 transition-colors mb-3">
                          {item.title}
                        </h3>

                        <p className="text-white/50 leading-relaxed text-sm md:text-base">
                          {item.description}
                        </p>

                        {/* Expand hint */}
                        {movieRef && (
                          <div className="mt-4 flex items-center gap-2 text-white/20 text-xs font-mono">
                            <span className="text-green-500/40">{">"}</span>
                            {isExpanded ? "click to collapse" : "click to reveal easter egg"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Easter egg */}
                    <AnimatePresence>
                      {isExpanded && movieRef && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-5 border-t border-white/[0.06]">
                            <div className="flex items-center gap-3 font-mono text-sm">
                              <span className="text-green-400">{"\u275D"}</span>
                              <span className="text-green-400/80 italic">
                                {movieRef.quote}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-white/30 font-mono">
                              — {movieRef.movie}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Empty column for spacing */}
                <div
                  className={`hidden md:block ${
                    isEven ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
