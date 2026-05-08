import { Request, Response } from "express";
import { runAudit } from "../services/audit.service";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const SubscriptionSchema = z.object({
  toolName: z.string().min(1),
  planName: z.string().min(1),
  seats: z.number().int().positive(),
  monthlyPrice: z.number().positive(),
});

const AuditRequestSchema = z.object({
  companyName: z.string().optional(),
  teamSize: z.number().int().positive(),
  subscriptions: z.array(SubscriptionSchema).min(1),
});

function generateSlug(): string {
  return Math.random().toString(36).substring(2, 8);
}

export async function createAudit(req: Request, res: Response) {
  try {
    const parsed = AuditRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: parsed.error.flatten(),
      });
    }

    const { companyName, teamSize, subscriptions } = parsed.data;

    const { results, totalMonthlySpend, estimatedSavings } = runAudit(subscriptions);

    const report = await prisma.auditReport.create({
      data: {
        shareSlug: generateSlug(),
        companyName,
        teamSize,
        totalMonthlySpend,
        estimatedSavings,
        subscriptions: {
          create: results.map((r) => ({
            toolName: r.toolName,
            planName: r.planName,
            seats: r.seats,
            monthlyPrice: r.monthlyPrice,
            recommendation: r.recommendation,
            potentialSaving: r.potentialSaving,
          })),
        },
      },
      include: { subscriptions: true },
    });

    return res.status(201).json({ report });
  } catch (error) {
    console.error("createAudit error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getReport(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const report = await prisma.auditReport.findUnique({
      where: { shareSlug: slug },
      include: { subscriptions: true, lead: true },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    return res.json({ report });
  } catch (error) {
    console.error("getReport error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
