import RegisterForm from "@/components/features/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-16 dark:bg-slate-950 md:py-20">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-16 left-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-900/35" />
                <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-900/35" />
            </div>

            <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_50px_115px_-56px_rgba(15,23,42,0.7)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_60px_135px_-60px_rgba(15,23,42,0.74)] xl:grid-cols-[1fr_1.2fr] dark:border-slate-700 dark:bg-slate-900/70">
                <section className="border-b border-slate-200/70 bg-linear-to-b from-cyan-100/70 to-slate-100/70 p-8 transition-colors duration-300 xl:border-r xl:border-b-0 dark:border-slate-700 dark:from-cyan-950/35 dark:to-slate-900/35 md:p-10">
                    <p className="text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase dark:text-cyan-300">Medistore</p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100">
                        Build Your
                        <span className="block text-cyan-600 dark:text-cyan-300">Healthcare Account</span>
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        Register quickly and start managing orders, medicines, and delivery workflows.
                    </p>
                </section>

                <section className="p-8 md:p-10 lg:p-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create Account</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Join MediStore as Customer or Seller.</p>
                    <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-[0_20px_45px_-32px_rgba(15,23,42,0.45)] transition-all duration-300 hover:border-emerald-300/70 hover:shadow-[0_30px_60px_-36px_rgba(5,150,105,0.45)] dark:border-slate-700/70 dark:bg-slate-900/45 dark:hover:border-emerald-800/80">
                        <RegisterForm />
                    </div>
                    <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
                            Login here
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}
