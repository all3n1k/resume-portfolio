import MediaShowcase from "@/components/MediaShowcase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MediaPage() {
  return (
    <main className="relative z-10 min-h-screen bg-black text-white p-6 md:p-12 lg:p-20 overflow-x-hidden">
      {/* Global IDE Architectural Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.2]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: 'center center'
        }} 
      />

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
