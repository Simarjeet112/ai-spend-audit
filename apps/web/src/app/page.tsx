"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingDown, Zap, Shield, BarChart3 } from "lucide-react";
import dynamic from "next/dynamic";
import { fadeUp } from "@/lib/variants";
import StatsWidget from "@/components/StatsWidget";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

const TOOLS = ["ChatGPT", "Cursor", "GitHub Copilot", "Claude", "Gemini", "Notion", "Figma", "Linear"];

const STATS = [
  { value: "$4,200", label: "avg. annual savings found" },
  { value: "2 min", label: "to complete your audit" },
  { value: "10+", label: "AI tools analyzed" },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Spend analysis",
    description: "See exactly what you're paying across every AI tool, broken down by seat and plan.",
  },
  {
    icon: TrendingDown,
    title: "Savings recommendations",
    description: "Get specific, actionable plan downgrades based on your actual team size and usage.",
  },
  {
    icon: Zap,
    title: "Instant results",
    description: "No signup required. Enter your tools, get your audit. Results in under 2 minutes.",
  },
  {
    icon: Shield,
    title: "Shareable reports",
    description: "Every audit gets a permanent URL. Share with your CFO or finance team instantly.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#27272a]/60 backdrop-blur-md bg-[#09090b]/70 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">
            AI Spend Audit
          </span>
          <Link
            href="/audit"
            className="text-sm text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
          >
            Start audit
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <ParticleField />

        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(9,9,11,0.3) 0%, rgba(9,9,11,0.7) 50%, rgba(9,9,11,0.95) 100%)",
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[2]"
          style={{
            background: "linear-gradient(to bottom, transparent, #09090b)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-[#27272a] bg-[#09090b]/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-[#a1a1aa] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Free audit — no account required
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            Are you overpaying
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              for AI tools?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#a1a1aa] max-w-xl mx-auto leading-relaxed mb-10"
          >
            Enter your AI subscriptions and get a precise breakdown of where
            you're overspending — with specific recommendations to cut costs
            without losing capability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium px-6 py-3 rounded-lg transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-105"
            >
              Start free audit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-sm text-[#52525b]">Takes 2 minutes</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-[#52525b]">Analyzes:</span>
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="text-xs border border-[#27272a] bg-[#09090b]/60 backdrop-blur-sm text-[#71717a] px-3 py-1 rounded-full"
              >
                {tool}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#3f3f46]">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-[#3f3f46] to-transparent"
          />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-3 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
            >
              <div className="text-4xl font-semibold font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-[#71717a]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold tracking-tight mb-3">
            Everything in one audit
          </h2>
          <p className="text-[#71717a] text-sm max-w-md">
            No spreadsheets. No manual research. Just your tools and instant clarity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#27272a] rounded-xl overflow-hidden">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-[#09090b] p-8 hover:bg-[#0f0f10] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] border border-[#27272a] flex items-center justify-center mb-5 group-hover:border-[#2563eb]/40 transition-colors">
                <feature.icon className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <h3 className="text-sm font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-[#71717a] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live stats */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <StatsWidget />
      </section>

      {/* Bottom CTA */}
      <section className="relative border-t border-[#27272a] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center bottom, rgba(37,99,235,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-semibold tracking-tight mb-4"
          >
            Run your audit now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#71717a] mb-10 text-sm"
          >
            Free. Instant. No account needed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium px-6 py-3 rounded-lg transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              Start free audit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#27272a] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-[#52525b]">AI Spend Audit</span>
          <span className="text-xs text-[#52525b]">
            Built for founders and engineering teams
          </span>
        </div>
      </footer>
    </main>
  );
}
