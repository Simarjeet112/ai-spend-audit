import { Metadata } from "next";
import { getReport } from "@/services/api";
import ReportView from "@/components/results/ReportView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const report = await getReport(slug);
    return {
      title: `${report.companyName || "AI Spend"} Audit Report`,
      description: `Monthly AI spend: $${report.totalMonthlySpend}. Potential savings: $${report.estimatedSavings}/month.`,
      openGraph: {
        title: `${report.companyName || "AI Spend"} Audit Report`,
        description: `This team could save $${report.estimatedSavings}/month on AI tools.`,
        type: "website",
      },
    };
  } catch {
    return { title: "AI Spend Audit Report" };
  }
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ReportView slug={slug} isPublic />;
}
