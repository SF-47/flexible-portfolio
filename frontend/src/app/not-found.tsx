import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-md text-center">
        <p className="mb-4 text-lg font-semibold text-amber-400">404</p>

        <h1 className="mb-4 text-3xl font-bold">Page Not Found</h1>

        <p className="mb-8 text-slate-400">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
