type Subscription = {
  toolName: string;
  planName: string;
  seats: number;
  monthlyPrice: number;
};

type AuditResult = {
  toolName: string;
  planName: string;
  seats: number;
  monthlyPrice: number;
  recommendation: string;
  potentialSaving: number;
};

type AuditSummary = {
  results: AuditResult[];
  totalMonthlySpend: number;
  estimatedSavings: number;
};

// Pricing data — hardcoded, deterministic, fully testable
const PLAN_RULES: Record<string, (sub: Subscription) => { recommendation: string; saving: number }> = {
  chatgpt: (sub) => {
    if (sub.planName.toLowerCase().includes("team") && sub.seats <= 2) {
      const saving = sub.monthlyPrice - 20;
      return {
        recommendation: `You have ${sub.seats} seats on ChatGPT Team ($25/seat). For ≤2 users, 2× ChatGPT Plus at $20/month total saves you $${saving}/month.`,
        saving: Math.max(saving, 0),
      };
    }
    if (sub.planName.toLowerCase().includes("enterprise")) {
      return {
        recommendation: "ChatGPT Enterprise is justified for large teams needing SSO and compliance. No change recommended.",
        saving: 0,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  cursor: (sub) => {
    if (sub.planName.toLowerCase().includes("business") && sub.seats <= 5) {
      const saving = sub.monthlyPrice - sub.seats * 20;
      return {
        recommendation: `Cursor Business at $40/seat is expensive for ${sub.seats} users. Cursor Pro at $20/seat saves $${Math.max(saving, 0)}/month.`,
        saving: Math.max(saving, 0),
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  github_copilot: (sub) => {
    if (sub.planName.toLowerCase().includes("enterprise") && sub.seats <= 10) {
      const saving = (39 - 19) * sub.seats;
      return {
        recommendation: `GitHub Copilot Enterprise at $39/seat is overkill for ${sub.seats} users. Copilot Business at $19/seat saves $${saving}/month.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  claude: (sub) => {
    if (sub.planName.toLowerCase().includes("team") && sub.seats <= 3) {
      const saving = sub.monthlyPrice - 60;
      return {
        recommendation: `Claude Team for ${sub.seats} users — consider individual Pro plans at $20/user which may be cheaper.`,
        saving: Math.max(saving, 0),
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  gemini: (sub) => {
    if (sub.planName.toLowerCase().includes("business") && sub.seats <= 3) {
      return {
        recommendation: "Gemini Business for a small team — Gemini Advanced ($20/user) may cover your needs at lower cost.",
        saving: Math.max(sub.monthlyPrice - sub.seats * 20, 0),
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },
};

export function runAudit(subscriptions: Subscription[]): AuditSummary {
  const results: AuditResult[] = subscriptions.map((sub) => {
    const key = sub.toolName.toLowerCase().replace(/\s+/g, "_");
    const rule = PLAN_RULES[key];

    if (!rule) {
      return {
        ...sub,
        recommendation: "No specific recommendation available for this tool.",
        potentialSaving: 0,
      };
    }

    const { recommendation, saving } = rule(sub);
    return {
      ...sub,
      recommendation,
      potentialSaving: saving,
    };
  });

  const totalMonthlySpend = subscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);
  const estimatedSavings = results.reduce((sum, r) => sum + r.potentialSaving, 0);

  return { results, totalMonthlySpend, estimatedSavings };
}
