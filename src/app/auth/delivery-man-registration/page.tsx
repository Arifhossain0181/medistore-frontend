import DeliveryManApplicationForm from "@/components/features/auth/DeliveryManApplicationForm";
import Link from "next/link";

export default function DeliveryManRegistrationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-16 dark:bg-slate-950 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-900/35" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-900/35" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_50px_115px_-56px_rgba(15,23,42,0.7)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_60px_135px_-60px_rgba(15,23,42,0.74)] xl:grid-cols-[1fr_1.3fr] dark:border-slate-700 dark:bg-slate-900/70">
        <section className="border-b border-slate-200/70 bg-linear-to-b from-cyan-100/70 to-slate-100/70 p-8 transition-colors duration-300 xl:border-r xl:border-b-0 dark:border-slate-700 dark:from-cyan-950/35 dark:to-slate-900/35 md:p-10">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase dark:text-cyan-300">Medistore</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100">
            Delivery Team
            <span className="block text-cyan-600 dark:text-cyan-300">Application Portal</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Submit your profile, vehicle and area details. Admin will review your request and update status.
          </p>
        </section>

        <section className="p-8 md:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Delivery Man Registration</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Fill all required information. After submit, admin will approve or reject your application.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.45)] transition-all duration-300 hover:border-cyan-300/70 hover:shadow-[0_30px_60px_-36px_rgba(14,116,144,0.45)] dark:border-slate-700/70 dark:bg-slate-900/45 dark:hover:border-cyan-800/80">
            <DeliveryManApplicationForm />
          </div>
          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
            Want normal account?{" "}
            <Link href="/signup" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
              Go to user registration
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
