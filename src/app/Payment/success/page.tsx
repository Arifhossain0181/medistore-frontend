import { Suspense } from "react";
import PaymentSuccess from "../../Payment/Payment.success";

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={<div className="mx-auto mt-20 max-w-xl rounded-xl border bg-white p-8 text-center shadow-sm">Loading payment status...</div>}>
			<PaymentSuccess />
		</Suspense>
	);
}
