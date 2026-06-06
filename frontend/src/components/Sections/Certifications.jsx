import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ExternalLink, X, Calendar, CheckCircle, Award } from 'lucide-react';
import TiltCard from '../TiltCard';

const Certifications = ({ certifications = [] }) => {
  const [selectedCert, setSelectedCert] = useState(null);

  // Core verified certificates
  const localCerts = certifications.length > 0 ? certifications : [
    {
      name: "AI Engineer Certification",
      issuer: "Roadmap.sh",
      date: "2025",
      id: "CERT-AI-8329-01",
      description: "Comprehensive verification of competence in Generative AI architectures, prompt engineering, private LLM deployments with Ollama, vector stores (ChromaDB), and RAG pipeline creation.",
      verificationUrl: "https://roadmap.sh"
    },
    {
      name: "Python Basics Certification",
      issuer: "OneRoadmap",
      date: "2025",
      id: "CERT-PY-8329-02",
      description: "Validation of core programming concepts, data structures, algorithms, object-oriented programming (OOP), file operations, and clean software architecture patterns in Python.",
      verificationUrl: "https://roadmap.sh"
    },
    {
      name: "Generative AI for Beginners",
      issuer: "Simplilearn",
      date: "2025",
      id: "CERT-GENAI-8329-03",
      description: "Foundational mastery in prompt design, LLM fine-tuning concepts, retrieval-augmented systems, transformer architectures, and ethical AI deployment guidelines.",
      verificationUrl: "https://simplilearn.com"
    }
  ];

  return (
    <section id="certifications" className="py-[30px] px-6 relative z-10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white inline-block relative font-sans"
          >
            Credentials & Certificate Wall
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 max-w-xl mx-auto text-sm"
          >
            Verified credentials. Click any certificate card to open the interactive hologram preview.
          </motion.p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localCerts.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedCert(cert)}
              className="h-full cursor-pointer"
            >
              <TiltCard 
                className="h-full flex flex-col justify-between hover:border-primary/40 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)] transition-all duration-300 relative overflow-hidden"
                glowColor={idx % 3 === 0 ? 'primary' : idx % 3 === 1 ? 'secondary' : 'accent'}
              >
                <div className="space-y-4 text-left">
                  {/* Badge Header */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/5 border border-white/5 w-fit rounded-xl text-[#00F5FF]">
                      <ShieldCheck size={22} className="animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      VERIFIED
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors">
                    {cert.name}
                  </h3>
                  
                  <p className="text-xs font-mono font-bold text-[#7B61FF]">
                    ISSUER: {cert.issuer}
                  </p>
                  
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-mono text-[9px]">{cert.date}</span>
                  {(cert.verificationUrl || cert.url || cert.file || cert.image) && (
                    <span className="text-[10px] font-bold text-[#00FF88] uppercase tracking-widest flex items-center gap-1">
                      Preview Certificate <ExternalLink size={10} />
                    </span>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Certificate Holographic Modal Preview */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050816]/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl aspect-[1.4/1] rounded-3xl p-1 bg-gradient-to-tr from-[#00F5FF]/30 via-white/5 to-[#7B61FF]/30 shadow-2xl overflow-hidden"
              >
                {/* Holographic background scans */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_96%,rgba(0,245,255,0.08)_98%,rgba(255,255,255,0)_100%)] bg-[size:100%_30px] pointer-events-none opacity-25 animate-[pulse_2.5s_infinite]" />

                <div className="w-full h-full bg-[#050816]/98 rounded-[22px] p-6 sm:p-10 flex flex-col justify-between text-left relative">
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>

                  {/* Top header of certificate */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-6">
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-widest text-[#00F5FF] font-bold">Verification Program</div>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-1">Verified Digital Credential</h3>
                    </div>
                    <div className="hidden sm:block">
                      <Award size={36} className="text-[#7B61FF] animate-bounce" />
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="space-y-4 my-6 flex-1 flex flex-col justify-center">
                    <div className="text-xs text-gray-500 font-mono">THIS CERTIFIES THAT</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-gradient-cyan-purple font-sans tracking-wide">
                      Kuldeep Mahajan
                    </div>
                    <div className="text-xs text-gray-400 font-light leading-relaxed">
                      has successfully fulfilled all technical requirements and is hereby awarded the credential of
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle className="text-[#00FF88]" size={18} />
                      <span>{selectedCert.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      Issued by <span className="text-white font-bold">{selectedCert.issuer}</span> in <span className="text-white font-bold">{selectedCert.date}</span>.
                    </div>
                  </div>

                  {/* Bottom verification signatures & ID */}
                  <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="font-mono text-[9px] text-gray-500 space-y-1">
                      <div>CREDENTIAL ID: <span className="text-[#00FF88] font-bold">{selectedCert.id || 'N/A'}</span></div>
                      <div>STATUS: SECURE REGISTRY INTEGRATED</div>
                    </div>
                    
                    {(selectedCert.verificationUrl || selectedCert.url || selectedCert.file || selectedCert.image) && (
                      <a
                        href={selectedCert.verificationUrl || selectedCert.url || selectedCert.file || selectedCert.image}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Certifications;
