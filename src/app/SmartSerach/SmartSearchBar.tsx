'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartstore';
import { useAuthStore } from '@/store/authstore';

type Medicine = {
  id: string;
  name: string;
  price: number;
  category: { name: string } | null;
  manufacturer?: string;
  imageUrl?: string;
  description?: string;
  viewCount?: number;
};

export default function SmartSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [medicineSuggestions, setMedicineSuggestions] = useState<string[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500); // 500ms debounce
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Debounce দিয়ে search
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  // Outside click — dropdown বন্ধ করো
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchResults = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        console.error('Search request failed:', data?.message || `status ${res.status}`);
        setResults([]);
        setKeywords([]);
        setMedicineSuggestions([]);
        setAiAdvice(null);
        setOpen(true);
        return;
      }

      if (data.success) {
        const meds = data.data.medicines.slice(0, 6);
        setResults(meds); // dropdown-এ max 6
        setKeywords(data.data.keywords || []);
        setMedicineSuggestions(data.data.medicineSuggestions || data.data.keywords || []);
        setAiAdvice(data.data.aiAdvice || data.data.aiSuggestion || null);
        setOpen(true);
      } else {
        setResults([]);
        setKeywords([]);
        setMedicineSuggestions([]);
        setAiAdvice(null);
        setOpen(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setKeywords([]);
      setMedicineSuggestions([]);
      setAiAdvice(null);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    router.push(`/shop/${id}`);
    setOpen(false);
    setQuery('');
  };

  const handleAddToCart = (med: Medicine) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    addToCart({
      id: med.id,
      name: med.name,
      price: med.price,
      manufacturer: med.manufacturer || 'Unknown',
      imageUrl: med.imageUrl,
      description: med.description,
      viewCount: med.viewCount,
    });
    toast.success(`${med.name} added to cart`);
  };

  const handleSearchAll = () => {
    const q = query.trim();
    if (!q) return;
    fetchResults(q);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">

      {/* Search Input */}
      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 focus-within:border-primary transition">
        <div className="pl-4 text-gray-400">
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          )}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearchAll();
            }
          }}
          placeholder="মাথাব্যথা, fever medicine, Napa..."
          className="flex-1 px-3 py-3 text-sm outline-none bg-transparent dark:text-gray-200"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="pr-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">

          {/* AI Advice */}
          {aiAdvice && (
            <div className="m-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">👨‍⚕️</span>
                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">ফার্মাসিস্ট পরামর্শ:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mt-1 leading-relaxed">&quot;{aiAdvice}&quot;</p>
                  {medicineSuggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {medicineSuggestions.slice(0, 4).map((name) => (
                        <span
                          key={name}
                          className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-red-400 mt-2">* ডাক্তারের পরামর্শ ছাড়া ঔষধ সেবন করবেন না।</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Keywords */}
          {keywords.length > 0 && (
            <div className="px-3 py-2 border-b dark:border-gray-700 flex gap-2 flex-wrap">
              <span className="text-xs text-gray-400">AI খুঁজেছে:</span>
              {medicineSuggestions.slice(0, 4).map((k, i) => (
                <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {k}
                </span>
              ))}
            </div>
          )}

          {/* Results */}
          {results.length > 0 ? (
            <div className="divide-y dark:divide-gray-800">
              {results.map((med) => (
                <div
                  key={med.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition text-left"
                >
                  <button onClick={() => handleSelect(med.id)} className="text-left flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{med.name}</p>
                    <p className="text-xs text-gray-500">{med.category?.name || 'Medicine'}</p>
                  </button>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">৳ {med.price}</p>
                    <button
                      onClick={() => handleAddToCart(med)}
                      className="mt-1 bg-primary text-white px-3 py-1 rounded text-xs hover:opacity-90"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}

              {/* See all */}
              <button
                onClick={handleSearchAll}
                className="w-full py-3 text-sm text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                &quot;{query}&quot; আবার search করো
              </button>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm">
              আপনার সার্চের সাথে মিলে এমন কোনো ঔষধ আমাদের স্টকে নেই।
            </div>
          )}
        </div>
      )}
    </div>
  );
}