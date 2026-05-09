import { describe, it, expect } from "vitest";
import { runAudit } from "./audit.service";

describe("runAudit", () => {
  it("detects ChatGPT Team overspend for small teams", () => {
    const result = runAudit([
      { toolName: "chatgpt", planName: "Team", seats: 2, monthlyPrice: 50 },
    ]);
    expect(result.estimatedSavings).toBeGreaterThan(0);
    expect(result.totalMonthlySpend).toBe(50);
  });

  it("detects Cursor Business overspend for small teams", () => {
    const result = runAudit([
      { toolName: "cursor", planName: "Business", seats: 3, monthlyPrice: 120 },
    ]);
    expect(result.estimatedSavings).toBeGreaterThan(0);
  });

  it("returns zero savings for appropriate plans", () => {
    const result = runAudit([
      { toolName: "chatgpt", planName: "Enterprise", seats: 50, monthlyPrice: 1000 },
    ]);
    expect(result.estimatedSavings).toBe(0);
  });

  it("calculates total spend correctly", () => {
    const result = runAudit([
      { toolName: "chatgpt", planName: "Team", seats: 2, monthlyPrice: 50 },
      { toolName: "cursor", planName: "Business", seats: 3, monthlyPrice: 120 },
    ]);
    expect(result.totalMonthlySpend).toBe(170);
  });

  it("handles unknown tools gracefully", () => {
    const result = runAudit([
      { toolName: "unknowntool", planName: "Pro", seats: 1, monthlyPrice: 20 },
    ]);
    expect(result.estimatedSavings).toBe(0);
    expect(result.results[0].recommendation).toBeTruthy();
  });

  it("handles multiple tools", () => {
    const result = runAudit([
      { toolName: "chatgpt", planName: "Team", seats: 2, monthlyPrice: 50 },
      { toolName: "cursor", planName: "Business", seats: 3, monthlyPrice: 120 },
      { toolName: "notion", planName: "Business", seats: 5, monthlyPrice: 75 },
    ]);
    expect(result.results).toHaveLength(3);
    expect(result.estimatedSavings).toBeGreaterThan(0);
  });
});
