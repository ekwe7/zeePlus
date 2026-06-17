import { create } from "zustand";
import type { InventoryItem } from "@/types/inventory";

const seed: InventoryItem[] = [
  {
    id: "i1",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    stock: 240,
    threshold: 50,
    unit: "tablets",
    expiry: "2027-01-15",
  },
  {
    id: "i2",
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    stock: 30,
    threshold: 40,
    unit: "capsules",
    expiry: "2026-09-30",
  },
  {
    id: "i3",
    name: "Insulin Glargine",
    category: "Diabetes",
    stock: 12,
    threshold: 15,
    unit: "vials",
    expiry: "2026-11-10",
  },
];

interface State {
  items: InventoryItem[];
  add: (i: InventoryItem) => void;
  update: (id: string, patch: Partial<InventoryItem>) => void;
  remove: (id: string) => void;
}

export const useInventoryStore = create<State>((set) => ({
  items: seed,
  add: (i) => set((s) => ({ items: [i, ...s.items] })),
  update: (id, patch) =>
    set((s) => ({ items: s.items.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
}));
