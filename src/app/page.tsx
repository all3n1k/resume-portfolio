import ChatWidget from "@/components/ChatWidget";
import LandingDoorSequence from "@/components/LandingDoorSequence";
import EasterEggManager from "@/components/EasterEggManager";
import HeroSection from "@/components/HeroSection";
import { FloatingCodeSnippet } from "@/components/HeroSection";
import ModernAchievements from "@/components/ModernAchievements";
import TechStack from "@/components/TechStack";
import ModernContact from "@/components/ModernContact";
import MouseGlitchText from "@/components/MouseGlitchText";
import InitFade from "@/components/InitFade";

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
      {/* Massive centered floating text overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center font-bold"
        style={{ fontFamily: "'OCR A Std', 'OCR-A', 'OCR A Extended', monospace" }}
      >
        <MouseGlitchText 
          text="knock, knock, Allen." 
          baseColor="black"
          outlineColor="#00ff41"
          outlineWidth="4px"
          className="text-[8vw] md:text-[5rem] tracking-[0.1em] font-black drop-shadow-[0_0_15px_rgba(0,255,65,0.4)] text-center px-4" 
          glitchRadius={180}
          autoDissolveDelay={5000}
        />
      </div>

      <InitFade />

      <LandingDoorSequence>
        <EasterEggManager>
          <main className="relative z-10 min-h-screen">
            {/* Global IDE Architectural Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]" 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                backgroundPosition: 'center center'
              }} 
            />

            {/* ── Global Ambient Code Block Layer ── */}
            {/* These are fixed-position, pointer-events-none snippets scattered across the full scroll depth */}
            <div className="fixed inset-0 z-0 pointer-events-none hidden lg:block">
              {/* Achievements Zone — Left margin */}
              <FloatingCodeSnippet code={"nmap -sV -p 443 target.lan"} x="1%" y="35%" delay={3.0} duration={5.0} />
              <FloatingCodeSnippet code={"git clone git@github.com:all3n1k/ollamaped"} x="3%" y="45%" delay={2.2} duration={4.3} />
              <FloatingCodeSnippet code={"let bytes = pcap::Capture::from_device(dev)?"} x="1%" y="55%" delay={3.5} duration={6.0} />

              {/* Achievements Zone — Right margin */}
              <FloatingCodeSnippet code={"metasploit > use exploit/multi/handler"} x="79%" y="32%" delay={2.8} duration={4.7} />
              <FloatingCodeSnippet code={"frida -U -l hook.js com.target.app"} x="82%" y="44%" delay={3.2} duration={5.3} />
              <FloatingCodeSnippet code={"with open('dump.txt', 'r') as f:"} x="77%" y="56%" delay={1.9} duration={4.1} />

              {/* Tech Stack Zone — Left margin */}
              <FloatingCodeSnippet code={"tailscale up --accept-routes"} x="2%" y="65%" delay={2.6} duration={3.9} />
              <FloatingCodeSnippet code={"kubectl apply -f deployment.yaml"} x="5%" y="74%" delay={3.8} duration={5.5} />

              {/* Tech Stack Zone — Right margin */}
              <FloatingCodeSnippet code={"ghidra > analyze_headless ./binary"} x="80%" y="63%" delay={2.4} duration={4.6} />
              <FloatingCodeSnippet code={"model = nn.Sequential(nn.Linear(128, 64))"} x="76%" y="73%" delay={3.1} duration={5.8} />

              {/* Contact Zone */}
              <FloatingCodeSnippet code={"msfvenom -p linux/x64/shell_reverse_tcp"} x="1%" y="84%" delay={2.0} duration={4.4} />
              <FloatingCodeSnippet code={"docker build -t classifier:latest ."} x="79%" y="85%" delay={2.9} duration={5.1} />
            </div>

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
