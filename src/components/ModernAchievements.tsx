"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

const MOVIE_REFERENCES = [
  { 
    achievement: "Cybersecurity & Pen-Testing", 
    movie: "Mr. Robot", 
    quote: "侵蚀。", 
    hint: "侵蚀一切阻挡你的东西" 
  },
  { 
    achievement: "Co-Founded Jewelry Tech Platform", 
    movie: "Silicon Valley", 
    quote: "This is the10xer.", 
    hint: "Build something 10x better" 
  },
  { 
    achievement: "Web Security Research", 
    movie: "Hackers", 
    quote: "I&apos;d like to hack the planet.", 
    hint: "They are sys admins" 
  },
  { 
    achievement: "Hardware Modding", 
    movie: "Wreck-It Ralph", 
    quote: "I&apos;m gonna win.", 
    hint: "Because I can" 
  },
];

export default function ModernAchievements({ items }: { items: Array<{ id: string; year: string; title: string; description: string }> }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [secretRevealed, setSecretRevealed] = useState<string | null>(null);

  const getMovieRef = (title: string) => {
    return MOVIE_REFERENCES.find(ref => title.includes(ref.achievement.split(" ")[0]));
  };

  return (
    <section id="achievements" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-6">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-mono">{`// ACHIEVEMENTS.TXT`}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white/90">The </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            From hardware labs to production deployments — each chapter shaped my engineering philosophy.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {items.map((item, idx) => {
            const movieRef = getMovieRef(item.title);
            const isHovered = hoveredId === item.id;
            const isRevealed = secretRevealed === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                data-secret={movieRef?.movie.toLowerCase()}
                className="group relative"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`absolute -inset-px bg-gradient-to-r from-green-500/50 to-cyan-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />
                
                <div className="relative p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-400">{item.year}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-white/60 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        {movieRef && (
                          <button
                            onClick={() => setSecretRevealed(isRevealed ? null : item.id)}
                            className="flex-shrink-0 p-3 rounded-lg border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all group/btn"
                          >
                            <span className="block w-5 h-5 text-green-400/50 group-hover/btn:text-green-400 transition-colors">
                              ?
                            </span>
                          </button>
                        )}
                      </div>

                      {isRevealed && movieRef && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 p-4 rounded-xl bg-black/40 border border-green-500/30"
                        >
                          <div className="text-green-400 font-mono text-sm mb-2">
                            &ldquo;{movieRef.quote}&rdquo;
                          </div>
                          <div className="text-xs text-white/40">
                            — {movieRef.movie}
                          </div>
                        </motion.div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {["React", "Node.js", "AWS", "Docker", "PostgreSQL"].slice(0, idx + 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-white/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isHovered ? "100%" : "0%" }}
                      className="h-0.5 bg-gradient-to-r from-green-500 to-cyan-500"
                    />
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
