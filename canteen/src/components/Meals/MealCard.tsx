import React, { useRef } from 'react';
import { useParallax } from '../../hooks/useParallax';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import type { Meal } from '../../store/meals';
import styles from './MealCard.module.scss';

type Props = {
  meal: Meal;
};

export const MealCard: React.FC<Props> = ({ meal }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  useParallax(cardRef, { sensitivity: 8 });
  useParallax(mediaRef, { sensitivity: 15 });
  useScrollAnimations(cardRef, { type: 'fade-up' });

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.inner}>
        <div ref={mediaRef} className={styles.media}>
          {meal.imageData ? (
            <img
              className={styles.img}
              src={meal.imageData}
              alt={meal.name}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className={styles.shadow} />
          )}
          <div className={styles.shadow} />
        </div>
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{meal.name}</h3>
            <span className={styles.badge}>{meal.category}</span>
          </div>
          <div className={styles.meta}>
            <span>{meal.serving}</span>
            <span>{meal.active ? 'Active' : 'Inactive'}</span>
          </div>
          <p className={styles.desc}>{meal.description}</p>
        </div>
      </div>
      <div className={styles.reflection} />
    </div>
  );
};
