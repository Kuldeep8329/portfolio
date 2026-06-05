
const TiltCard = ({ children, className = '', glowColor = 'primary' }) => {
  const glowStyleClass = glowColor === 'secondary' 
    ? 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/10'
    : 'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] border-purple-500/10';

  return (
    <div
      className={`glass-card p-6 rounded-2xl transition-all duration-300 ease-out border ${glowStyleClass} ${className}`}
    >
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
