import { Request, Response } from "express";
import { generateSummary } from "../services/summary.service";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const SummarySchema = z.object({
  reportId: z.string().uuid(),
});

export async function createSummary(req: Request, res: Response) {
  try {
    const parsed = SummarySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { reportId } = parsed.data;

    const report = await prisma.auditReport.findUnique({
      where: { id: reportId },
      include: { subscriptions: true },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const summary = await generateSummary({
      companyName: report.companyName ?? undefined,
      teamSize: report.teamSize,
      totalMonthlySpend: report.totalMonthlySpend,
      estimatedSavings: report.estimatedSavings,
      toolCount: report.subscriptions.length,
    });

    await prisma.auditReport.update({
      where: { id: reportId },
      data: { aiSummary: summary },
    });

    return res.json({ summary });
  } catch (error) {
    console.error("createSummary error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
