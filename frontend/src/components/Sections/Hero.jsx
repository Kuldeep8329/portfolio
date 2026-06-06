import { motion } from 'framer-motion';
import { ArrowRight, Download, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom SVG Icons (AI Generated Theme)
const AIBrainIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#00F5FF]">
    <defs>
      <linearGradient id="brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F5FF" />
        <stop offset="100%" stopColor="#7B61FF" />
      </linearGradient>
    </defs>
    {/* Left Hemisphere */}
    <path d="M48 20 C32 20 22 32 22 48 C22 60 30 68 38 72 C40 73 42 75 42 78 C42 82 45 85 48 85 Z" fill="none" stroke="url(#brain-grad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M48 30 C38 32 30 40 30 48 C30 54 36 58 42 60 M48 40 C42 42 38 46 38 50" fill="none" stroke="url(#brain-grad)" strokeWidth="2" strokeLinecap="round" />
    {/* Right Hemisphere */}
    <path d="M52 20 C68 20 78 32 78 48 C78 60 70 68 62 72 C60 73 58 75 58 78 C58 82 55 85 52 85 Z" fill="none" stroke="url(#brain-grad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M52 30 C62 32 70 40 70 48 C70 54 64 58 58 60 M52 40 C58 42 62 46 62 50" fill="none" stroke="url(#brain-grad)" strokeWidth="2" strokeLinecap="round" />
    {/* Connection Dots */}
    <circle cx="30" cy="48" r="3" fill="#00FF88" className="animate-pulse" />
    <circle cx="70" cy="48" r="3" fill="#00FF88" className="animate-pulse" />
    <circle cx="48" cy="85" r="2.5" fill="#00F5FF" />
    <circle cx="52" cy="85" r="2.5" fill="#7B61FF" />
    <line x1="48" y1="20" x2="48" y2="85" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <line x1="52" y1="20" x2="52" y2="85" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
  </svg>
);

const DeveloperIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#7B61FF]">
    <defs>
      <linearGradient id="dev-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7B61FF" />
        <stop offset="100%" stopColor="#00FF88" />
      </linearGradient>
    </defs>
    {/* Brackets */}
    <path d="M25 35 L10 50 L25 65" fill="none" stroke="url(#dev-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M75 35 L90 50 L75 65" fill="none" stroke="url(#dev-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {/* Slash */}
    <line x1="60" y1="25" x2="40" y2="75" stroke="#00F5FF" strokeWidth="3.5" strokeLinecap="round" />
    {/* Inner Screen Lines */}
    <rect x="30" y="38" width="8" height="6" rx="1" fill="rgba(123, 97, 255, 0.2)" stroke="#7B61FF" strokeWidth="1" />
    <rect x="62" y="56" width="8" height="6" rx="1" fill="rgba(0, 255, 136, 0.2)" stroke="#00FF88" strokeWidth="1" />
    <circle cx="50" cy="50" r="4" fill="#00FF88" className="animate-ping" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#00FF88]">
    <defs>
      <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FF88" />
        <stop offset="100%" stopColor="#00F5FF" />
      </linearGradient>
    </defs>
    {/* Cloud Shape */}
    <path d="M30 65 C20 65 15 55 20 45 C18 35 28 25 38 28 C45 18 60 18 68 28 C78 26 85 35 82 45 C88 55 80 65 70 65 Z" fill="none" stroke="url(#cloud-grad)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Data paths */}
    <line x1="38" y1="48" x2="62" y2="48" stroke="#00F5FF" strokeWidth="2" strokeDasharray="3 3" />
    <line x1="50" y1="36" x2="50" y2="60" stroke="#7B61FF" strokeWidth="2" strokeDasharray="3 3" />
    {/* Glowing node dots */}
    <circle cx="38" cy="48" r="3" fill="#00FF88" />
    <circle cx="62" cy="48" r="3" fill="#00F5FF" />
    <circle cx="50" cy="36" r="3" fill="#7B61FF" />
    <circle cx="50" cy="60" r="3" fill="#00FF88" />
  </svg>
);

const DjangoIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#00FF88]">
    <defs>
      <linearGradient id="django-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#092e20" />
        <stop offset="100%" stopColor="#00FF88" />
      </linearGradient>
    </defs>
    {/* Outer Hexagon frame */}
    <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="url(#django-grad)" strokeWidth="2.5" />
    {/* Stylized D letter */}
    <path d="M40 32 L40 68 C40 68 58 68 58 50 C58 32 40 32 40 32 Z M47 40 L49 40 C53 40 53 60 49 60 L47 60 Z" fill="none" stroke="#00FF88" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Small curly leaf/code nodes */}
    <circle cx="50" cy="15" r="3" fill="#00F5FF" />
    <circle cx="50" cy="85" r="3" fill="#7B61FF" />
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#00F5FF]">
    <defs>
      <linearGradient id="react-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F5FF" />
        <stop offset="100%" stopColor="#7B61FF" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="url(#react-grad)" strokeWidth="3" transform="rotate(30 50 50)" />
    <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="url(#react-grad)" strokeWidth="3" transform="rotate(90 50 50)" />
    <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="url(#react-grad)" strokeWidth="3" transform="rotate(150 50 50)" />
    <circle cx="50" cy="50" r="6" fill="#00FF88" className="animate-pulse" />
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#7B61FF]">
    <defs>
      <linearGradient id="db-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7B61FF" />
        <stop offset="100%" stopColor="#00F5FF" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="25" rx="25" ry="10" fill="none" stroke="url(#db-grad)" strokeWidth="3" />
    <path d="M25 25 V50 A25 10 0 0 0 75 50 V25" fill="none" stroke="url(#db-grad)" strokeWidth="3" />
    <path d="M25 50 V75 A25 10 0 0 0 75 75 V50" fill="none" stroke="url(#db-grad)" strokeWidth="3" />
    <circle cx="50" cy="40" r="3" fill="#00FF88" />
    <circle cx="50" cy="65" r="3" fill="#00FF88" />
  </svg>
);

const PowerPlatformIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#00FF88]">
    <defs>
      <linearGradient id="power-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FF88" />
        <stop offset="100%" stopColor="#7B61FF" />
      </linearGradient>
    </defs>
    <rect x="25" y="25" width="22" height="22" rx="4" fill="none" stroke="url(#power-grad)" strokeWidth="3" />
    <rect x="53" y="25" width="22" height="22" rx="4" fill="none" stroke="url(#power-grad)" strokeWidth="3" />
    <rect x="25" y="53" width="22" height="22" rx="4" fill="none" stroke="url(#power-grad)" strokeWidth="3" />
    <circle cx="64" cy="64" r="8" fill="#00F5FF" className="animate-ping" />
  </svg>
);

const ProblemSolvingIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#00F5FF]">
    <defs>
      <linearGradient id="ps-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F5FF" />
        <stop offset="100%" stopColor="#00FF88" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="45" r="18" fill="none" stroke="url(#ps-grad)" strokeWidth="3" />
    <path d="M40 70 L60 70 L55 85 L45 85 Z" fill="none" stroke="url(#ps-grad)" strokeWidth="3" strokeLinejoin="round" />
    <path d="M50 45 M50 20 L50 25 M30 45 L25 45 M70 45 L75 45 M35 30 L30 25 M65 30 L70 25" stroke="#7B61FF" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="50" cy="45" r="4" fill="#00FF88" className="animate-pulse" />
  </svg>
);

