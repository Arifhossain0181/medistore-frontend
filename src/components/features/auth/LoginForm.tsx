"use client";


import { useAuthStore } from "@/store/authstore";
import { useCartStore } from "@/store/cartstore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const setUserId = useCartStore((s) => s.setUserId);

  const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
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
          role: (user.role || 'CUSTOMER') as 'ADMIN' | 'SELLER' | 'CUSTOMER',
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
  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="email"
        onChange={(e) => setemail(e.target.value)}
        className="input"
        required
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setpassword(e.target.value)}
        className="input"
        required
      />
      <button className="btn-primary w-full" disabled={loading}>{loading ? "Logging in..." : "Login"} </button>
    </form>
  );
}
