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

// Tower heights vary to create the clustered power-plant silhouette
const TOWER_HEIGHTS = ["min-h-[420px]", "min-h-[480px]", "min-h-[450px]", "min-h-[400px]"];
// Each tower gets a subtle accent shift for the inner core glow
const CORE_COLORS = [
  "from-red-500/20 via-purple-500/10 to-blue-500/20",
  "from-blue-500/20 via-cyan-500/10 to-purple-500/20",
  "from-purple-500/20 via-red-500/10 to-blue-500/20",
  "from-cyan-500/20 via-blue-500/10 to-purple-500/20",
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
    <section id="achievements" className="relative py-28 md:py-40 overflow-hidden">
      {/* Atmospheric fog layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-purple-900/[0.07] via-blue-900/[0.04] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-black via-transparent to-transparent" />
        {/* Side mist */}
        <div className="absolute left-0 top-1/4 w-[400px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute right-0 top-1/3 w-[300px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Section header */}
      <div className="relative max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-green-500 to-transparent" />
            <span className="text-green-400 text-xs font-mono tracking-[0.2em] uppercase">
              power plant
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">What I&apos;ve </span>
            <span className="gradient-text">Built</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl">
            Each tower represents a chapter — years of building, breaking,
            and securing systems, powering the next.
          </p>
        </motion.div>
      </div>

      {/* Power plant tower grid */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Ground-level glow bar */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 left-[10%] right-[10%] h-24 bg-gradient-to-t from-purple-500/[0.06] to-transparent blur-xl pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-end">
          {items.map((item, idx) => {
            const Icon = getIcon(item.title);
            const movieRef = getMovieRef(item.title);
            const isExpanded = expandedId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                className={`relative group ${TOWER_HEIGHTS[idx]} flex flex-col`}
              >
                {/* Tower structure */}
                <div
                  className="relative flex-1 flex flex-col rounded-2xl border border-white/[0.06] bg-black/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all hover:border-white/[0.12]"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Inner core glow — the "energy" inside each tower */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${CORE_COLORS[idx]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Vertical light strip — power conduit running up the tower */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-blue-500/10 group-hover:via-purple-400/40 transition-all duration-500" />

                  {/* Top cap glow */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/[0.08] to-transparent pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full p-6 md:p-7">
                    {/* Year + Icon header */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-green-400 text-xs font-mono">
                        {item.year}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-purple-500/30 group-hover:bg-purple-500/[0.06] transition-all">
                        <Icon className="w-4 h-4 text-white/40 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-green-400 transition-colors mb-3 leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/40 text-sm leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* Easter egg hint */}
                    {movieRef && (
                      <div className="mt-4 pt-3 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2 text-white/15 text-[11px] font-mono">
                          <span className="text-green-500/30">$</span>
                          {isExpanded ? "click to collapse" : "click to decrypt"}
                        </div>
                      </div>
                    )}

                    {/* Easter egg reveal */}
                    <AnimatePresence>
                      {isExpanded && movieRef && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-purple-500/10">
                            <div className="flex items-start gap-2 font-mono text-xs">
                              <span className="text-purple-400/80 mt-0.5">{"\u275D"}</span>
                              <span className="text-purple-300/60 italic leading-relaxed">
                                {movieRef.quote}
                              </span>
                            </div>
                            <div className="mt-1.5 text-[10px] text-white/20 font-mono pl-4">
                              — {movieRef.movie}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom energy ring */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent group-hover:via-purple-400/40 transition-all" />
                </div>

                {/* Base platform glow beneath each tower */}
                <div className="mx-4 h-4 bg-gradient-to-b from-purple-500/[0.06] to-transparent rounded-b-full blur-sm" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
