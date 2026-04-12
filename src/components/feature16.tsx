"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface Feature16Props {
  className?: string;
}

const categories = [
  { label: "Neurology", color: "text-sky-600 dark:text-sky-300" },
  { label: "Wellness", color: "text-emerald-600 dark:text-emerald-300" },
  { label: "Medicine", color: "text-cyan-600 dark:text-cyan-300" },
];

const articles = [
  {
    category: categories[0],
    readTime: "5 Min Read",
    title: "The Gut-Brain Connection: New Clinical Findings",
    desc: "Recent studies have illuminated the profound impact our digestive system has on mental well-being and therapeutic response patterns.",
  },
  {
    category: categories[1],
    readTime: "8 Min Read",
    title: "Circadian Rhythms: Mastering Your Sleep Cycle",
    desc: "Understanding your body clock helps improve restorative sleep quality, immunity, and long-term metabolic resilience.",
  },
  {
    category: categories[2],
    readTime: "6 Min Read",
    title: "Advancements in mRNA: The Future of Therapeutics",
    desc: "Targeted gene delivery is reshaping the treatment landscape for chronic conditions with faster and more precise interventions.",
  },
];

const Feature16 = ({ className }: Feature16Props) => {
  return (
    <section className={cn("py-20", className)}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Clinical Insights</h2>
          <p className="text-muted-foreground">
            Stay informed with the latest medical research and wellness tips.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -7 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="group flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_16px_35px_-30px_rgba(15,23,42,0.45)] transition-all duration-300 dark:border-slate-700/70 dark:bg-slate-900/65"
            >
              <div className="mb-4 flex items-center gap-3 text-xs">
                <span className={cn("font-semibold", article.category.color)}>
                  {article.category.label}
                </span>
                <span className="text-muted-foreground">| {article.readTime}</span>
              </div>

              <h3 className="mb-3 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-300">
                {article.title}
              </h3>

              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {article.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature16 };
