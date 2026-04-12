'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, Stethoscope, Clock3 } from 'lucide-react'

const values = [
  {
    title: 'Clinical Trust',
    description: 'Every listed medicine is sourced from verified channels with strict quality checks.',
    icon: ShieldCheck,
  },
  {
    title: 'Reliable Delivery',
    description: 'Fast dispatch and trackable delivery for routine and urgent healthcare needs.',
    icon: Truck,
  },
  {
    title: 'Expert Support',
    description: 'Our healthcare-focused support helps users choose and use medicines responsibly.',
    icon: Stethoscope,
  },
  {
    title: 'Always Available',
    description: 'Built to provide dependable access to wellness essentials around the clock.',
    icon: Clock3,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AboutPage() {
  const handleOpenChat = () => {
    window.dispatchEvent(new Event('medistore:open-chat'))
  }

  return (
    <main className="bg-slate-50 pt-28 pb-16 dark:bg-slate-950 md:pt-32">
      <section className="px-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-700/70 bg-linear-to-br from-slate-900 via-emerald-900 to-cyan-900 p-8 text-white shadow-[0_22px_50px_-30px_rgba(15,23,42,0.7)] md:p-14 dark:border-slate-700">
          <div className="absolute -top-14 -left-14 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-3xl"
          >
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] uppercase text-white/85">About MediStore</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Healthcare Access, Reimagined for Daily Life
            </h1>
            <p className="mt-4 text-base text-white/90 md:text-lg">
              We are building a safer and smarter medicine experience where quality, speed, and trust come first.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-white/90"
              >
                Explore Medicines
              </Link>
              <button
                type="button"
                onClick={handleOpenChat}
                className="rounded-lg border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to Support
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-6 px-4 md:grid-cols-2">
        <motion.article
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Our Mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            To make genuine medicines and reliable care guidance easily available for every household through a transparent digital platform.
          </p>
        </motion.article>

        <motion.article
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Our Vision</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            To become the most trusted clinical commerce ecosystem by combining pharmaceutical reliability with modern technology.
          </p>
        </motion.article>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">What We Stand For</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Built on practical values that keep healthcare simple, safe, and consistent.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, idx) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.5)] dark:border-slate-700 dark:bg-slate-900"
            >
              <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-emerald-100 bg-white p-8 dark:border-slate-700 dark:bg-slate-900 md:p-10"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Ready to explore our store?</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Discover quality medicines, transparent pricing, and a smoother shopping experience designed around real patient needs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Shop Now
            </Link>
            <Link
              href="/smart-search"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Smart Search
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
