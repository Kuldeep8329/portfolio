import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar } from 'lucide-react';
import TiltCard from '../TiltCard';

const Awards = ({ awards }) => {
  const localAwards = awards && awards.length > 0 ? awards : [
    {
      title: "Best Application Developer",
      organization: "Computer Society of India (CSI)",
      date: "2023",
      description: "Recognized for designing and building an outstanding, high-performance web application, displaying advanced capabilities in full-stack architecture and frontend styling."
    },
    {
      title: "1st Prize - State-Level Project Competition",
      organization: "Inter-Collegiate TechFest",
      date: "2023",
      description: "Won first prize for presenting an AI-based automated solution utilizing local Large Language Models (LLM) and RAG for automated workspace assistance."
    },
    {
      title: "Special Recognition for Digital Innovation",
      organization: "Academic Department Excellence Award",
      date: "2022",
      description: "Awarded for designing a custom student portal application that improved department communication and automated lab scheduling."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id="awards" className="py-12 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
          >
            Awards & Recognition
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Milestones and awards achieved throughout academic and professional projects.
          </motion.p>
        </div>

        {/* Awards list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {localAwards.map((award, idx) => (
            <motion.div key={idx} variants={itemVariants} className="h-full">
              <TiltCard 
                className="h-full flex flex-col justify-between overflow-hidden relative"
                glowColor={idx % 2 === 0 ? 'primary' : 'secondary'}
              >
                {/* Background soft glowing accent */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />

                <div className="space-y-4">
                  {/* Badge Row */}
                  <div className="flex justify-between items-center">
                    <div className="p-3 bg-white/5 border border-white/5 w-fit rounded-xl text-primary shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      <Trophy size={20} />
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <Calendar size={12} />
                      {award.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {award.title}
                  </h3>
                  
                  <p className="text-xs font-bold text-secondary">
                    {award.organization}
                  </p>

                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    {award.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                  <span>Recognition</span>
                  <span className="text-primary font-bold">1st Place / Honor</span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Awards;
