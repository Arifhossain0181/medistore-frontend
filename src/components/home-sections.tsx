"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, ShieldCheck, Truck, Stethoscope, Pill, Sparkles } from "lucide-react";

import { getAllCategories, getAllMedicines } from "@/lib/api/medicine";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Medicine = {
  id: string;
  name: string;
  price: number;
  manufacturer?: string;
  category?: { id: string; name: string } | string;
};

type Category = {
  id: string;
  name: string;
};

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const serviceItems = [
  { title: "24/7 Pharmacist Chat", desc: "Talk with licensed professionals.", icon: Stethoscope },
  { title: "Express Delivery", desc: "Same-day delivery in major zones.", icon: Truck },
  { title: "Authenticity Guaranteed", desc: "Verified medicine supply chain.", icon: ShieldCheck },
  { title: "Smart Refills", desc: "Never miss your regular medicine.", icon: Clock3 },
];

const faqItems = [
  {
    id: "faq-1",
    q: "How do I verify medicine authenticity?",
    a: "Every medicine listing includes supplier and batch-level traceability. You can also verify before checkout with our support team.",
  },
  {
    id: "faq-2",
    q: "Do you support prescription uploads?",
    a: "Yes. Use the prescription flow from the menu and our team will validate before dispatch for controlled medicines.",
  },
  {
    id: "faq-3",
    q: "How quickly can I get urgent medicines?",
    a: "Delivery time depends on location and stock. Express-enabled zones usually receive within a few hours.",
  },
];

export default function HomeSections() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [medData, catData] = await Promise.all([getAllMedicines(), getAllCategories()]);

        const normalizedMeds: Medicine[] = Array.isArray(medData)
          ? medData
          : Array.isArray(medData?.data)
            ? medData.data
            : [];

        const normalizedCats: Category[] = Array.isArray(catData)
          ? catData
          : Array.isArray(catData?.data)
            ? catData.data
            : [];

        setMedicines(normalizedMeds);
        setCategories(normalizedCats);
      } catch (error) {
        console.error("Failed to load home sections data", error);
      }
    };

    void load();
  }, []);

  const avgPrice = useMemo(() => {
    if (!medicines.length) return 0;
    const total = medicines.reduce((sum, med) => sum + Number(med.price || 0), 0);
    return total / medicines.length;
  }, [medicines]);

  const featuredByPrice = useMemo(() => {
    return [...medicines].sort((a, b) => Number(b.price || 0) - Number(a.price || 0)).slice(0, 3);
  }, [medicines]);

  const categoryNames = useMemo(() => categories.slice(0, 6).map((item) => item.name), [categories]);

  return (
    <>
      <section id="home-metrics" className="bg-slate-900 py-10 text-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
              <p className="text-xs text-slate-300">Active Medicines</p>
              <h3 className="mt-2 text-2xl font-bold">{medicines.length || "--"}</h3>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
              <p className="text-xs text-slate-300">Categories</p>
              <h3 className="mt-2 text-2xl font-bold">{categories.length || "--"}</h3>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
              <p className="text-xs text-slate-300">Avg. Price</p>
              <h3 className="mt-2 text-2xl font-bold">${avgPrice.toFixed(2)}</h3>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
              <p className="text-xs text-slate-300">Coverage</p>
              <h3 className="mt-2 text-2xl font-bold">Nationwide</h3>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Care Services</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Everything you need for a smoother healthcare journey.</p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {serviceItems.map((service, index) => (
              <motion.div
                key={service.title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/70"
              >
                <service.icon className="size-5 text-emerald-600 dark:text-emerald-300" />
                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{service.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Top Value Picks</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Dynamic selection from your live medicine catalog.</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Browse More
            </Link>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredByPrice.map((item, idx) => (
              <motion.div
                key={item.id}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.42, delay: idx * 0.08 }}
                className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700"
              >
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-300">
                  <Sparkles className="size-3.5" />
                  Featured
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.manufacturer || "Trusted Manufacturer"}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-300">${Number(item.price || 0).toFixed(2)}</span>
                  <Link
                    href={`/shop?search=${encodeURIComponent(item.name)}`}
                    className="text-xs font-semibold text-slate-800 underline-offset-4 hover:underline dark:text-slate-200"
                  >
                    View
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-16 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl bg-linear-to-r from-cyan-500 to-emerald-500 p-8 text-white md:p-10"
          >
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wider">
                <Pill className="size-3.5" />
                Personal Care Assistant
              </p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">Speak with a Licensed Clinician Today</h2>
              <p className="mt-3 text-sm text-white/90 md:text-base">
                Get fast, reliable guidance for medicine usage, side effects, and routine care.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-white text-slate-900 hover:bg-white/90">
                  <Link href="/chatbot">Start Consultation</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-950">
        <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-2">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Everything people ask before placing medicine orders.</p>

            <Accordion type="single" collapsible className="mt-6 w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Join the Serenity Circle</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Weekly medicine safety tips, offer alerts, and wellness reminders.</p>

            <div className="mt-5 space-y-3">
              <Input placeholder="Enter your email address" type="email" />
              <Button asChild className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                <Link href="/signup">Subscribe</Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {categoryNames.length ? (
                categoryNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-900/30 dark:text-emerald-300"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400">Loading category tags...</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
