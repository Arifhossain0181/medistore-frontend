"use client";

import { usePathname } from "next/navigation";
import { Footer2 } from "./footer2";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on dashboard routes
  const isDashboardRoute = pathname?.startsWith("/dashboard") || 
                          pathname?.startsWith("/customer/dashboard") ||
                          pathname?.startsWith("/seller/dashboard") ||
                          pathname?.startsWith("/admin/dashboard");
  
  if (isDashboardRoute) {
    return null;
  }
  
  return <Footer2 />;
}
