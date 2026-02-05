"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on dashboard routes
  const isDashboardRoute = pathname?.startsWith("/dashboard") || 
                          pathname?.startsWith("/customer/dashboard") ||
                          pathname?.startsWith("/seller/dashboard") ||
                          pathname?.startsWith("/admin/dashboard");
  
  if (isDashboardRoute) {
    return null;
  }
  
  return <Navbar />;
}
