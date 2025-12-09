"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Minus, Plus, Trash2, Info, ArrowLeftRight, ShoppingCart, X } from "lucide-react";
import { getProductsForBranch, getCategoriesForStore, LOW_STOCK_THRESHOLD, type Product } from "@/constants/pos-data";
import { useStoreContext } from "@/lib/stores";
import { cn } from "@/lib/utils";

type CartItem = {
  product: Product;
  quantity: number;
};

const POS = () => {
  // ====================================
  // ZUSTAND - Subscribe to store/branch
  // ====================================
  // These will re-render the component when they change
  const selectedStore = useStoreContext((state) => state.selectedStore);
  const selectedBranch = useStoreContext((state) => state.selectedBranch);
  
  // Mobile cart expansion state
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // ====================================
  // DERIVED DATA - Based on Zustand state
  // ====================================
  // Get products and categories for the current store/branch
  const products = useMemo(() => {
    return getProductsForBranch(selectedStore.id, selectedBranch.id);
  }, [selectedStore.id, selectedBranch.id]);

  const categories = useMemo(() => {
    return getCategoriesForStore(selectedStore.id);
  }, [selectedStore.id]);

  // ====================================
  // LOCAL STATE - UI-specific
  // ====================================
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Reset category filter when store changes (categories differ per store)
  useEffect(() => {
    setSelectedCategory("all");
  }, [selectedStore.id]);

  // Clear cart when branch changes (different inventory)
  useEffect(() => {
    setCart([]);
  }, [selectedBranch.id]);

  // ====================================
  // FILTERED PRODUCTS
  // ====================================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // ====================================
  // CART CALCULATIONS
  // ====================================
  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const discount = 0; // Placeholder for discount functionality
  const total = subtotal - discount;

  // ====================================
  // CART ACTIONS
  // ====================================
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const formatPrice = (price: number) => {
    return `₱${price.toFixed(2)}`;
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] gap-6 p-6">
      {/* Left Column - Product List */}
      <div className="flex flex-1 flex-col gap-5 overflow-hidden">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-emerald-600 text-white"
                  : "bg-[#262626] text-white/70 hover:bg-[#303030] hover:text-white"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToCart(product)}
                  className="group relative flex flex-col rounded-xl border border-white/10 bg-[#1a1a1a] p-3 xl:p-4 text-left transition-all hover:border-white/20 hover:bg-[#222222] active:scale-[0.98]"
                >
                  {isLowStock && (
                    <span className="absolute right-2 top-2 xl:right-3 xl:top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                      Low
                    </span>
                  )}
                  <h3 className="text-sm xl:text-base font-medium text-white leading-tight mb-auto pr-8">
                    {product.name}
                  </h3>
                  <div className="mt-3 xl:mt-4 flex flex-col xl:flex-row xl:items-baseline gap-1 xl:gap-3">
                    <span className="text-base xl:text-lg font-semibold text-white">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs xl:text-sm text-white/40">
                      Stock: {product.stock}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <Search className="size-12 mb-3 opacity-50" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Cart */}
      <div className="max-md:hidden flex w-[380px] shrink-0 flex-col rounded-xl border border-white/10 bg-[#141414]">
        {/* Cart Header */}
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Current Sale</h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-white/50 mb-1">Cart is empty</p>
              <p className="text-sm text-white/30">Add items to start a sale</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">
                        {item.product.name}
                      </h4>
                      <span className="inline-block mt-1 rounded bg-white/10 px-2 py-0.5 text-xs text-white/60">
                        Product
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-8 text-center text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <span className="text-white font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="border-t border-white/10 p-5">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-white/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>Discount</span>
              <span className="text-emerald-400">-{formatPrice(discount)}</span>
            </div>
            <div className="flex items-center justify-between text-white font-semibold text-lg pt-2">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Checkout
          </button>

          {/* Peer Stock Check */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
            <Info className="size-5 text-white/30 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white/80">Peer Stock Check</p>
              <p className="text-xs text-white/40">
                Coordinate transfers with other branches
              </p>
            </div>
            <ArrowLeftRight className="size-5 text-white/30 shrink-0" />
          </div>
        </div>
      </div>

      {/* Mobile Cart Button - Fixed at bottom */}
      <button
        type="button"
        onClick={() => setIsMobileCartOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-emerald-600 px-6 py-4 shadow-2xl transition-transform active:scale-95"
      >
        <div className="relative">
          <ShoppingCart className="size-6 text-white" />
          {cartItemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cartItemCount}
            </span>
          )}
        </div>
        <div className="text-left">
          <p className="text-xs font-medium text-white/80">Total</p>
          <p className="text-lg font-bold text-white">{formatPrice(total)}</p>
        </div>
      </button>

      {/* Mobile Cart Modal */}
      {isMobileCartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileCartOpen(false)}
          />

          {/* Modal Cart */}
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl border-t border-white/10 bg-[#141414]">
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Current Sale</h2>
              <button
                type="button"
                onClick={() => setIsMobileCartOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              >
                <X className="size-5 text-white" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <p className="text-white/50 mb-1">Cart is empty</p>
                  <p className="text-sm text-white/30">Add items to start a sale</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">
                            {item.product.name}
                          </h4>
                          <span className="inline-block mt-1 rounded bg-white/10 px-2 py-0.5 text-xs text-white/60">
                            Product
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-white/30 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-8 text-center text-white font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <span className="text-white font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-white/10 p-5">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Discount</span>
                  <span className="text-emerald-400">-{formatPrice(discount)}</span>
                </div>
                <div className="flex items-center justify-between text-white font-semibold text-lg pt-2">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={cart.length === 0}
                className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default POS;
