import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import TiltCard from '../TiltCard';

const Experience = ({ experience }) => {
  const localExp = experience && experience.length > 0 ? experience : [
    {
      role: "Power Platform Intern",
      company: "Enterprise Tech Solutions",
      location: "Pune, India",
      period: "Jan 2024 - Present",
      highlights: [
        "Develop and deploy enterprise-level PowerApps and Power Automate flows to automate manual workflows.",
        "Integrate SharePoint lists and databases for efficient information storage and management.",
        "Build custom modern web dashboards using React and Tailwind CSS, integrating with Node.js and Django backends.",
        "Incorporate AI-based solutions, including document question-answering pipelines using local Ollama and RAG models.",
        "Create interactive reports and business intelligence dashboards using Power BI to visualize key performance indicators."
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
          >
            Professional Experience
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Internship history and core contributions to enterprise software solutions.
          </motion.p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-white/10 ml-4 md:ml-8 pl-8 space-y-12">
          {localExp.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative"
            >
              {/* Timeline Indicator Dot */}
              <span className="absolute -left-[41px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-dark-bg border border-primary/50 text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Briefcase size={12} />
              </span>

              {/* Card Container */}
              <TiltCard className="relative overflow-hidden" glowColor="primary">
                {/* Glowing Side bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-secondary mt-1">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <Calendar size={12} />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start text-sm text-gray-400 leading-relaxed">
                      <span className="text-primary mr-2.5 mt-1.5 select-none font-bold text-xs">•</span>
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
