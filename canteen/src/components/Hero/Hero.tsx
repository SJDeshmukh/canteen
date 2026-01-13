import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FloatingUtensils } from '../FloatingUtensils/FloatingUtensils';
import { SteamParticles } from '../SteamParticles/SteamParticles';
import { useParallax } from '../../hooks/useParallax';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import styles from './Hero.module.scss';

gsap.registerPlugin(ScrollToPlugin);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useParallax(containerRef, { sensitivity: 10 });
  useScrollAnimations(titleRef, { type: 'fade-up', delay: 0.2 });
  useScrollAnimations(subtitleRef, { type: 'fade-up', delay: 0.4 });
  useScrollAnimations(ctaRef, { type: 'scale-up', delay: 0.6 });

  const handlePartnerClick = () => {
    // Industrial mechanical feedback
    if (ctaRef.current) {
        gsap.to(ctaRef.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                // The "Drag" effect
                gsap.to(window, {
                    duration: 2,
                    scrollTo: { y: '#contact-section', offsetY: 50 },
                    ease: 'power4.inOut' // Heavy industrial ease
                });
            }
        });
    }
  };

  return (
    <section className={styles.hero} ref={containerRef}>
      <div className={styles.bgOverlay} />
      
      <FloatingUtensils />
      <SteamParticles count={20} opacity={0.2} />

      <div className={`container ${styles.content}`}>
        <div className={styles.textContent}>
          <h1 ref={titleRef} className={styles.title}>
            Industrial Scale.<br />
            <span className="text-gold">Precision</span> Taste.
          </h1>
          <p ref={subtitleRef} className={styles.subtitle}>
            Engineered food solutions for corporates, factories, and offshore institutions.
            Feeding the workforce that builds the world.
          </p>
          <button ref={ctaRef} className={styles.cta} onClick={handlePartnerClick}>
            Partner With Us
          </button>
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
      </div>
    </section>
  );
};
