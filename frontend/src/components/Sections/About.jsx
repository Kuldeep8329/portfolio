import { motion } from 'framer-motion';
import { MapPin, Globe, GraduationCap, Briefcase } from 'lucide-react';
import TiltCard from '../TiltCard';

const About = ({ profile }) => {
  const { summary = '', location = 'Pune, India', languages = [] } = profile || {};

  const infoItems = [
    {
      icon: <MapPin className="text-secondary" size={20} />,
      label: 'Based In',
      value: location
    },
    {
      icon: <Globe className="text-primary" size={20} />,
      label: 'Languages',
      value: languages.join(', ')
    },
    {
      icon: <GraduationCap className="text-secondary" size={20} />,
      label: 'Education',
      value: 'MCA & BCA'
    },
    {
      icon: <Briefcase className="text-primary" size={20} />,
      label: 'Current Status',
      value: 'Power Platform Intern'
    }
  ];

  return (
    <section id="about" className="py-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
          >
            About Me
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            A quick glimpse into my professional summary, locations, and competencies.
          </motion.p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Summary Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <h3 className="text-2xl font-bold text-white">
              Professional Summary
            </h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-light">
              {summary || "Highly motivated Power Platform Intern and developer with expertise in Python, Django, React, MS-365 tools, AI automation, collaboration, and problem-solving."}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              I specialize in bridging the gap between business processes and advanced technology. By combining Microsoft Power Platform's low-code benefits with high-performance custom code in React and Node.js, I engineer applications that are scalable, beautiful, and highly functional. Additionally, my work with local AI assistants (Ollama/RAG) enables offline, secure document processing and semantic search capabilities.
            </p>
          </motion.div>

          {/* Details / Metric Grid Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {infoItems.map((item, index) => (
              <TiltCard 
                key={index} 
                className="flex flex-col space-y-3 justify-center h-40"
                glowColor={index % 2 === 0 ? 'primary' : 'secondary'}
              >
                <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/5">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {item.label}
                  </h4>
                  <p className="text-sm font-bold text-white mt-1">
                    {item.value}
                  </p>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
