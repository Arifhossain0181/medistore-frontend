"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authstore";
import RoleDashboard from "@/components/dashboard/role-dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    // Redirect only after persisted auth state is restored
    if (!user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [hasHydrated, user, router]);

  // Show nothing until hydration is complete
  if (!hasHydrated) {
    return null;
  }

  // Show nothing when redirecting
  if (!user) {
    return null;
  }

  return <RoleDashboard />;
}
