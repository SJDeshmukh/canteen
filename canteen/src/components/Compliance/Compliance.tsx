import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Compliance.module.scss';

gsap.registerPlugin(ScrollTrigger);

export const Compliance: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.children;
    if (!elements) return;

    gsap.fromTo(elements, 
      { scale: 1.25, opacity: 0, rotation: -6 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      }
    );
  }, []);

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container">
        <h2 className={styles.heading}>Certified Trust</h2>
        <div ref={containerRef} className={styles.certGrid}>
          <div className={styles.certCard}>
            <h3>ISO 22000</h3>
            <p>Food Safety Management</p>
          </div>
          <div className={styles.certCard}>
            <h3>HACCP</h3>
            <p>Hazard Analysis Critical Control</p>
          </div>
          <div className={styles.certCard}>
            <h3>FSSAI</h3>
            <p>Regulated Food Safety License</p>
          </div>
        </div>
      </div>
    </section>
  );
};
