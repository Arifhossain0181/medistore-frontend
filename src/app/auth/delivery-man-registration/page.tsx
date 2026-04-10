import DeliveryManApplicationForm from "@/components/features/auth/DeliveryManApplicationForm";
import Link from "next/link";

export default function DeliveryManRegistrationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl rounded-lg border bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">Delivery Man Registration</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Fill all required information. After submit, admin will approve or reject your delivery man application.
        </p>
        <DeliveryManApplicationForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Want normal account?{" "}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:underline">
            Go to user registration
          </Link>
        </p>
      </div>
    </div>
  );
}
