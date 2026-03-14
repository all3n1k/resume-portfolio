"use client";

import { useState } from "react";
import ArchitectScene from "./ArchitectScene";

interface LandingDoorSequenceProps {
  children: React.ReactNode;
}

// Video pool — every monitor cycles through these on click
const SCREEN_VIDEOS = [
  "/Screenvideos/SCREENCONTENT.mp4",
];

export default function LandingDoorSequence({ children }: LandingDoorSequenceProps) {
  const [entered, setEntered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const handleDoorClick = () => {
    setTransitioning(true);
    // Wait for fade out animation before showing content
    setTimeout(() => {
      setEntered(true);
    }, 800);
  };

  if (entered) {
    return (
      <div className="animate-in fade-in duration-1000 slide-in-from-bottom-4">
        {children}
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Scene */}
      <div className={`transition-opacity duration-700 ${transitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
        <ArchitectScene onDoorClick={handleDoorClick} videoPaths={SCREEN_VIDEOS} />
      </div>
    </div>
  );
}
