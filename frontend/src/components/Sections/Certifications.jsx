import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, ExternalLink } from 'lucide-react';
import TiltCard from '../TiltCard';

const Certifications = ({ certifications }) => {
  const localCerts = certifications && certifications.length > 0 ? certifications : [
    {
      name: "Best Application Developer Certificate",
      issuer: "Computer Society of India (CSI)",
      date: "2023",
      description: "Certified as Best Application Developer during the CSI annual convention/competition."
    },
    {
      name: "Microsoft Power Platform Certified App Maker",
      issuer: "Microsoft",
      date: "2024",
      description: "Validation of skills in creating custom canvas and model-driven business applications with Microsoft PowerApps, Power Automate, and SharePoint integrations."
    },
    {
      name: "Python & Data Science Professional",
      issuer: "Udemy / Online Professional Certification",
      date: "2023",
      description: "Comprehensive course covering advanced Python programming, data structures, and machine learning foundations."
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
    <section id="certifications" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative"
          >
            Certifications
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Verified industry credentials and professional certification details.
          </motion.p>
        </div>

        {/* Certifications Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {localCerts.map((cert, idx) => (
            <motion.div key={idx} variants={itemVariants} className="h-full">
              <TiltCard 
                className="h-full flex flex-col justify-between"
                glowColor={idx % 2 === 0 ? 'secondary' : 'primary'}
              >
                <div className="space-y-4">
                  {/* Icon and metadata */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/5 border border-white/5 w-fit rounded-xl text-secondary">
                      <ShieldCheck size={22} />
                    </div>
                    <span className="text-xs text-gray-500 font-semibold bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      {cert.date}
                    </span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {cert.name}
                  </h3>
                  
                  <p className="text-xs font-semibold text-primary">
                    Issued by: {cert.issuer}
                  </p>
                  
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                    Verified Credential <ExternalLink size={10} />
                  </span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
