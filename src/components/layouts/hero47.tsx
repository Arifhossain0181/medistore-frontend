"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const partners = ["PHARMACO", "BIO-TECH", "CLINIC-PRO", "HEALTH-CORP", "MED-SOLVE"];

interface Hero47Props {
  className?: string;
}

const Hero47 = ({ className }: Hero47Props) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("relative min-h-[68vh] overflow-hidden md:min-h-[70vh]", className)}
    >
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="/hero-bg.jpg"
          alt="MediStore Hero"
          fill
          priority
          className="object-cover object-right brightness-[1.02] contrast-[1.07] saturate-[1.1] dark:brightness-[0.72] dark:contrast-[1.06] dark:saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white/88 via-white/44 to-white/8 dark:from-slate-950 dark:via-slate-950/72 dark:to-slate-950/26" />
        <div className="absolute inset-0 bg-linear-to-t from-white/52 via-transparent to-white/34 dark:from-slate-950/78 dark:to-slate-950/48" />
      </motion.div>

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-emerald-500/30 dark:bg-emerald-400/30"
          style={{ left: `${18 + i * 16}%`, top: `${24 + i * 10}%` }}
          animate={{
            y: [-16, 22, -16],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 3.8 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.45,
          }}
        />
      ))}

      <motion.div
        className="container relative z-10 mx-auto px-6 pt-28 pb-14 md:pt-32"
        style={{ y: contentY }}
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-medium tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
              Redefining Clinical Excellence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mb-6 text-5xl leading-[1.08] font-bold text-slate-900 md:text-6xl lg:text-7xl dark:text-white"
          >
            Your Trusted Partner in
            <span className="block bg-linear-to-r from-sky-700 via-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-sky-300 dark:via-emerald-300 dark:to-cyan-300">
              Ethereal Healthcare
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mb-9 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300"
          >
            Experience the next generation of pharmaceutical care. Transparent, efficient, and designed with your comfort in mind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="group bg-emerald-600 text-white hover:bg-emerald-700">
              <Link href="/shop">
                Shop Pharmaceuticals
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-300 bg-white/60 text-slate-800 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <Link href="/about">
                <Play size={16} />
                Learn More
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 border-t border-slate-300/60 pt-8 dark:border-slate-700/60"
        >
          <p className="mb-5 text-center text-xs tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400">
            Collaborated with Global Leaders
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-14">
            {partners.map((partner, i) => (
              <motion.span
                key={partner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.09 }}
                className="cursor-default text-sm font-semibold tracking-[0.2em] text-slate-500/80 transition-colors hover:text-emerald-600 dark:text-slate-300/75 dark:hover:text-emerald-300"
              >
                {partner}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute right-0 bottom-6 left-0 z-20 flex justify-center"
        animate={{ y: [0, 8, 0], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link
          href="#home-metrics"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/65 px-4 py-2 text-xs font-semibold tracking-wide text-slate-700 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
        >
          Explore More <ChevronDown size={14} />
        </Link>
      </motion.div>
    </section>
  );
};

export { Hero47 };
