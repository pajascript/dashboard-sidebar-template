import { create } from "zustand";

// ============================================
// TYPES
// ============================================

export type Branch = {
  id: string;
  label: string;
};

export type Store = {
  id: string;
  label: string;
  branches: Branch[];
};

// ============================================
// STATIC DATA - Available stores and branches
// ============================================

export const stores: Store[] = [
  {
    id: "daily-dope",
    label: "Daily Dope Vape Shop",
    branches: [
      { id: "vicas", label: "Vicas" },
      { id: "deparo", label: "Deparo" },
      { id: "north-mall", label: "North Mall" },
    ],
  },
  {
    id: "moto-masters",
    label: "Moto Masters Shop",
    branches: [
      { id: "westside", label: "Westside" },
      { id: "uptown", label: "Uptown" },
    ],
  },
];

// ============================================
// ZUSTAND STORE
// ============================================

type StoreContextState = {
  selectedStore: Store;
  selectedBranch: Branch;
  setSelectedStore: (store: Store) => void;
  setSelectedBranch: (branch: Branch) => void;
  switchStore: (store: Store) => void;
};

/**
 * Store Context - manages multi-tenant store/branch selection
 * 
 * Used by:
 * - Context Switcher (updates selection)
 * - POS Page (reads selection to show correct products)
 * - Header (displays current context on mobile)
 */
export const useStoreContext = create<StoreContextState>((set) => ({
  selectedStore: stores[0],
  selectedBranch: stores[0].branches[0],

  setSelectedStore: (store) => set({ selectedStore: store }),
  
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  switchStore: (store) =>
    set({
      selectedStore: store,
      selectedBranch: store.branches[0],
    }),
}));

