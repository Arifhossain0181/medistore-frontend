"use client";

import { usePathname } from "next/navigation";
import { Footer2 } from "./footer2";

export function ConditionalFooter() {
  const pathname = usePathname();
  // Hide footer on all admin, seller, customer routes
  const isDashboardRoute = pathname?.startsWith("/dashboard") || 
    pathname?.startsWith("/customer") ||
    pathname?.startsWith("/seller") ||
    pathname?.startsWith("/admin");

  if (isDashboardRoute) {
    return null;
  }

  return <Footer2 />;
}
