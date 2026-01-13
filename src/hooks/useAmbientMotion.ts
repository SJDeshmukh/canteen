import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';

interface AmbientMotionOptions {
  yRange?: number;
  rotationRange?: number;
  duration?: number;
  delay?: number;
}

export const useAmbientMotion = <T extends HTMLElement>(ref: RefObject<T | null>, options: AmbientMotionOptions = {}) => {
  const { yRange = 20, rotationRange = 5, duration = 3, delay = 0 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const randomStart = Math.random() * duration;

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'sine.inOut' },
      delay: delay - randomStart
    });

    tl.to(element, {
      y: yRange,
      rotation: rotationRange,
      duration: duration,
    });

    return () => {
      tl.kill();
    };
  }, [ref, yRange, rotationRange, duration, delay]);
};
