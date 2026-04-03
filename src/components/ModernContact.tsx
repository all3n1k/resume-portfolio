"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send, ArrowUpRight } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Github, href: "#", label: "GitHub", handle: "@allen" },
  { icon: Linkedin, href: "#", label: "LinkedIn", handle: "in/allen" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email", handle: "hello@example.com" },
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
          timeZone: "America/Los_Angeles",
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

export default function ModernContact() {
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
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-green-500 to-transparent" />
            <span className="text-green-400 text-xs font-mono tracking-[0.2em] uppercase">
              contact
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="text-white">Let&apos;s </span>
            <span className="gradient-text">Connect</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl">
            Open to new opportunities, collaborations, and interesting conversations.
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
            <div className="relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-white/30 uppercase tracking-wider">Send a message</span>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-white/30 font-mono mb-2 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/15 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 font-mono mb-2 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/15 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/30 font-mono mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    rows={4}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/15 focus:outline-none focus:border-green-500/30 focus:bg-white/[0.04] transition-all resize-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-green-400 to-emerald-400 hover:brightness-110 transition-all shadow-lg shadow-green-500/10 text-sm"
                >
                  Send Message
                  <Send className="w-4 h-4" />
                </button>
              </form>
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
              className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              <span className="text-xs font-mono text-white/30 uppercase tracking-wider">Links</span>
              <div className="mt-4 space-y-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group/link flex items-center gap-3 p-3 -mx-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <link.icon className="w-4 h-4 text-white/50 group-hover/link:text-green-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/80 font-medium">{link.label}</div>
                      <div className="text-xs text-white/30 font-mono truncate">{link.handle}</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover/link:text-green-400/50 transition-colors" />
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
              className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              <span className="text-xs font-mono text-white/30 uppercase tracking-wider">Location</span>
              <div className="mt-4 space-y-3">
                <div className="text-white/70 text-sm">San Francisco, CA</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-mono text-green-400 font-bold">
                    <LiveClock />
                  </span>
                  <span className="text-xs text-white/20 font-mono">PST</span>
                </div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-2xl border border-green-500/10 bg-green-500/[0.03] flex items-center gap-3"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-green-400/80 text-sm font-mono">
                Open to opportunities
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
