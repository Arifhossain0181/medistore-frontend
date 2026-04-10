"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getDeliveryManApplications,
  reviewDeliveryManApplication,
  type DeliveryManApplication,
} from "@/lib/api/medicine";

export default function DeliveryApplicationsPage() {
  const [applications, setApplications] = useState<DeliveryManApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      const data = await getDeliveryManApplications();
      setApplications(data || []);
    } catch (error) {
      console.error("Failed to load applications:", error);
      toast.error("Failed to load delivery man applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const pendingCount = useMemo(
    () => applications.filter((application) => application.status === "PENDING").length,
    [applications],
  );

  const handleReview = async (id: string, action: "APPROVE" | "REJECT") => {
    setUpdatingId(id);
    try {
      const rejectionReason =
        action === "REJECT" ? window.prompt("Rejection reason (optional):") || undefined : undefined;
      await reviewDeliveryManApplication(id, action, rejectionReason);
      toast.success(action === "APPROVE" ? "Delivery man approved" : "Application rejected");
      await loadApplications();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        (error as Error).message ||
        "Failed to review application";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Man Applications</h1>
        <p className="text-sm text-gray-600 mt-1">Review and approve or reject delivery man registrations.</p>
      </div>

      <div className="rounded-lg border bg-white p-4 text-sm">
        <p className="font-semibold">Total Applications: {applications.length}</p>
        <p className="text-amber-700 font-semibold">Pending Applications: {pendingCount}</p>
      </div>

      {loading ? (
        <div className="p-6">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-gray-500">No delivery man applications found.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-lg">{application.user.name}</p>
                  <p className="text-sm text-gray-600">{application.user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Applied: {new Date(application.createdAt).toLocaleString()}</p>
                </div>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium">{application.status}</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Phone:</span> {application.phone}</p>
                <p><span className="font-medium">NID:</span> {application.nidNumber}</p>
                <p><span className="font-medium">License:</span> {application.licenseNumber}</p>
                <p><span className="font-medium">Vehicle:</span> {application.vehicleType}</p>
                <p><span className="font-medium">Registration No:</span> {application.vehicleRegistrationNo}</p>
                <p><span className="font-medium">Delivery Area:</span> {application.deliveryArea}</p>
                <p className="md:col-span-2"><span className="font-medium">Address:</span> {application.currentAddress}</p>
                <p><span className="font-medium">Emergency Name:</span> {application.emergencyContactName}</p>
                <p><span className="font-medium">Emergency Phone:</span> {application.emergencyContactPhone}</p>
              </div>

              {application.status === "REJECTED" && application.rejectionReason ? (
                <p className="mt-3 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                  Rejection Reason: {application.rejectionReason}
                </p>
              ) : null}

              {application.status === "PENDING" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleReview(application.id, "APPROVE")}
                    disabled={updatingId === application.id}
                    className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview(application.id, "REJECT")}
                    disabled={updatingId === application.id}
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
