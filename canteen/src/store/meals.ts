export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Special' | 'Bulk Order';
export type ServingType = 'Thali' | 'Tray' | 'Box';

export type Meal = {
  id: string;
  name: string;
  category: MealCategory;
  description: string;
  highlights?: string;
  serving: ServingType;
  active: boolean;
  imageData?: string;
  createdAt: number;
  updatedAt: number;
};

type MealUpdate = Partial<Omit<Meal, 'id' | 'createdAt'>> & { id: string };

const STORAGE_KEY = 'canteen_meals';

const emitter = new EventTarget();

const readAll = (): Meal[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Meal[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const writeAll = (meals: Meal[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  emitter.dispatchEvent(new CustomEvent('meals-change', { detail: meals }));
};

export const MealsStore = {
  list(): Meal[] {
    return readAll().sort((a, b) => b.createdAt - a.createdAt);
  },
  byId(id: string): Meal | undefined {
    return readAll().find(m => m.id === id);
  },
  add(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Meal {
    const now = Date.now();
    const record: Meal = {
      ...meal,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    const all = readAll();
    all.push(record);
    writeAll(all);
    return record;
  },
  update(update: MealUpdate): Meal | undefined {
    const all = readAll();
    const idx = all.findIndex(m => m.id === update.id);
    if (idx === -1) return undefined;
    const next: Meal = {
      ...all[idx],
      ...update,
      updatedAt: Date.now()
    };
    all[idx] = next;
    writeAll(all);
    return next;
  },
  remove(id: string) {
    const all = readAll().filter(m => m.id !== id);
    writeAll(all);
  },
  subscribe(cb: (meals: Meal[]) => void): () => void {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<Meal[]>;
      cb(ev.detail);
    };
    emitter.addEventListener('meals-change', handler as EventListener);
    cb(readAll());
    return () => {
      emitter.removeEventListener('meals-change', handler as EventListener);
    };
  }
};

