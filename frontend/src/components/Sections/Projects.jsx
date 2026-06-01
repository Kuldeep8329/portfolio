import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import TiltCard from '../TiltCard';

const GithubIcon = ({ size = 14, className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Projects = ({ projects }) => {
  const localProjects = projects && projects.length > 0 ? projects : [
    {
      title: "Local RAG Document Assistant",
      description: "An AI-powered document search and question-answering assistant. Built using React for the frontend and a Node.js backend integration with Ollama. Implements Retrieval-Augmented Generation (RAG) to query local text documents privately and securely without external API dependency.",
      tech: ["React", "Node.js", "Ollama", "RAG", "Tailwind CSS"],
      link: "#",
      github: "#"
    },
    {
      title: "Enterprise Workflow Automation System",
      description: "Designed and deployed a suite of Power Platform applications, including custom canvas PowerApps and automated flows via Power Automate. Built automated email notifications and approvals mapped to a SharePoint database and visual analytics via Power BI dashboards.",
      tech: ["PowerApps", "Power Automate", "Power BI", "SharePoint"],
      link: "#",
      github: "#"
    },
    {
      title: "Interactive Client Portal",
      description: "A full-stack, responsive web application for client management and analytics. Features a premium glassmorphism dashboard in React on the frontend and an Express/Node.js API for backend data routing and authentication.",
      tech: ["React", "Express.js", "Node.js", "MongoDB", "Framer Motion"],
      link: "#",
      github: "#"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="projects" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
          >
            Featured Projects
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            A curated list of web applications, AI automation tools, and Microsoft Power Platform dashboards.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {localProjects.map((proj, idx) => (
            <motion.div key={idx} variants={itemVariants} className="h-full">
              <TiltCard 
                className="h-full flex flex-col justify-between"
                glowColor={idx % 2 === 0 ? 'primary' : 'secondary'}
              >
                <div className="space-y-4">
                  {/* Visual Accent Tab */}
                  <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${
                    idx % 2 === 0 ? 'from-primary to-purple-400' : 'from-secondary to-cyan-400'
                  }`} />
                  
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed font-light line-clamp-4">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-8 space-y-6">
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech.map((t, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[10px] font-semibold bg-white/5 border border-white/5 text-gray-300 px-2.5 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <a
                      href={proj.github}
                      className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      <GithubIcon size={14} />
                      <span>Repository</span>
                    </a>
                    
                    <a
                      href={proj.link}
                      className="flex items-center space-x-1.5 text-xs text-primary font-bold hover:text-white transition-colors group"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
