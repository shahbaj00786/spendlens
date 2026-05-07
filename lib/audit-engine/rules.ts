import { PRICING, ALTERNATIVES } from "./pricing";
import { ToolInput, ToolAuditResult, UseCaseType } from "./types";

export function auditTool(
  input: ToolInput,
  teamSize: number,
  useCase: UseCaseType
): ToolAuditResult {
  const toolPricing = PRICING[input.tool];

  // Fallback if tool not found
  if (!toolPricing) {
    return {
      tool: input.tool,
      currentPlan: input.plan,
      currentSpend: input.monthlySpend,
      recommendedAction: "keep",
      recommendedPlan: null,
      recommendedTool: null,
      estimatedMonthlyCost: input.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      reason: "No pricing data available for this tool.",
      severity: "optimal",
    };
  }

  const currentPlanData = toolPricing.plans[input.plan];
  const expectedCost = currentPlanData
    ? currentPlanData.pricePerSeat * input.seats
    : input.monthlySpend;

  // --- RULE 1: Overpaying vs list price ---
  if (input.monthlySpend > expectedCost * 1.1) {
    return buildResult(input, "keep", input.plan, null, expectedCost, {
      reason: `You're paying $${input.monthlySpend}/mo but ${toolPricing.displayName} ${currentPlanData?.name} should cost $${expectedCost}/mo for ${input.seats} seat(s). Check your billing.`,
      severity: "high",
    });
  }

  // --- RULE 2: Claude Team minimum seats ---
  if (input.tool === "claude" && input.plan === "team" && input.seats < 5) {
    const proMonthlyCost = PRICING.claude.plans.pro.pricePerSeat * input.seats;
    return buildResult(input, "downgrade", "pro", null, proMonthlyCost, {
      reason: `Claude Team requires a 5-seat minimum ($${30 * input.seats}/mo) but you only have ${input.seats} user(s). Claude Pro at $20/seat saves $${input.monthlySpend - proMonthlyCost}/mo with identical features for small teams.`,
      severity: "high",
    });
  }

  // --- RULE 3: ChatGPT Team overkill for small teams ---
  if (input.tool === "chatgpt" && input.plan === "team" && input.seats <= 2) {
    const plusCost = PRICING.chatgpt.plans.plus.pricePerSeat * input.seats;
    return buildResult(input, "downgrade", "plus", null, plusCost, {
      reason: `ChatGPT Team ($30/seat) is designed for collaboration features. With only ${input.seats} user(s), ChatGPT Plus ($20/seat) provides the same AI capability at $${input.monthlySpend - plusCost}/mo less.`,
      severity: "high",
    });
  }

  // --- RULE 4: GitHub Copilot Enterprise overkill for small teams ---
  if (
    input.tool === "github-copilot" &&
    input.plan === "enterprise" &&
    teamSize < 20
  ) {
    const businessCost =
      PRICING["github-copilot"].plans.business.pricePerSeat * input.seats;
    return buildResult(
      input,
      "downgrade",
      "business",
      null,
      businessCost,
      {
        reason: `GitHub Copilot Enterprise ($39/seat) adds fine-tuned models and audit logs — features that matter at 20+ developers. Your team of ${teamSize} would get identical day-to-day value from Business ($19/seat), saving $${input.monthlySpend - businessCost}/mo.`,
        severity: "medium",
      }
    );
  }

  // --- RULE 5: Cursor Business overkill for solo/small teams ---
  if (
    input.tool === "cursor" &&
    input.plan === "business" &&
    input.seats <= 3
  ) {
    const proCost = PRICING.cursor.plans.pro.pricePerSeat * input.seats;
    return buildResult(input, "downgrade", "pro", null, proCost, {
      reason: `Cursor Business ($40/seat) adds SSO and admin controls — only valuable for larger teams. With ${input.seats} seat(s), Cursor Pro ($20/seat) is identical for actual coding work, saving $${input.monthlySpend - proCost}/mo.`,
      severity: "medium",
    });
  }

  // --- RULE 6: Claude Max overkill unless heavy usage ---
  if (input.tool === "claude" && input.plan === "max" && teamSize <= 2) {
    const proCost = PRICING.claude.plans.pro.pricePerSeat * input.seats;
    return buildResult(input, "downgrade", "pro", null, proCost, {
      reason: `Claude Max ($100/seat) is for users hitting Pro's rate limits daily. For a team of ${teamSize}, Claude Pro ($20/seat) covers typical usage and saves $${input.monthlySpend - proCost}/mo.`,
      severity: "high",
    });
  }

  // --- RULE 7: Wrong tool for use case ---
  if (useCase === "coding" && input.tool === "chatgpt") {
    const cursorCost = PRICING.cursor.plans.pro.pricePerSeat * input.seats;
    if (cursorCost < input.monthlySpend) {
      return buildResult(input, "switch", input.plan, "cursor", cursorCost, {
        reason: `For a coding-focused team, Cursor Pro ($20/seat) integrates directly into your IDE with codebase awareness. ChatGPT requires copy-pasting code manually. Switching saves $${input.monthlySpend - cursorCost}/mo and improves workflow.`,
        severity: "medium",
      });
    }
  }

  // --- RULE 8: Windsurf cheaper alternative to Cursor for budget teams ---
  if (
    input.tool === "cursor" &&
    input.plan === "pro" &&
    teamSize >= 5
  ) {
    const windsurfCost = PRICING.windsurf.plans.pro.pricePerSeat * input.seats;
    if (windsurfCost < input.monthlySpend) {
      return buildResult(
        input,
        "switch",
        "pro",
        "windsurf",
        windsurfCost,
        {
          reason: `Windsurf Pro ($15/seat) offers comparable AI coding assistance to Cursor Pro ($20/seat). For your team of ${input.seats}, switching saves $${input.monthlySpend - windsurfCost}/mo annually with similar core features.`,
          severity: "low",
        }
      );
    }
  }

  // --- RULE 9: Already optimal ---
  return buildResult(input, "keep", input.plan, null, expectedCost, {
    reason: `${toolPricing.displayName} ${currentPlanData?.name} is well-matched to your team size and use case. No immediate savings identified.`,
    severity: "optimal",
  });
}

// ----------------------------------------------------------------
// Helper: builds the result object cleanly
// ----------------------------------------------------------------
function buildResult(
  input: ToolInput,
  action: ToolAuditResult["recommendedAction"],
  recommendedPlan: string | null,
  recommendedTool: ToolAuditResult["recommendedTool"],
  estimatedMonthlyCost: number,
  meta: { reason: string; severity: ToolAuditResult["severity"] }
): ToolAuditResult {
  const monthlySavings = Math.max(0, input.monthlySpend - estimatedMonthlyCost);

  return {
    tool: input.tool,
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    recommendedAction: action,
    recommendedPlan: action === "keep" ? null : recommendedPlan,
    recommendedTool,
    estimatedMonthlyCost,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason: meta.reason,
    severity: meta.severity,
  };
}