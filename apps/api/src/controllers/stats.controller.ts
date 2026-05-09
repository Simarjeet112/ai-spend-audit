import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

let cache: { data: object; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function getStats(_req: Request, res: Response) {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return res.json(cache.data);
    }

    const [totalReports, savingsAggregate, toolCounts] = await Promise.all([
      prisma.auditReport.count(),

      prisma.auditReport.aggregate({
        _sum: { estimatedSavings: true, totalMonthlySpend: true },
      }),

      prisma.subscription.groupBy({
        by: ["toolName"],
        _sum: { potentialSaving: true },
        _count: { toolName: true },
        orderBy: { _sum: { potentialSaving: "desc" } },
        take: 5,
      }),
    ]);

    const data = {
      totalAudits: totalReports,
      totalSavingsFound: Math.round(savingsAggregate._sum.estimatedSavings ?? 0),
      totalSpendAnalyzed: Math.round(savingsAggregate._sum.totalMonthlySpend ?? 0),
      topOverspentTools: toolCounts.map((t: { toolName: string; _sum: { potentialSaving: number | null }; _count: { toolName: number } }) => ({
        tool: t.toolName,
        totalSaving: Math.round(t._sum.potentialSaving ?? 0),
        auditCount: t._count.toolName,
      })),
    };

    cache = { data, timestamp: Date.now() };
    return res.json(data);
  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
