import EditMedicineForm from "@/components/features/seller/EditMedicineForm";
import { Suspense } from "react";

export default function EditMedicinePage() {
    return (
        <Suspense fallback={<div className="p-6">Loading...</div>}>
            <EditMedicineForm />
        </Suspense>
    );
}
