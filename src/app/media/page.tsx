"use client";

import MediaShowcase from "@/components/MediaShowcase";
import MatrixCanvas from "@/components/MatrixCanvas";
import { FloatingCodeSnippet } from "@/components/HeroSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MediaPage() {
  return (
    <main className="relative z-10 min-h-screen bg-black text-white p-6 md:p-12 lg:p-20 overflow-x-hidden">
      {/* Matrix falling code background */}
      <MatrixCanvas opacity={0.2} density={0.03} speed={40} mouseTrail={false} />

      {/* Global IDE Architectural Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: 'center center'
        }} 
      />

      {/* Ambient floating code snippets */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden lg:block">
        <FloatingCodeSnippet code={"git log --oneline --graph"} x="1%" y="12%" delay={1.2} duration={4.5} />
        <FloatingCodeSnippet code={"cargo build --release"} x="2%" y="30%" delay={2.0} duration={5.0} />
        <FloatingCodeSnippet code={"uvicorn main:app --reload"} x="1%" y="55%" delay={1.7} duration={3.8} />
        <FloatingCodeSnippet code={"ollama run llama3"} x="3%" y="72%" delay={2.5} duration={4.2} />
        <FloatingCodeSnippet code={"tailscale status --json | jq"} x="1%" y="88%" delay={3.0} duration={5.5} />

        <FloatingCodeSnippet code={"ffmpeg -i demo.mp4 -c:v libx264 out.mp4"} x="80%" y="10%" delay={1.5} duration={4.8} />
        <FloatingCodeSnippet code={"pyshark.FileCapture('./traffic.pcap')"} x="78%" y="28%" delay={2.2} duration={5.2} />
        <FloatingCodeSnippet code={"struct PacketHeader { src: IpAddr }"} x="81%" y="50%" delay={1.9} duration={4.0} />
        <FloatingCodeSnippet code={"ssh -p 22 root@10.0.0.1"} x="79%" y="68%" delay={2.8} duration={3.6} />
        <FloatingCodeSnippet code={"systemctl status quadruped.service"} x="80%" y="84%" delay={3.3} duration={4.9} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-16 px-4 py-2 border border-white/10 bg-black text-white/50 hover:bg-white/[0.03] hover:text-green-400 hover:border-green-500/30 font-mono text-xs uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="w-3 h-3" />
          cd ../root
        </Link>
        <MediaShowcase />
      </div>
    </main>
  );
}
