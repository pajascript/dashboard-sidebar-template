import { create } from "zustand";

// Types
export type Branch = {
  id: string;
  label: string;
};

export type Store = {
  id: string;
  label: string;
  branches: Branch[];
};

// Available stores and branches
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

// Zustand Store State & Actions
type StoreState = {
  // State
  selectedStore: Store;
  selectedBranch: Branch;

  // Actions
  setSelectedStore: (store: Store) => void;
  setSelectedBranch: (branch: Branch) => void;
  switchStore: (store: Store) => void; // Switches store and auto-selects first branch
};

/**
 * Zustand Store for Store/Branch Selection
 * 
 * How it works:
 * 1. `create` creates a store with initial state and actions
 * 2. `set` is used inside actions to update state (auto-merges)
 * 3. Components use `useStoreSelector` hook to subscribe to specific slices
 * 4. Only subscribed slices trigger re-renders when they change
 */
export const useStoreSelector = create<StoreState>((set) => ({
  // Initial State - default to first store and its first branch
  selectedStore: stores[0],
  selectedBranch: stores[0].branches[0],

  // Actions
  setSelectedStore: (store) => set({ selectedStore: store }),
  
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),

  // Convenience action: switch store and auto-select first branch
  switchStore: (store) =>
    set({
      selectedStore: store,
      selectedBranch: store.branches[0],
    }),
}));

