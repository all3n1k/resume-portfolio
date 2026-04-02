"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send, MapPin } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Github, href: "#", label: "GitHub", color: "hover:text-white" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-400" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email", color: "hover:text-red-400" },
];

export default function ModernContact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/5">
            <span className="text-pink-400 text-sm font-mono tracking-wider">
              $ ./contact.sh --init
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Ready to build something extraordinary? I&apos;m always open to discussing new projects and opportunities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-px bg-gradient-to-r from-pink-500/50 to-purple-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-white/40 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/40 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/40 mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="What&apos;s on your mind?"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Send Message
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500/50 to-cyan-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
                
                <div className="space-y-4">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/5 transition-all ${link.color}`}
                    >
                      <link.icon className="w-5 h-5 text-white/60" />
                      <span className="text-white">{link.label}</span>
                      <span className="ml-auto text-white/30">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/50 to-green-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-4">Location</h3>
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/30 mb-1">Local Time</div>
                  <div className="text-lg text-green-400 font-mono">
                    --:-- PST
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-white/10 bg-white/5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-white/60 text-sm font-mono">Available for opportunities</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
