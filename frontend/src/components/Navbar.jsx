import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' }
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy implementation
  useEffect(() => {
    const observers = [];
    
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle area
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of fixed navbar
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
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      isScrolled 
        ? 'py-4 bg-[#030014]/75 backdrop-blur-md border-b border-white/5 shadow-lg' 
        : 'py-6 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-all"
        >
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span>
            KULDEEP<span className="text-primary font-extrabold font-mono">.</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1 glass-panel px-4 py-1.5 rounded-full border border-white/5 bg-white/5">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-white bg-gradient-to-r from-primary to-secondary/80 shadow-md font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="px-5 py-2 text-sm font-semibold rounded-full border border-primary/40 hover:border-primary/80 bg-primary/10 hover:bg-primary/20 text-white transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-[#030014]/95 border-l border-white/10 backdrop-blur-xl z-50 transform transition-transform duration-300 lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`px-4 py-3 text-sm font-semibold tracking-wide rounded-xl transition-all ${
                activeSection === item.id
                  ? 'text-white bg-gradient-to-r from-primary to-secondary/80 font-bold border-l-4 border-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="mt-4 px-4 py-3 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary text-white transition-all"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
