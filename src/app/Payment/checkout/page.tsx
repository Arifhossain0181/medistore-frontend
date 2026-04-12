import { Suspense } from "react";
import CheckoutPage from "../../Payment/Payment.checkout";

export default function PaymentCheckoutPage() {
	return (
		<Suspense fallback={<div className="mx-auto mt-16 max-w-lg rounded-xl border bg-white p-8 text-center shadow-sm">Loading checkout...</div>}>
			<CheckoutPage />
		</Suspense>
	);
}
