import ChatWidget from "@/components/ChatWidget";
import LandingDoorSequence from "@/components/LandingDoorSequence";
import { AboutSection } from "./portfolio/components/about-section";
import { SkillsSection } from "./portfolio/components/skills-section";
import { ProjectsSection } from "./portfolio/components/projects-section";
import { ContactSection } from "./portfolio/components/contact-section";
import MatrixCanvas from "@/components/MatrixCanvas";

import EasterEggManager from "@/components/EasterEggManager";
import HeroSection from "@/components/HeroSection";
import ModernAchievements from "@/components/ModernAchievements";
import ModernContact from "@/components/ModernContact";

const achievements = [
  {
    id: "a1",
    year: "2024",
    title: "Cybersecurity & Pen-Testing",
    description:
      "Conducted internal penetration testing with full kill-chain execution (enumeration, lateral traversal, privilege escalation). Managed incident response, server infra, and device provisioning.",
  },
  {
    id: "a2",
    year: "2023",
    title: "Co-Founded Jewelry Tech Platform",
    description:
      "Architected a scalable full-stack ecosystem: a React app with generative AI for designs, a graph-based planning board, multi-stage tracking (Apple-inspired), and webhook/RTMP integrations.",
  },
  {
    id: "a3",
    year: "2022",
    title: "Web Security Research",
    description:
      "Led a team simulating credential stuffing and auditing auth systems. Developed custom OpenBullet forks with extensive browser emulation, built botnet request infra, and reverse-engineered apps with Frida.",
  },
  {
    id: "a4",
    year: "2014-",
    title: "Hardware Modding & Software Fundamentals",
    description:
      "Started by modding PS3/Xbox hardware. Transitioned into software cracking, modding reverse-engineering using Cheat Engine, shaping the foundation of my engineering intuition.",
  },
];

export default function Home() {
  return (
    <>
      <MatrixCanvas opacity={0.08} density={0.03} speed={40} mouseTrail={true} />
      
      <LandingDoorSequence>
        <EasterEggManager>
          <main className="relative z-10 min-h-screen">
            <HeroSection
              name="ALLEN"
              tagline="Building the future, one commit at a time"
            />
            
            <ModernAchievements items={achievements} />
            
            <ModernContact />
            
            <footer className="relative z-10 py-12 border-t border-white/10">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-white/40 text-sm font-mono">
                    <span className="text-green-400">$</span> echo $SIGATURE
                  </div>
                  <div className="text-white/30 text-sm">
                    &copy; {new Date().getFullYear()} Allen. All systems operational.
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    v2.0.0
                  </div>
                </div>
              </div>
            </footer>
          </main>

          <ChatWidget />
        </EasterEggManager>
      </LandingDoorSequence>
    </>
  );
}
