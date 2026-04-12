import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pt-28 pb-10 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-6 w-full max-w-2xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </section>
    </main>
  );
}
