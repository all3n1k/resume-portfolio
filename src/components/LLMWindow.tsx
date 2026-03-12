"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CODE_SNIPPETS = [
  `> Initializing neural net connections...\n> Loading modules: [####      ] 40%\n> Allocating memory blocks...\n> Establishing secure WebSocket tunnel...`,
  `function computeEntropy(data) {\n  let entropy = 0;\n  for(let i=0; i<data.length; i++) {\n    entropy -= data[i] * Math.log2(data[i]);\n  }\n  return entropy;\n}\n> System optimized!`,
  `class AgentInterface {\n  constructor() {\n    this.id = uuidv4();\n    this.status = 'AWAITING_COMMAND';\n  }\n  execute(task) {\n    return this.process(task);\n  }\n}`,
  `> Scanning ports...\n> Port 22: OPEN\n> Port 80: OPEN\n> Port 443: OPEN\n> Injecting payloads...\n> Access Granted. Welcome Admin.`,
];

export default function LLMWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [snippetIndex, setSnippetIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setText("");
      return;
    }

    const fullText = CODE_SNIPPETS[snippetIndex % CODE_SNIPPETS.length];
    let charIndex = 0;
    
    const interval = setInterval(() => {
      setText(fullText.slice(0, charIndex));
      charIndex++;
      
      if (charIndex > fullText.length) {
        clearInterval(interval);
        // Queue next snippet after a delay
        setTimeout(() => {
          if (isOpen) {
             setSnippetIndex(prev => prev + 1);
          }
        }, 2000);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isOpen, snippetIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 z-50 flex items-center justify-center p-6 md:p-12 pointer-events-auto bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-5xl h-[80vh] bg-black/90 border border-[#00ff41]/50 rounded-lg overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,255,65,0.2)]">
            {/* Header / Title Bar */}
            <div className="h-10 border-b border-[#00ff41]/30 bg-[#00ff41]/10 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-400" onClick={onClose} />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-[#00ff41] font-mono text-xs uppercase tracking-wider opacity-80">
                LLM_AGENT@MAINFRAME:~
              </div>
              <div className="w-8" />
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-6 overflow-y-auto font-mono text-sm md:text-base text-[#00ff41]">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {text}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2.5 h-5 bg-[#00ff41] ml-1 align-middle"
                />
              </pre>
            </div>
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,255,65,0.1)]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
