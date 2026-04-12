import EditMedicineForm from "@/components/features/seller/EditMedicineForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function EditMedicinePage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-4 p-6">
                    <Skeleton className="h-8 w-52" />
                    <Skeleton className="h-44 w-full rounded-lg" />
                    <Skeleton className="h-44 w-full rounded-lg" />
                </div>
            }
        >
            <EditMedicineForm />
        </Suspense>
    );
}
