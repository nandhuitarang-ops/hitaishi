export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-primary border-r-primary/30 border-b-transparent border-l-transparent animate-spin" />
        <p className="text-sm text-ink-soft">Loading session…</p>
      </div>
    </div>
  );
}
