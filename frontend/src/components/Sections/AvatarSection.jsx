import { motion } from 'framer-motion';
import { Cpu, Eye, ShieldCheck, Terminal } from 'lucide-react';

const AvatarSection = () => {
  const coreStats = [
    { label: 'System Designation', value: 'AI Engineer / AI Product Dev', icon: <Cpu className="text-[#00F5FF]" size={16} /> },
    { label: 'Core Stack', value: 'Django + Python + React', icon: <Terminal className="text-[#7B61FF]" size={16} /> },
    { label: 'Low-Code Integration', value: 'PowerApps & SharePoint', icon: <ShieldCheck className="text-[#00FF88]" size={16} /> },
    { label: 'Primary Interface', value: 'Interactive 3D Web UI', icon: <Eye className="text-[#00F5FF]" size={16} /> }
  ];

  return (
    <section id="avatar" className="py-[30px] px-6 relative z-10 overflow-hidden bg-transparent">
      {/* Visual background rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-dashed border-[#7B61FF]/10 pointer-events-none animate-[spin_120s_linear_infinite]" />

      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-6 relative z-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight inline-block relative"
          >
            Technical Interface
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full" />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 mt-6 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-light text-center"
          >
            This interactive avatar represents my digital twin—an engineer optimized for low-latency AI product architecture, secure offline agentic workflows, and low-code operational flows. 
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Holographic Details */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left py-4"
          >



            <div className="space-y-4 pt-4">
              {coreStats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-4 p-4 rounded-xl glass-panel border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 shadow-md"
                >
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">{stat.label}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Floating Avatar Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex justify-center items-stretch relative min-h-[500px] lg:min-h-0"
          >
            {/* Soft Shadow effect glowing beneath the avatar */}
            <div className="absolute -bottom-4 w-64 h-12 rounded-full bg-gradient-to-r from-[#00F5FF]/10 to-[#7B61FF]/10 blur-xl opacity-80 animate-pulse" />

            {/* Static Card */}
            <div
              className="relative w-full max-w-[460px] aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[calc(100%-30px)] lg:mt-[30px] rounded-3xl p-1 bg-gradient-to-tr from-[#00F5FF]/30 via-white/5 to-[#7B61FF]/30 shadow-2xl cursor-pointer mx-auto"
            >
              <div className="absolute inset-0.5 bg-[#050816]/95 rounded-[22px] overflow-hidden flex items-center justify-center">
                
                {/* Hologram Overlay Elements */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_95%,rgba(0,245,255,0.1)_97%,rgba(0,245,255,0.15)_99%,rgba(255,255,255,0)_100%)] bg-[size:100%_40px] pointer-events-none opacity-20 animate-[pulse_2s_infinite]" />
                
                {/* Main Avatar Image with Floating Animation */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full flex justify-center items-center z-10 px-6"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Rotating animated rings */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute w-[110%] h-[110%] rounded-full border border-dashed border-[#00F5FF]/30 pointer-events-none"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute w-[120%] h-[120%] rounded-full border border-white/5 pointer-events-none"
                    />

                    {/* Avatar Container */}
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-tr from-[#00F5FF]/20 to-[#7B61FF]/20 p-1 shadow-[0_0_60px_rgba(0,245,255,0.2)] flex items-center justify-center">
                      <img 
                        src="/images/avatar_3d.png" 
                        alt="Kuldeep Mahajan AI Avatar" 
                        className="w-full h-full object-cover rounded-full border-2 border-[#050816]" 
                      />
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AvatarSection;
