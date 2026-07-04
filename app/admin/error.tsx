"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <div className="text-center max-w-md">
        <div className="font-serif text-6xl text-primary-deep mb-4">500</div>
        <h1 className="font-serif text-2xl mb-2">Something went wrong</h1>
        <p className="text-sm text-ink-soft mb-6">
          {error.message || "An unexpected error occurred on the admin panel."}
        </p>
        <button
          onClick={reset}
          className="rounded-button bg-primary text-white px-6 py-2 text-sm hover:bg-primary-deep transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
