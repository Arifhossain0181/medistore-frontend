"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authstore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const dashboardNameByRole: Record<string, string> = {
    CUSTOMER: "Customer Dashboard",
    SELLER: "Seller Dashboard",
    ADMIN: "Admin Dashboard",
    SUPER_ADMIN: "Super Admin Dashboard",
    DELIVERY_MAN: "Delivery Man Dashboard",
  };

  const dashboardName = user?.role ? dashboardNameByRole[user.role] || "Dashboard" : "Dashboard";

  const handleLogout = async () => {
    try {
      await axios.post(`/api/auth/logout`, {}, { withCredentials: true });
    } catch {
      // Keep local logout fallback even if network request fails.
    } finally {
      localStorage.removeItem("medistore-auth");
      logout();
      toast.success("Logged out successfully");
      window.location.href = "/";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-100 dark:bg-slate-950">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.7)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_12px_35px_-28px_rgba(2,132,199,0.35)]">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="rounded-lg border border-slate-200 bg-white/75 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_14px_26px_-18px_rgba(8,145,178,0.55)] dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-cyan-800" />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{dashboardName}</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-2 py-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_14px_28px_-20px_rgba(5,150,105,0.55)] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-800"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <UserRound className="h-4 w-4" />
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.name || "Account"}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.role || "User"}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95">
              <DropdownMenuItem asChild className="transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                <Link href="/dashboard/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="transition-colors hover:bg-cyan-50 dark:hover:bg-cyan-900/30">
                <Link href="/">Go Home</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/30">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}