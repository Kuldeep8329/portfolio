import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import TiltCard from '../TiltCard';

const Education = ({ education }) => {
  const localEdu = education && education.length > 0 ? education : [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Pune University / Affiliated College",
      location: "Pune, India",
      period: "2022 - 2024",
      details: "Specialized in Web Application Development, Database Systems, Software Engineering, and AI/ML technologies."
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Pune University / Affiliated College",
      location: "Pune, India",
      period: "2019 - 2022",
      details: "Graduated with honors. Developed strong fundamentals in Programming (C, C++, Java, Python), Web Design, and Database Management."
    }
  ];

  return (
    <section id="education" className="py-[30px] px-6 relative z-10 overflow-hidden bg-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
          >
            Education Qualifications
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Academic background details from BCA to MCA degrees.
          </motion.p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-white/10 ml-4 md:ml-8 pl-8 space-y-12">
          {localEdu.map((edu, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative"
            >
              {/* Timeline Indicator Dot */}
              <span className="absolute -left-[41px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-dark-bg border border-secondary/50 text-secondary shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <GraduationCap size={12} />
              </span>

              {/* Card Container */}
              <TiltCard className="relative overflow-hidden" glowColor="secondary">
                {/* Glowing Side bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary to-primary" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {edu.institution}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <Calendar size={12} />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <MapPin size={12} />
                      {edu.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {edu.details}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