const Hero = ({ profile }) => {
  const { name = 'Kuldeep Mahajan', resumeLink, resume_link } = profile || {};
  
  const finalResumeLink = resumeLink || resume_link || "https://drive.google.com/file/d/1Z_4xdQOL2AWGKCG-PQ6z8JtCw7tsGJrw/view?usp=drive_link";

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

  const handleDownloadResume = () => {
    // Generate visual burst for interaction feedback
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#00F5FF', '#7B61FF', '#00FF88']
    });

    // Open real resume from Google Drive
    window.open(finalResumeLink, "_blank");
  };

  // Custom items corresponding to generated SVG designs
  const iconsData = [
    { component: <AIBrainIcon />, title: 'AI Brain', desc: 'Agentic AI & LangChain RAG Integrations' },
    { component: <DeveloperIcon />, title: 'Developer', desc: 'React, Python & AI Ecosystem' },
    { component: <CloudIcon />, title: 'Cloud Automation', desc: 'Azure, Vercel & Microsoft Power Platform' },
    { component: <DjangoIcon />, title: 'Django Engine', desc: 'Secure Python APIs & Database Backends' },
    { component: <ReactIcon />, title: 'React Frontend', desc: 'Modern Interactive UI & Motion' },
    { component: <DatabaseIcon />, title: 'Database Design', desc: 'PostgreSQL, Supabase & Vector DBs' },
    { component: <PowerPlatformIcon />, title: 'Power Platform', desc: 'Enterprise Automation & Apps' },
    { component: <ProblemSolvingIcon />, title: 'Problem Solver', desc: 'Creative Logic & Solutions' }
  ];

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-28 pb-[30px] px-6 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider w-fit"
          >
            <Sparkles size={14} className="text-[#00FF88] animate-pulse" />
            <span className="text-gray-300 font-mono">Welcome to the AI & Low-Code Future</span>
          </motion.div>

          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none font-sans"
            >
              Hi, I'm <br />
              <span className="text-gradient-cyan-purple block mt-2 font-black tracking-wide">{name}</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl font-bold font-mono text-gray-300 flex flex-wrap items-center gap-2"
            >
              <span className="text-[#00F5FF]">AI Engineer</span>
              <span className="text-gray-600">|</span>
              <span className="text-[#7B61FF]">AI Product Developer</span>
              <span className="text-gray-600">|</span>
              <span className="text-[#00FF88]">Django Expert</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 max-w-xl text-base sm:text-lg leading-relaxed font-light"
          >
            I engineer high-performance AI Products combining the power of custom LLM solutions with Microsoft Power Platform. Specialized in integrating secure, local AI models (Ollama, RAG, LangChain) to automate complex workflows and solve enterprise problems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,245,255,0.25)] hover:shadow-[0_0_35px_rgba(123,97,255,0.5)] group cursor-pointer"
            >
              <span>View Projects</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform text-[#00FF88]" />
            </button>

            <button
              onClick={handleDownloadResume}
              className="flex items-center space-x-2 px-6 py-3 rounded-full border border-[#7B61FF]/40 hover:border-[#7B61FF] bg-[#7B61FF]/5 hover:bg-[#7B61FF]/10 text-white font-semibold text-sm transition-all cursor-pointer shadow-[0_0_15px_rgba(123,97,255,0.1)]"
            >
              <Download size={14} className="text-[#7B61FF]" />
              <span>Download Resume</span>
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center space-x-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              <Send size={14} className="text-[#00F5FF]" />
              <span>Contact Me</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Custom Animated SVG Orbit Space */}
        <div className="lg:col-span-5 flex items-center justify-center min-h-[400px] lg:min-h-[480px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[420px] aspect-square flex items-center justify-center"
          >
            {/* Ambient Core Glow */}
            <div className="absolute w-60 h-60 rounded-full bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/5 blur-[50px] animate-pulse" />

            {/* Orbiting rings */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#00F5FF]/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-10 rounded-full border border-solid border-[#7B61FF]/5 animate-[spin_24s_linear_infinite_reverse]" />
            <div className="absolute inset-20 rounded-full border border-dashed border-[#00FF88]/15 animate-[spin_16s_linear_infinite]" />

            {/* Holographic Center Core */}
            <div className="absolute w-24 h-24 rounded-full border border-white/10 glass-panel flex items-center justify-center shadow-[0_0_40px_rgba(0,245,255,0.15)] group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#050816] to-[#7B61FF]/10 flex items-center justify-center">
                <Sparkles size={28} className="text-[#00F5FF] animate-pulse" />
              </div>
            </div>

            {/* Orbiting Icons Container */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            >
              {iconsData.map((icon, idx) => {
                const radius = 155; // increased orbit distance for 8 icons
                const angle = (idx * 2 * Math.PI) / iconsData.length;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={idx}
                    className="absolute p-3 w-14 h-14 rounded-xl glass-panel border border-white/10 flex items-center justify-center cursor-pointer shadow-lg hover:border-primary transition-all duration-300 group hover:z-50"
                    style={{ x, y }}
                    animate={{ rotate: -360 }} // Counter-rotate so icons stay upright
                    transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                  >
                    <div className="w-full h-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                      {icon.component}
                    </div>

                    {/* Hover tooltip for premium interactions */}
                    <div className="absolute bottom-[140%] left-1/2 transform -translate-x-1/2 mb-3 bg-[#050816]/95 border border-white/10 rounded-lg py-2 px-3 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 w-44 z-30 shadow-2xl">
                      <div className="text-xs font-bold text-white mb-0.5">{icon.title}</div>
                      <div className="text-[9px] text-[#00F5FF]">{icon.desc}</div>
                      {/* Tooltip triangle */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#050816]" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

      </div>
      

    </section>
  );
};

export default Hero;
