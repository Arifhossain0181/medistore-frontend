"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

export default function RegisterForm() {
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await registerUser();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        required
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number (Optional)"
        value={form.phone}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        required
      />
      <button type="submit" className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 mt-2" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
      <Link
        href="/auth/delivery-man-registration"
        className="block w-full rounded-md bg-emerald-600 py-2 px-4 text-center text-white hover:bg-emerald-700"
      >
        Apply To Be A Delivery Man
      </Link>
      <p className="text-xs text-gray-500">Delivery Man application এ admin approve/reject flow থাকবে.</p>
    </form>
  );
}
