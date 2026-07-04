import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0c1612] text-white flex flex-col">
      {/* Privacy-notice placeholder bar */}
      <div className="h-10 bg-white/[0.02]" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-52" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-32 rounded-btn" />
        </div>
      </header>

      {/* Main room grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
        {/* Video & participants area */}
        <section className="p-6 flex flex-col gap-4 overflow-y-auto">
          {/* Video area skeleton */}
          <div className="bg-[#16241d] rounded-card border border-white/10 aspect-video relative overflow-hidden flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />
                <div className="w-12 h-12 rounded-full border-2 border-t-primary border-r-primary/30 border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute w-6 h-6 rounded-full border border-t-white/20 border-r-transparent border-b-transparent border-l-white/20 animate-[spin_1s_infinite_linear_reverse]" />
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
          </div>

          {/* Participant tiles grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#16241d] rounded-card border border-white/10 aspect-video flex flex-col items-center justify-center gap-2 p-2"
              >
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </section>

        {/* Chat sidebar skeleton */}
        <aside className="bg-[#0a120e] border-l border-white/10 flex flex-col">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-white/10">
            <Skeleton className="h-3 w-36" />
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex flex-col ${i % 2 === 0 ? "items-start" : "items-end"}`}
              >
                <Skeleton className="h-2 w-16 mb-1" />
                <Skeleton
                  className={`h-8 rounded-card ${i % 2 === 0 ? "w-48" : "w-32"}`}
                />
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="border-t border-white/10 p-3 flex items-center gap-2">
            <Skeleton className="flex-1 h-9 rounded-input" />
            <Skeleton className="h-9 w-16 rounded-btn" />
          </div>
        </aside>
      </div>
    </main>
  );
}
