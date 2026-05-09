"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type AuditSubscription } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

type Props = {
  subscriptions: AuditSubscription[];
  totalMonthlySpend: number;
  estimatedSavings: number;
};

export default function ComparisonToggle({
  subscriptions,
  totalMonthlySpend,
  estimatedSavings,
}: Props) {
  const [view, setView] = useState<"current" | "optimized">("current");

  const optimizedSpend = totalMonthlySpend - estimatedSavings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-6 mb-8"
    >
      {/* Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs text-[#52525b] uppercase tracking-widest">
          Plan comparison
        </h2>
        <div className="flex items-center bg-[#09090b] border border-[#27272a] rounded-lg p-0.5">
          {(["current", "optimized"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`relative px-3 py-1.5 text-xs rounded-md transition-all ${
                view === v
                  ? "text-[#fafafa]"
                  : "text-[#52525b] hover:text-[#a1a1aa]"
              }`}
            >
              {view === v && (
                <motion.div
                  layoutId="toggle-bg"
                  className="absolute inset-0 bg-[#27272a] rounded-md"
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className="relative capitalize">{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-end justify-between mb-5 pb-5 border-b border-[#27272a]">
        <div>
          <p className="text-xs text-[#52525b] mb-1">Total monthly</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`text-3xl font-semibold font-mono ${
                view === "optimized" ? "text-emerald-400" : "text-[#fafafa]"
              }`}
            >
              {view === "current"
                ? formatCurrency(totalMonthlySpend)
                : formatCurrency(optimizedSpend)}
            </motion.p>
          </AnimatePresence>
        </div>
        {view === "optimized" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span className="text-xs font-medium font-mono">
              Save {formatCurrency(estimatedSavings)}/mo
            </span>
          </motion.div>
        )}
      </div>

      {/* Per tool breakdown */}
      <div className="space-y-3">
        {subscriptions.map((sub) => {
          const optimizedPrice = Math.max(
            sub.monthlyPrice - sub.potentialSaving,
            0
          );
          const displayPrice =
            view === "current" ? sub.monthlyPrice : optimizedPrice;

          return (
            <div key={sub.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    view === "optimized" && sub.potentialSaving > 0
                      ? "bg-emerald-400"
                      : "bg-[#3f3f46]"
                  }`}
                />
                <span className="text-sm text-[#a1a1aa]">{sub.toolName}</span>
                <span className="text-xs text-[#52525b]">{sub.planName}</span>
              </div>
              <div className="flex items-center gap-3">
                {view === "optimized" && sub.potentialSaving > 0 && (
                  <span className="text-xs text-emerald-400 font-mono">
                    -{formatCurrency(sub.potentialSaving)}
                  </span>
                )}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${sub.id}-${view}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`text-sm font-mono ${
                      view === "optimized" && sub.potentialSaving > 0
                        ? "text-emerald-400"
                        : "text-[#fafafa]"
                    }`}
                  >
                    ${displayPrice}/mo
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
