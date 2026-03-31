'use client';

import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Shield } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AboutSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <section ref={ref} className="mb-16">
      <motion.div
        style={{ opacity, y }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="glass p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-blue-400 w-8 h-8" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              About
            </h2>
          </div>
          
          <motion.div variants={itemVariants} className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <span className="text-blue-300 font-semibold">Cybersecurity Engineer &amp; Full-Stack Developer</span> based in Philadelphia with expertise in penetration testing, vulnerability research, and building scalable web applications.
            </p>
            
            <p>
              My journey began in 2014 with hands-on hardware modification and quickly evolved into software reverse engineering, web security research, and full-stack development. I&apos;ve led security research teams, co-founded a tech startup, and spent years conducting authorized penetration testing for cybersecurity firms.
            </p>
            
            <p>
              Currently specializing in <span className="text-cyan-300">authorization testing</span>, <span className="text-cyan-300">vulnerability research</span>, and building developer tools. Experienced in both offensive security (kill-chain execution, privilege escalation) and defensive infrastructure (container orchestration, intrusion response).
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="glass p-4">
                <h3 className="text-blue-300 font-semibold mb-2">🎯 Focus Areas</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Authorization Testing</li>
                  <li>• CVE Research & Vulnerability Tracking</li>
                  <li>• Full-Stack Application Development</li>
                  <li>• Security Tool Development</li>
                </ul>
              </div>
              
              <div className="glass p-4">
                <h3 className="text-blue-300 font-semibold mb-2">🏢 Work History</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Senior Security Engineer</li>
                  <li>• Full-Stack Developer (Jewelry Startup)</li>
                  <li>• Security Research Team Lead</li>
                  <li>• Hardware/Software Modder (Since 2014)</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
