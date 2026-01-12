import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Counters.module.scss';

gsap.registerPlugin(ScrollTrigger);

type Metric = {
  label: string;
  value: number;
  suffix?: string;
};

const formatInteger = (n: number) => new Intl.NumberFormat('en-IN').format(Math.round(n));

export const Counters: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const metrics: Metric[] = useMemo(
    () => [
      { label: 'Meals / Day', value: 50000, suffix: '+' },
      { label: 'Enterprise Clients', value: 180, suffix: '+' },
      { label: 'Years of Operation', value: 18, suffix: '+' },
      { label: 'Facilities', value: 6, suffix: '' },
    ],
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const valueEl = el.querySelector<HTMLElement>('[data-counter-value]');
        if (!valueEl) return;

        const target = metrics[idx]?.value ?? 0;
        const driver = { v: 0 };

        gsap.set(el, { opacity: 0, y: 40 });
        gsap.set(valueEl, { opacity: 0.9 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power4.out',
        }).to(
          driver,
          {
            v: target * 1.03,
            duration: 1.2,
            ease: 'power3.out',
            onUpdate: () => {
              valueEl.textContent = formatInteger(driver.v);
            },
          },
          0.05,
        ).to(
          driver,
          {
            v: target,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: () => {
              valueEl.textContent = formatInteger(driver.v);
            },
          },
          '>-0.15',
        );
      });
    }, section);

    return () => ctx.revert();
  }, [metrics]);

  return (
    <section ref={sectionRef} className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Production Metrics</h2>
          <p className={styles.subtitle}>Measured output. Verified consistency. Controlled risk.</p>
        </div>

        <div className={styles.grid}>
          {metrics.map((m, i) => (
            <div
              key={m.label}
              ref={(node) => {
                itemRefs.current[i] = node;
              }}
              className={styles.card}
            >
              <div className={styles.valueRow}>
                <span data-counter-value className={styles.value}>
                  0
                </span>
                {m.suffix ? <span className={styles.suffix}>{m.suffix}</span> : null}
              </div>
              <div className={styles.label}>{m.label}</div>
              <div className={styles.sweep} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

