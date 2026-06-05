import { motion } from 'framer-motion';
import TiltCard from '../TiltCard';
import { CheckCircle } from 'lucide-react';

const Skills = ({ skills }) => {
  // Fallback local skills list if API is delayed/fails
  const localSkills = skills && skills.length > 0 ? skills : [
    {
      category: "Languages",
      items: ["Python", "JavaScript", "HTML", "CSS", "SQL"]
    },
    {
      category: "Web Development",
      items: ["React", "Node.js", "Express.js", "Django", "Bootstrap", "Tailwind CSS"]
    },
    {
      category: "Microsoft Power Platform",
      items: ["PowerApps", "Power BI", "Power Automate", "SharePoint", "MS-365 Tools"]
    },
    {
      category: "Database Management",
      items: ["MongoDB", "PostgreSQL", "MySQL", "SharePoint Lists"]
    },
    {
      category: "AI & Advanced Tech",
      items: ["Generative AI", "Ollama", "Retrieval-Augmented Generation (RAG)", "Machine Learning (ML)"]
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section id="skills" className="py-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
          >
            Technical Stack & Skills
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            A breakdown of technologies, programming languages, and tools I use to build automated solutions.
          </motion.p>
        </div>

        {/* Skill Card Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {localSkills.map((categoryData, catIdx) => (
            <motion.div key={catIdx} variants={cardVariants}>
              <TiltCard 
                className="h-full flex flex-col justify-between"
                glowColor={catIdx % 2 === 0 ? 'primary' : 'secondary'}
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                    <span>{categoryData.category}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {categoryData.items.map((skill, skillIdx) => (
                      <div 
                        key={skillIdx} 
                        className="flex items-center space-x-2 text-gray-300 group hover:text-white transition-colors"
                      >
                        <CheckCircle size={14} className="text-secondary opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Visual footer border/bar to add premium vibe */}
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                  <span>Competence</span>
                  <span className="font-bold text-gray-400">Advanced / Expert</span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
