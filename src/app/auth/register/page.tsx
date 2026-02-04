import RegisterForm from "@/components/features/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md border p-8 rounded-lg shadow-lg bg-white">
                <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
                <p className="text-center text-gray-600 mb-6">Join MediStore as Customer or Seller</p>
                <RegisterForm />
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
