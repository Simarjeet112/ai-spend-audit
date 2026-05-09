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

type RuleResult = { recommendation: string; saving: number };
type RuleFn = (sub: Subscription) => RuleResult;

const PLAN_RULES: Record<string, RuleFn> = {
  chatgpt: (sub) => {
    if (sub.planName.toLowerCase().includes("team") && sub.seats <= 2) {
      const saving = Math.max(sub.monthlyPrice - 20, 0);
      return {
        recommendation: `You have ${sub.seats} seats on ChatGPT Team ($25/seat). For up to 2 users, 2x ChatGPT Plus at $20/month total saves you $${saving}/month.`,
        saving,
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
      const saving = Math.max(sub.monthlyPrice - sub.seats * 20, 0);
      return {
        recommendation: `Cursor Business at $40/seat is expensive for ${sub.seats} users. Cursor Pro at $20/seat saves $${saving}/month.`,
        saving,
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
      const saving = Math.max(sub.monthlyPrice - 60, 0);
      return {
        recommendation: `Claude Team for ${sub.seats} users — individual Pro plans at $20/user may be cheaper.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  gemini: (sub) => {
    if (sub.planName.toLowerCase().includes("business") && sub.seats <= 3) {
      const saving = Math.max(sub.monthlyPrice - sub.seats * 20, 0);
      return {
        recommendation: `Gemini Business for a small team — Gemini Advanced ($20/user) may cover your needs at lower cost. Saves $${saving}/month.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  notion: (sub) => {
    if (sub.planName.toLowerCase().includes("business") && sub.seats <= 5) {
      const saving = (15 - 10) * sub.seats;
      return {
        recommendation: `Notion Business at $15/seat for ${sub.seats} users — Notion Plus at $10/seat has most features small teams need. Saves $${saving}/month.`,
        saving,
      };
    }
    if (sub.planName.toLowerCase().includes("enterprise") && sub.seats <= 10) {
      const saving = Math.max(sub.monthlyPrice - sub.seats * 15, 0);
      return {
        recommendation: `Notion Enterprise for ${sub.seats} users is likely over-provisioned. Business plan covers most needs at lower cost.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  figma: (sub) => {
    if (sub.planName.toLowerCase().includes("organization") && sub.seats <= 5) {
      const saving = (45 - 15) * sub.seats;
      return {
        recommendation: `Figma Organization at $45/seat is expensive for ${sub.seats} users. Figma Professional at $15/seat covers most team needs. Saves $${saving}/month.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  linear: (sub) => {
    if (sub.planName.toLowerCase().includes("business") && sub.seats <= 5) {
      const saving = (16 - 8) * sub.seats;
      return {
        recommendation: `Linear Business at $16/seat for ${sub.seats} users — Linear Basic at $8/seat includes core features for small teams. Saves $${saving}/month.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  vercel: (sub) => {
    if (sub.planName.toLowerCase().includes("pro") && sub.seats <= 2) {
      const saving = Math.max(sub.monthlyPrice - 20, 0);
      return {
        recommendation: `Vercel Pro for ${sub.seats} users — consider consolidating to one Pro account at $20/month. Saves $${saving}/month.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },

  midjourney: (sub) => {
    if (sub.planName.toLowerCase().includes("mega") && sub.seats <= 2) {
      const saving = Math.max(sub.monthlyPrice - 60, 0);
      return {
        recommendation: `Midjourney Mega at $120/month — Pro plan at $60/month covers most teams. Saves $${saving}/month.`,
        saving,
      };
    }
    return { recommendation: "Plan looks appropriate for your team size.", saving: 0 };
  },
};

export function runAudit(subscriptions: Subscription[]): AuditSummary {
  const results: AuditResult[] = subscriptions.map((sub) => {
    const key = sub.toolName.toLowerCase().replace(/[\s-]+/g, "_");
    const rule = PLAN_RULES[key];

    if (!rule) {
      return {
        ...sub,
        recommendation: "No specific recommendation available for this tool. Review plan tiers on the provider's pricing page.",
        potentialSaving: 0,
      };
    }

    const { recommendation, saving } = rule(sub);
    return { ...sub, recommendation, potentialSaving: saving };
  });

  const totalMonthlySpend = subscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);
  const estimatedSavings = results.reduce((sum, r) => sum + r.potentialSaving, 0);

  return { results, totalMonthlySpend, estimatedSavings };
}
