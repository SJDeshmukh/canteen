import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'fade-up' | 'reveal' | 'scale-up' | 'stagger-list';

interface ScrollAnimationOptions {
  type?: AnimationType;
  stagger?: number;
  delay?: number;
  duration?: number;
  start?: string;
  markers?: boolean;
}

export const useScrollAnimations = <T extends HTMLElement>(ref: RefObject<T | null>, options: ScrollAnimationOptions = {}) => {
  const { 
    type = 'fade-up', 
    stagger = 0.1, 
    delay = 0, 
    duration = 1,
    start = 'top 80%',
    markers = false
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      switch (type) {
        case 'fade-up':
          gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration,
              delay,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start,
                markers
              }
            }
          );
          break;
        case 'reveal':
          gsap.fromTo(element,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.5,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: element,
                start,
                markers
              }
            }
          );
          break;
        case 'scale-up':
           gsap.fromTo(element,
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start,
                markers
              }
            }
           );
           break;
        case 'stagger-list':
          {
            const children = element.children;
            gsap.fromTo(children,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration,
                stagger,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: element,
                  start,
                  markers
                }
              }
            );
          }
          break;
      }
    }, ref);

    return () => ctx.revert();
  }, [ref, type, stagger, delay, duration, start, markers]);
};
