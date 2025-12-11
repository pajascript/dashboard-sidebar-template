import { create } from "zustand";
import axios from "axios";

// ============================================
// TYPES
// ============================================

export type TransactionItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Transaction = {
  id: string;
  timestamp: number;
  storeId: string;
  storeName: string;
  branchId: string;
  branchName: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: "completed" | "voided";
  voidedAt?: number;
  voidReason?: string;
};

// ============================================
// ZUSTAND STORE with API integration
// ============================================

type TransactionsState = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: (storeId?: string, branchId?: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp" | "status">) => Promise<void>;
  voidTransaction: (id: string, reason?: string) => Promise<void>;
};

/**
 * Transactions Store with MongoDB API via Axios
 * 
 * Features:
 * - Fetches from MongoDB via API with store/branch filtering
 * - Creates transactions via API
 * - Voids transactions via API
 * - Local state cache for fast UI updates
 * - Uses Axios for cleaner error handling
 */
export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  /**
   * Fetch transactions from API
   * Optionally filter by store and/or branch
   */
  fetchTransactions: async (storeId?: string, branchId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (storeId) params.append("storeId", storeId);
      if (branchId) params.append("branchId", branchId);

      const response = await axios.get(`/api/transactions?${params.toString()}`);
      set({ transactions: response.data.transactions, isLoading: false });
    } catch (error) {
      set({ 
        error: axios.isAxiosError(error) 
          ? error.response?.data?.error || error.message 
          : "Unknown error",
        isLoading: false 
      });
    }
  },

  /**
   * Add new transaction via API
   */
  addTransaction: async (transaction) => {
    try {
      const response = await axios.post("/api/transactions", transaction);
      
      // Optimistic update: add to local state immediately
      set((state) => ({
        transactions: [response.data.transaction, ...state.transactions],
      }));
    } catch (error) {
      console.error("Error adding transaction:", error);
      // Re-fetch to stay in sync
      get().fetchTransactions();
    }
  },

  /**
   * Void transaction via API
   */
  voidTransaction: async (id, reason) => {
    try {
      await axios.patch(`/api/transactions/${id}`, { reason });

      // Optimistic update: update local state immediately
      set((state) => ({
        transactions: state.transactions.map((txn) =>
          txn.id === id
            ? {
                ...txn,
                status: "voided" as const,
                voidedAt: Date.now(),
                voidReason: reason,
              }
            : txn
        ),
      }));
    } catch (error) {
      console.error("Error voiding transaction:", error);
      // Re-fetch to stay in sync
      get().fetchTransactions();
    }
  },
}));
