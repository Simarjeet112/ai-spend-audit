const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type Subscription = {
  toolName: string;
  planName: string;
  seats: number;
  monthlyPrice: number;
};

export type AuditSubscription = Subscription & {
  id: string;
  reportId: string;
  recommendation: string;
  potentialSaving: number;
};

export type AuditReport = {
  id: string;
  shareSlug: string;
  companyName?: string;
  teamSize: number;
  totalMonthlySpend: number;
  estimatedSavings: number;
  aiSummary?: string;
  createdAt: string;
  subscriptions: AuditSubscription[];
};

export type AuditRequest = {
  companyName?: string;
  teamSize: number;
  subscriptions: Subscription[];
};

export async function createAudit(data: AuditRequest): Promise<AuditReport> {
  const res = await fetch(`${API_URL}/api/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create audit");
  const json = await res.json();
  return json.report;
}

export async function getReport(slug: string): Promise<AuditReport> {
  const res = await fetch(`${API_URL}/api/report/${slug}`);
  if (!res.ok) throw new Error("Report not found");
  const json = await res.json();
  return json.report;
}

export async function generateSummary(reportId: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportId }),
  });
  if (!res.ok) throw new Error("Failed to generate summary");
  const json = await res.json();
  return json.summary;
}

export async function captureLead(email: string, reportId: string): Promise<void> {
  await fetch(`${API_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, reportId }),
  });
}

export type PublicStats = {
  totalAudits: number;
  totalSavingsFound: number;
  totalSpendAnalyzed: number;
  topOverspentTools: {
    tool: string;
    totalSaving: number;
    auditCount: number;
  }[];
};

export async function getPublicStats(): Promise<PublicStats> {
  const res = await fetch(`${API_URL}/api/stats`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
