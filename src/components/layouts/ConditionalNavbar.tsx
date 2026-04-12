"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  // Hide navbar on all admin, seller, customer routes
  const isDashboardRoute = pathname?.startsWith("/dashboard") || 
    pathname?.startsWith("/customer") ||
    pathname?.startsWith("/seller") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/super-admin") ||
    pathname?.startsWith("/delivery");

  if (isDashboardRoute) {
    return null;
  }

  return <Navbar />;
}
