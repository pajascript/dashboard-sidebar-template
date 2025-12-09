// Re-export all stores for convenient imports
// Usage: import { useStoreContext, useSidebarStore } from "@/lib/stores"

export { useStoreContext, stores, type Store, type Branch } from "./store-context";
export { useSidebarStore } from "./sidebar";

