"use client";

import { useAuthStore } from "@/store/authstore";
import { useCartStore } from "@/store/cartstore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const setUserId = useCartStore((s) => s.setUserId);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getRedirectURL = () => {
    const redirectPath = searchParams.get("redirect") || "/";
    return new URL(redirectPath, window.location.origin).toString();
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      
      if (res.data && res.data.user) {
        const user = res.data.user;
        
        console.log(" Backend Response:", res.data);
        console.log(" User Object:", user);
        console.log(" Role from Backend:", user.role);
        
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user.role || 'CUSTOMER') as 'ADMIN' | 'SELLER' | 'CUSTOMER' | 'SUPER_ADMIN' | 'DELIVERY_MAN',
        };
        
        console.log("Final User Data:", userData);
        console.log(" User Role:", userData.role);
        
        // Clear old cached data before setting new user
        localStorage.removeItem('medistore-auth');
        
        setUser(userData);
        // Sync cart with logged in user
        setUserId(userData.id);
        
        toast.success("Login successful! Welcome back, " + userData.name);
        
        // Get redirect URL from query params or use default based on role
        const redirectTo = searchParams.get("redirect");
        
        if (redirectTo) {
          console.log("Redirecting to:", redirectTo);
          router.push(redirectTo);
        } else if (userData.role === "ADMIN") {
          router.push("/");
        } else if (userData.role === "SELLER") {
          router.push("/");
        } else if (userData.role === "SUPER_ADMIN") {
          router.push("/super-admin/dashboard");
        } else if (userData.role === "DELIVERY_MAN") {
          router.push("/delivery/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      if (typeof window !== "undefined") {
        // Mark that a Google login flow has started so we can show a toast after redirect
        sessionStorage.setItem("medistore-google-login-pending", "1");
      }

      const callbackURL = getRedirectURL();
      const res = await axios.post(
        `/api/auth/sign-in/social`,
        {
          provider: "google",
          callbackURL,
          disableRedirect: true,
        },
        { withCredentials: true },
      );

      if (res.data?.url) {
        window.location.assign(res.data.url);
        return;
      }

      toast.error("Google login did not return a redirect URL.");
    } catch (err: unknown) {
      console.error("Google login error:", err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Something went wrong";
      toast.error(errorMessage);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("medistore-google-login-pending");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const fieldClassName =
    "w-full rounded-xl border border-slate-300/80 bg-white/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.45)] transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600/80 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/40";

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
        className={fieldClassName}
        required
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        className={fieldClassName}
        required
      />

      <motion.button
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        className="mt-1 w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_30px_-20px_rgba(4,120,87,0.8)] transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login Now"}
      </motion.button>

      <div className="mt-1 flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span>Continue With</span>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300/85 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.6)] transition hover:border-cyan-300 hover:bg-cyan-50/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/25"
        disabled={loading || googleLoading}
      >
        <Chrome className="h-4 w-4" />
        {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
      </motion.button>
    </form>
  );
}
