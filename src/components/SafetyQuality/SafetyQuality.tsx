import React, { useRef } from 'react';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import styles from './SafetyQuality.module.scss';

export const SafetyQuality: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useScrollAnimations(containerRef, { type: 'reveal' });
  useScrollAnimations(textRef, { type: 'fade-up', delay: 0.3 });

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          <div ref={containerRef} className={styles.imagePanel}>
            <div className={styles.overlay}>
              <div className={styles.scanLine} />
            </div>
            <div className={styles.cleanSurface} />
          </div>
          
          <div ref={textRef} className={styles.content}>
            <h2 className={styles.title}>Hygiene Beyond <br />Compliance.</h2>
            <p className={styles.text}>
              Our facilities operate under surgical-grade hygiene protocols. 
              Every batch is tested for 35+ parameters before dispatch.
            </p>
            <ul className={styles.list}>
              <li>Micro-biological Testing</li>
              <li>Automated Temperature Checks</li>
              <li>Touch-free Processing</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
