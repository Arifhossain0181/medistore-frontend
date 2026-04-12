"use client";

import { useEffect, useMemo, useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
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

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const focus = (searchParams.get("focus") || "").toLowerCase();
  const isDeliveryFocus = ["delivery", "fast-delivery", "fast"].includes(focus);
  const isTrustedFocus = ["trusted", "trusted-network", "network"].includes(focus);
  const detailMode = isDeliveryFocus ? "delivery" : isTrustedFocus ? "trusted" : "all";
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

  useEffect(() => {
    if (detailMode === "delivery") {
      document.getElementById("fast-delivery")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (detailMode === "trusted") {
      document.getElementById("trusted-network")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [detailMode]);

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

  const heroBackgroundImage = "/Gemini_Generated_Image_f239scf239scf239.png";
  const deliveryHeroImage = heroBackgroundImage;
  const deliveryDetailImage = "/Gemini_Generated_Image_7bm51i7bm51i7bm5.png";
  const trustedHeroImage = heroBackgroundImage;
  const trustedDetailImage = "/Gemini_Generated_Image_u054swu054swu054.png";

  const focusHeroImage = isTrustedFocus ? trustedHeroImage : deliveryHeroImage;

  const focusHeroAlt = isTrustedFocus
    ? "Trusted medicine network preview"
    : "Delivery monitoring preview";

  const heroBorder = isTrustedFocus
    ? "border-emerald-200/60 dark:border-emerald-800/70"
    : "border-cyan-200/60 dark:border-cyan-800/70";

  return (
    <main className="bg-slate-50 px-4 pt-32 pb-16 dark:bg-slate-950 md:pt-36">
      <section className="mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5 }}
          className={`rounded-3xl border p-8 text-white shadow-[0_22px_50px_-30px_rgba(15,23,42,0.6)] ${heroBorder} md:p-12`}
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(8,47,73,0.88), rgba(6,95,70,0.82), rgba(15,23,42,0.78)), url(${heroBackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-white/90">Our Services</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Faster Delivery, Trusted Medicines</h1>
          <p className="mt-4 max-w-3xl text-white/90">
            We combine authenticated medicine sources with efficient delivery operations so your essentials arrive quickly and safely.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-2 backdrop-blur-sm">
            <Image
              src={focusHeroImage}
              alt={focusHeroAlt}
              width={1200}
              height={720}
              priority
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-5 max-w-7xl">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/services?focus=delivery#fast-delivery"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isDeliveryFocus
                ? "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            Fast Delivery
          </Link>
          <Link
            href="/services?focus=trusted#trusted-network"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isTrustedFocus
                ? "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            Trusted Network
          </Link>
          <Link
            href="/services"
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              detailMode === "all"
                ? "border-violet-300 bg-violet-100 text-violet-800 dark:border-violet-700 dark:bg-violet-900/40 dark:text-violet-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            Show All
          </Link>
        </div>
      </section>

      {isDeliveryFocus ? (
        <section className="mx-auto mt-6 max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.55, delay: 0.06 }}
            className="relative overflow-hidden rounded-3xl border border-cyan-200/60 bg-white p-6 shadow-[0_25px_60px_-35px_rgba(14,116,144,0.45)] dark:border-cyan-900/60 dark:bg-slate-900 md:p-8"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -left-12 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-600/15" />
              <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-700/15" />
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="inline-flex rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-700 uppercase dark:border-cyan-800 dark:bg-cyan-900/35 dark:text-cyan-300">
                  Delivery Focus Mode
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
                  Real-Time Cold-Chain Delivery Monitoring
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Track medicine movement with route visibility, estimated arrival, and quality-safe transport updates from our live delivery operation data.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">ETA Window</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">5-30 Min</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Cold Chain</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">2-8°C Safe</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Live Success</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">92% On-Time</p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-cyan-200/70 bg-slate-900 p-2 shadow-inner dark:border-cyan-800/60">
                <Image
                  src={deliveryDetailImage}
                  alt="Faster delivery route monitoring"
                  width={900}
                  height={620}
                  className="h-full min-h-80 w-full rounded-xl object-cover"
                />

                <div className="pointer-events-none absolute top-5 left-5 rounded-full border border-cyan-300/35 bg-cyan-500/20 px-3 py-1 text-[11px] font-semibold tracking-wide text-cyan-100 uppercase backdrop-blur">
                  Delivering in 5 mins
                </div>

                <div className="pointer-events-none absolute right-5 bottom-5 grid grid-cols-3 gap-2 text-[11px]">
                  <div className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1.5 text-cyan-100 backdrop-blur">
                    <p className="text-cyan-100/70">ETA</p>
                    <p className="font-semibold">10:30 AM</p>
                  </div>
                  <div className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1.5 text-cyan-100 backdrop-blur">
                    <p className="text-cyan-100/70">Temp</p>
                    <p className="font-semibold">4°C</p>
                  </div>
                  <div className="rounded-md border border-cyan-300/25 bg-slate-900/70 px-2 py-1.5 text-cyan-100 backdrop-blur">
                    <p className="text-cyan-100/70">Health</p>
                    <p className="font-semibold">92%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      ) : null}

      {isTrustedFocus ? (
        <section className="mx-auto mt-6 max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.55, delay: 0.06 }}
            className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-white p-6 shadow-[0_25px_60px_-35px_rgba(5,150,105,0.45)] dark:border-emerald-900/60 dark:bg-slate-900 md:p-8"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -left-12 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-700/15" />
              <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-700/15" />
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:border-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-300">
                  Trusted Focus Mode
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
                  Verified Supplier Network and Quality Signals
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  We validate suppliers, monitor customer sentiment, and maintain transparent medicine sourcing so every order is trustworthy.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Trusted Suppliers</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{trustedSuppliers}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Customer Reviews</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{totalReviews}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Service Categories</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{categories.length}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-2 dark:border-emerald-800/60 dark:bg-emerald-900/10">
                <Image
                  src={trustedDetailImage}
                  alt="Trusted pharmacy network"
                  width={900}
                  height={620}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>
        </section>
      ) : null}

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
        {(detailMode === "all" || detailMode === "delivery") ? (
          <motion.article
            id="fast-delivery"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className={`rounded-2xl border bg-white p-6 dark:bg-slate-900 ${
              detailMode === "delivery"
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
        ) : null}

        {(detailMode === "all" || detailMode === "trusted") ? (
          <motion.article
            id="trusted-network"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className={`rounded-2xl border bg-white p-6 dark:bg-slate-900 ${
              detailMode === "trusted"
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
        ) : null}
      </section>

      <section className="mx-auto mt-10 max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900 md:p-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Need Medicines Right Now?</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Explore the live medicine catalog and order with confidence from our verified network.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="rounded-lg bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Checkout Support
          </Link>
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

export default function ServicesPage() {
  return (
    <Suspense fallback={<main className="bg-slate-50 px-4 pt-32 pb-16 dark:bg-slate-950 md:pt-36"><section className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Loading services...</section></main>}>
      <ServicesPageContent />
    </Suspense>
  );
}
