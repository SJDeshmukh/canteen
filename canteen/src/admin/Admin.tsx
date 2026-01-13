import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MealsStore, type MealCategory, type ServingType } from '../store/meals';
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
  const [form, setForm] = useState<FormState>(defaultState);
  const [meals, setMeals] = useState(MealsStore.list());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = MealsStore.subscribe(setMeals);
    return () => unsub();
  }, []);

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

        <div className={styles.card} style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Recently Added</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {meals.map(m => <MealCard key={m.id} meal={m} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
