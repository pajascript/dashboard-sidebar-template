"use client";

import { sidebarLinks } from "@/constants";
import { MenuIcon } from "lucide-react";
import ContextSwitcher from "./context-switcher";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-context";

const Header = () => {
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();

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
            <p className="text-white/50 text-xs sm:hidden">Daily Dope Vicas</p> {/* selected store and branch */}
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