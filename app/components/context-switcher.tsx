"use client";

import { Check, ChevronDown, HomeIcon, MapPinIcon, StoreIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStoreSelector, stores, type Store, type Branch } from "@/lib/store";

const ContextSwitcher = () => {
  // Zustand store - subscribe to specific slices for optimal re-renders
  const selectedStore = useStoreSelector((state) => state.selectedStore);
  const selectedBranch = useStoreSelector((state) => state.selectedBranch);
  const switchStore = useStoreSelector((state) => state.switchStore);
  const setSelectedBranch = useStoreSelector((state) => state.setSelectedBranch);

  // Local UI state (dropdown open/close)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleStoreSelect = (store: Store) => {
    // Uses Zustand action - switches store and auto-selects first branch
    switchStore(store);
  };

  const handleBranchSelect = (branch: Branch) => {
    // Uses Zustand action
    setSelectedBranch(branch);
    setIsOpen(false);
  };

  return (
    <div className="relative max-w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-[#171717] px-3 py-1 text-white cursor-pointer hover:bg-[#262626] transition-colors duration-300 max-w-full overflow-hidden"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          <HomeIcon className="size-4 shrink-0 text-white/80" />
          <span className="text-sm truncate">
            {selectedStore.label}
          </span>
        </span>
        <span className="text-white/30 shrink-0">|</span>
        <span className="flex items-center gap-2 shrink-0">
          <MapPinIcon className="size-4 text-white/80" />
          <span className="text-sm">{selectedBranch.label}</span>
        </span>
        <ChevronDown 
          className={`size-4 shrink-0 text-white/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-2.5rem)] origin-top-left rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl shadow-black/50 transition-all duration-200 z-50 ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            Switch Context
          </p>
        </div>

        {/* Stores List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {stores.map((store, storeIndex) => (
            <div key={store.id}>
              {/* Store Header */}
              <button
                type="button"
                onClick={() => handleStoreSelect(store)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
                  selectedStore.id === store.id
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    selectedStore.id === store.id
                      ? "bg-emerald-500/20"
                      : "bg-white/10"
                  }`}
                >
                  <StoreIcon className="size-4" />
                </div>
                <span className="flex-1 text-sm font-medium truncate">{store.label}</span>
                {selectedStore.id === store.id && (
                  <Check className="size-4 text-emerald-400" />
                )}
              </button>

              {/* Branches - shown only for selected store */}
              {selectedStore.id === store.id && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-4">
                  {store.branches.map((branch) => (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => handleBranchSelect(branch)}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors duration-150 ${
                        selectedBranch.id === branch.id
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white/80"
                      }`}
                    >
                      <MapPinIcon className="size-3.5" />
                      <span className="text-sm">{branch.label}</span>
                      {selectedBranch.id === branch.id && (
                        <Check className="ml-auto size-3.5 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Divider between stores */}
              {storeIndex < stores.length - 1 && (
                <div className="my-2 border-t border-white/5" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-3">
          <p className="text-xs text-white/30">
            Select a store and branch to switch context
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContextSwitcher;
