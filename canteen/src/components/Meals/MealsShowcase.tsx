import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import { MealsStore, type Meal, type MealCategory } from '../../store/meals';
import { MealCard } from './MealCard';
import styles from './MealsShowcase.module.scss';

type Props = {
  title?: string;
  initialCategory?: MealCategory | 'All';
  onlyActive?: boolean;
};

const categories: Array<MealCategory | 'All'> = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Special', 'Bulk Order'];

export const MealsShowcase: React.FC<Props> = ({ title = 'Menu Showcase', initialCategory = 'All', onlyActive = true }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<MealCategory | 'All'>(initialCategory);
  const [meals, setMeals] = useState<Meal[]>(MealsStore.list());
  useScrollAnimations(sectionRef, { type: 'reveal' });

  useEffect(() => {
    const unsub = MealsStore.subscribe(setMeals);
    return () => unsub();
  }, []);

  const visible = useMemo(() => {
    return meals.filter(m => (onlyActive ? m.active : true) && (current === 'All' ? true : m.category === current));
  }, [meals, current, onlyActive]);

  return (
    <section ref={sectionRef} className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.controls}>
            {categories.map(c => (
              <button
                key={c}
                className={`${styles.control} ${current === c ? styles.controlActive : ''}`}
                onClick={() => setCurrent(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {visible.length === 0 ? (
            <div className={styles.empty}>No meals available</div>
          ) : (
            visible.map(m => <MealCard key={m.id} meal={m} />)
          )}
        </div>
      </div>
    </section>
  );
};

