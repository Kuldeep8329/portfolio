import React from 'react';
import { Mail, Phone, MapPin, ChevronUp } from 'lucide-react';

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#030014]/80 py-12 px-6 z-10 overflow-hidden">
      {/* Decorative top blur line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand details */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <span className="text-xl font-bold tracking-tight text-white">
            KULDEEP<span className="text-primary font-extrabold font-mono">.</span>
          </span>
          <p className="text-xs text-gray-500 max-w-xs font-light">
            Power Platform Intern & Full-Stack Developer. Automating enterprise workflows and engineering high-end UI dashboards.
          </p>
        </div>

        {/* Navigation & Copyright */}
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <div className="flex space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all text-xs"
            >
              <GithubIcon size={16} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all text-xs"
            >
              <LinkedinIcon size={16} />
            </a>
          </div>

          <p className="text-[11px] text-gray-600">
            &copy; {new Date().getFullYear()} Kuldeep Mahajan. All rights reserved.
          </p>
        </div>

        {/* Scroll back to top button */}
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/5 hover:border-primary/50 text-gray-400 hover:text-primary transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] group"
          aria-label="Scroll to top"
        >
          <ChevronUp size={16} className="transform group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
