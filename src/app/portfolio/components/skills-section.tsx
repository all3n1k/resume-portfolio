'use client';

import { motion } from 'framer-motion';
import { Code, Lock, Server, Database, Zap, GitBranch, Layout, Cloud, Globe, Cpu, TerminalSquare } from 'lucide-react';

const skills = [
  {
    category: 'Security Testing',
    icon: Lock,
    skills: [
      { name: 'Metasploit/MSFVenom', level: 90 },
      { name: 'Burp Suite', level: 95 },
      { name: 'Ghidra', level: 85 },
      { name: 'Frida', level: 80 },
      { name: 'Penetration Testing', level: 90 },
      { name: 'CVE Research', level: 85 },
    ],
  },
  {
    category: 'Web Development',
    icon: Code,
    skills: [
      { name: 'React/Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'TailwindCSS', level: 95 },
      { name: 'Full-Stack Apps', level: 90 },
      { name: 'API Design', level: 85 },
      { name: 'Database Architecture', level: 80 },
    ],
  },
  {
    category: 'Security Research',
    icon: Zap,
    skills: [
      { name: 'Reverse Engineering', level: 90 },
      { name: 'Application Cracking', level: 85 },
      { name: 'Authentication Auditing', level: 95 },
      { name: 'Web App Security', level: 95 },
      { name: 'Botnet Infrastructure', level: 80 },
      { name: 'Fingerprint Evasion', level: 85 },
    ],
  },
  {
    category: 'Infrastructure',
    icon: Server,
    skills: [
      { name: 'Container Orchestration', level: 85 },
      { name: 'MDM Solutions', level: 85 },
      { name: 'Server Patch Management', level: 90 },
      { name: 'Intrusion Response', level: 90 },
      { name: 'Network Security', level: 85 },
      { name: 'CLI/DevOps Tools', level: 90 },
    ],
  },
];

const tools = [
  { name: 'Go', icon: TerminalSquare, level: 75 },
  { name: 'React Three Fiber', icon: GitBranch, level: 80 },
  { name: 'Three.js', icon: Globe, level: 85 },
  { name: 'Docker', icon: Cpu, level: 85 },
  { name: 'Webhooks', icon: Cloud, level: 80 },
  { name: 'RTMP Integration', icon: Layout, level: 75 },
];

export function SkillsSection() {
  return (
    <section className="mb-16">
      <div className="glass p-8 mb-6">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {skills.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-5 hover:border-blue-500/50 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="text-blue-400 w-6 h-6" />
                <h3 className="text-xl font-semibold text-gray-200">{category.category}</h3>
              </div>
              
              <div className="space-y-3">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">{skill.name}</span>
                      <span className="text-sm text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <Database className="text-blue-400 w-6 h-6" />
          Tools & Technologies
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-4 py-2 flex items-center gap-2"
            >
              <tool.icon className="text-blue-400 w-5 h-5" />
              <span className="text-gray-200">{tool.name}</span>
              <div className="w-20 bg-gray-700 rounded-full h-1.5 ml-2">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${tool.level}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
