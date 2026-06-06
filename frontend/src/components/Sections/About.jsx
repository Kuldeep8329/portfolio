import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  AwardIcon, 
  Sparkles, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import TiltCard from '../TiltCard';

const About = ({ profile, education = [], certifications = [], experience = [], skills = [], awards = [] }) => {
  const { summary = '', location = 'Pune, India', languages = [] } = profile || {};
  const [activeFilter, setActiveFilter] = useState('all');

  // Fallbacks if database returns empty
  const defaultEducation = education.length > 0 ? education : [
    { degree: 'MCA (Master of Computer Applications)', institution: 'IMRD College', period: '2024 - 2026', details: 'Focused on advanced database systems, AI integration, and AI product architectures.' },
    { degree: 'BCA (Bachelor of Computer Applications)', institution: 'IMRD College', period: '2021 - 2024', details: 'Graduated with Distinction. Developed custom database solutions and web layouts.' }
  ];

  const defaultCertifications = certifications.length > 0 ? certifications : [
    { name: 'AI Engineer', issuer: 'Roadmap.sh', date: '2025', description: 'Agentic workflows, prompt engineering, vector databases, and LLM integrations.' },
    { name: 'Python Basics', issuer: 'OneRoadmap', date: '2025', description: 'Core Python concepts, file structures, algorithms, and OOP principles.' },
    { name: 'Generative AI for Beginners', issuer: 'Simplilearn', date: '2025', description: 'Large language models, generative image prompts, and application design.' }
  ];

  const defaultExperience = experience.length > 0 ? experience : [
    { role: 'Power Platform Intern', company: 'DevNectar Solutions', period: '2025 - Present', highlights: ['Built canvas apps mapped to SharePoint databases.', 'Automated employee workflows using Power Automate.'] },
    { role: 'Freelance Django Developer', company: 'Self-Employed', period: '2024', highlights: ['Created REST APIs for business e-commerce platforms.', 'Optimized postgres query performance by 40%.'] }
  ];

  const defaultAwards = awards.length > 0 ? awards : [
    { title: 'Best AI Innovator Award', organization: 'IMRD Tech Fest', date: '2025', description: 'Awarded first place for engineering IMRD College student support chatbot.' }
  ];

  // Process and normalize all timeline events
  const timelineEvents = [
    ...defaultExperience.map(item => ({
      id: `exp-${item.id || item.role}`,
      year: item.period.split(' ')[0] || '2025',
      category: 'experience',
      title: item.role,
      subtitle: item.company,
      description: item.highlights ? item.highlights.join(' ') : 'AI engineering & business process automation.',
      icon: <Briefcase className="text-[#00F5FF]" size={16} />,
      color: 'primary'
    })),
    ...defaultEducation.map(item => ({
      id: `edu-${item.id || item.degree}`,
      year: item.period.split(' ')[0] || '2024',
      category: 'education',
      title: item.degree,
      subtitle: item.institution,
      description: item.details || 'Academic focus on computing sciences, data models, and programming systems.',
      icon: <GraduationCap className="text-[#7B61FF]" size={16} />,
      color: 'secondary'
    })),
    ...defaultCertifications.map(item => ({
      id: `cert-${item.id || item.name}`,
      year: item.date || '2025',
      category: 'certification',
      title: item.name,
      subtitle: item.issuer,
      description: item.description || 'Specialized certification validating technical engineering competence.',
      icon: <Award className="text-[#00FF88]" size={16} />,
      color: 'accent'
    })),
    ...defaultAwards.map(item => ({
      id: `award-${item.id || item.title}`,
      year: item.date || '2025',
      category: 'achievement',
      title: item.title,
      subtitle: item.organization,
      description: item.description || 'Awarded for technical excellence and innovative system engineering.',
      icon: <Sparkles className="text-[#00F5FF]" size={16} />,
      color: 'primary'
    }))
  ].sort((a, b) => b.year.localeCompare(a.year)); // Sort newest first

  const filters = [
    { id: 'all', label: 'All Events', icon: <Layers size={14} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={14} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={14} /> },
    { id: 'certification', label: 'Certifications', icon: <Award size={14} /> },
    { id: 'achievement', label: 'Achievements', icon: <Sparkles size={14} /> }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category === activeFilter);

  return (
    <section id="about" className="py-20 px-6 relative z-10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative font-sans"
          >
            My Story Timeline
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full animate-pulse" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            A chronological timeline of my professional accomplishments, academic degrees, and specialized certifications.
          </motion.p>
        </div>

        {/* Profile Card & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 space-y-5 text-left"
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00F5FF]">Professional Summary</span>
            </h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-light">
              {summary || "Highly motivated AI Engineer and Product Developer with expertise in building scalable Python Django servers, modern React web apps, and automated workflows on Microsoft Power Platform. Passionate about local LLMs, retrieval augmented generation, and custom software solutions."}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              I specialize in bridging the gap between low-code ease of delivery and robust custom architectures. By implementing local document query systems (Ollama, ChromaDB, RAG) and Django-based backends, I help organizations secure their intelligence and automate routine business tasks. Let's design scalable software together!
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 glass-panel border border-white/5 rounded-2xl p-6 text-left space-y-4"
          >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Location & Specs</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                <span className="text-gray-400">Headquarters</span>
                <span className="text-white font-bold">{location}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                <span className="text-gray-400">Languages</span>
                <span className="text-[#00FF88] font-bold">{languages.join(', ') || 'English, Hindi, Marathi'}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                <span className="text-gray-400">Current Scope</span>
                <span className="text-[#7B61FF] font-bold">Available for Contracts</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300 cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#00F5FF] to-[#7B61FF] text-white border-transparent shadow-[0_0_15px_rgba(0,245,255,0.25)]'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Interactive Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto pl-8 sm:pl-0">
          
          {/* Vertical Center Line */}
          <div className="absolute left-0 sm:left-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#00F5FF] via-[#7B61FF] to-[#00FF88] opacity-20 transform -translate-x-1/2" />

          {/* Timeline Cards Loop */}
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5 }}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center w-full ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Pulsing Timeline Node Dot */}
                    <div className="absolute left-[-32px] sm:left-1/2 top-4 sm:top-auto w-6 h-6 rounded-full bg-[#050816] border-2 border-primary flex items-center justify-center transform -translate-x-1/2 shadow-lg z-20">
                      <div className={`w-2 h-2 rounded-full bg-${event.color} animate-pulse`} />
                    </div>

                    {/* Timeline Event Side (Spans half-width) */}
                    <div className="w-full sm:w-1/2 pr-0 sm:pr-8 sm:pl-0 pl-2">
                      <TiltCard 
                        glowColor={event.color} 
                        className="text-left w-full relative overflow-hidden"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-3 bg-white/5 rounded-xl border border-white/5 h-fit flex items-center justify-center shrink-0">
                            {event.icon}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-base font-bold text-white tracking-tight">{event.title}</h4>
                            <h5 className="text-xs text-primary font-mono font-bold uppercase tracking-wide">{event.subtitle}</h5>
                            <p className="text-xs text-gray-400 leading-relaxed font-light pt-2">{event.description}</p>
                          </div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 p-1">
                          <ChevronRight size={14} className="text-gray-600 transform -rotate-45" />
                        </div>
                      </TiltCard>
                    </div>

                    {/* Empty Space for visual symmetry on Desktop */}
                    <div className="hidden sm:block w-1/2" />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredEvents.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-gray-500 font-mono text-sm"
              >
                No historical events match the filter criteria.
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
