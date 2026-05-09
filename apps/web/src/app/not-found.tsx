import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col items-center justify-center px-6">
      <p className="text-xs text-[#52525b] uppercase tracking-widest mb-4">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight mb-3">
        Page not found
      </h1>
      <p className="text-sm text-[#71717a] mb-8 text-center max-w-sm">
        This page doesn't exist. If you're looking for a report, check the URL.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
      >
        Back to home
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </main>
  );
}
