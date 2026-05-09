"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type PublicStats, getPublicStats } from "@/services/api";
import { formatCurrency } from "@/lib/utils";

export default function StatsWidget() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    getPublicStats().then(setStats).catch(() => {});
  }, []);

  if (!stats || stats.totalAudits === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border border-[#27272a] rounded-xl p-6 bg-[#0f0f10]/50 backdrop-blur-sm"
    >
      <p className="text-xs text-[#52525b] uppercase tracking-widest mb-5">
        Live stats
      </p>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {[
          {
            label: "Audits run",
            value: stats.totalAudits.toString(),
          },
          {
            label: "Savings identified",
            value: formatCurrency(stats.totalSavingsFound) + "/mo",
          },
          {
            label: "Spend analyzed",
            value: formatCurrency(stats.totalSpendAnalyzed) + "/mo",
          },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xl font-semibold font-mono">{s.value}</p>
            <p className="text-xs text-[#52525b] mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      {stats.topOverspentTools.length > 0 && (
        <div>
          <p className="text-xs text-[#52525b] mb-3">Most overspent tools</p>
          <div className="flex flex-wrap gap-2">
            {stats.topOverspentTools.map((t) => (
              <span
                key={t.tool}
                className="text-xs border border-[#27272a] text-[#71717a] px-2.5 py-1 rounded-full"
              >
                {t.tool} · {formatCurrency(t.totalSaving)}/mo saved
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
