"use client";

import { motion } from "framer-motion";

interface TechItem {
  name: string;
  category: string;
  level: number; // 0-100
}

const TECH: TechItem[] = [
  { name: "React / Next.js", category: "Frontend", level: 95 },
  { name: "TypeScript", category: "Frontend", level: 90 },
  { name: "Node.js", category: "Backend", level: 90 },
  { name: "Python", category: "Backend", level: 85 },
  { name: "Go", category: "Backend", level: 75 },
  { name: "PostgreSQL", category: "Backend", level: 80 },
  { name: "AWS / Cloud", category: "Infra", level: 85 },
  { name: "Docker / K8s", category: "Infra", level: 80 },
  { name: "Penetration Testing", category: "Security", level: 92 },
  { name: "Reverse Engineering", category: "Security", level: 88 },
  { name: "Metasploit / Burp Suite", category: "Security", level: 90 },
  { name: "Frida / Ghidra", category: "Security", level: 85 },
];

const CATEGORIES = ["Frontend", "Backend", "Infra", "Security"];

const CAT_DOTS: Record<string, string> = {
  Frontend: "bg-cyan-400",
  Backend: "bg-green-400",
  Infra: "bg-purple-400",
  Security: "bg-red-400",
};

export default function TechStack() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-green-400 text-sm font-mono tracking-widest uppercase">
              {"//"} DEPENDENCIES
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter uppercase">
            <span className="text-white/40">{"< "}</span>
            <span className="text-white">TechStack</span>
            <span className="text-white/40">{" />"}</span>
          </h2>
          <p className="mt-4 text-white/40 text-sm font-mono max-w-xl">
            Libraries, frameworks, and command line tools utilized for architecture and infiltration.
          </p>
        </motion.div>

        {/* Category filters as visual labels */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 px-3 py-1 rounded-none border border-white/20 bg-black"
            >
              <div className={`w-2 h-2 rounded-none ${CAT_DOTS[cat]}`} />
              <span className="text-xs text-white/60 font-mono uppercase tracking-wider">{cat}</span>
            </div>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 gap-0 border-t border-l border-white/10">
          {TECH.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="group relative p-4 border-r border-b border-white/10 bg-black hover:bg-white/[0.03] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-1 h-4 ${CAT_DOTS[tech.category]}`} />
                <span className="text-white/80 font-mono text-sm uppercase tracking-wide">{tech.name}</span>
              </div>
              <span className="text-white/30 text-xs font-mono">[{tech.level}%]</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
