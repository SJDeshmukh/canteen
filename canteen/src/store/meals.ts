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
type MealDTO = {
  id: unknown;
  name: unknown;
  category: unknown;
  description: unknown;
  highlights?: unknown;
  serving: unknown;
  active: unknown;
  image_url?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

const STORAGE_KEY = 'canteen_meals';
const API_BASE = import.meta.env?.VITE_API_BASE ?? 'http://localhost:5000';

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

const syncFromServer = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/meals`);
    if (!res.ok) return;
    const list: unknown = await res.json();
    const mapped: Meal[] = (Array.isArray(list) ? list : []).map((m: MealDTO) => ({
      id: String(m.id),
      name: String(m.name),
      category: String(m.category) as MealCategory,
      description: String(m.description),
      highlights: String(m.highlights ?? ''),
      serving: String(m.serving) as ServingType,
      active: Boolean(m.active),
      imageData: m.image_url ? `${API_BASE}${String(m.image_url)}` : undefined,
      createdAt: Number(m.created_at ?? Date.now()),
      updatedAt: Number(m.updated_at ?? Date.now())
    }));
    writeAll(mapped);
  } catch (err) {
    console.error('syncFromServer failed', err);
  }
};

export const MealsStore = {
  list(): Meal[] {
    return readAll().sort((a, b) => b.createdAt - a.createdAt);
  },
  byId(id: string): Meal | undefined {
    return readAll().find(m => m.id === id);
  },
  async addUpload(form: FormData): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/api/meals`, { method: 'POST', body: form });
      if (!res.ok) return;
      await syncFromServer();
    } catch (err) {
      console.error('addUpload failed', err);
    }
  },
  async update(update: MealUpdate): Promise<Meal | undefined> {
    try {
      const res = await fetch(`${API_BASE}/api/meals/${update.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
      if (!res.ok) return undefined;
      await syncFromServer();
      return this.byId(update.id);
    } catch {
      return undefined;
    }
  },
  async remove(id: string) {
    try {
      await fetch(`${API_BASE}/api/meals/${id}`, { method: 'DELETE' });
      await syncFromServer();
    } catch (err) {
      console.error('remove failed', err);
    }
  },
  subscribe(cb: (meals: Meal[]) => void): () => void {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<Meal[]>;
      cb(ev.detail);
    };
    emitter.addEventListener('meals-change', handler as EventListener);
    cb(readAll());
    syncFromServer();
    return () => {
      emitter.removeEventListener('meals-change', handler as EventListener);
    };
  }
};
