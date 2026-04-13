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
      {/* Removed atmospheric fog layers for austere IDE layout */}

      {/* Section header */}
      <div className="relative max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-green-400 text-sm font-mono tracking-widest uppercase">
              {"//"} EXPERIMENTAL_DATA
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter uppercase">
            <span className="text-white/40">{"> "}</span>
            <span className="text-white">Initiatives</span>
            <span className="animate-pulse text-green-400">_</span>
          </h2>
          <p className="mt-4 text-white/40 text-sm font-mono max-w-xl">
            Execution logs for system architecture, defensive mechanics, and
            hardware manipulation.
          </p>
        </motion.div>
      </div>

      {/* Power plant tower grid */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Ground-level structural line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

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
                {/* IDE Panel Structure */}
                <div
                  className="relative flex-1 flex flex-col rounded-none border border-white/20 bg-black cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full p-6">
                    {/* Header bar simulated as IDE tab */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                      <span className="px-2 py-0.5 border border-green-500/30 text-green-400 text-xs font-mono bg-green-500/5">
                        {item.year}
                      </span>
                      <div className="flex items-center justify-center text-white/30 group-hover:text-green-400 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-mono font-semibold text-white tracking-tight group-hover:text-green-400 transition-colors mb-4 uppercase">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 text-sm font-mono leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* Easter egg hint */}
                    {movieRef && (
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-white/30 text-xs font-mono uppercase">
                          <span className="text-green-400">$</span>
                          {isExpanded ? "kill -9 process" : "./decrypt --silent"}
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
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 p-3 border border-green-500/20 bg-green-500/5">
                            <div className="flex items-start gap-2 font-mono text-xs">
                              <span className="text-green-400 mt-0.5">{">"}</span>
                              <span className="text-green-300/80 uppercase tracking-widest">
                                &quot;{movieRef.quote}&quot;
                              </span>
                            </div>
                            <div className="mt-2 text-[10px] text-white/30 font-mono pl-4 uppercase">
                              ROOT: {movieRef.movie}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
