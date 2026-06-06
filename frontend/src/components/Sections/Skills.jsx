import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Cpu, Database, Cloud, Layout, CheckCircle2 } from 'lucide-react';
import TiltCard from '../TiltCard';

const skillsData = [
  // Programming
  { name: 'Python', level: 95, category: 'programming', color: '#00F5FF' },
  { name: 'JavaScript', level: 90, category: 'programming', color: '#7B61FF' },
  { name: 'Java', level: 80, category: 'programming', color: '#00FF88' },
  
  // Frontend
  { name: 'React', level: 90, category: 'frontend', color: '#7B61FF' },
  { name: 'HTML', level: 95, category: 'frontend', color: '#00F5FF' },
  { name: 'CSS', level: 90, category: 'frontend', color: '#00FF88' },
  { name: 'Bootstrap', level: 85, category: 'frontend', color: '#7B61FF' },
  
  // Backend
  { name: 'Django', level: 95, category: 'backend', color: '#00FF88' },
  { name: 'REST API', level: 92, category: 'backend', color: '#00F5FF' },
  
  // Database
  { name: 'MySQL', level: 88, category: 'database', color: '#00F5FF' },
  { name: 'PostgreSQL', level: 90, category: 'database', color: '#7B61FF' },
  { name: 'Supabase', level: 85, category: 'database', color: '#00FF88' },
  
  // AI
  { name: 'OpenAI API', level: 90, category: 'ai', color: '#00F5FF' },
  { name: 'Ollama', level: 92, category: 'ai', color: '#7B61FF' },
  { name: 'LangChain', level: 88, category: 'ai', color: '#00FF88' },
  { name: 'Prompt Eng.', level: 92, category: 'ai', color: '#00F5FF' },
  
  // Cloud
  { name: 'Azure', level: 85, category: 'cloud', color: '#7B61FF' },
  { name: 'Vercel', level: 88, category: 'cloud', color: '#00FF88' }
];

const categories = [
  { id: 'all', label: 'All Technologies', icon: <Cpu size={14} /> },
  { id: 'programming', label: 'Languages', icon: <Code size={14} /> },
  { id: 'frontend', label: 'Frontend UI', icon: <Layout size={14} /> },
  { id: 'backend', label: 'Backend APIs', icon: <CheckCircle2 size={14} /> },
  { id: 'database', label: 'Databases', icon: <Database size={14} /> },
  { id: 'ai', label: 'Artificial Intel', icon: <Sparkles size={14} /> },
  { id: 'cloud', label: 'Cloud Systems', icon: <Cloud size={14} /> }
];

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const sphereRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Filter skills for list display
  const displayedSkills = selectedCategory === 'all'
    ? skillsData
    : skillsData.filter(s => s.category === selectedCategory);

  // 3D Tag Sphere Implementation
  useEffect(() => {
    const container = sphereRef.current;
    if (!container) return;

    // Elements to rotate
    const tagElements = container.querySelectorAll('.sphere-tag');
    if (tagElements.length === 0) return;

    const tags = Array.from(tagElements).map((el, idx) => {
      // Golden ratio placement
      const len = tagElements.length;
      const phi = Math.acos(-1 + (2 * idx) / len);
      const theta = Math.sqrt(len * Math.PI) * phi;

      const radius = 200; // Sphere radius

      return {
        el,
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi)
      };
    });

    let angleX = 0.005; // Base rotation speeds
    let angleY = 0.005;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Calculate speeds based on mouse offset from center
      angleY = (e.clientX - cx) * 0.00015;
      angleX = -(e.clientY - cy) * 0.00015;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const rotateSphere = () => {
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      tags.forEach(tag => {
        // Rotate around X axis
        const y1 = tag.y * cosX - tag.z * sinX;
        const z1 = tag.z * cosX + tag.y * sinX;

        // Rotate around Y axis
        const x2 = tag.x * cosY + z1 * sinY;
        const z2 = z1 * cosY - tag.x * sinY;

        tag.x = x2;
        tag.y = y1;
        tag.z = z2;

        // Project onto 2D viewport
        const focalLength = 300;
        const scale = focalLength / (focalLength + tag.z);
        const alpha = (tag.z + 150) / 300; // opacity based on depth

        // Update style directly for high performance
        tag.el.style.transform = `translate3d(${tag.x * scale}px, ${tag.y * scale}px, ${tag.z}px) scale(${scale})`;
        tag.el.style.opacity = Math.max(0.15, Math.min(1, alpha + 0.3));
        tag.el.style.zIndex = Math.round(scale * 100);
      });

      animationRef.current = requestAnimationFrame(rotateSphere);
    };

    rotateSphere();

    return () => {
      cancelAnimationFrame(animationRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [selectedCategory]); // Re-init sphere when tags count changes

  return (
    <div className="flex justify-center items-center w-full h-full relative z-0">
        <div 
          ref={sphereRef} 
          className="relative w-[450px] h-[450px] flex items-center justify-center cursor-pointer select-none"
        >
          {/* Inner ambient glowing core */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-[#00F5FF]/10 to-[#7B61FF]/10 blur-[50px] pointer-events-none" />

          {/* 3D absolute tags */}
          {displayedSkills.map((skill, idx) => (
            <div
              key={`${selectedCategory}-${skill.name}-${idx}`}
              className="sphere-tag absolute font-mono font-black text-sm tracking-wide px-3 py-1.5 rounded-lg glass-panel border border-white/5 text-white transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(0,245,255,0.4)]"
              style={{
                color: skill.color,
                textShadow: `0 0 10px ${skill.color}55`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {skill.name}
            </div>
          ))}
        </div>
    </div>
  );
};

export default Skills;
