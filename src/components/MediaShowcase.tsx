"use client";

import React, { useState } from 'react';
import { Terminal, Code2, AlertTriangle, Play, Pause, MonitorPlay, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const MEDIA_PROJECTS = [
  {
    id: "proj-ollama",
    name: "Ollamaped",
    status: "ACTIVE",
    description: "Open-source vision + local-LLM-driven autonomous quadruped pet. Freenove Quadruped V2 firmware + Python/FastAPI/Ollama brain.",
    githubUrl: "https://github.com/all3n1k/ollamaped",
    icon: Terminal,
    videoSrc: "", 
  },
  {
    id: "proj-traffic",
    name: "Traffic Classifier",
    status: "MAINTAIN",
    description: "High-performance real-time network traffic classifier using Rust, PyTorch, and React.",
    githubUrl: "https://github.com/all3n1k/traffic-classifier",
    icon: AlertTriangle,
    videoSrc: "",
  },
  {
    id: "proj-tailscale",
    name: "Tailscale Dashboard",
    status: "DEPLOYED",
    description: "Self-hosted web dashboard for monitoring and controlling a Tailscale mesh network.",
    githubUrl: "https://github.com/all3n1k/tailscale-dashboard",
    icon: Code2,
    videoSrc: "", 
  },
  {
    id: "proj-matrix",
    name: "Terminal Portfolio",
    status: "ACTIVE",
    description: "Brutalist 3D interactive portfolio bridging Next.js performance wrappers with native WebGL rendering via Three.js.",
    githubUrl: "https://github.com/all3n1k/resume-portfolio",
    icon: MonitorPlay,
    videoSrc: "", 
  }
];

export default function MediaShowcase() {
  const [playing, setPlaying] = useState<Record<string, boolean>>({});

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-green-400 text-sm font-mono tracking-widest uppercase">
          {"//"} VIDEO_ARCHIVE
        </span>
      </div>
      <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tighter uppercase mb-6">
        <span className="text-white/40">{"> "}</span>
        <span className="text-white">Media_Logs</span>
        <span className="animate-pulse text-green-400">_</span>
      </h1>
      <p className="text-white/40 text-sm font-mono max-w-2xl mb-16 border-l border-green-500/30 pl-4 py-1">
        Visual diagnostics, hardware intercepts, and raw execution logs. Validating theoretical system concepts through 
        functional deployment. Source code access provided beneath direct visual evidence.
      </p>

      {/* Grid container, strict structural hairlines */}
      <div className="grid lg:grid-cols-2 gap-0 border-t border-l border-white/10 relative">
        <div className="absolute top-0 right-0 bottom-0 border-r border-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 border-b border-white/10 pointer-events-none" />

        {MEDIA_PROJECTS.map((project, idx) => {
          const isPlaying = playing[project.id];
          const togglePlay = () => setPlaying(prev => ({ ...prev, [project.id]: !prev[project.id] }));

          return (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.15 }}
              className="flex flex-col p-6 sm:p-8 border-r border-b border-white/10 bg-black hover:bg-white/[0.02] transition-colors group"
            >
              {/* Header Box */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <project.icon className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-mono text-white/50 tracking-widest uppercase">{project.id}</span>
                </div>
                <div className="px-2 py-0.5 border border-green-500/20 bg-green-500/5 text-green-400 text-[10px] font-mono tracking-wider">
                  [{project.status}]
                </div>
              </div>

              {/* Video Block Placeholder */}
              <div className="relative w-full aspect-video bg-black border border-white/10 mb-6 flex items-center justify-center overflow-hidden group/video">
                {project.videoSrc ? (
                  <video 
                    src={project.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <MonitorPlay className="w-8 h-8 text-white/50" />
                    <span className="font-mono text-xs text-white/50 tracking-[0.2em]">[ NO SIGNAL ]</span>
                  </div>
                )}

                {/* Overlaid static noise or scanlines to maintain aesthetic */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.05]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.4) 2px, rgba(0,255,65,0.4) 4px)"
                  }}
                />

                {/* Simulated playback controls */}
                <button 
                  onClick={togglePlay}
                  className="absolute bottom-4 right-4 w-8 h-8 bg-black/80 border border-white/20 flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-500/50 backdrop-blur-sm transition-colors opacity-0 group-hover/video:opacity-100"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-mono font-bold text-white mb-3 uppercase tracking-tight">
                  {project.name}
                </h3>
                <p className="text-white/40 text-sm font-mono leading-relaxed mb-8 flex-1">
                  {project.description}
                </p>

                {/* Direct Action Link */}
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/[0.02] border border-white/20 hover:border-green-500/50 hover:bg-green-500/5 transition-all text-white/70 hover:text-green-400 font-mono text-xs uppercase tracking-widest"
                >
                  <Github className="w-4 h-4" />
                  Fetch Repository
                  <span className="w-1.5 h-3 bg-green-400 animate-pulse ml-1 hidden group-hover:block" />
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
