"use client";

import { useAuditHistory } from "@/hooks/useAuditHistory";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export default function HistoryBanner() {
  const { history } = useAuditHistory();
  const [dismissed, setDismissed] = useState(false);

  if (!history.length || dismissed) return null;

  const latest = history[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-4 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <Clock className="w-4 h-4 text-[#52525b] shrink-0" />
        <div>
          <p className="text-xs text-[#71717a]">
            Previous audit{" "}
            {latest.companyName && (
              <span className="text-[#a1a1aa]">— {latest.companyName}</span>
            )}
          </p>
          <p className="text-xs text-[#52525b] mt-0.5">
            {formatCurrency(latest.totalMonthlySpend)}/mo spend ·{" "}
            <span className="text-emerald-400">
              {formatCurrency(latest.estimatedSavings)} savings found
            </span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/results/${latest.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
        >
          View report
          <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#52525b] hover:text-[#71717a] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
