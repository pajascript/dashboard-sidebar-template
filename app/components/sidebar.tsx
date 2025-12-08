"use client";

import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-context";
import ContextSwitcher from "./context-switcher";

const Sidebar = () => {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div>
        {/* Header */}
        <div className={cn(
          "flex items-center min-w-0 gap-8 border-b border-[#303030] pb-6 justify-between overflow-hidden",
          isMobile ? "px-5" : (isSidebarExpanded ? "px-5" : "px-6")
        )}>
          <h1 className={cn(
            "text-xl font-medium ml-2 text-[#FAFAFA] whitespace-nowrap overflow-hidden",
            !isMobile && !isSidebarExpanded && "hidden"
          )}>
            ERP Dashboard
          </h1>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="px-2.5 py-2 rounded-md text-gray-300 hover:text-white hover:bg-[#262626] cursor-pointer transition-colors duration-300"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              className="px-2.5 py-2 rounded-md text-gray-300 hover:text-white hover:bg-[#262626] cursor-pointer transition-colors duration-300"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft className={cn(
                "size-4 transition-transform duration-300 ease-in-out",
                !isSidebarExpanded ? "rotate-180" : "rotate-0"
              )} />
            </button>
          )}
        </div>

        {/* Context Switcher - only on mobile */}
        {isMobile && (
          <div className="px-5 pt-5 pb-3 border-b border-[#303030]">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-3">
              Current Context
            </p>
            <ContextSwitcher />
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-5 flex flex-col px-5">
          {sidebarLinks.map((link) => {
            const isSelected = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "flex flex-row items-center w-full gap-3 rounded-xl p-3 text-[#A1A1A1] hover:bg-[#1f1f1f] hover:shadow-xs transition-all duration-300 hover:text-white",
                    isSelected && "bg-[#262626] shadow-xs text-white",
                    !isMobile && !isSidebarExpanded && "justify-center"
                  )}
                >
                  <div className="relative size-5">
                    {link.icon && <link.icon className="size-5" />}
                  </div>
                  <p className={cn(
                    "font-medium whitespace-nowrap overflow-hidden",
                    isSelected && "text-white",
                    !isMobile && !isSidebarExpanded && "hidden"
                  )}>
                    {link.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "sticky left-0 top-0 flex h-dvh flex-col justify-between border-r border-[#303030] bg-[#171717] pb-5 pt-6 max-md:hidden transition-[width] ease-in-out duration-300",
          isSidebarExpanded ? "w-[265px]" : "w-21"
        )}
      >
        <SidebarContent isMobile={false} />
      </aside>

      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-dvh w-[280px] flex-col justify-between border-r border-[#303030] bg-[#171717] pb-5 pt-6 md:hidden transition-transform duration-300 ease-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent isMobile={true} />
      </aside>
    </>
  );
};

export default Sidebar;