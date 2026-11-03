"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Portfolio error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md text-center">
        <AlertTriangle size={48} className="mx-auto mb-6 text-amber-400" />

        <h1 className="mb-4 text-3xl font-bold">Something went wrong</h1>

        <p className="mb-8 text-slate-400">
          We couldn&apos;t load the website right now. Please try again in a
          moment.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mx-auto flex items-center gap-3 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    </main>
  );
}
