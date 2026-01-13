import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ScaleInfrastructure.module.scss';

gsap.registerPlugin(ScrollTrigger);

export const ScaleInfrastructure: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const steps = stepsRef.current;

    if (!section || !path || !steps) return;

    const pathLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1,
      }
    });

    tl.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      duration: 2
    });

    const stepElements = Array.from(steps.children);
    stepElements.forEach((step) => {
      gsap.fromTo(step, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

  }, []);

  return (
    <section ref={sectionRef} className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Engineered for <span className="text-heat">Scale</span></h2>
          <p className={styles.subtitle}>Automated workflows delivering 50,000+ meals daily with zero error margin.</p>
        </div>

        <div className={styles.pipeline}>
          <svg className={styles.connector} viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path 
              ref={pathRef}
              d="M50,100 L250,100 L300,50 L450,50 L500,100 L700,100 L750,150 L950,150" 
              fill="none" 
              stroke="var(--color-gold)" 
              strokeWidth="2"
            />
          </svg>

          <div ref={stepsRef} className={styles.steps}>
            <div className={styles.step} style={{ left: '5%' }}>
              <div className={styles.stepNumber}>01</div>
              <h3>Sourcing</h3>
              <p>Farm-direct procurement</p>
            </div>
            
            <div className={styles.step} style={{ left: '28%', top: '-50px' }}>
              <div className={styles.stepNumber}>02</div>
              <h3>Processing</h3>
              <p>Automated chopping & prep</p>
            </div>
            
            <div className={styles.step} style={{ left: '50%' }}>
              <div className={styles.stepNumber}>03</div>
              <h3>Cooking</h3>
              <p>Steam-jacketed cauldrons</p>
            </div>
            
            <div className={styles.step} style={{ left: '75%', top: '50px' }}>
              <div className={styles.stepNumber}>04</div>
              <h3>Distribution</h3>
              <p>IoT-tracked logistics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
