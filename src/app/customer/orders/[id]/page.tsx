"use client";

import React, { useEffect, useState, use } from "react";
import { getSingleOrder } from "@/lib/api/order";
import { createMedicineReview, getMedicineReviews, type MedicineReview } from "@/lib/api/medicine";
import { useRouter } from "next/navigation";
import { Button } from "@/nextjs/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
    manufacturer: string;
    imageUrl?: string;
  };
}

interface OrderDetails {
  id: string;
  total?: number;
  totalAmount?: number;
  status: string;
  createdAt: string;
  shippingAddress?: string;
  phone?: string;
  paymentSummary?: {
    status: "PAID" | "PARTIALLY_PAID" | "PENDING";
    totalPaidAmount: number;
    paidItems: number;
    totalItems: number;
    payments: Array<{
      medicineId: string;
      medicineName: string;
      status: string;
      amount: number;
      paidAt: string | null;
      stripeSessionId: string | null;
    }>;
  };
  items: OrderItem[];
}

export default function CustomerOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [reviewsByMedicine, setReviewsByMedicine] = useState<Record<string, MedicineReview[]>>({});
  const [reviewDrafts, setReviewDrafts] = useState<
    Record<string, { open: boolean; rating: number; comment: string; submitting: boolean }>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
    }
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      const data = await getSingleOrder(id);
      console.log("Order details:", data);
      setOrder(data);

      const medicineIds = Array.from(
        new Set((data?.items || []).map((item: OrderItem) => item.medicine?.id).filter(Boolean))
      ) as string[];

      if (medicineIds.length) {
        const reviewEntries = await Promise.all(
          medicineIds.map(async (medicineId) => {
            try {
              const reviews = await getMedicineReviews(medicineId);
              return [medicineId, reviews] as const;
            } catch {
              return [medicineId, []] as const;
            }
          })
        );

        setReviewsByMedicine(Object.fromEntries(reviewEntries));
      }
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canReviewThisOrder = order?.status === "SHIPPED" || order?.status === "DELIVERED";

  const openReviewForm = (medicineId: string) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [medicineId]: {
        open: true,
        rating: prev[medicineId]?.rating ?? 5,
        comment: prev[medicineId]?.comment ?? "",
        submitting: false,
      },
    }));
  };

  const updateReviewDraft = (
    medicineId: string,
    patch: Partial<{ open: boolean; rating: number; comment: string; submitting: boolean }>
  ) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [medicineId]: {
        open: prev[medicineId]?.open ?? true,
        rating: prev[medicineId]?.rating ?? 5,
        comment: prev[medicineId]?.comment ?? "",
        submitting: prev[medicineId]?.submitting ?? false,
        ...patch,
      },
    }));
  };

  const submitReview = async (medicineId: string) => {
    if (!canReviewThisOrder) {
      toast.error("Review can be added only for shipped or delivered orders.");
      return;
    }

    const draft = reviewDrafts[medicineId] || { open: true, rating: 5, comment: "", submitting: false };
    if (!draft.comment.trim()) {
      toast.error("Please write a comment before submitting review.");
      return;
    }

    try {
      updateReviewDraft(medicineId, { submitting: true });
      await createMedicineReview({
        medicineId,
        rating: draft.rating,
        comment: draft.comment.trim(),
      });

      const refreshed = await getMedicineReviews(medicineId);
      setReviewsByMedicine((prev) => ({ ...prev, [medicineId]: refreshed }));
      updateReviewDraft(medicineId, { comment: "", rating: 5, submitting: false, open: false });
      toast.success("Review submitted successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      toast.error(message);
      updateReviewDraft(medicineId, { submitting: false });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl bg-white dark:bg-gray-900 min-h-screen">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
        <p className="text-red-500 dark:text-red-400">Order not found</p>
        <Button onClick={() => router.back()} className="mt-4 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="mb-6">
        <Button onClick={() => router.back()} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
          ← Back to Orders
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
          <h1 className="text-2xl font-bold mb-2">Order Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {order.id}</p>
        </div>

        {/* Order Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                    ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                    ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                    ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                    ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                  `}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Shipping Information</h3>
            <div className="text-sm space-y-1">
              {order.shippingAddress && (
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress}</p>
              )}
              {order.phone && (
                <p className="text-gray-600 dark:text-gray-400">Phone: {order.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-600 p-5 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Payment Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loaded from Prisma payment records</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium
              ${order.paymentSummary?.status === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
              ${order.paymentSummary?.status === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
              ${order.paymentSummary?.status === 'PENDING' || !order.paymentSummary?.status ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
            `}>
              {order.paymentSummary?.status || 'PENDING'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Paid Items</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {order.paymentSummary?.paidItems || 0}/{order.paymentSummary?.totalItems || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Paid Amount</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${Number(order.paymentSummary?.totalPaidAmount || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Order Payment Status</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {order.paymentSummary?.status || 'PENDING'}
              </p>
            </div>
          </div>

          {order.paymentSummary?.payments && order.paymentSummary.payments.length > 0 ? (
            <div className="space-y-3">
              {order.paymentSummary.payments.map((payment) => (
                <div key={payment.medicineId} className="rounded-lg border border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-900">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{payment.medicineName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Session: {payment.stripeSessionId || 'N/A'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p>Status: {payment.status}</p>
                      <p>Amount: ${Number(payment.amount || 0).toFixed(2)}</p>
                      <p>Paid at: {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'Not paid yet'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No payment records found for this order.</p>
          )}
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-4">
                    {item.medicine?.imageUrl && (
                      <img
                        src={item.medicine.imageUrl}
                        alt={item.medicine.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.medicine?.name || 'Unknown Medicine'}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.medicine?.manufacturer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ${item.price ? item.price.toFixed(2) : '0.00'} × {item.quantity || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-600 p-3 bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Reviews: {reviewsByMedicine[item.medicine.id]?.length || 0}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openReviewForm(item.medicine.id)}
                        disabled={!canReviewThisOrder}
                        className="border-gray-300 dark:border-gray-600"
                      >
                        Add Review
                      </Button>
                    </div>

                    {!canReviewThisOrder && (
                      <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                        You can review this medicine after order status is SHIPPED or DELIVERED.
                      </p>
                    )}

                    {reviewDrafts[item.medicine.id]?.open && (
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <label htmlFor={`rating-${item.medicine.id}`} className="text-sm text-gray-600 dark:text-gray-300">
                            Rating
                          </label>
                          <select
                            id={`rating-${item.medicine.id}`}
                            value={reviewDrafts[item.medicine.id]?.rating ?? 5}
                            onChange={(e) => updateReviewDraft(item.medicine.id, { rating: Number(e.target.value) })}
                            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm"
                          >
                            <option value={5}>5</option>
                            <option value={4}>4</option>
                            <option value={3}>3</option>
                            <option value={2}>2</option>
                            <option value={1}>1</option>
                          </select>
                        </div>

                        <textarea
                          value={reviewDrafts[item.medicine.id]?.comment ?? ""}
                          onChange={(e) => updateReviewDraft(item.medicine.id, { comment: e.target.value })}
                          placeholder="Write your review..."
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                          rows={3}
                        />

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => submitReview(item.medicine.id)}
                            disabled={reviewDrafts[item.medicine.id]?.submitting}
                          >
                            {reviewDrafts[item.medicine.id]?.submitting ? "Submitting..." : "Submit"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReviewDraft(item.medicine.id, { open: false })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {(reviewsByMedicine[item.medicine.id] || []).length > 0 && (
                      <div className="mt-3 space-y-2">
                        {(reviewsByMedicine[item.medicine.id] || []).slice(0, 3).map((review) => (
                          <div key={review.id} className="rounded border border-gray-200 dark:border-gray-700 p-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800 dark:text-gray-200">{review.user?.name || "Customer"}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{review.rating}/5</span>
                            </div>
                            <p className="mt-1 text-gray-600 dark:text-gray-300">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No items in this order</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Order Total:</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${Number(order.total ?? order.totalAmount ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
