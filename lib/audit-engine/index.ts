import { auditTool } from "./rules";
import { AuditInput, AuditOutput } from "./types";

export function runAudit(input: AuditInput): AuditOutput {
  // Run each tool through the audit engine
  const results = input.tools
    .filter((t) => t.monthlySpend > 0) // Skip tools with $0 spend
    .map((tool) => auditTool(tool, input.teamSize, input.useCase));

  // Sum up total savings
  const totalMonthlySavings = results.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  const totalAnnualSavings = totalMonthlySavings * 12;

  // >$500/mo savings = high value lead for Credex
  const isHighSavings = totalMonthlySavings > 500;

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings,
  };
}