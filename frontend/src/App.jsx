import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiquidBackground from './components/LiquidBackground';
import Hero from './components/Sections/Hero';
import About from './components/Sections/About';
import Skills from './components/Sections/Skills';
import Experience from './components/Sections/Experience';
import Projects from './components/Sections/Projects';
import Education from './components/Sections/Education';
import Certifications from './components/Sections/Certifications';
import Awards from './components/Sections/Awards';
import Contact from './components/Sections/Contact';
import Footer from './components/Footer';

import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';

const PortfolioPage = ({ loading, portfolioData }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030014]">
        {/* Animated fluid loader */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-secondary/15 border-t-secondary animate-[spin_1.5s_linear_infinite_reverse]" />
          <div className="absolute inset-4 rounded-full bg-[#030014] flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
          </div>
        </div>
        <span className="mt-6 text-sm text-gray-500 font-medium tracking-widest uppercase animate-pulse">
          Initializing Portfolio...
        </span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-[#030014] selection:bg-primary/30 selection:text-white">
      {/* Background visual components */}
      <LiquidBackground />

      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Hero profile={portfolioData.profile} />
        
        {/* Decorative Divider */}
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <About profile={portfolioData.profile} />
        
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <Skills skills={portfolioData.skills} />
        
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <Experience experience={portfolioData.experience} />
        
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <Projects projects={portfolioData.projects} />
        
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <Education education={portfolioData.education} />
        
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <Certifications certifications={portfolioData.certifications} />
        
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <Awards awards={portfolioData.awards} />
        
        <div className="max-w-7xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <Contact profile={portfolioData.profile} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState({
    profile: null,
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    awards: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          'profile',
          'skills',
          'experience',
          'projects',
          'education',
          'certifications',
          'awards'
        ];

        // Fetch all APIs in parallel
        const responses = await Promise.all(
          endpoints.map(ep => 
            fetch(`http://localhost:5000/api/${ep}`)
              .then(res => res.json())
              .catch(err => {
                console.warn(`Error fetching endpoint ${ep}, using fallbacks:`, err);
                return null;
              })
          )
        );

        setPortfolioData({
          profile: responses[0],
          skills: responses[1] || [],
          experience: responses[2] || [],
          projects: responses[3] || [],
          education: responses[4] || [],
          certifications: responses[5] || [],
          awards: responses[6] || []
        });
      } catch (error) {
        console.error('Fatal error loading portfolio data:', error);
      } finally {
        // Guarantee minimal display length for the premium loader
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      }
    };

    fetchData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PortfolioPage loading={loading} portfolioData={portfolioData} />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
