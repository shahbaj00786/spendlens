// All the AI tools we support
export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

// Plans vary per tool
export type UseCaseType =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "mixed";

// What the user fills in for each tool
export interface ToolInput {
  tool: ToolName;
  plan: string;
  seats: number;
  monthlySpend: number;
}

// What the audit engine returns for each tool
export interface ToolAuditResult {
  tool: ToolName;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: "downgrade" | "upgrade" | "switch" | "keep";
  recommendedPlan: string | null;
  recommendedTool: ToolName | null;
  estimatedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: "high" | "medium" | "low" | "optimal";
}

// The full input from the user
export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCaseType;
}

// The full output from the audit engine
export interface AuditOutput {
  results: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean; // true if >$500/mo
  summary?: string;       // AI generated, optional
}