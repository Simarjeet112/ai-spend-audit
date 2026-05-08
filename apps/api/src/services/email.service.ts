import { config } from "../config/env";

export async function sendAuditReport(email: string, slug: string): Promise<boolean> {
  if (!config.resendApiKey) {
    console.log("No Resend API key — skipping email send");
    return false;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(config.resendApiKey);

    await resend.emails.send({
      from: "AI Spend Audit <onboarding@resend.dev>",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <h2>Your AI Spend Audit is ready</h2>
        <p>View your full report and recommendations here:</p>
        <a href="${config.frontendUrl}/results/${slug}">View Report</a>
        <p>Bookmark this link — it's yours forever.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}
