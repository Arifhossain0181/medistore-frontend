"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/api/auth";

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "CUSTOMER"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await authClient.signUp.email({
                email: form.email,
                name: form.name,
                password: form.password,
            });
            router.push("/auth/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500">{error}</p>}
            
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