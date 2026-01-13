import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './SteamParticles.module.scss';

interface SteamParticlesProps {
  count?: number;
  color?: string;
  opacity?: number;
}

export const SteamParticles: React.FC<SteamParticlesProps> = ({ 
  count = 15, 
  color = '#ffffff',
  opacity = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add(styles.particle);
        container.appendChild(particle);

        const size = Math.random() * 60 + 20;
        const startX = Math.random() * 100;
        const startY = Math.random() * 20 + 80;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;

        gsap.set(particle, {
          width: size,
          height: size,
          x: `${startX}%`,
          y: `${startY}%`,
          opacity: 0,
          backgroundColor: color,
        });

        const tl = gsap.timeline({ repeat: -1, delay: delay });
        
        tl.fromTo(particle, 
          { 
            y: '120%', 
            x: `${startX}%`, 
            opacity: 0, 
            scale: 0.5 
          },
          {
            y: '-20%',
            x: `${startX + (Math.random() * 20 - 10)}%`,
            opacity: 0,
            scale: 1.5,
            duration: duration,
            ease: 'none',
            keyframes: [
              { opacity: opacity, percent: 20 },
              { opacity: opacity * 0.5, percent: 50 },
              { opacity: 0, percent: 100 }
            ]
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      container.innerHTML = '';
    };
  }, [count, color, opacity]);

  return <div ref={containerRef} className={styles.container} />;
};
