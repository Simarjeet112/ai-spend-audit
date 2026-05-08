import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { sendAuditReport } from "../services/email.service";
import { z } from "zod";

const LeadSchema = z.object({
  email: z.string().email(),
  reportId: z.string().uuid(),
});

export async function captureLead(req: Request, res: Response) {
  try {
    const parsed = LeadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: parsed.error.flatten(),
      });
    }

    const { email, reportId } = parsed.data;

    const report = await prisma.auditReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const existingLead = await prisma.lead.findUnique({
      where: { reportId },
    });

    if (existingLead) {
      return res.status(409).json({ error: "Email already captured for this report" });
    }

    const emailSent = await sendAuditReport(email, report.shareSlug);

    const lead = await prisma.lead.create({
      data: { email, reportId, emailSent },
    });

    return res.status(201).json({ lead, emailSent });
  } catch (error) {
    console.error("captureLead error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
