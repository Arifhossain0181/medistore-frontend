"use client";


import { useAuthStore } from "@/store/authstore";
import { useCartStore } from "@/store/cartstore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Chrome } from "lucide-react";

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
        "/api/auth/sign-in/social",
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

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="email"
        onChange={(e) => setemail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        required
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setpassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        required
      />
      <button className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50" disabled={loading}>{loading ? "Logging in..." : "Login"} </button>
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span>or</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
        disabled={loading || googleLoading}
      >
        <Chrome className="h-4 w-4" />
        {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
      </button>
    </form>
  );
}
