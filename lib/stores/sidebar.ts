import { create } from "zustand";

// ============================================
// ZUSTAND STORE
// ============================================

type SidebarState = {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

/**
 * Sidebar Store - manages mobile sidebar UI state
 * 
 * Used by:
 * - Sidebar (reads open state, handles close)
 * - Header (toggles open via hamburger menu)
 */
export const useSidebarStore = create<SidebarState>((set) => ({
  isMobileOpen: false,

  setMobileOpen: (open) => set({ isMobileOpen: open }),

  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),

  closeMobile: () => set({ isMobileOpen: false }),
}));

