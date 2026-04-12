"use client";

import DeliveryManApplicationForm from "@/components/features/auth/DeliveryManApplicationForm";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DeliveryManRegistrationPage() {
  return (
    <main className="relative flex min-h-screen items-start justify-center overflow-hidden bg-slate-100 px-4 pt-24 pb-8 dark:bg-slate-950 md:pt-28 md:pb-10">
      <Image
        src="/hero-bg.jpg"
        alt="Medical background"
        fill
        priority
        className="object-cover opacity-45 dark:opacity-25"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-100/70 via-white/72 to-emerald-100/70 backdrop-blur-[2px] dark:from-slate-950/88 dark:via-slate-900/84 dark:to-cyan-950/66" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-1 w-full max-w-3xl rounded-[1.8rem] border border-slate-200/85 bg-white/90 p-5 shadow-[0_32px_78px_-45px_rgba(15,23,42,0.66)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/78 md:mt-2 md:p-6"
      >
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/45 dark:text-emerald-300">
          <span className="text-lg">❤</span>
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">Delivery Application</h1>
        <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300">Apply to join our delivery team with verified details.</p>

        <section className="mt-4">
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200/85 bg-white/80 p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.48)] dark:border-slate-700/75 dark:bg-slate-900/52"
          >
            <DeliveryManApplicationForm />
          </motion.div>
          <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-300">
            Want normal account?{" "}
            <Link href="/signup" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
              Go to user registration
            </Link>
          </p>
        </section>
      </motion.div>
    </main>
  );
}
