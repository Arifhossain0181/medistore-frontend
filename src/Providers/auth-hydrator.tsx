"use client";

import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore, type User } from "@/store/authstore";

export function AuthHydrator() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!hasHydrated) return;

    // If we already have a user in the store, we can skip hydration.
    if (user) return;

    const controller = new AbortController();

    const hydrate = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          withCredentials: true,
          signal: controller.signal,
        });

        const apiUser = res.data?.user;
        if (!apiUser) return;

        const hydratedUser: User = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          role: apiUser.role ?? "CUSTOMER",
          image: apiUser.image ?? undefined,
        };

        setUser(hydratedUser);

        if (typeof window !== "undefined") {
          const pendingGoogle = sessionStorage.getItem("medistore-google-login-pending") === "1";
          if (pendingGoogle) {
            toast.success(`Logged in with Google as ${hydratedUser.name}`);
            sessionStorage.removeItem("medistore-google-login-pending");
          }
        }
      } catch (err) {
        // If not logged in (401) or network error, just leave user as null.
        if (axios.isAxiosError(err)) {
          const pendingGoogle = typeof window !== "undefined" && sessionStorage.getItem("medistore-google-login-pending") === "1";

          if (err.response?.status === 401) {
            setUser(null);
            if (pendingGoogle) {
              toast.error("Google login failed. Please try again.");
              sessionStorage.removeItem("medistore-google-login-pending");
            }
          }
        }
      }
    };

    void hydrate();

    return () => {
      controller.abort();
    };
  }, [hasHydrated, user, setUser]);

  return null;
}
