import React, { useMemo, useRef, useState } from 'react';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import styles from './ContactForm.module.scss';

type FormState = {
  company: string;
  name: string;
  email: string;
  phone: string;
  requirement: string;
};

export const ContactForm: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<FormState>({
    company: '',
    name: '',
    email: '',
    phone: '',
    requirement: '',
  });

  const canSubmit = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim());
    return Boolean(state.company.trim() && state.name.trim() && emailOk && state.requirement.trim());
  }, [state]);

  useScrollAnimations(panelRef, { type: 'scale-up', start: 'top 75%' });

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setState((s) => ({ ...s, [key]: e.target.value }));
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setState({ company: '', name: '', email: '', phone: '', requirement: '' });
  };

  return (
    <section id="contact-section" ref={sectionRef} className={`section-padding ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Enterprise Enquiry</h2>
          <p className={styles.subtitle}>
            Tell us your volume, site type, and operating constraints. We respond with a production-grade proposal.
          </p>
        </div>

        <div ref={panelRef} className={styles.panel}>
          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Company</label>
                <input value={state.company} onChange={onChange('company')} placeholder="Company / Facility" />
              </div>
              <div className={styles.field}>
                <label>Contact Name</label>
                <input value={state.name} onChange={onChange('name')} placeholder="Full name" />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input value={state.email} onChange={onChange('email')} placeholder="work@domain.com" />
              </div>
              <div className={styles.field}>
                <label>Phone</label>
                <input value={state.phone} onChange={onChange('phone')} placeholder="+91 ..." />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label>Requirement</label>
                <textarea
                  value={state.requirement}
                  onChange={onChange('requirement')}
                  placeholder="Meals/day, shift timing, site type (corporate/factory/offshore/institution), location, dietary constraints…"
                  rows={5}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.submit} type="submit" disabled={!canSubmit}>
                Request Proposal
              </button>
              <div className={styles.note}>ISO / HACCP aligned processes. Contract-ready documentation.</div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

