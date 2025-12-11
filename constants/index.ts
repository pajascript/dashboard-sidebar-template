import type { LucideIcon } from "lucide-react";
import { ShoppingCart, Package, LayoutDashboard, Users, Settings, Receipt } from "lucide-react";

export type SidebarLink = {
  title: string;
  route: string;
  img?: string;
  icon?: LucideIcon;
};

export const sidebarLinks: SidebarLink[] = [
  {
    title: "Point of Sale",
    route: "/pos",
    icon: ShoppingCart,
  },
  {
    title: "Sales History",
    route: "/sales-history",
    icon: Receipt,
  },
  {
    title: "Inventory",
    route: "/inventory",
    icon: Package,
  },
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    route: "/employees",
    icon: Users,
  },
  {
    title: "Store Settings",
    route: "/settings",
    icon: Settings,
  },
];

