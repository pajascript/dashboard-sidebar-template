"use client";

import { sidebarLinks } from "@/constants";
import { MenuIcon } from "lucide-react";
import ContextSwitcher from "./context-switcher";
import { usePathname } from "next/navigation";
import { useStoreContext, useSidebarStore } from "@/lib/stores";

const Header = () => {
  const pathname = usePathname();
  
  // Zustand - mobile sidebar toggle
  const toggleMobile = useSidebarStore((state) => state.toggleMobile);
  
  // Zustand - for displaying current context in mobile header
  const selectedStore = useStoreContext((state) => state.selectedStore);
  const selectedBranch = useStoreContext((state) => state.selectedBranch);

  const activePage =
    sidebarLinks.find((link) => {
      if (link.route === "/") {
        return pathname === "/";
      }

      return (
        pathname === link.route || pathname.startsWith(`${link.route}/`)
      );
    }) ?? { title: "Dashboard" };

  return (
    <header className="h-16 bg-black">
      <div className="h-full flex items-center justify-between px-5">
        <div className="flex items-center gap-4 max-sm:gap-2">
          <button
            type="button"
            onClick={toggleMobile}
            className="cursor-pointer p-2 rounded-md hover:bg-[#262626] transition-colors duration-300 md:hidden"
            aria-label="Toggle menu"
          >
            <MenuIcon className="text-white" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">{activePage.title}</h1>
            <p className="text-white/50 text-xs md:hidden">
              {selectedStore.label.split(" ")[0]} {selectedBranch.label}
            </p>
          </div>
        </div>
        {/* Hide context switcher on mobile - it's in sidebar instead */}
        <div className="max-md:hidden">
          <ContextSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
