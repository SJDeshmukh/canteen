import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { MealsStore, type MealCategory, type ServingType, type Meal } from '../store/meals';
import { compressImage } from '../utils/image';
import { MealCard } from '../components/Meals/MealCard';
import styles from './Admin.module.scss';

type FormState = {
  name: string;
  category: MealCategory;
  description: string;
  highlights: string;
  serving: ServingType;
  active: boolean;
  imageData?: string;
};

const defaultState: FormState = {
  name: '',
  category: 'Lunch',
  description: '',
  highlights: '',
  serving: 'Thali',
  active: true,
  imageData: undefined
};

const PIN_KEY = 'canteen_admin_pin';

export const Admin: React.FC = () => {
  const [pinSet, setPinSet] = useState<boolean>(Boolean(localStorage.getItem(PIN_KEY)));
  const [pinInput, setPinInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<'create' | 'manage'>('create');
  const [form, setForm] = useState<FormState>(defaultState);
  const [meals, setMeals] = useState(MealsStore.list());
  const [editing, setEditing] = useState<Record<string, Partial<Omit<Meal, 'id' | 'createdAt'>> & { id: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = MealsStore.subscribe(setMeals);
    return () => unsub();
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.from(Array.from(el.children), {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }, [view, meals.length]);

  const canSave = useMemo(() => Boolean(form.name.trim() && form.description.trim()), [form]);

  const onFile = async (file: File | null) => {
    if (!file) return;
    const dataUrl = await compressImage(file, 1400, 0.85);
    setForm(s => ({ ...s, imageData: dataUrl }));
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    await onFile(file);
  };

  const onPublish = () => {
    if (!canSave) return;
    MealsStore.add({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      highlights: form.highlights.trim(),
      serving: form.serving,
      active: form.active,
      imageData: form.imageData
    });
    setForm(defaultState);
  };

  const clearImage = () => setForm(s => ({ ...s, imageData: undefined }));

  const trySetPin = () => {
    if (!pinInput.trim()) return;
    localStorage.setItem(PIN_KEY, pinInput.trim());
    setPinSet(true);
    setAuthed(true);
  };

  const tryAuth = () => {
    const pin = localStorage.getItem(PIN_KEY) ?? '';
    if (pin && pinInput.trim() === pin) setAuthed(true);
  };

  if (!authed) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.gate}>
            <h2 className={styles.gateTitle}>{pinSet ? 'Enter Admin PIN' : 'Set Admin PIN'}</h2>
            <div className={styles.gateRow}>
              <input
                type="password"
                className={styles.input}
                placeholder="PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
              />
              <button className={styles.btn} onClick={pinSet ? tryAuth : trySetPin}>
                {pinSet ? 'Unlock' : 'Save'}
              </button>
            </div>
            <div className={styles.note}>Client-side PIN. For production security, use a backend.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.topbar}>
          <div className={styles.brand}>Canteen Admin</div>
          <div className={styles.topNav}>
            <button
              className={`${styles.topNavBtn} ${view === 'create' ? styles.topNavActive : ''}`}
              onClick={() => setView('create')}
            >
              Create Meal
            </button>
            <button
              className={`${styles.topNavBtn} ${view === 'manage' ? styles.topNavActive : ''}`}
              onClick={() => setView('manage')}
            >
              Manage Recipes
            </button>
          </div>
        </div>
        <div ref={contentRef}>
        {view === 'create' ? (
          <>
            <h1 className={styles.heading}>Meal Management</h1>
            <div className={styles.panel}>
              <div className={styles.card}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Meal name</label>
                    <input
                      className={styles.input}
                      value={form.name}
                      onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
                      placeholder="e.g., Executive North Indian Thali"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Category</label>
                    <select
                      className={styles.select}
                      value={form.category}
                      onChange={(e) => setForm(s => ({ ...s, category: e.target.value as MealCategory }))}
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Special</option>
                      <option>Bulk Order</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Serving type</label>
                    <select
                      className={styles.select}
                      value={form.serving}
                      onChange={(e) => setForm(s => ({ ...s, serving: e.target.value as ServingType }))}
                    >
                      <option>Thali</option>
                      <option>Tray</option>
                      <option>Box</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Availability</label>
                    <select
                      className={styles.select}
                      value={form.active ? 'Active' : 'Inactive'}
                      onChange={(e) => setForm(s => ({ ...s, active: e.target.value === 'Active' }))}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={form.description}
                    onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))}
                    placeholder="Balanced corporate thali with seasonal vegetables, dal, roti, rice, and salad."
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Highlights</label>
                  <input
                    className={styles.input}
                    value={form.highlights}
                    onChange={(e) => setForm(s => ({ ...s, highlights: e.target.value }))}
                    placeholder="High protein, low oil, vitamin-rich"
                  />
                </div>
                <div
                  className={styles.upload}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                >
                  <div>Drag & drop meal image or</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.danger}`} onClick={() => setForm(defaultState)}>Reset</button>
                  <button className={styles.btn} onClick={onPublish} disabled={!canSave}>Publish</button>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.preview}>
                  {form.imageData && (
                    <button className={`${styles.btn} ${styles.danger}`} onClick={clearImage}>Remove Image</button>
                  )}
                  <MealCard meal={{
                    id: 'preview',
                    name: form.name || 'Preview Meal',
                    category: form.category,
                    description: form.description || 'Your description will appear here.',
                    highlights: form.highlights,
                    serving: form.serving,
                    active: form.active,
                    imageData: form.imageData,
                    createdAt: 0,
                    updatedAt: 0
                  }} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.card}>
            <h3 style={{ marginBottom: '1rem' }}>Recipes</h3>
            <div className={styles.manageList}>
              {meals.map(m => {
                const e = editing[m.id];
                return (
                  <div key={m.id} className={styles.manageRow}>
                    <div className={styles.rowHeader}>
                      <div className={styles.thumb}>
                        {m.imageData ? (
                          <img src={m.imageData} alt={m.name} />
                        ) : null}
                      </div>
                      <div className={styles.rowTitle}>{m.name}</div>
                      <div className={styles.rowMeta}>
                        <span>{m.category}</span>
                        <span>{m.serving}</span>
                        <span>{m.active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className={styles.rowControls}>
                        {!e ? (
                          <>
                            <button
                              className={styles.btn}
                              onClick={() => setEditing(s => ({ ...s, [m.id]: {
                                id: m.id,
                                name: m.name,
                                category: m.category,
                                description: m.description,
                                highlights: m.highlights,
                                serving: m.serving,
                                active: m.active
                              } }))}
                            >
                              Edit
                            </button>
                            <button
                              className={`${styles.btn} ${styles.danger}`}
                              onClick={() => MealsStore.remove(m.id)}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.btn}
                              onClick={() => {
                                const payload = editing[m.id];
                                if (!payload) return;
                                const data = {
                                  id: payload.id,
                                  name: String(payload.name ?? m.name).trim(),
                                  category: (payload.category ?? m.category) as MealCategory,
                                  description: String(payload.description ?? m.description).trim(),
                                  highlights: String(payload.highlights ?? m.highlights ?? '').trim(),
                                  serving: (payload.serving ?? m.serving) as ServingType,
                                  active: Boolean(payload.active ?? m.active)
                                };
                                MealsStore.update(data);
                                setEditing(s => {
                                  const n = { ...s };
                                  delete n[m.id];
                                  return n;
                                });
                              }}
                            >
                              Save
                            </button>
                            <button
                              className={`${styles.btn} ${styles.danger}`}
                              onClick={() => setEditing(s => {
                                const n = { ...s };
                                delete n[m.id];
                                return n;
                              })}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {!e ? (
                      <div style={{ color: '#9aa4af' }}>{m.description}</div>
                    ) : (
                      <>
                        <div className={styles.formRow}>
                          <div className={styles.field}>
                            <label className={styles.label}>Name</label>
                            <input
                              className={styles.input}
                              value={String(e.name ?? '')}
                              onChange={(ev) => setEditing(s => ({ ...s, [m.id]: { ...e, name: ev.target.value } }))}
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>Category</label>
                            <select
                              className={styles.select}
                              value={String(e.category ?? m.category)}
                              onChange={(ev) => setEditing(s => ({ ...s, [m.id]: { ...e, category: ev.target.value as MealCategory } }))}
                            >
                              <option>Breakfast</option>
                              <option>Lunch</option>
                              <option>Dinner</option>
                              <option>Special</option>
                              <option>Bulk Order</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.formRow}>
                          <div className={styles.field}>
                            <label className={styles.label}>Serving</label>
                            <select
                              className={styles.select}
                              value={String(e.serving ?? m.serving)}
                              onChange={(ev) => setEditing(s => ({ ...s, [m.id]: { ...e, serving: ev.target.value as ServingType } }))}
                            >
                              <option>Thali</option>
                              <option>Tray</option>
                              <option>Box</option>
                            </select>
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>Availability</label>
                            <select
                              className={styles.select}
                              value={(e.active ?? m.active) ? 'Active' : 'Inactive'}
                              onChange={(ev) => setEditing(s => ({ ...s, [m.id]: { ...e, active: ev.target.value === 'Active' } }))}
                            >
                              <option>Active</option>
                              <option>Inactive</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Description</label>
                          <textarea
                            className={styles.textarea}
                            value={String(e.description ?? '')}
                            onChange={(ev) => setEditing(s => ({ ...s, [m.id]: { ...e, description: ev.target.value } }))}
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Highlights</label>
                          <input
                            className={styles.input}
                            value={String(e.highlights ?? '')}
                            onChange={(ev) => setEditing(s => ({ ...s, [m.id]: { ...e, highlights: ev.target.value } }))}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {meals.length === 0 && <div className={styles.note}>No recipes available</div>}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
