import ReportView from "@/components/results/ReportView";
import { use } from "react";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <ReportView slug={slug} isPublic={false} />;
}
