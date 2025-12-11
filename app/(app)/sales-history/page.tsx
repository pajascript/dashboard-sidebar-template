"use client";

import { useState, useEffect } from "react";
import { useTransactionsStore, useStoreContext } from "@/lib/stores";
import { ChevronDown, ChevronUp, AlertTriangle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SalesHistory = () => {
  // Get current store/branch context
  const selectedStore = useStoreContext((state) => state.selectedStore);
  const selectedBranch = useStoreContext((state) => state.selectedBranch);

  const transactions = useTransactionsStore((state) => state.transactions);
  const isLoading = useTransactionsStore((state) => state.isLoading);
  const fetchTransactions = useTransactionsStore((state) => state.fetchTransactions);
  const voidTransaction = useTransactionsStore((state) => state.voidTransaction);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [voidModalId, setVoidModalId] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState("");

  // Fetch transactions for current store/branch
  useEffect(() => {
    fetchTransactions(selectedStore.id, selectedBranch.id);
  }, [fetchTransactions, selectedStore.id, selectedBranch.id]);

  const formatPrice = (price: number) => {
    return `₱${price.toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleVoid = (id: string) => {
    voidTransaction(id, voidReason || undefined);
    setVoidModalId(null);
    setVoidReason("");
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin text-white/50 mx-auto mb-2" />
          <p className="text-sm text-white/50">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-1">No sales history yet</p>
          <p className="text-sm text-white/30">Completed transactions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-xl border border-white/10 bg-[#1a1a1a] overflow-hidden"
          >
            {/* Transaction Header */}
            <div className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-white font-medium">
                    {formatDate(transaction.timestamp)} • {formatTime(transaction.timestamp)}
                  </p>
                  {transaction.status === "voided" && (
                    <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-400">
                      VOIDED
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/50">
                  {transaction.storeName} - {transaction.branchName}
                </p>
                <p className="text-xs text-white/30 mt-1">#{transaction.id}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-white/50">{transaction.items.length} items</p>
                <p className="text-xl font-bold text-white">{formatPrice(transaction.total)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-white/10 px-4 py-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expandedId === transaction.id ? null : transaction.id)
                }
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                {expandedId === transaction.id ? (
                  <>
                    <ChevronUp className="size-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-4" />
                    View Details
                  </>
                )}
              </button>

              {transaction.status === "completed" && (
                <button
                  type="button"
                  onClick={() => setVoidModalId(transaction.id)}
                  className="ml-auto flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <AlertTriangle className="size-4" />
                  Void Transaction
                </button>
              )}
            </div>

            {/* Expanded Details */}
            {expandedId === transaction.id && (
              <div className="border-t border-white/10 bg-[#141414] p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-3">
                  Items
                </p>
                <div className="space-y-2">
                  {transaction.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex-1">
                        <p className="text-white">{item.productName}</p>
                        <p className="text-white/40 text-xs">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-white">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(transaction.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Discount</span>
                    <span className="text-emerald-400">
                      -{formatPrice(transaction.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-white pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>{formatPrice(transaction.total)}</span>
                  </div>
                </div>

                {transaction.status === "voided" && transaction.voidReason && (
                  <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-xs font-medium text-red-400 mb-1">Void Reason:</p>
                    <p className="text-sm text-white/80">{transaction.voidReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Void Confirmation Modal */}
      {voidModalId && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setVoidModalId(null);
              setVoidReason("");
            }}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Void Transaction</h3>
                <p className="mt-1 text-sm text-white/50">
                  This action cannot be undone
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVoidModalId(null);
                  setVoidReason("");
                }}
                className="rounded-lg p-1 hover:bg-white/10 transition-colors"
              >
                <X className="size-5 text-white/50" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="e.g., Customer returned items"
                className="w-full rounded-lg border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setVoidModalId(null);
                  setVoidReason("");
                }}
                className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 font-medium text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVoid(voidModalId)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-500 transition-colors"
              >
                Void Transaction
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesHistory;

