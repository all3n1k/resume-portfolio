"use client";

import { useState, useEffect, useCallback } from "react";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  startOnView?: boolean;
  cursorChar?: string;
}

export default function TypewriterText({
  text,
  className = "",
  speed = 50,
  delay = 0,
  startOnView = false,
  cursorChar = "█",
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(!startOnView);

  const elementRef = useCallback((node: HTMLElement | null) => {
    if (!node || !startOnView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, hasStarted]);

  return (
    <span ref={elementRef} className={`inline-block ${className}`}>
      {displayed}
      {!isComplete && (
        <span className="animate-pulse ml-0.5">{cursorChar}</span>
      )}
    </span>
  );
}
