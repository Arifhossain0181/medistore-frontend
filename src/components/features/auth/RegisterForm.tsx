"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:5000";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const getRedirectURL = () => new URL("/", window.location.origin).toString();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log("Form state updated:", {
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async () => {
    setLoading(true);

    try {
      // Validate form data with Zod
      const validatedData = formSchema.parse(form);

      await axios.post(
        `/api/auth/register`,
        {
          email: validatedData.email,
          name: validatedData.name,
          password: validatedData.password,
          phone: validatedData.phone,
          role: "CUSTOMER",
        },
        { withCredentials: true },
      );

      toast.success("Registration successful! Redirecting to login...");
      router.push("/auth/login");
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        toast.error(err.issues.map((e) => e.message).join(", "));
      } else {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Something went wrong";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);

    try {
      const callbackURL = getRedirectURL();
      const res = await axios.post(
        `${backendBaseUrl}/api/auth/sign-in/social`,
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

      toast.error("Google registration did not return a redirect URL.");
    } catch (err: unknown) {
      console.error("Google registration error:", err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await registerUser();
  };

  const fieldClassName =
    "w-full rounded-xl border border-slate-300/80 bg-white/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.45)] transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-600/80 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-emerald-600 dark:focus:ring-emerald-900/40";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        placeholder="Full name"
        value={form.name}
        onChange={handleChange}
        className={fieldClassName}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={handleChange}
        className={fieldClassName}
        required
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone number (optional)"
        value={form.phone}
        onChange={handleChange}
        className={fieldClassName}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
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
        {loading ? "Registering..." : "Register"}
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
        onClick={handleGoogleRegister}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300/85 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_14px_28px_-22px_rgba(15,23,42,0.6)] transition hover:border-cyan-300 hover:bg-cyan-50/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/25"
        disabled={loading || googleLoading}
      >
        <Chrome className="h-4 w-4" />
        {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
      </motion.button>

      <Link
        href="/auth/delivery-man-registration"
        className="mt-1 block w-full rounded-xl border border-emerald-300/80 bg-emerald-50 py-2.5 px-4 text-center text-sm font-semibold text-emerald-700 shadow-[0_14px_28px_-22px_rgba(5,150,105,0.6)] transition hover:bg-emerald-100 dark:border-emerald-800/80 dark:bg-emerald-900/25 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
      >
        Apply To Be A Delivery Man
      </Link>
      <p className="text-xs text-slate-500 dark:text-slate-400">Delivery application will be reviewed by admin.</p>
    </form>
  );
}
