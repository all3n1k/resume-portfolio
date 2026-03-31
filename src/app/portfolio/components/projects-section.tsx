'use client';

import { motion } from 'framer-motion';
import { GitBranch, Database, Lock, Terminal, Cpu } from 'lucide-react';

const projects = [
  {
    title: 'Jewelry Manufacturing Platform',
    role: 'Technology Architect & Lead Developer',
    icon: Database,
    period: '1+ Year',
    description: 'Co-founded and built the complete technology stack for a jewelry manufacturing company. Designed and implemented a full-stack application that streamlined operations and reduced headcount requirements.',
    features: [
      'React web app with AI-generated design concepts (early diffusion models)',
      'Obsidian-inspired graph view planning board for production teams',
      'Apple-like multi-stage order tracking with photo updates',
      'Real-time webhooks (RTMP, SMS) for notifications & 2FA',
      'Google Drive-as-database initially, migrated to CDN architecture',
      'Target market: NY tri-state area with optimized UX/UI'
    ],
    tech: ['React', 'TypeScript', 'TailwindCSS', 'CDN', 'Webhooks', 'RTMP'],
  },
  {
    title: 'Penetration Testing & Security Research',
    role: 'Technical Support Specialist & Security Engineer',
    icon: Lock,
    period: 'Cybersecurity Firm',
    description: 'Conducted authorized penetration testing, vulnerability research, and incident response. Built internal workforce management systems and maintained production infrastructure.',
    features: [
      'Full kill-chain execution: enumeration, lateral traversal, privilege escalation',
      'Network intrusion response and container rollback automation',
      'CVE research and vulnerability tracking (ongoing)',
      'Post-exploitation reports for reliability engineering teams',
      'Go-based internal workforce management system',
      'MDM device provisioning and OS troubleshooting'
    ],
    tech: ['Go', 'Metasploit', 'Burp Suite', 'Ghidra', 'Frida', 'Docker'],
  },
  {
    title: 'Web Security Research Team',
    role: 'Team Lead & Technical Architect',
    icon: Terminal,
    period: '2014-2018',
    description: 'Led a technical team focused on web application security research, specializing in anti-bot evasion and authentication auditing for major platforms.',
    features: [
      'Custom OpenBullet forks with extended browser emulation',
      'JavaScript fingerprint evasion techniques',
      'Time-based encryption with atomic clock synchronization',
      'Frida instrumentation for iOS/Android auth flow analysis',
      'Botnet request infrastructure development',
      'Credential sanitization for testing pipelines'
    ],
    tech: ['Custom Tools', 'Frida', 'OpenBullet Forks', 'JavaScript', 'Mobile Security'],
  },
  {
    title: '3D Portfolio Scene (Current Project)',
    role: 'Full-Stack Developer',
    icon: Cpu,
    period: '2025 (Current)',
    description: 'Building an immersive Matrix-themed 3D portfolio with interactive door transitions, spherical monitor wall, and AI chat assistant using cutting-edge web technologies.',
    features: [
      '75x18 spherical monitor dome (1200+ monitors)',
      'Neo & Architect character models from The Matrix',
      'Interactive glass door with animation sequences',
      'Matrix rain transitions and CRT effects',
      'Framer Motion animations and smooth camera controls',
      'Floating AI chat widget for visitor engagement'
    ],
    tech: ['Next.js 15', 'React 19', 'Three.js', 'React Three Fiber', 'Framer Motion', 'TailwindCSS v4'],
  },
];

export function ProjectsSection() {
  return (
    <section className="mb-16">
      <div className="glass p-8 mb-6">
        <div className="flex items-center gap-3 mb-8">
          <GitBranch className="text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Featured Projects
          </h2>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 hover:border-blue-500/50 transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <project.icon className="text-blue-400 w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-200">{project.title}</h3>
                    <p className="text-blue-300 font-medium">{project.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {project.period}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Key Features</h4>
                <ul className="space-y-2">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="bg-gray-800 text-blue-300 px-3 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
