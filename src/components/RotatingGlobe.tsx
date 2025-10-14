import { useEffect, useRef } from 'react';

export function RotatingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw globe
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 80;

      // Main globe with gradient
      const gradient = ctx.createRadialGradient(
        centerX - 20,
        centerY - 20,
        radius * 0.3,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, '#4DD0E1');
      gradient.addColorStop(0.5, '#29B6F6');
      gradient.addColorStop(1, '#0277BD');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Green continents (simplified)
      ctx.fillStyle = '#4CAF50';
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Continent shapes (simplified blobs)
      const continents = [
        { x: -30, y: -20, w: 50, h: 30 },
        { x: 20, y: 10, w: 40, h: 25 },
        { x: -40, y: 30, w: 35, h: 20 },
      ];

      continents.forEach(cont => {
        ctx.beginPath();
        ctx.ellipse(cont.x, cont.y, cont.w / 2, cont.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Shine/highlight
      const shineGradient = ctx.createRadialGradient(
        centerX - 30,
        centerY - 30,
        0,
        centerX - 30,
        centerY - 30,
        radius * 0.6
      );
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = shineGradient;
      ctx.fill();

      // Orbiting dots
      const dots = 3;
      for (let i = 0; i < dots; i++) {
        const angle = (rotation * 2 + (i * Math.PI * 2) / dots) % (Math.PI * 2);
        const dotX = centerX + Math.cos(angle) * (radius + 20);
        const dotY = centerY + Math.sin(angle) * (radius + 20);
        
        ctx.beginPath();
        ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      }

      rotation += 0.01;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="mx-auto"
    />
  );
}
