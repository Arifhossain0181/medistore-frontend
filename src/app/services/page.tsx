"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Timer, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { getAllCategories, getAllMedicines, getMedicineReviews } from "@/lib/api/medicine";

type Medicine = {
  id: string;
  name: string;
  stock?: number;
  manufacturer?: string;
  price?: number;
};

type Category = {
  id: string;
  name: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [medRes, catRes] = await Promise.all([getAllMedicines(), getAllCategories()]);

        const meds: Medicine[] = Array.isArray(medRes)
          ? medRes
          : Array.isArray(medRes?.data)
            ? medRes.data
            : [];

        const cats: Category[] = Array.isArray(catRes)
          ? catRes
          : Array.isArray(catRes?.data)
            ? catRes.data
            : [];

        setMedicines(meds);
        setCategories(cats);

        const topForReviews = meds.slice(0, 12);
        const reviewBatches = await Promise.all(
          topForReviews.map(async (medicine) => {
            try {
              const reviews = await getMedicineReviews(medicine.id);
              return reviews.length;
            } catch {
              return 0;
            }
          }),
        );

        setTotalReviews(reviewBatches.reduce((sum, count) => sum + count, 0));
      } catch (error) {
        console.error("Failed to load services metrics", error);
      }
    };

    void loadData();
  }, []);

  const inStock = useMemo(() => medicines.filter((item) => (item.stock || 0) > 0).length, [medicines]);
  const trustedSuppliers = useMemo(() => {
    const unique = new Set(medicines.map((item) => item.manufacturer).filter(Boolean));
    return unique.size;
  }, [medicines]);

  const avgPrice = useMemo(() => {
    if (!medicines.length) return 0;
    const total = medicines.reduce((sum, item) => sum + Number(item.price || 0), 0);
    return total / medicines.length;
  }, [medicines]);

  useEffect(() => {
    if (!focus) return;

    const sectionId = focus === "delivery" ? "fast-delivery" : focus === "trusted" ? "trusted-network" : null;
    if (!sectionId) return;

    const timer = setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [focus]);

  return (
    <main className="bg-slate-50 px-4 pt-32 pb-16 dark:bg-slate-950 md:pt-36">
      <section className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-emerald-200/60 bg-linear-to-r from-emerald-500 to-cyan-500 p-8 text-white shadow-[0_22px_50px_-30px_rgba(15,23,42,0.6)] dark:border-slate-700 md:p-12"
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-white/90">Our Services</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Faster Delivery, Trusted Medicines</h1>
          <p className="mt-4 max-w-3xl text-white/90">
            We combine authenticated medicine sources with efficient delivery operations so your essentials arrive quickly and safely.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300"><Truck className="h-4 w-4" /> Fast Delivery Coverage</div>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{inStock}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">In-stock medicines ready to dispatch</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300"><ShieldCheck className="h-4 w-4" /> Trusted Suppliers</div>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{trustedSuppliers}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Verified medicine manufacturers</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300"><Users className="h-4 w-4" /> Customer Reviews</div>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{totalReviews}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Reviews pulled from database</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300"><Timer className="h-4 w-4" /> Service Scope</div>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{categories.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Medicine categories we actively serve</p>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-2">
        <motion.article
          id="fast-delivery"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className={`rounded-2xl border bg-white p-6 dark:bg-slate-900 ${
            focus === "delivery"
              ? "border-emerald-400 ring-2 ring-emerald-300/70 dark:border-emerald-500 dark:ring-emerald-700/40"
              : "border-slate-200 dark:border-slate-700"
          }`}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Less-Time Delivery Promise</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Our logistics pipeline prioritizes in-stock medicines and optimized dispatch routes. The system continuously updates stock visibility from the database to reduce fulfillment delay.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Current average catalog pricing insight: <span className="font-semibold text-emerald-700 dark:text-emerald-300">${avgPrice.toFixed(2)}</span>
          </p>
        </motion.article>

        <motion.article
          id="trusted-network"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className={`rounded-2xl border bg-white p-6 dark:bg-slate-900 ${
            focus === "trusted"
              ? "border-emerald-400 ring-2 ring-emerald-300/70 dark:border-emerald-500 dark:ring-emerald-700/40"
              : "border-slate-200 dark:border-slate-700"
          }`}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Trusted People, Trusted Process</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Medicines are listed from validated manufacturers and monitored with customer review signals. This helps maintain quality confidence and service transparency.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from(new Set(medicines.map((item) => item.manufacturer).filter(Boolean))).slice(0, 8).map((manufacturer) => (
              <span
                key={manufacturer}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                {manufacturer}
              </span>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="mx-auto mt-10 max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900 md:p-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Need Medicines Right Now?</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Explore the live medicine catalog and order with confidence from our verified network.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Explore Medicines
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("medistore:open-chat"))}
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Talk to Support
          </button>
        </div>
      </section>
    </main>
  );
}
