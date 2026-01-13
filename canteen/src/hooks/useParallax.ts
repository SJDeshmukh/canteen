import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';

interface ParallaxOptions {
  sensitivity?: number;
}

export const useParallax = <T extends HTMLElement>(ref: RefObject<T | null>, options: ParallaxOptions = {}) => {
  const { sensitivity = 20 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth - 0.5) * sensitivity;
      const yPos = (clientY / innerHeight - 0.5) * sensitivity;

      gsap.to(element, {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, sensitivity]);
};
