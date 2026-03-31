'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Calendar, Phone, ExternalLink } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="mb-8">
      <div className="glass p-8 mb-6">
        <div className="flex items-center gap-3 mb-8">
          <Mail className="text-blue-400 w-8 h-8" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Get in Touch
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Interested in working together? Whether you have a security research project, 
              need penetration testing services, or want to discuss full-stack development, 
              I&apos;d love to hear from you.
            </p>

            <div className="space-y-4">
              <motion.a
                href="mailto:your-email@example.com"
                className="flex items-center gap-3 p-4 glass hover:border-blue-500/50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Mail className="text-blue-400 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-gray-200 font-medium">your-email@example.com</p>
                </div>
              </motion.a>

              <motion.a
                href="https://github.com/all3n1k"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 glass hover:border-blue-500/50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Github className="text-blue-400 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-400">GitHub</p>
                  <p className="text-gray-200 font-medium">@all3n1k</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-500 ml-auto" />
              </motion.a>

              <motion.a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 glass hover:border-blue-500/50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Linkedin className="text-blue-400 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-400">LinkedIn</p>
                  <p className="text-gray-200 font-medium">Your Profile</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-500 ml-auto" />
              </motion.a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass p-4">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-blue-400 w-5 h-5" />
                <h3 className="text-gray-200 font-medium">Location</h3>
              </div>
              <p className="text-gray-400 ml-8">Philadelphia, PA</p>
            </div>

            <div className="glass p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-blue-400 w-5 h-5" />
                <h3 className="text-gray-200 font-medium">Availability</h3>
              </div>
              <p className="text-gray-400 ml-8">Open to new opportunities</p>
            </div>

            <div className="glass p-4">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="text-blue-400 w-5 h-5" />
                <h3 className="text-gray-200 font-medium">Response Time</h3>
              </div>
              <p className="text-gray-400 ml-8">Within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
