import { motion } from 'framer-motion';
import { ArrowRight, Send, Sparkles } from 'lucide-react';

const Hero = ({ profile }) => {
  const { name = 'Kuldeep Mahajan', role = 'Power Platform Intern' } = profile || {};

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Text Area */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider w-fit"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Welcome to my Digital Portfolio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none"
          >
            Hi, I'm <br />
            <span className="text-gradient-purple-cyan block mt-2">{name}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-gray-300"
          >
            {role}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 max-w-xl text-base sm:text-lg leading-relaxed font-light"
          >
            Developing high-performance full-stack applications with **React & Node.js**, and building enterprise workflow automation solutions via **Microsoft Power Platform** and SharePoint. Passionate about local AI integration using **Ollama & RAG**.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] group"
            >
              <span>Explore My Projects</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center space-x-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all"
            >
              <Send size={14} />
              <span>Contact Me</span>
            </button>
          </motion.div>
        </div>

        {/* Visual Showcase (Abstract code container / 3D element) */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-square max-w-[400px]"
          >
            {/* Outer Glowing Rings */}
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_12s_linear_infinite] glow-primary" />
            <div className="absolute inset-4 rounded-full border border-dashed border-secondary/20 animate-[spin_8s_linear_infinite_reverse] glow-secondary" />

            {/* 3D Flip Card */}
            <div className="absolute inset-10 flip-card z-10">
              <div className="flip-card-inner">
                
                {/* Front: Profile Photo */}
                <div className="flip-card-front">
                  <div className="w-full h-full rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-primary to-secondary shadow-2xl relative">
                    <img 
                      src="/kuldeep.jpg" 
                      alt="Kuldeep Mahajan" 
                      className="w-full h-full object-cover rounded-xl border border-[#030014]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/65 via-transparent to-transparent flex items-end p-4 rounded-xl">
                      <div className="text-left">
                        <h4 className="text-sm font-extrabold text-white leading-none">{name}</h4>
                        <span className="text-[10px] uppercase tracking-widest text-primary font-extrabold mt-1.5 block">Full-Stack & Power Platform</span>
                        <span className="text-[9px] text-gray-400 font-light mt-1 block">Hover to see code &rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back: Code Terminal */}
                <div className="flip-card-back">
                  <div className="w-full h-full glass-panel rounded-2xl border border-white/10 p-5 flex flex-col justify-between font-mono text-xs text-cyan-300 shadow-2xl text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[10px] text-gray-500">developer.json</span>
                    </div>
                    
                    <div className="flex-1 py-4 space-y-2 overflow-hidden text-[11px] sm:text-xs">
                      <div>
                        <span className="text-purple-400">const</span> developer = &#123;
                      </div>
                      <div className="pl-4">
                        name: <span className="text-yellow-300">"{name.split(' ')[0]}"</span>,
                      </div>
                      <div className="pl-4">
                        role: <span className="text-yellow-300">"Intern"</span>,
                      </div>
                      <div className="pl-4">
                        skills: [<span className="text-yellow-300">"React"</span>, <span className="text-yellow-300">"Node"</span>, <span className="text-yellow-300">"AI"</span>],
                      </div>
                      <div className="pl-4">
                        focus: <span className="text-yellow-300">"Automation"</span>,
                      </div>
                      <div className="pl-4">
                        motto: <span className="text-yellow-300">"Solve & Automate"</span>
                      </div>
                      <div>&#125;;</div>
                      <div className="text-green-400 mt-2">
                        &gt; developer.status()
                      </div>
                      <div className="text-gray-400">
                        "Ready to engineer next-gen products."
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-500 text-right pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-primary font-bold animate-pulse">Live Sandbox</span>
                      <span>Hover off to see photo</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Decorative Floating Circles */}
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary/30 blur-sm animate-bounce" />
            <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-secondary/30 blur-sm animate-pulse" />
          </motion.div>
        </div>

      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => scrollToSection('about')}>
        <span className="text-[10px] uppercase tracking-widest text-gray-400">Scroll Down</span>
        <div className="w-5 h-9 rounded-full border border-gray-400 p-1 flex justify-center">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
