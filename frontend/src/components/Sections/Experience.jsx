import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Award, Terminal } from 'lucide-react';
import TiltCard from '../TiltCard';

const Experience = ({ experience = [] }) => {
  // Local list matching Internship, Freelance Work, Academic Projects
  const localExp = experience.length > 0 ? experience.map(exp => ({
    ...exp,
    category: 'Internship',
    icon: <Briefcase size={14} className="text-[#00F5FF]" />,
    color: 'primary'
  })) : [
    {
      role: "React & Power Platform Developer Intern",
      company: "devNectar Consultancy",
      location: "Pune, India",
      period: "Feb 2026 - Present",
      category: "Internship",
      highlights: [
        "Architected and developed responsive user interfaces using React, improving performance by 35% and enhancing layout responsive states.",
        "Designed and deployed backend services using Node.js and Django, building scalable REST APIs supporting secure communications.",
        "Built enterprise apps on Microsoft Power Platform (PowerApps, Power Automate, SharePoint lists) automating approval procedures.",
        "Integrated vector databases (ChromaDB) and local LLMs (Ollama) to build private, secure document search systems."
      ],
      icon: <Briefcase size={14} className="text-[#00F5FF]" />,
      color: 'primary'
    }
  ];

  // If there are fallbacks, let's inject Freelance Work and Academic Projects if not already present
  const fullExperienceList = [
    ...localExp,
    // Add Freelance Work
    {
      role: "Freelance AI Developer",
      company: "Self-Employed",
      location: "Remote",
      period: "Jun 2024 - Dec 2025",
      category: "Freelance Work",
      highlights: [
        "Created custom e-commerce and Ayurvedic product platforms using Django, React, and PostgreSQL/Supabase database backends.",
        "Designed beautiful glassmorphism interfaces and landing pages for business landing screens, maximizing search discovery.",
        "Created secure Stripe billing flows and customer ordering dashboards, automating order notifications."
      ],
      icon: <Terminal size={14} className="text-[#7B61FF]" />,
      color: 'secondary'
    },
    // Add Academic Projects
    {
      role: "Academic Projects & Chatbots Lead",
      company: "IMRD College Initiatives",
      location: "Pune, India",
      period: "Jul 2023 - May 2024",
      category: "Academic Projects",
      highlights: [
        "Led a team of three to develop the IMRD College student support chatbot in Django and Python, automating queries for 500+ daily student visits.",
        "Created Agri Store Marketplace—a Python-powered agriculture platform mapping local pesticide and crop data for rural farmers.",
        "Built interactive 3D portfolio dashboards, demonstrating competencies in frontend designs."
      ],
      icon: <Award size={14} className="text-[#00FF88]" />,
      color: 'accent'
    }
  ];

  return (
    <section id="experience" className="py-[30px] px-6 relative z-10 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative font-sans"
          >
            Professional Experience Tree
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Chronological records of professional internships, freelance contracts, and leading academic projects.
          </motion.p>
        </div>

        {/* Vertical Experience Timeline */}
        <div className="relative border-l border-white/10 ml-4 md:ml-8 pl-8 space-y-12 text-left">
          
          {/* Glowing vertical trace */}
          <div className="absolute left-[-1px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#00F5FF] via-[#7B61FF] to-[#00FF88] opacity-35" />

          {fullExperienceList.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.1 }}
              className="relative"
            >
              {/* Timeline Indicator Dot */}
              <span className={`absolute -left-[41px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#050816] border border-${exp.color} text-${exp.color} shadow-[0_0_15px_rgba(0,245,255,0.2)] z-10`}>
                {exp.icon}
              </span>

              {/* Card Container */}
              <TiltCard className="relative overflow-hidden" glowColor={exp.color}>
                {/* Glowing Side accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-${exp.color} to-[#050816]`} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    {/* Role title and category badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {exp.role}
                      </h3>
                      <span className={`text-[9px] uppercase font-mono tracking-widest font-extrabold bg-[#050816] border border-${exp.color}/30 text-${exp.color} px-2 py-0.5 rounded`}>
                        {exp.category}
                      </span>
                    </div>
                    
                    <p className="text-sm font-semibold text-gray-400 mt-1">
                      {exp.company}
                    </p>
                  </div>
                  
                  {/* Period and Location Badges */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5 font-mono text-[10px]">
                      <Calendar size={12} className="text-[#00F5FF]" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5 font-mono text-[10px]">
                      <MapPin size={12} className="text-[#00FF88]" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Highlights List */}
                <ul className="space-y-3 pl-1">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start text-sm text-gray-400 leading-relaxed font-light">
                      <span className="text-primary mr-3 mt-1.5 select-none font-bold text-xs shrink-0">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
