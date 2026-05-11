"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { createAudit, type Subscription } from "@/services/api";
import { useAuditHistory } from "@/hooks/useAuditHistory";
import HistoryBanner from "@/components/audit/HistoryBanner";

const AuditBackground = dynamic(
  () => import("@/components/three/AuditBackground"),
  { ssr: false }
);

const TOOL_OPTIONS = [
  "ChatGPT","Cursor","GitHub Copilot","Claude","Gemini",
  "Notion","Figma","Linear","Vercel","Midjourney","Perplexity","Other",
];

const PLAN_OPTIONS: Record<string, string[]> = {
  ChatGPT: ["Plus", "Team", "Enterprise"],
  Cursor: ["Hobby", "Pro", "Business"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  Claude: ["Pro", "Team", "Enterprise"],
  Gemini: ["Advanced", "Business", "Enterprise"],
  Notion: ["Plus", "Business", "Enterprise"],
  Figma: ["Starter", "Professional", "Organization", "Enterprise"],
  Linear: ["Free", "Basic", "Business"],
  Vercel: ["Hobby", "Pro", "Enterprise"],
  Midjourney: ["Basic", "Standard", "Pro", "Mega"],
  Perplexity: ["Pro"],
  Other: ["Basic", "Pro", "Business", "Enterprise"],
};

type Step = 1 | 2 | 3;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function AuditPage() {
  const router = useRouter();
  const { addEntry } = useAuditHistory();
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { toolName: "ChatGPT", planName: "Team", seats: 1, monthlyPrice: 0 },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("audit_form_state");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.companyName) setCompanyName(data.companyName);
        if (data.teamSize) setTeamSize(data.teamSize);
        if (data.subscriptions?.length) setSubscriptions(data.subscriptions);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "audit_form_state",
        JSON.stringify({ companyName, teamSize, subscriptions })
      );
    } catch {}
  }, [companyName, teamSize, subscriptions]);

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const addTool = () => {
    setSubscriptions([
      ...subscriptions,
      { toolName: "ChatGPT", planName: "Team", seats: 1, monthlyPrice: 0 },
    ]);
  };

  const removeTool = (i: number) => {
    setSubscriptions(subscriptions.filter((_, idx) => idx !== i));
  };

  const updateTool = (i: number, field: keyof Subscription, value: string | number) => {
    const updated = [...subscriptions];
    if (field === "toolName") {
      updated[i] = {
        ...updated[i],
        toolName: value as string,
        planName: PLAN_OPTIONS[value as string]?.[0] || "Pro",
      };
    } else {
      updated[i] = { ...updated[i], [field]: value };
    }
    setSubscriptions(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const report = await createAudit({
        companyName: companyName || undefined,
        teamSize: parseInt(teamSize),
        subscriptions: subscriptions.map((s) => ({
          ...s,
          seats: Number(s.seats),
          monthlyPrice: Number(s.monthlyPrice),
        })),
      });
      addEntry({
        slug: report.shareSlug,
        companyName: report.companyName,
        totalMonthlySpend: report.totalMonthlySpend,
        estimatedSavings: report.estimatedSavings,
        createdAt: report.createdAt,
      });
      localStorage.removeItem("audit_form_state");
      router.push("/results/" + report.shareSlug);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#0f0f10] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-[#fafafa] placeholder-[#52525b] focus:outline-none focus:border-[#2563eb] transition-colors";
  const selectClass = "w-full bg-[#0f0f10] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-[#fafafa] focus:outline-none focus:border-[#2563eb] transition-colors appearance-none";

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden">
      <AuditBackground />
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: "radial-gradient(ellipse at center, rgba(9,9,11,0.5) 0%, rgba(9,9,11,0.85) 100%)" }} />

      <nav className="relative z-10 border-b border-[#27272a]/60 backdrop-blur-md bg-[#09090b]/70 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="text-sm font-semibold tracking-tight">AI Spend Audit</a>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className={"h-1 rounded-full transition-all duration-300 " + (s === step ? "w-8 bg-[#2563eb]" : s < step ? "w-4 bg-[#27272a]" : "w-4 bg-[#1c1c1e]")} />
            ))}
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <HistoryBanner />
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}>
              <p className="text-xs text-[#52525b] uppercase tracking-widest mb-3">Step 1 of 3</p>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">Tell us about your team</h1>
              <p className="text-sm text-[#71717a] mb-10">This helps us calibrate recommendations for your team size.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-[#a1a1aa] mb-2">Company or team name <span className="text-[#52525b]">(optional)</span></label>
                  <input type="text" placeholder="Acme Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-[#a1a1aa] mb-2">Team size <span className="text-red-500">*</span></label>
                  <input type="number" placeholder="e.g. 5" min="1" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className={inputClass} />
                </div>
              </div>
              <button onClick={() => goTo(2)} disabled={!teamSize || parseInt(teamSize) < 1} className="mt-10 inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}>
              <p className="text-xs text-[#52525b] uppercase tracking-widest mb-3">Step 2 of 3</p>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">Add your AI tools</h1>
              <p className="text-sm text-[#71717a] mb-10">Add every AI subscription your team pays for.</p>
              <div className="space-y-4">
                {subscriptions.map((sub, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#52525b] font-mono">Tool {String(i + 1).padStart(2, "0")}</span>
                      {subscriptions.length > 1 && (
                        <button onClick={() => removeTool(i)} className="text-[#52525b] hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#71717a] mb-1.5">Tool</label>
                        <select value={sub.toolName} onChange={(e) => updateTool(i, "toolName", e.target.value)} className={selectClass}>
                          {TOOL_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[#71717a] mb-1.5">Plan</label>
                        <select value={sub.planName} onChange={(e) => updateTool(i, "planName", e.target.value)} className={selectClass}>
                          {(PLAN_OPTIONS[sub.toolName] || ["Pro"]).map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-[#71717a] mb-1.5">Seats</label>
                        <input type="number" min="1" value={sub.seats} onChange={(e) => updateTool(i, "seats", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs text-[#71717a] mb-1.5">Monthly price ($)</label>
                        <input type="number" min="0" placeholder="0" value={sub.monthlyPrice || ""} onChange={(e) => updateTool(i, "monthlyPrice", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <button onClick={addTool} className="w-full border border-dashed border-[#27272a] hover:border-[#2563eb]/50 rounded-xl py-3 text-sm text-[#52525b] hover:text-[#3b82f6] transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add another tool
                </button>
              </div>
              <div className="flex items-center gap-3 mt-10">
                <button onClick={() => goTo(1)} className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => goTo(3)} disabled={subscriptions.some((s) => !s.monthlyPrice)} className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeOut" }}>
              <p className="text-xs text-[#52525b] uppercase tracking-widest mb-3">Step 3 of 3</p>
              <h1 className="text-3xl font-semibold tracking-tight mb-2">Review and run audit</h1>
              <p className="text-sm text-[#71717a] mb-10">Confirm your details and we will generate your report instantly.</p>
              <div className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#52525b] uppercase tracking-widest">Team</span>
                  <button onClick={() => goTo(1)} className="text-xs text-[#3b82f6] hover:text-[#60a5fa]">Edit</button>
                </div>
                <p className="text-sm">{companyName || "Your team"} &mdash; <span className="font-mono">{teamSize}</span> members</p>
              </div>
              <div className="bg-[#0f0f10]/80 backdrop-blur-sm border border-[#27272a] rounded-xl p-5 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[#52525b] uppercase tracking-widest">Tools ({subscriptions.length})</span>
                  <button onClick={() => goTo(2)} className="text-xs text-[#3b82f6] hover:text-[#60a5fa]">Edit</button>
                </div>
                <div className="space-y-2">
                  {subscriptions.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#a1a1aa]">{sub.toolName} {sub.planName}<span className="text-[#52525b] ml-1">x {sub.seats}</span></span>
                      <span className="font-mono text-[#fafafa]">${Number(sub.monthlyPrice).toFixed(0)}/mo</span>
                    </div>
                  ))}
                  <div className="border-t border-[#27272a] pt-2 mt-2 flex justify-between text-sm">
                    <span className="text-[#71717a]">Total</span>
                    <span className="font-mono font-medium">${subscriptions.reduce((s, t) => s + Number(t.monthlyPrice), 0).toFixed(0)}/mo</span>
                  </div>
                </div>
              </div>
              {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
              <div className="flex items-center gap-3">
                <button onClick={() => goTo(2)} className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all">
                  {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Running audit...</>) : (<>Run audit <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
