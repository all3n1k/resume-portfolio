import { AboutSection } from './components/about-section';
import { SkillsSection } from './components/skills-section';
import { ProjectsSection } from './components/projects-section';
import { ContactSection } from './components/contact-section';

export const metadata = {
  title: 'Allen | Cybersecurity Engineer & Full-Stack Developer',
  description: 'Cybersecurity professional specializing in penetration testing, vulnerability research, and full-stack application development.',
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16 glass p-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Allen
          </h1>
          <p className="text-xl text-gray-300 mb-2">Cybersecurity Engineer & Full-Stack Developer</p>
          <p className="text-gray-400">Philadelphia | cybersecurity expert | full-stack architect</p>
        </header>

        {/* About Section */}
        <AboutSection />

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <ProjectsSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <footer className="text-center text-gray-500 mt-16 pb-8">
          <p>© {new Date().getFullYear()} Allen. Built with Next.js, React, and TailwindCSS.</p>
        </footer>
      </div>
    </main>
  );
}
