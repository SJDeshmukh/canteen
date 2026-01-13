import React, { useRef } from 'react';
import { Building, Factory, Ship, Institution } from './IndustryIcons';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import styles from './WhoWeServe.module.scss';

const industries = [
  {
    title: 'Corporates',
    icon: Building,
    description: 'Premium dining experiences for modern office complexes.',
  },
  {
    title: 'Factories',
    icon: Factory,
    description: 'High-volume, nutritious meals for the industrial workforce.',
  },
  {
    title: 'Offshore',
    icon: Ship,
    description: 'Logistics-heavy catering for rigs and marine vessels.',
  },
  {
    title: 'Institutions',
    icon: Institution,
    description: 'Scalable food solutions for universities and hospitals.',
  }
];

export const WhoWeServe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useScrollAnimations(titleRef, { type: 'fade-up' });
  useScrollAnimations(containerRef, { type: 'stagger-list', stagger: 0.2, delay: 0.3 });

  return (
    <section className={`section-padding ${styles.section}`}>
      <div className="container">
        <h2 ref={titleRef} className={styles.heading}>
          Industries We <span className="text-gold">Power</span>
        </h2>
        
        <div ref={containerRef} className={styles.grid}>
          {industries.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.iconWrapper}>
                  <item.icon />
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
                <div className={styles.reflection} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
