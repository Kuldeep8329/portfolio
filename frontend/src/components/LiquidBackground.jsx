import { useEffect, useState } from 'react';

const LiquidBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate cursor position relative to screen size for parallax overlay
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#030014]">
      {/* Background grids */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f1a3a_1px,transparent_1px),linear-gradient(to_bottom,#1f1a3a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"
      />

      {/* Floating Organic Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full liquid-blob-1 animate-blob" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full liquid-blob-2 animate-blob [animation-delay:4s]" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full liquid-blob-3 animate-blob [animation-delay:2s]" />

      {/* Cursor Following Ambient Light Layer */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-25 transition-transform duration-500 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(0, 0, 0, 0) 70%)',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Subtle organic overlay for premium grain/depth */}
      <div className="absolute inset-0 bg-[#030014]/10 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
};

export default LiquidBackground;
