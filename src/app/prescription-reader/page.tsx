'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { compressImage } from '@/utils/compressImage';

type MatchedItem = {
  detectedName: string;
  medicineId: string;
  medicineName: string;
};

type ScanAndAddResponse = {
  success: boolean;
  message?: string;
  data?: {
    detected: Array<{ name: string; dosage: string }>;
    matched: MatchedItem[];
    unmatched: string[];
    addedCount: number;
  };
};

export default function PrescriptionReaderPage() {
  const MAX_FILE_SIZE = 6 * 1024 * 1024;
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<ScanAndAddResponse['data'] | null>(null);

  useEffect(() => {
    let active = true;

    const ensureSession = async () => {
      try {
        const sessionCheck = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (active && !sessionCheck.ok) {
          router.replace('/login?redirect=/prescription-reader');
        }
      } catch {
        if (active) {
          router.replace('/login?redirect=/prescription-reader');
        }
      }
    };

    ensureSession();

    return () => {
      active = false;
    };
  }, [router]);

  const previewUrl = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setResult(null);
      setError('Image is too large. Please upload a file smaller than 6MB.');
      return;
    }
    setFile(selected);
    setError('');
    setResult(null);
    setLoadingStep('');
  };

  const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 60000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a prescription image first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setLoadingStep('image-compress');

    try {
      const sessionCheck = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!sessionCheck.ok) {
        setError('Login required. Redirecting to login page...');
        router.push('/login?redirect=/prescription-reader');
        return;
      }

      const image = await compressImage(file, 800);

      if (image.length > 12 * 1024 * 1024) {
        throw new Error('Encoded image is too large. Please use a smaller image.');
      }

      setLoadingStep('ai-scanning');

      const res = await fetchWithTimeout('/api/prescription/scan-and-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ image }),
      }, 65000);

      const raw = await res.text();
      let data: ScanAndAddResponse | null = null;

      try {
        data = JSON.parse(raw) as ScanAndAddResponse;
      } catch {
        data = null;
      }

      if (!res.ok) {
        if (res.status === 401) {
          setError('Session expired. Redirecting to login page...');
          router.push('/login?redirect=/prescription-reader');
          return;
        }
        const message = data?.message || raw || `Request failed (${res.status})`;
        throw new Error(message);
      }

      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || 'Failed to scan prescription');
      }

      setResult(data.data);
      setLoadingStep('done');
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.name === 'AbortError'
          ? 'Scan took too long. Please try a clearer/smaller image.'
          : err instanceof Error
            ? err.message
            : 'Failed to process prescription';
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">AI Prescription Reader</h1>
          <p className="mt-2 text-sm text-slate-600">
            Prescription image upload করুন, AI medicine detect করবে, আর matched medicines cart-এ add হবে।
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-slate-300 p-2 text-sm"
            />

            <button
              type="submit"
              disabled={loading || !file}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Scanning and adding...' : 'Scan Prescription & Add to Cart'}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          {loadingStep === 'image-compress' && (
            <p className="mt-3 text-sm text-gray-500">ছবি প্রস্তুত করা হচ্ছে...</p>
          )}
          {loadingStep === 'ai-scanning' && (
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium text-primary">AI prescription পড়ছে...</p>
              <p className="text-xs text-gray-400">সাধারণত ৫-১৫ সেকেন্ড লাগে</p>
            </div>
          )}

          {previewUrl && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-slate-700">Image Preview</p>
              <img src={previewUrl} alt="Prescription preview" className="max-h-80 rounded-lg border border-slate-200" />
            </div>
          )}
        </section>

        {result && (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Detected Medicines</h2>
              {result.detected.length === 0 ? (
                <p className="text-sm text-slate-600">No medicines detected.</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-700">
                  {result.detected.map((m, idx) => (
                    <li key={`${m.name}-${idx}`} className="rounded-md bg-slate-50 p-2">
                      <p className="font-medium">{m.name}</p>
                      <p className="text-slate-500">Dosage: {m.dosage}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Cart Add Result</h2>
              <p className="mb-3 text-sm text-slate-700">Added to cart: {result.addedCount}</p>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Matched</p>
                  {result.matched.length === 0 ? (
                    <p className="text-sm text-slate-500">No matched medicine found in catalog.</p>
                  ) : (
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {result.matched.map((m) => (
                        <li key={`${m.detectedName}-${m.medicineId}`}>- {m.detectedName} {'->'} {m.medicineName}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-800">Unmatched</p>
                  {result.unmatched.length === 0 ? (
                    <p className="text-sm text-slate-500">All detected medicines matched.</p>
                  ) : (
                    <ul className="mt-1 space-y-1 text-sm text-amber-700">
                      {result.unmatched.map((name, idx) => (
                        <li key={`${name}-${idx}`}>- {name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
