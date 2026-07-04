import { Skeleton } from "@/components/ui";

export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-rule bg-surface-card px-6 md:px-10 py-5 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-20" />
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-surface-card border border-rule rounded-card p-6 space-y-6">
          <div>
            <Skeleton className="h-5 w-20 rounded-pill mb-3" />
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="border-t border-rule pt-4">
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Skeleton className="h-4 w-4 mt-0.5 shrink-0" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>

          <div className="rounded-card border border-rule bg-surface p-4 space-y-2">
            <Skeleton className="h-4 w-28 rounded-pill" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="pt-2">
            <Skeleton className="h-12 w-full rounded-card" />
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
    </main>
  );
}