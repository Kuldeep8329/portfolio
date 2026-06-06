import { useEffect, useRef } from 'react';

const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(100, Math.floor((width * height) / 15000));
    const connectionDistance = 120;
    const mouse = { x: null, y: null, radius: 180, targetX: null, targetY: null };

    // 3D Projection Config
    const focalLength = 300;

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        // Generate coordinates in 3D space
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = init ? Math.random() * 800 : 800; // depth

        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = -0.8 - Math.random() * 0.7; // move towards viewer

        this.radius = 1.2 + Math.random() * 1.8;
        // Vary color slightly between cyan, violet, and emerald
        const rands = Math.random();
        if (rands < 0.4) {
          this.color = '0, 245, 255'; // Cyan #00F5FF
        } else if (rands < 0.8) {
          this.color = '123, 97, 255'; // Purple #7B61FF
        } else {
          this.color = '0, 255, 136'; // Accent Emerald #00FF88
        }
      }

      update() {
        // Drift in 3D space
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Apply mouse interaction in 2D projected space
        if (mouse.x !== null && mouse.y !== null) {
          // Project current coordinates first
          const scale = focalLength / (focalLength + this.z);
          const projX = width / 2 + this.x * scale;
          const projY = height / 2 + this.y * scale;

          const dx = mouse.x - projX;
          const dy = mouse.y - projY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Repel particles
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 4 / scale;
            this.y -= Math.sin(angle) * force * 4 / scale;
          }
        }

        // Reset if past viewer (z <= -focalLength) or too far
        if (this.z <= -focalLength + 10 || this.z > 1000) {
          this.reset(false);
        }
      }

      draw() {
        if (this.z <= -focalLength) return;

        // Perspective projection
        const scale = focalLength / (focalLength + this.z);
        const projX = width / 2 + this.x * scale;
        const projY = height / 2 + this.y * scale;

        // Clip bounds
        if (projX < 0 || projX > width || projY < 0 || projY > height) return;

        // Size based on depth
        const depthRadius = this.radius * scale;
        // Alpha fades as it comes very close or gets very far
        let alpha = scale * 0.8;
        if (this.z < 100) {
          alpha *= (this.z / 100); // fade out close to camera
        }

        ctx.beginPath();
        ctx.arc(projX, projY, depthRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, Math.min(1, alpha))})`;
        ctx.shadowBlur = depthRadius * 4;
        ctx.shadowColor = `rgba(${this.color}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Animation Loop
    const animate = () => {
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid overlay in 3D
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Smooth mouse interpolation
      if (mouse.targetX !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // Update and Draw Particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw Connection lines in projected space
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.z <= -focalLength) continue;

        const s1 = focalLength / (focalLength + p1.z);
        const x1 = width / 2 + p1.x * s1;
        const y1 = height / 2 + p1.y * s1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.z <= -focalLength) continue;

          const s2 = focalLength / (focalLength + p2.z);
          const x2 = width / 2 + p2.x * s2;
          const y2 = height / 2 + p2.y * s2;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.18 * Math.min(s1, s2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            // Gradient connection line
            const grad = ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0, `rgba(${p1.color}, ${alpha})`);
            grad.addColorStop(1, `rgba(${p2.color}, ${alpha})`);
            ctx.strokeStyle = grad;
            ctx.stroke();
          }
        }
      }

      // Draw Cursor Ambient Glow
      if (mouse.x !== null) {
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        grad.addColorStop(0, 'rgba(0, 245, 255, 0.05)');
        grad.addColorStop(0.5, 'rgba(123, 97, 255, 0.02)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 block w-full h-full pointer-events-none"
    />
  );
};

export default ThreeBackground;
