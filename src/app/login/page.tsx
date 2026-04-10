import LoginForm from "@/components/features/auth/LoginForm";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md border p-8 rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold mb-2 text-black text-center">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Login to MediStore</p>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
        <p className="mt-4 text-center text-sm text-gray-600">
          Dont have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
