"use client";
import { useEffect } from "react";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog page error:", error.message, error.digest);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="mb-4 text-2xl font-bold">Une erreur est survenue</h2>
      <p className="mb-2 text-muted">Digest: {error.digest}</p>
      <p className="mb-6 text-sm text-muted/60">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-brand px-6 py-3 font-semibold text-base"
      >
        Réessayer
      </button>
    </div>
  );
}
