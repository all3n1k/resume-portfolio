"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MATRIX_CHARS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789".split("");

interface MouseGlitchTextProps {
  text: string;
  className?: string;
  glitchRadius?: number;
  autoDissolveDelay?: number; // MS before it dissolves
}

export default function MouseGlitchText({ 
  text, 
  className = "", 
  glitchRadius = 150,
  autoDissolveDelay = 4000,
  baseColor = "rgba(255, 255, 255, 0.6)",
  outlineColor = "transparent",
  outlineWidth = "0px"
}: MouseGlitchTextProps & { baseColor?: string; outlineColor?: string; outlineWidth?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = React.useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const spans = Array.from(containerRef.current.children) as HTMLSpanElement[];
    const charArray = text.split("");

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let raf: number;
    let frameCount = 0;
    
    // Auto dissolve triggers
    let dissolveTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (autoDissolveDelay > 0) {
      dissolveTimer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.dataset.forceScramble = "true";
        }
      }, autoDissolveDelay);

      hideTimer = setTimeout(() => {
        setHidden(true);
      }, autoDissolveDelay + 1500); // 1.5 seconds of violent scramble before vanishing entirely
    }

    const draw = () => {
      frameCount++;
      const forceScramble = containerRef.current?.dataset.forceScramble === "true";
      const shouldScramble = forceScramble || frameCount % 4 === 0;

      spans.forEach((span, i) => {
        if (charArray[i] === " ") return;

        const rect = span.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dist = Math.hypot(centerX - mouseX, centerY - mouseY);
        
        if (forceScramble) {
            span.innerText = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            const intense = Math.random();
            span.style.color = `rgba(0, 255, 65, ${0.2 + intense * 0.8})`;
            span.style.textShadow = `0 0 ${15 * intense}px rgba(0, 255, 65, ${intense})`;
            span.style.transform = `scale(${0.8 + intense * 0.4}) translate(${Math.random()*6-3}px, ${Math.random()*6-3}px)`;
        } else if (dist < glitchRadius) {
          if (shouldScramble) {
            span.innerText = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }
          const intensity = Math.max(0, 1 - (dist / glitchRadius));
          span.style.color = `rgba(0, 255, 65, ${0.4 + intensity * 0.6})`;
          span.style.textShadow = `0 0 ${12 * intensity}px rgba(0, 255, 65, ${intensity})`;
          span.style.transform = `scale(${1 + intensity * 0.1})`;
        } else {
          span.innerText = charArray[i];
          span.style.color = baseColor;
          span.style.textShadow = "none";
          span.style.transform = "scale(1)";
        }
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
      clearTimeout(dissolveTimer);
      clearTimeout(hideTimer);
    };
  }, [text, glitchRadius, autoDissolveDelay, outlineColor, outlineWidth, baseColor]);

  if (hidden) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: containerRef.current?.dataset.forceScramble === "true" ? 0 : 1, scale: 1 }}
      transition={{ opacity: { duration: 1.5, delay: 0 }, scale: { duration: 1.0, delay: 0 } }}
      ref={containerRef} 
      className={`flex flex-wrap justify-center pointer-events-none select-none ${className}`}
    >
      {text.split("").map((char, i) => (
        <span 
          key={i} 
          style={{ 
            width: "1ch", 
            textAlign: "center", 
            display: "inline-block",
            transition: "color 0.1s ease-out, transform 0.1s ease-out",
            WebkitTextStroke: `${outlineWidth} ${outlineColor}`,
            paintOrder: "stroke fill"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </motion.div>
  );
}
