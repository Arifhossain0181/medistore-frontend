"use client";


import { authClient } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authstore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });
      
      if (res.data) {
        const user = res.data.user as typeof res.data.user & { role?: 'ADMIN' | 'SELLER' | 'CUSTOMER' };
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user.role || 'CUSTOMER') as 'ADMIN' | 'SELLER' | 'CUSTOMER',
        };
        
        setUser(userData);
        
        if (userData.role === "ADMIN") router.push("/admin/dashboard");
        else if (userData.role === "SELLER") router.push("/seller/dashboard");
        else router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
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
      <button className="btn-primary w-full" disabled={loading}>{loading ? "logging in..." : "login"} </button>
    </form>
  );
}
