"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";

export default function RegisterForm() {
    const formSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email("Invalid email address"),
        phone: z.string().optional(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["CUSTOMER", "SELLER"])
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "CUSTOMER" as "CUSTOMER" | "SELLER"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
            
        });
        console.log("Form state updated:", {
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Validate form data with Zod
            const validatedData = formSchema.parse(form);
            
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
                {
                    email: validatedData.email,
                    name: validatedData.name,
                    password: validatedData.password,
                    phone: validatedData.phone,
                    role: validatedData.role
                },
                { withCredentials: true }
            );
            
            toast.success("Registration successful! Redirecting to login...");
            router.push("/auth/login");
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                // Handle Zod validation errors
                toast.error(err.issues.map(e => e.message).join(", "));
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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
                name="name" 
                placeholder="Name" 
                value={form.name}
                onChange={handleChange} 
                className="input" 
                required 
            />
            <input 
                name="email" 
                type="email"
                placeholder="Email" 
                value={form.email}
                onChange={handleChange} 
                className="input" 
                required 
            />
            <input 
                name="phone" 
                type="tel"
                placeholder="Phone Number (Optional)" 
                value={form.phone}
                onChange={handleChange} 
                className="input" 
            />
            <input 
                name="password" 
                type="password"
                placeholder="Password" 
                value={form.password}
                onChange={handleChange} 
                className="input" 
                required 
            />
            <select 
                name="role" 
                value={form.role}
                onChange={handleChange} 
                className="input" 
                required
            >
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
            </select>
            <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>
    );
}