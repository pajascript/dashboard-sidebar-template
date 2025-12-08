export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
};

export type Category = {
  id: string;
  label: string;
};

export const LOW_STOCK_THRESHOLD = 10;

// ============================================
// DAILY DOPE VAPE SHOP - Categories & Products
// ============================================

export const vapeshopCategories: Category[] = [
  { id: "all", label: "All" },
  { id: "e-liquids", label: "E-Liquids" },
  { id: "coils", label: "Coils" },
  { id: "devices", label: "Devices" },
];

// Products per branch (each branch has its own inventory/stock)
export const vapeshopProducts: Record<string, Product[]> = {
  // Vicas Branch
  vicas: [
    { id: "blue-razz-60ml", name: "Blue Razz E-Liquid 60ml", price: 24.99, stock: 45, category: "e-liquids" },
    { id: "strawberry-dream-60ml", name: "Strawberry Dream 60ml", price: 24.99, stock: 32, category: "e-liquids" },
    { id: "mesh-coil-015", name: "Mesh Coil 0.15Ω (5-pack)", price: 19.99, stock: 67, category: "coils" },
  ],
  // Deparo Branch
  deparo: [
    { id: "menthol-ice-30ml", name: "Menthol Ice 30ml", price: 14.99, stock: 28, category: "e-liquids" },
    { id: "tropical-punch-60ml", name: "Tropical Punch 60ml", price: 24.99, stock: 19, category: "e-liquids" },
    { id: "ceramic-coil-04", name: "Ceramic Coil 0.4Ω (5-pack)", price: 22.99, stock: 8, category: "coils" },
  ],
  // North Mall Branch
  "north-mall": [
    { id: "grape-burst-60ml", name: "Grape Burst 60ml", price: 24.99, stock: 52, category: "e-liquids" },
    { id: "standard-coil-12", name: "Standard Coil 1.2Ω (5-pack)", price: 16.99, stock: 41, category: "coils" },
    { id: "pod-system-starter", name: "Pod System Starter Kit", price: 49.99, stock: 15, category: "devices" },
  ],
};

// ============================================
// MOTO MASTERS SHOP - Categories & Products
// ============================================

export const motoshopCategories: Category[] = [
  { id: "all", label: "All" },
  { id: "lubricants", label: "Lubricants" },
  { id: "brake-parts", label: "Brake Parts" },
  { id: "filters", label: "Filters" },
];

// Products per branch
export const motoshopProducts: Record<string, Product[]> = {
  // Westside Branch
  westside: [
    { id: "engine-oil-10w40", name: "Engine Oil 10W-40 (1L)", price: 12.99, stock: 120, category: "lubricants" },
    { id: "brake-pads-front", name: "Front Brake Pads", price: 34.99, stock: 25, category: "brake-parts" },
    { id: "oil-filter-std", name: "Standard Oil Filter", price: 8.99, stock: 65, category: "filters" },
  ],
  // Uptown Branch
  uptown: [
    { id: "chain-lube", name: "Chain Lubricant Spray", price: 9.99, stock: 48, category: "lubricants" },
    { id: "brake-disc-rear", name: "Rear Brake Disc", price: 54.99, stock: 12, category: "brake-parts" },
    { id: "air-filter-perf", name: "Performance Air Filter", price: 18.99, stock: 7, category: "filters" },
  ],
};

// ============================================
// Helper function to get products & categories by store/branch
// ============================================

export function getProductsForBranch(storeId: string, branchId: string): Product[] {
  if (storeId === "daily-dope") {
    return vapeshopProducts[branchId] || [];
  }
  if (storeId === "moto-masters") {
    return motoshopProducts[branchId] || [];
  }
  return [];
}

export function getCategoriesForStore(storeId: string): Category[] {
  if (storeId === "daily-dope") {
    return vapeshopCategories;
  }
  if (storeId === "moto-masters") {
    return motoshopCategories;
  }
  return [{ id: "all", label: "All" }];
}
