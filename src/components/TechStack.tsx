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
const CAT_COLORS: Record<string, string> = {
  Frontend: "from-cyan-400 to-blue-500",
  Backend: "from-green-400 to-emerald-500",
  Infra: "from-purple-400 to-violet-500",
  Security: "from-red-400 to-orange-500",
};
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
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-green-500 to-transparent" />
            <span className="text-green-400 text-xs font-mono tracking-[0.2em] uppercase">
              arsenal
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">Tech </span>
            <span className="gradient-text">Stack</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl">
            Tools and technologies I work with daily to build, break, and secure.
          </p>
        </motion.div>

        {/* Category filters as visual labels */}
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02]"
            >
              <div className={`w-2 h-2 rounded-full ${CAT_DOTS[cat]}`} />
              <span className="text-xs text-white/50 font-mono">{cat}</span>
            </div>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          {TECH.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${CAT_DOTS[tech.category]}`} />
                  <span className="text-white/80 font-medium text-sm">{tech.name}</span>
                </div>
                <span className="text-white/20 text-xs font-mono">{tech.level}%</span>
              </div>
              {/* Progress bar */}
              <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${tech.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${CAT_COLORS[tech.category]}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
