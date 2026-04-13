"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/all3n1k", label: "GitHub", handle: "github.com/all3n1k" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/allen-niktalov/", label: "LinkedIn", handle: "in/allen-niktalov" },
  { icon: Mail, href: "#contact", label: "Email", handle: "allenniktalov@gmail.com" },
];

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/New_York",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">{time || "--:--:--"}</span>
  );
}

function TerminalRadar() {
  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center rounded-full border border-green-500/30 overflow-hidden bg-black/50">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.2) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Crosshairs */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-full h-px bg-green-500/20" />
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-full w-px bg-green-500/20" />
      </div>
      
      {/* Target Rings */}
      <div className="absolute w-[150px] h-[150px] rounded-full border border-green-500/10 z-10" />
      <div className="absolute w-[100px] h-[100px] rounded-full border border-green-500/10 z-10" />
      <div className="absolute w-[50px] h-[50px] rounded-full border border-green-500/20 z-10" />

      {/* Radar Sweeper */}
      <div 
        className="absolute inset-0 z-20 rounded-full animate-[spin_4s_linear_infinite]"
        style={{
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 255, 65, 0.1) 80%, rgba(0, 255, 65, 0.8) 100%)',
        }}
      />

      {/* PA Targeted Blip */}
      <div className="absolute z-30" style={{ top: '35%', left: '30%' }}>
        <div className="relative flex items-center justify-center group">
          {/* Ping animation rings */}
          <div className="absolute w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75" />
          <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#00ff41]" />
          
          {/* Target identifier line */}
          <div className="absolute top-2 left-2 w-8 h-px bg-green-400/50 rotate-45 origin-top-left" />
          <div className="absolute top-8 left-8 text-[8px] font-mono text-green-400 tracking-widest bg-black px-1 border border-green-500/30 whitespace-nowrap">
            TARGET_PA
          </div>
        </div>
      </div>
      

    </div>
  );
}

export default function ModernContact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [loadingPhase, setLoadingPhase] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus("submitting");
    setLoadingPhase("[ ESTABLISHING SECURE TUNNEL... ]");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Transmission Rejected");
      }

      setLoadingPhase("[ 200 OK: PAYLOAD DELIVERED ]");
      setTimeout(() => setStatus("success"), 500);

    } catch (error) {
      console.error(error);
      setLoadingPhase("[ ERROR: TRANSMISSION FAILED ]");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-green-400 text-sm font-mono tracking-widest uppercase">
              {"//"} HANDSHAKE PROTOCOL
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter uppercase">
            <span className="text-white/40">{"< "}</span>
            <span className="text-white">Contact</span>
            <span className="text-white/40">{" />"}</span>
          </h2>
          <p className="mt-4 text-white/40 text-sm font-mono max-w-xl">
            Transmit directly to secure server. Awaiting initial SYN.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Contact form — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 relative group"
          >
            <div className="relative p-8 rounded-none border border-white/20 bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <div className="w-2 h-4 bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Execute POST /message</span>
              </div>

              {status === "success" ? (
                <div className="p-6 border border-green-500/30 bg-green-500/[0.02] font-mono text-sm space-y-3">
                  <div className="text-green-400 font-bold mb-6 text-base tracking-wider">{"> "} 200 OK: PACKET DELIVERED.</div>
                  <div className="text-green-500/70 flex justify-between">
                    <span>TIMESTAMP:</span>
                    <span className="text-green-400/90">
                      {new Date().toLocaleString("en-US", {
                        timeZone: "America/New_York",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })} EST
                    </span>
                  </div>
                  <div className="text-green-500/70 flex justify-between">
                    <span>NAME:</span>
                    <span className="text-green-400/90">{formData.name}</span>
                  </div>
                  <div className="text-green-500/70 flex justify-between">
                    <span>SIZE:</span>
                    <span className="text-green-400/90">{formData.message.length * 4}b</span>
                  </div>
                  <div className="text-green-500/70 border-t border-green-500/10 pt-3 mt-3">
                    <span className="block mb-2 text-green-500/40">MESSAGE:</span>
                    <span className="text-green-400/80 whitespace-pre-wrap">{formData.message}</span>
                  </div>
                  <div className="mt-8 pt-4 flex items-center gap-3 text-green-500/40 text-xs tracking-widest border-t border-green-500/10">
                    <span className="w-2 h-4 bg-green-400 animate-pulse border border-green-400" /> CONNECTION TERMINATED.
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-white/30 font-mono mb-2 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        required
                        disabled={status === "submitting"}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-none bg-black border border-white/10 text-green-400 font-mono placeholder:text-white/10 focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 disabled:opacity-50 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/30 font-mono mb-2 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        required
                        disabled={status === "submitting"}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-none bg-black border border-white/10 text-green-400 font-mono placeholder:text-white/10 focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 disabled:opacity-50 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 font-mono mb-2 uppercase tracking-wider">Message</label>
                    <textarea
                      rows={4}
                      required
                      disabled={status === "submitting"}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-3 rounded-none bg-black border border-white/10 text-green-400 font-mono placeholder:text-white/10 focus:outline-none focus:border-green-500/50 focus:bg-green-500/5 disabled:opacity-50 transition-all resize-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-none font-mono text-green-400 bg-black border border-green-500/40 hover:bg-green-500/10 disabled:bg-green-500/5 disabled:border-green-500/20 disabled:text-green-500/50 transition-all text-sm tracking-widest uppercase mt-4 overflow-hidden"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="inline-block w-3 h-3 border-2 border-green-500/30 border-t-green-400 rounded-full animate-spin mr-2" />
                        {loadingPhase}
                      </>
                    ) : (
                      <>
                        $ TRANSMIT
                        <span className="w-2 h-4 bg-green-400 group-hover:animate-pulse ml-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right column stack */}
          <div className="space-y-4">
            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-none border border-white/20 bg-black shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,255,65,0.05)] transition-shadow duration-500"
            >
              <span className="text-xs font-mono text-white/30 uppercase tracking-widest border-b border-white/10 pb-2 block mb-4">Endpoints</span>
              <div className="space-y-0 text-sm font-mono">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group/link flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/[0.03] px-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-4 h-4 text-white/30 group-hover/link:text-green-400 transition-colors" />
                      <span className="text-white/80 group-hover/link:text-green-400 transition-colors uppercase tracking-wider">{link.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/20 hidden sm:block">{link.handle}</span>
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover/link:text-green-400/50 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Location + time */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-none border border-white/20 bg-black relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.15] pointer-events-none scale-150">
                <TerminalRadar />
              </div>

              <div className="relative z-10">
                <span className="text-xs font-mono text-white/30 uppercase tracking-widest border-b border-white/10 pb-2 block mb-4">Location</span>
                <div className="space-y-1">
                  <div className="text-white/80 text-sm font-mono uppercase tracking-wider">Elkins Park, PA</div>
                  <div className="text-white/40 text-[10px] font-mono tracking-widest mb-3">[40.0768° N, 75.1277° W]</div>
                  <div className="flex items-baseline gap-3 pt-2 border-t border-white/10">
                    <span className="text-2xl font-mono text-green-400 font-bold drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">
                      <LiveClock />
                    </span>
                    <span className="text-xs text-white/30 font-mono uppercase">EST</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-none border border-green-500/20 bg-black flex items-center gap-3"
            >
              <div className="w-2 h-4 bg-green-400 animate-pulse border border-green-400" />
              <span className="text-green-400/80 text-sm font-mono tracking-widest uppercase">
                PORT 22 OPEN
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
