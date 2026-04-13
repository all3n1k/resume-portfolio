"use client";

import { Github, Linkedin, MonitorPlay, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  function handleContactClick(e: React.MouseEvent) {
    e.preventDefault();
    router.push("/contact");
  }

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navLinks = [
    { name: "GITHUB", href: "https://github.com/all3n1k", icon: Github },
    { name: "LINKEDIN", href: "https://www.linkedin.com/in/allen-niktalov/", icon: Linkedin },
    { name: "MEDIA_LOGS", href: "/media", icon: MonitorPlay },
    { name: "SYS_CONTACT", href: "/#contact", icon: TerminalSquare },
  ];

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
          layout: { type: "spring", stiffness: 200, damping: 30 }
        }}
        className="pointer-events-auto flex flex-row gap-0"
      >
        <div className="bg-black border border-green-500/20 flex flex-row shadow-[4px_4px_0_rgba(0,255,65,0.05)] h-[40px] items-stretch">
        {/* IDE Header / Root Label */}
        <div className="bg-green-500/5 border-r border-green-500/20 px-4 flex items-center justify-center">
          <span className="text-[10px] text-green-500/50 font-mono tracking-widest uppercase">root@nav:~</span>
        </div>

        {/* Links List */}
        <div className="flex flex-row">
          {navLinks.map((link) =>
            link.name === "SYS_CONTACT" ? (
              <button
                key={link.name}
                onClick={handleContactClick}
                className="group relative flex items-center gap-2.5 px-5 border-r border-green-500/10 last:border-r-0 hover:bg-green-500/[0.08] transition-colors h-full"
              >
                <link.icon className="w-3.5 h-3.5 text-green-500/40 group-hover:text-green-400 transition-colors" />
                <span className="text-xs font-mono text-green-500/60 group-hover:text-green-400 tracking-wider">
                  {link.name}
                </span>
                <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="group relative flex items-center gap-2.5 px-5 border-r border-green-500/10 last:border-r-0 hover:bg-green-500/[0.08] transition-colors"
              >
                <link.icon className="w-3.5 h-3.5 text-green-500/40 group-hover:text-green-400 transition-colors" />
                <span className="text-xs font-mono text-green-500/60 group-hover:text-green-400 tracking-wider">
                  {link.name}
                </span>
                <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )
          )}
        </div>
      </div>
    </motion.div>
    </div>
  );
}
