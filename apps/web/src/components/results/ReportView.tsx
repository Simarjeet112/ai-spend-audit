"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  TrendingDown,
  Share2,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  getReport,
  generateSummary,
  captureLead,
  type AuditReport,
} from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import SavingsChart from "@/components/results/SavingsChart";
import ComparisonToggle from "@/components/results/ComparisonToggle";

const ResultsBackground = dynamic(
  () => import("@/components/three/ResultsBackground"),
  { ssr: false }
);

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{value}</>;
}

function SkeletonCard() {
  return (
    <div className="bg-[#0f0f10]/80 border border-[#27272a] rounded-xl p-5 animate-pulse">
      <div className="h-3 w-24 bg-[#27272a] rounded mb-3" />
      <div className="h-7 w-32 bg-[#27272a] rounded mb-2" />
      <div className="h-3 w-20 bg-[#1c1c1e] rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="bg-[#0f0f10]/80 border border-[#27272a] rounded-xl p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-28 bg-[#27272a] rounded" />
        <div className="h-4 w-16 bg-[#1c1c1e] rounded" />
      </div>
      <div className="h-3 w-full bg-[#1c1c1e] rounded mb-2" />
      <div className="h-3 w-3/4 bg-[#1c1c1e] rounded" />
    </div>
  );
}

export default function ReportView({
  slug,
  isPublic = false,
}: {
  slug: string;
  isPublic?: boolean;
}) {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getReport(slug)
      .then((r) => {
        setReport(r);
        setLoading(false);
        if (r.aiSummary) {
          setSummary(r.aiSummary);
        } else {
          generateSummary(r.id).then(setSummary).catch(() => {});
        }
      })
      .catch(() => {
        setError("Report not found.");
        setLoading(false);
      });
  }, [slug]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = form.querySelector('input[name="website"]') as HTMLInputElement;
    if (honeypot?.value) return;
    if (!report || !email) return;
    await captureLead(email, report.id);
    setEmailSent(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#71717a]">This report doesn't exist.</p>
        <Link
          href="/audit"
          className="inline-flex items-center gap-2 text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
        >
          Run your own audit
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const savingPercent = report
    ? Math.round((report.estimatedSavings / report.totalMonthlySpend) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden">
      <ResultsBackground savings={report?.estimatedSavings ?? 0} />

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(9,9,11,0.4) 0%, rgba(9,9,11,0.9) 60%)",
        }}
      />

      <nav className="relative z-10 border-b border-[#27272a]/60 backdrop-blur-md bg-[#09090b]/70 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            AI Spend Audit
          </Link>
          <div className="flex items-center gap-3">
            {isPublic && (
              <Link
                href="/audit"
                className="text-xs text-[#71717a] hover:text-[#fafafa] transition-colors"
              >
                Run your audit
              </Link>
            )}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 text-xs text-[#71717a] hover:text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] px-3 py-1.5 rounded-lg transition-all"
            >
              {copied ? (
                <><Check className="w-3 h-3" />Copied</>
              ) : (
                <><Copy className="w-3 h-3" />Share</>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs text-[#52525b] uppercase tracking-widest mb-2">
            {isPublic ? "Shared report" : "Audit complete"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {loading
              ? "Loading report..."
              : report?.companyName
              ? `${report.companyName}'s AI spend report`
              : "Your AI spend report"}
          </h1>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            [
              {
                label: "Monthly spend",
                value: formatCurrency(report!.totalMonthlySpend),
                sub: "current total",
                color: "text-[#fafafa]",
                count: false,
              },
              {
                label: "Potential savings",
                value: report!.estimatedSavings,
                sub: `${savingPercent}% reduction`,
                color: "text-emerald-400",
                count: true,
              },
              {
                label: "Annual savings",
                value: formatCurrency(report!.estimatedSavings * 12),
                sub: "if you act now",
                color: "text-[#3b82f6]",
                count: false,
              },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-5"
              >
                <p className="text-xs text-[#52525b] mb-2">{metric.label}</p>
                <p className={`text-2xl font-semibold font-mono ${metric.color}`}>
                  {metric.count ? (
                    <>$<CountUp target={metric.value as number} /></>
                  ) : (
                    metric.value
                  )}
                </p>
                <p className="text-xs text-[#52525b] mt-1">{metric.sub}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Credex CTA for high savings */}
        {!loading && report && report.estimatedSavings >= 500 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-6 mb-8"
          >
            <p className="text-xs text-emerald-400 uppercase tracking-widest mb-2">
              You qualify for Credex savings
            </p>
            <h3 className="text-base font-semibold mb-2">
              Capture even more savings with discounted AI credits
            </h3>
            <p className="text-sm text-[#71717a] leading-relaxed mb-4 max-w-xl">
              Credex sells discounted AI infrastructure credits — Cursor, Claude,
              ChatGPT Enterprise and others — sourced from companies that
              overforecast. Your audit shows ${report.estimatedSavings}/month in
              potential savings. Credex can help you capture even more on top of that.
            </p>
            
              <a href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
            >
              Book a free Credex consultation
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}

        {/* Comparison toggle */}
        {!loading && report && (
          <ComparisonToggle
            subscriptions={report.subscriptions}
            totalMonthlySpend={report.totalMonthlySpend}
            estimatedSavings={report.estimatedSavings}
          />
        )}

        {/* Savings chart */}
        {!loading && report && (
          <SavingsChart subscriptions={report.subscriptions} />
        )}

        {/* AI Summary */}
        {(loading || summary) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
              <span className="text-xs text-[#52525b] uppercase tracking-widest">
                AI analysis
              </span>
            </div>
            {loading || !summary ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 w-full bg-[#27272a] rounded" />
                <div className="h-3 w-5/6 bg-[#27272a] rounded" />
                <div className="h-3 w-4/6 bg-[#1c1c1e] rounded" />
              </div>
            ) : (
              <p className="text-sm text-[#a1a1aa] leading-relaxed">{summary}</p>
            )}
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xs text-[#52525b] uppercase tracking-widest mb-4">
            Recommendations
          </h2>
          <div className="space-y-3">
            {loading ? (
              <><SkeletonRow /><SkeletonRow /></>
            ) : (
              report!.subscriptions.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-5 hover:border-[#3f3f46] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm font-medium">{sub.toolName}</span>
                        <span className="text-xs border border-[#27272a] text-[#71717a] px-2 py-0.5 rounded-full">
                          {sub.planName}
                        </span>
                        <span className="text-xs text-[#52525b]">
                          {sub.seats} seat{sub.seats > 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717a] leading-relaxed">
                        {sub.recommendation}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-[#52525b] mb-1">
                        ${sub.monthlyPrice}/mo
                      </p>
                      {sub.potentialSaving > 0 ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingDown className="w-3 h-3" />
                          <span className="text-xs font-mono font-medium">
                            Save ${sub.potentialSaving}/mo
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#52525b]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-xs">Optimized</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Email capture */}
        {!isPublic && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-6 mb-6"
          >
            {emailSent ? (
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <p className="text-sm text-[#a1a1aa]">
                  Report sent to <span className="text-[#fafafa]">{email}</span>
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-medium mb-1">
                  Get this report by email
                </h3>
                <p className="text-xs text-[#71717a] mb-4">
                  We'll send you a permanent link to this audit.
                </p>
                <form onSubmit={handleEmailSubmit} className="flex gap-3">
                  <input
                    type="text"
                    name="website"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#2563eb] transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}

        {/* CTA for public view */}
        {isPublic && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="border border-[#27272a] rounded-xl p-6 text-center"
          >
            <p className="text-sm text-[#71717a] mb-4">
              Want to audit your own AI spend?
            </p>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Run free audit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
