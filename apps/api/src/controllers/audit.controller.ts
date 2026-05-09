import { Request, Response } from "express";
import { runAudit } from "../services/audit.service";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { sanitizeString } from "../utils/sanitize";

const SubscriptionSchema = z.object({
  toolName: z.string().min(1).max(100),
  planName: z.string().min(1).max(100),
  seats: z.number().int().positive().max(10000),
  monthlyPrice: z.number().positive().max(1000000),
});

const AuditRequestSchema = z.object({
  companyName: z.string().max(200).optional(),
  teamSize: z.number().int().positive().max(100000),
  subscriptions: z.array(SubscriptionSchema).min(1).max(20),
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

    const sanitizedCompanyName = companyName
      ? sanitizeString(companyName)
      : undefined;

    const sanitizedSubscriptions = subscriptions.map((s) => ({
      ...s,
      toolName: sanitizeString(s.toolName),
      planName: sanitizeString(s.planName),
    }));

    const { results, totalMonthlySpend, estimatedSavings } =
      runAudit(sanitizedSubscriptions);

    let slug = generateSlug();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.auditReport.findUnique({
        where: { shareSlug: slug },
      });
      if (!existing) break;
      slug = generateSlug();
      attempts++;
    }

    const report = await prisma.auditReport.create({
      data: {
        shareSlug: slug,
        companyName: sanitizedCompanyName,
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

    if (!slug || slug.length > 20) {
      return res.status(400).json({ error: "Invalid slug" });
    }

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
