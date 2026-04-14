"use client";

import { Github, Linkedin, MonitorPlay, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const MEDIA_ENTRIES = [
  { id: "proj-ollama", name: "Ollamaped", tag: "ACTIVE" },
  { id: "proj-traffic", name: "Traffic Classifier", tag: "MAINTAIN" },
  { id: "proj-tailscale", name: "Tailscale Dashboard", tag: "DEPLOYED" },
  { id: "proj-matrix", name: "Terminal Portfolio", tag: "ACTIVE" },
];

export default function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <div
      className="fixed top-6 left-0 right-0 w-full px-6 z-50 hidden md:flex pointer-events-none transition-all duration-700 ease-in-out"
      style={{ justifyContent: isScrolled ? "center" : "flex-end" }}
    >
      <motion.div
        id="top-nav"
        layout
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { delay: 2.5, duration: 0.8 },
          y: { delay: 2.5, duration: 0.8 },
          layout: { type: "spring", stiffness: 200, damping: 30 },
        }}
        className="pointer-events-auto flex flex-row gap-0"
      >
        <div className="bg-black border border-green-500/20 flex flex-row shadow-[4px_4px_0_rgba(0,255,65,0.05)] h-[40px] items-stretch">
          <div className="bg-green-500/5 border-r border-green-500/20 px-4 flex items-center justify-center">
            <span className="text-[10px] text-green-500/50 font-mono tracking-widest uppercase">root@nav:~</span>
          </div>

          <div className="flex flex-row">
            <a
              href="https://github.com/all3n1k"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 px-5 border-r border-green-500/10 hover:bg-green-500/[0.08] transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-green-500/40 group-hover:text-green-400 transition-colors" />
              <span className="text-xs font-mono text-green-500/60 group-hover:text-green-400 tracking-wider">
                GITHUB
              </span>
              <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            <a
              href="https://www.linkedin.com/in/allen-niktalov/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 px-5 border-r border-green-500/10 hover:bg-green-500/[0.08] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-green-500/40 group-hover:text-green-400 transition-colors" />
              <span className="text-xs font-mono text-green-500/60 group-hover:text-green-400 tracking-wider">
                LINKEDIN
              </span>
              <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            <div
              className="relative"
              onMouseEnter={() => setMediaOpen(true)}
              onMouseLeave={() => setMediaOpen(false)}
            >
              <button
                onClick={() => router.push("/media")}
                className="group relative flex items-center gap-2.5 px-5 border-r border-green-500/10 hover:bg-green-500/[0.08] transition-colors h-full"
              >
                <MonitorPlay className="w-3.5 h-3.5 text-green-500/40 group-hover:text-green-400 transition-colors" />
                <span className="text-xs font-mono text-green-500/60 group-hover:text-green-400 tracking-wider">
                  MEDIA_LOGS
                </span>
                <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div
                className={`absolute top-full left-0 min-w-[260px] bg-black border border-green-500/20 shadow-[4px_4px_0_rgba(0,255,65,0.05)] transition-all duration-150 origin-top ${
                  mediaOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="bg-green-500/5 border-b border-green-500/20 px-3 py-1.5">
                  <span className="text-[9px] text-green-500/50 font-mono tracking-widest uppercase">
                    {"//"} index /media
                  </span>
                </div>
                <div className="flex flex-col">
                  {MEDIA_ENTRIES.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => {
                        setMediaOpen(false);
                        router.push(`/media#${entry.id}`);
                      }}
                      className="group/entry flex items-center justify-between gap-3 px-3 py-2.5 border-b border-green-500/10 last:border-b-0 hover:bg-green-500/[0.08] transition-colors text-left"
                    >
                      <span className="text-xs font-mono text-green-500/70 group-hover/entry:text-green-400 tracking-wider">
                        {entry.name}
                      </span>
                      <span className="text-[9px] font-mono text-green-500/30 group-hover/entry:text-green-400/70 tracking-widest px-1.5 py-0.5 border border-green-500/20">
                        [{entry.tag}]
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/contact")}
              className="group relative flex items-center gap-2.5 px-5 hover:bg-green-500/[0.08] transition-colors h-full"
            >
              <TerminalSquare className="w-3.5 h-3.5 text-green-500/40 group-hover:text-green-400 transition-colors" />
              <span className="text-xs font-mono text-green-500/60 group-hover:text-green-400 tracking-wider">
                SYS_CONTACT
              </span>
              <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
