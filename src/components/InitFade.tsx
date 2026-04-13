"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function InitFade() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hold pure black for 1.5s to completely mask any three.js FBX parsing lag
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-30 bg-black pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
