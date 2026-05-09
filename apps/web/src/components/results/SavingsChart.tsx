"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { type AuditSubscription } from "@/services/api";

type Props = {
  subscriptions: AuditSubscription[];
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="text-[#a1a1aa] mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono" style={{ color: p.name === "current" ? "#71717a" : "#34d399" }}>
          {p.name === "current" ? "Current" : "Optimized"}: ${p.value}/mo
        </p>
      ))}
    </div>
  );
};

export default function SavingsChart({ subscriptions }: Props) {
  const data = subscriptions.map((sub) => ({
    name: sub.toolName,
    current: sub.monthlyPrice,
    optimized: Math.max(sub.monthlyPrice - sub.potentialSaving, 0),
    saving: sub.potentialSaving,
  }));

  const hasAnySavings = data.some((d) => d.saving > 0);

  if (!hasAnySavings) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xs text-[#52525b] uppercase tracking-widest mb-1">
            Spend breakdown
          </h2>
          <p className="text-sm text-[#a1a1aa]">Current vs optimized monthly cost</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#71717a]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#27272a]" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            Optimized
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          barGap={4}
          barCategoryGap="35%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="current" name="current" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((_, i) => (
              <Cell key={i} fill="#27272a" />
            ))}
          </Bar>
          <Bar dataKey="optimized" name="optimized" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.saving > 0 ? "#10b981" : "#27272a"}
                opacity={entry.saving > 0 ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
