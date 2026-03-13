import ChatWidget from "@/components/ChatWidget";
import AchievementSpotlight, { Achievement } from "@/components/AchievementSpotlight";
import GlassCard from "@/components/GlassCard";
import LandingDoorSequence from "@/components/LandingDoorSequence";
const achievements: Achievement[] = [
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
    <LandingDoorSequence>
      <div className="relative min-h-dvh">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-10">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
                Allen&apos;s Portfolio
              </h1>
              <p className="text-lg md:text-xl opacity-80">
                A showcase of my journey from hardware modding to full-stack architecture and cybersecurity.
              </p>
            <div className="flex gap-3">
              <a href="#achievements" className="btn-accent rounded-lg px-4 py-3 text-sm font-medium">
                View achievements
              </a>
              <a href="#contact" className="glass rounded-lg px-4 py-3 text-sm font-medium">
                Get in touch
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <GlassCard className="p-6 md:p-8">
              <div className="text-sm uppercase tracking-wide opacity-70">About Me</div>
              <div className="text-xl font-medium mt-1">Allen</div>
              <p className="mt-3 opacity-90">
                A versatile engineer with expertise spanning web product development, scalable infrastructure, and offensive security research. Passionate about solving complex technical problems.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Achievements Spotlight */}
      <section id="achievements" className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <AchievementSpotlight items={achievements} />
      </section>

      {/* Footer placeholder */}
      <footer id="contact" className="max-w-6xl mx-auto px-6 md:px-10 pb-24 pt-8">
        <div className="glass p-6 md:p-8">
          <div className="text-sm uppercase tracking-wide opacity-70">Contact</div>
          <div className="mt-2">Reach out via LinkedIn or email to collaborate.</div>
        </div>
      </footer>

      {/* Floating Chat Assistant */}
      <ChatWidget />
    </div>
    </LandingDoorSequence>
  );
}
