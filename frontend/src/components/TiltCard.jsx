import React, { useState, useRef } from 'react';

const TiltCard = ({ children, className = '', glowColor = 'primary' }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Mouse position relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation percentage based on center of card
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Max tilt is 15 degrees
    const rotateX = (yc - y) / 10;
    const rotateY = (x - xc) / 10;

    setCoords({ x: rotateY, y: rotateX });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const glowStyleClass = glowColor === 'secondary' 
    ? 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/10'
    : 'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] border-purple-500/10';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glass-card p-6 rounded-2xl transition-all duration-200 ease-out border ${glowStyleClass} ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${coords.y}deg) rotateY(${coords.x}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Dynamic 3D inner element styling container */}
      <div style={{ transform: 'translateZ(20px)' }} className="h-full">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
