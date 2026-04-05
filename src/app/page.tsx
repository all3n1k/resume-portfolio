import ChatWidget from "@/components/ChatWidget";
import LandingDoorSequence from "@/components/LandingDoorSequence";
import EasterEggManager from "@/components/EasterEggManager";
import HeroSection from "@/components/HeroSection";
import ModernAchievements from "@/components/ModernAchievements";
import TechStack from "@/components/TechStack";
import ModernContact from "@/components/ModernContact";
import MouseGlitchText from "@/components/MouseGlitchText";

const achievements = [
  {
    id: "a1",
    year: "2024",
    title: "Cybersecurity & Pen-Testing",
    description:
      "Technical Support Specialist at a cybersecurity firm. Authorized for internal pen-testing with full kill-chain execution — enumeration, lateral traversal, privilege escalation — delivering post-exploitation reports to reliability engineering. Managed incident response, container rollback automation, CVE tracking, and contributed to an internal Go-based workforce management system. Tools: Metasploit, Burp Suite, Ghidra.",
  },
  {
    id: "a2",
    year: "2023",
    title: "Co-Founded Jewelry Tech Platform",
    description:
      "Sole technology architect for a jewelry manufacturing company. Built the entire stack over ~1 year: a React app with early diffusion-model AI for design concepts, an Obsidian-inspired graph planning board, Apple-style multi-stage order tracking with photo updates, webhook/RTMP/SMS integrations, and fiber-networked workstations. Reduced headcount by automating design-to-delivery coordination. Later transitioned to CDN architecture targeting the NY tri-state market.",
  },
  {
    id: "a3",
    year: "2022",
    title: "Web Security Research",
    description:
      "Organized and led a team conducting anti-bot evasion, credential stuffing simulation, and auth auditing across e-commerce and fast food platforms. Built custom OpenBullet forks with extended browser emulation and UA spoofing, JS fingerprint evasion, and botnet request infra. Used Frida on Android/iOS to hook auth flows. Designed a proprietary time-based encryption method tied to atomic clock-synchronized UA generation.",
  },
  {
    id: "a4",
    year: "2014–",
    title: "Hardware Modding & Software Fundamentals",
    description:
      "Began by disassembling and modding PS3 and original Xbox consoles — cooling systems, casings, hardware internals. Built and upgraded PCs (i7-4790K + GTX 760 Ti → AMD workstation + GTX 980). Transitioned into game modding with Cheat Engine and custom menus, then into software cracking, reverse engineering, Unreal Engine game dev, and server hosting.",
  },
];

export default function Home() {
  return (
    <>
      {/* Unobstructive, massive centered floating text overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center font-bold mix-blend-screen">
        <MouseGlitchText 
          text="ALLEN" 
          className="text-[12vw] md:text-[8rem] tracking-[0.3em] font-black mix-blend-screen" 
          glitchRadius={180}
          autoDissolveDelay={5000}
        />
      </div>

      <LandingDoorSequence>
        <EasterEggManager>
          <main className="relative z-10 min-h-screen">
            <HeroSection
              name="ALLEN"
              tagline="Security researcher and full-stack engineer — building systems that scale and breaking the ones that don't."
            />

            <ModernAchievements items={achievements} />

            <TechStack />

            <ModernContact />

            <footer className="relative z-10 py-10 border-t border-white/[0.04]">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-white/20 text-xs font-mono">
                    <span className="text-green-500/50">$</span> echo &quot;built with next.js + three.js&quot;
                  </div>
                  <div className="text-white/15 text-xs">
                    &copy; {new Date().getFullYear()} Allen. All systems operational.
                  </div>
                  <div className="flex items-center gap-2 text-white/15 text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
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
