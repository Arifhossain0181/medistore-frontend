import LoginForm from "@/components/features/auth/LoginForm";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-16 dark:bg-slate-950 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-900/35" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-900/35" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_52px_120px_-58px_rgba(15,23,42,0.72)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_62px_140px_-62px_rgba(15,23,42,0.78)] xl:grid-cols-[1fr_1.25fr] dark:border-slate-700 dark:bg-slate-900/70">
        <section className="border-b border-slate-200/70 bg-linear-to-b from-cyan-100/70 to-slate-100/70 p-8 transition-colors duration-300 xl:border-r xl:border-b-0 dark:border-slate-700 dark:from-cyan-950/35 dark:to-slate-900/35 md:p-10">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase dark:text-cyan-300">Medistore</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100">
            Access Your
            <span className="block text-cyan-600 dark:text-cyan-300">Secure Workspace</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Trusted login gateway for customers, sellers, admins, and delivery teams.
          </p>
        </section>

        <section className="p-8 md:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Sign In</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Enter your credentials to continue.</p>
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.45)] transition-all duration-300 hover:border-cyan-300/70 hover:shadow-[0_30px_60px_-36px_rgba(14,116,144,0.45)] dark:border-slate-700/70 dark:bg-slate-900/45 dark:hover:border-cyan-800/80">
            <Suspense fallback={<div className="text-center text-sm text-slate-500">Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
              Register here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
