import { config } from "../config/env";

type SummaryInput = {
  companyName?: string;
  teamSize: number;
  totalMonthlySpend: number;
  estimatedSavings: number;
  toolCount: number;
};

function generateMockSummary(input: SummaryInput): string {
  const { companyName, teamSize, totalMonthlySpend, estimatedSavings, toolCount } = input;
  const name = companyName || "Your team";
  const savingPercent = Math.round((estimatedSavings / totalMonthlySpend) * 100);
  return `${name} is currently spending $${totalMonthlySpend}/month across ${toolCount} AI tools for ${teamSize} team members. Our audit identified $${estimatedSavings}/month in potential savings — that's ${savingPercent}% of your current spend, or $${estimatedSavings * 12}/year. The biggest opportunities are in right-sizing plans to match your actual team size rather than defaulting to business tiers.`;
}

export async function generateSummary(input: SummaryInput): Promise<string> {
  if (!config.anthropicApiKey) {
    return generateMockSummary(input);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `Write a 2-3 sentence personalized audit summary for ${input.companyName || "a team"} with ${input.teamSize} members spending $${input.totalMonthlySpend}/month on ${input.toolCount} AI tools. They could save $${input.estimatedSavings}/month. Be specific, concise, and actionable. No bullet points.`,
          },
        ],
      }),
    });

    const data = await response.json() as { content: { text: string }[] };
    return data.content[0].text;
  } catch (error) {
    console.error("Summary generation error:", error);
    return generateMockSummary(input);
  }
}
