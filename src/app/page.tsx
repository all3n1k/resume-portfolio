"use client";

import React, { useState } from "react";
import ChatWidget from "@/components/ChatWidget";
import AchievementSpotlight, { Achievement } from "@/components/AchievementSpotlight";
import GlassCard from "@/components/GlassCard";
import MatrixRoom from "@/components/MatrixRoom";
import MatrixOverlay from "@/components/MatrixOverlay";
import LLMWindow from "@/components/LLMWindow";


const achievements: Achievement[] = [
  {
    id: "a1",
    year: "2024",
    title: "Launched cross-platform feature (+18% engagement)",
    description:
      "Led design and delivery of a cross-platform experience across web & iOS, leveraging motion and haptics to communicate state and reduce friction.",
  },
  {
    id: "a2",
    year: "2023",
    title: "Optimized load time (-42% TTI)",
    description:
      "Decreased time-to-interactive with route-level code splitting, streaming SSR, and an asset budget enforced via CI checks.",
  },
  {
    id: "a3",
    year: "2022",
    title: "Built AI résumé assistant",
    description:
      "Shipped an embedded assistant trained on résumé data to answer recruiter questions contextually and quickly.",
  },
];

export default function Home() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <div className="relative min-h-dvh bg-black">
      {/* 3D Matrix Environment */}
      <div className="absolute inset-0 z-0 h-screen w-full">
        <MatrixRoom 
          onZoomChange={(zoomed) => {
            setIsZoomed(zoomed);
            if (!zoomed) {
              setTerminalOpen(false);
            }
          }}
          onArrived={() => setTerminalOpen(true)}
        />
        {!isZoomed && <MatrixOverlay />}
        <LLMWindow isOpen={terminalOpen} onClose={() => {
           setTerminalOpen(false);
           // NOTE: The click on the close button shouldn't propagate, but if we want to reset zoom, 
           // we'd need to pass a method to MatrixRoom. Let's let the user click the background to zoom out.
        }} />
      </div>

      {/* Main Content (Push down past the 100vh hero) */}
      <div className="relative z-10 pt-[100vh]">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-10">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Modern Resume Portfolio
            </h1>
            <p className="text-lg md:text-xl opacity-80">
              An Apple-inspired, motion-first portfolio to showcase achievements as you scroll.
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
              <div className="text-sm uppercase tracking-wide opacity-70">About</div>
              <div className="text-xl font-medium mt-1">Allen Niktalov</div>
              <p className="mt-3 opacity-90">
                Product-focused engineer specializing in delightful, accessible experiences. Passionate about craft
                and performance.
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
          <div className="mt-2">Reach out at allenniktalov@gmail.com</div>
        </div>
      </footer>

      {/* Floating Chat Assistant */}
      <ChatWidget />
      </div>
    </div>
  );
}
