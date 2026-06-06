import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Layers, Sparkles, Code, Cpu } from 'lucide-react';

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
import TiltCard from '../TiltCard';

const Projects = ({ projects = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Normalized fallbacks matching dbInit / projects.json
  const defaultProjects = projects.length > 0 ? projects : [
    {
      title: "Agri Store System",
      description: "Developed a web-based agriculture store that allows farmers and customers to browse and purchase agricultural products such as seeds, fertilizers, and pesticides. Built using Django with product management, secure cart validation, and fully responsive layout structures.",
      tech: ["Python", "Django", "HTML", "CSS", "JS", "Bootstrap"],
      link: "#",
      github: "#"
    },
    {
      title: "Homved",
      description: "Developed a web-based e-commerce platform for Ayurvedic and natural healthcare products. The website provides an easy product browsing and purchasing experience with a user-friendly interface, secure ordering process, and responsive layout designs.",
      tech: ["React", "Nodejs", "Database (Supabase)", "Deployment (Vercel)"],
      link: "#",
      github: "#"
    },
    {
      title: "Dev-AI Chatbot",
      description: "Developed an AI-powered chatbot designed to provide intelligent and real-time assistance. The chatbot can answer coding questions, generate structured content, and explain technical terms using private LLMs and retrieval augmentation.",
      tech: ["React", "Python", "Django", "LLM", "RAG", "ChromaDB"],
      link: "#",
      github: "#"
    },
    {
      title: "IMRD College Chatbot",
      description: "Developed an AI-powered chatbot for IMRD College to assist students with academic queries, admissions, timetables, and campus updates. Engineered with natural language dialogue models and responsive design.",
      tech: ["Python", "Django", "HTML", "CSS", "JS", "Bootstrap"],
      link: "#",
      github: "#"
    },
    {
      title: "AI-Integrated Task Assistant",
      description: "Developed an AI-powered task management assistant that helps users organize, prioritize, and track tasks. Implements scheduling algorithms, automated notifications, and AI productivity recommendations.",
      tech: ["Python", "Django", "HTML", "CSS", "JS", "Bootstrap"],
      link: "#",
      github: "#"
    }
  ];

  // Helper mapper to associate generated mockup images to corresponding project title
  const getProjectImage = (title) => {
    const t = title.toLowerCase();
    if (t.includes('agri')) return '/images/project_agri_store.png';
    if (t.includes('homved')) return '/images/project_homved.png';
    if (t.includes('dev-ai') || t.includes('dev ai') || (t.includes('dev') && t.includes('ai'))) return '/images/project_dev_ai_chatbot.png';
    if (t.includes('imrd') || t.includes('college')) return '/images/project_college_chatbot.png';
    if (t.includes('task') || t.includes('assistant')) return '/images/project_task_assistant.png';
    // Fallback if title is HR or anything else
    return '/images/project_dev_ai_chatbot.png';
  };

  // Helper categories classifier
  const getProjectCategory = (proj) => {
    const t = proj.title.toLowerCase();
    const techStr = proj.tech ? proj.tech.join(' ').toLowerCase() : '';
    
    if (t.includes('chatbot') || techStr.includes('llm') || techStr.includes('rag') || t.includes('assistant')) {
      return 'ai';
    }
    if (t.includes('store') || t.includes('homved') || techStr.includes('react') || techStr.includes('django')) {
      return 'web';
    }
    return 'automation';
  };

  const filters = [
    { id: 'all', label: 'All Projects', icon: <Layers size={12} /> },
    { id: 'web', label: 'Web Applications', icon: <Code size={12} /> },
    { id: 'ai', label: 'AI Chatbots / Assistants', icon: <Sparkles size={12} /> },
    { id: 'automation', label: 'Workflows & Automation', icon: <Cpu size={12} /> }
  ];

  const filteredProjects = activeFilter === 'all'
    ? defaultProjects
    : defaultProjects.filter(p => getProjectCategory(p) === activeFilter);

  return (
    <section id="projects" className="py-[30px] px-6 relative z-10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative font-sans"
          >
            Featured Projects Showcase
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Explore real-world software deployments, Python Django platforms, AI chat models, and low-code enterprise automations.
          </motion.p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300 cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#00F5FF] to-[#7B61FF] text-white border-transparent shadow-[0_0_15px_rgba(0,245,255,0.25)]'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id || proj.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <TiltCard 
                  className="h-full flex flex-col justify-between overflow-hidden p-0 relative group"
                  glowColor={idx % 3 === 0 ? 'primary' : idx % 3 === 1 ? 'secondary' : 'accent'}
                >
                  <div className="space-y-4">
                    
                    {/* Project Mockup Container */}
                    <div className="relative w-full aspect-video overflow-hidden border-b border-white/5 bg-[#050816]">
                      {/* Gradient overlay for premium feel */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/20 to-transparent z-10 pointer-events-none" />
                      
                      <img 
                        src={getProjectImage(proj.title)} 
                        alt={proj.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 pointer-events-none" 
                      />

                      {/* Tag floating */}
                      <span className="absolute top-3 right-3 z-20 text-[9px] uppercase font-mono tracking-widest font-extrabold bg-[#050816]/95 border border-[#00F5FF]/30 text-[#00F5FF] px-2.5 py-1 rounded-md">
                        {getProjectCategory(proj) === 'ai' ? 'Agentic AI' : getProjectCategory(proj) === 'web' ? 'AI Web App' : 'Workflows'}
                      </span>
                    </div>

                    {/* Card Content body */}
                    <div className="px-6 pt-2 pb-4 space-y-3">
                      <h3 className="text-xl font-extrabold text-white group-hover:text-primary transition-colors">
                        {proj.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  {/* Badges and actions in Card Footer */}
                  <div className="px-6 pb-6 space-y-5">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech && proj.tech.map((t, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    {(proj.github && proj.github !== '#' || proj.link && proj.link !== '#') && (
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-2">
                        {(proj.github && proj.github !== '#') && (
                          <a
                            href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1.5 text-xs font-mono text-gray-500 hover:text-white transition-colors cursor-pointer group"
                          >
                            <GithubIcon size={14} className="group-hover:rotate-6 transition-transform" />
                            <span>Repository</span>
                          </a>
                        )}
                        
                        {(proj.link && proj.link !== '#') && (
                          <a
                            href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1 text-xs font-bold text-primary hover:text-white transition-colors group cursor-pointer ml-auto"
                          >
                            <span>Live Demo</span>
                            <ExternalLink size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-mono text-sm">
            No projects found in this technical category.
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;
