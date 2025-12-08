import { ReactNode } from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import { SidebarProvider } from "../components/sidebar-context";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <main className="flex min-h-screen flex-row bg-black w-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </main>
    </SidebarProvider>
  );
}