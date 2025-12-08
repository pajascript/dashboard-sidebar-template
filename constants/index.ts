import type { LucideIcon } from "lucide-react";
import { ShoppingCart } from "lucide-react";

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
    title: "Inventory",
    route: "/inventory",
    icon: ShoppingCart,
  },
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: ShoppingCart,
  },
  {
    title: "Employees",
    route: "/employees",
    icon: ShoppingCart,
  },
  {
    title: "Store Settings",
    route: "/settings",
    icon: ShoppingCart,
  },
];

