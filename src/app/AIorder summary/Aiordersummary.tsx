'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authstore';

type Summary = {
  quickOverview: string;
  topSelling: string;
  inventoryWarning: string;
  growthSuggestion: string;
  generatedAt: string;
};

type Props = {
  role?: 'ADMIN' | 'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER' | 'DELIVERY_MAN';
};

export default function AIOrderSummary({ role }: Props) {
  const userRole = useAuthStore((s) => s.user?.role);
  const effectiveRole = role || userRole;
  const canView = effectiveRole === 'ADMIN' || effectiveRole === 'SUPER_ADMIN';

  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const [error, setError] = useState('');

  const buildSummaryUrl = () => {
    const configuredBase = process.env.NEXT_PUBLIC_API_URL?.trim();
    const normalizedBase = configuredBase ? configuredBase.replace(/\/$/, '') : '';
    return normalizedBase
      ? `${normalizedBase}/api/admin/order-summary?days=${days}`
      : `/api/admin/order-summary?days=${days}`;
  };

  const generate = async () => {
    if (!canView) {
      setError('এই summary শুধু admin এবং super admin দেখতে পারবে।');
      return;
    }

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const res = await fetch(buildSummaryUrl(), {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) {
        setSummary(data.data);
      } else {
        setError(data.message || 'Failed to generate summary');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    canView ? (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">AI Sales Insights</h3>
            <p className="text-xs text-gray-400">Powered by AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Days selector */}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none"
          >
            <option value={1}>আজকের</option>
            <option value={7}>৭ দিন</option>
            <option value={15}>১৫ দিন</option>
            <option value={30}>৩০ দিন</option>
          </select>

          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                বিশ্লেষণ হচ্ছে...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Summary বানাও
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="text-center py-4 text-red-400 text-sm">{error}</div>
        )}

        {!summary && !loading && !error && (
          <div className="text-center py-10 text-gray-300 dark:text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
            <p className="text-sm">Button চাপো — AI order data বিশ্লেষণ করবে</p>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24 mb-2"/>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full mb-1"/>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4"/>
              </div>
            ))}
          </div>
        )}

        {summary && (
          <div className="space-y-4">

            {/* Quick Overview */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Quick Overview</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.quickOverview}</p>
            </div>

            {/* Top Selling */}
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-100 dark:border-green-900">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">Top Selling</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.topSelling}</p>
            </div>

            {/* Inventory Warning */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Inventory Warning</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.inventoryWarning}</p>
            </div>

            {/* Growth Suggestion */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Growth Suggestion</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.growthSuggestion}</p>
            </div>

            {/* Generated at */}
            <p className="text-center text-xs text-gray-400 mt-2">
              Generated: {summary.generatedAt}
            </p>
          </div>
        )}
      </div>
    </div>
    ) : null
  );
}