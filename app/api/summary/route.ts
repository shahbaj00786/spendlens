import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import connectDB from "@/lib/db/mongoose";
import Audit from "@/lib/models/Audit";
import { AuditInput, AuditOutput } from "@/lib/audit-engine/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const {
      auditId,
      input,
      output,
    }: {
      auditId: string;
      input: AuditInput;
      output: AuditOutput;
    } = await req.json();

    const summary = await generateSummary(input, output);

    // Save summary to audit record
    await connectDB();
    await Audit.findByIdAndUpdate(auditId, { aiSummary: summary });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}

async function generateSummary(
  input: AuditInput,
  output: AuditOutput
): Promise<string> {
  const toolsList = input.tools
    .map((t) => `${t.tool} (${t.plan}, ${t.seats} seats, $${t.monthlySpend}/mo)`)
    .join(", ");

  const topSavings = output.results
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 2)
    .map((r) => `${r.tool}: save $${r.monthlySavings}/mo by ${r.recommendedAction === "switch" ? `switching to ${r.recommendedTool}` : `downgrading to ${r.recommendedPlan}`}`)
    .join("; ");

  const prompt = `You are a financial advisor specializing in SaaS costs for startups.

A ${input.teamSize}-person team using AI tools for ${input.useCase} just ran a spend audit.

Their current tools: ${toolsList}
Total potential monthly savings: $${output.totalMonthlySavings}
Top opportunities: ${topSavings || "spending is already optimized"}

Write a personalized 2-3 sentence summary (max 100 words) that:
1. Acknowledges their specific situation
2. Highlights the biggest saving opportunity (if any)
3. Ends with a concrete next step

Be direct and specific. No generic advice. No bullet points. Plain paragraph only.`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() || getFallbackSummary(output)
    );
  } catch (error) {
    console.error("AI generation failed, using fallback:", error);
    return getFallbackSummary(output);
  }
}

// Fallback if AI fails — always returns something useful
function getFallbackSummary(output: AuditOutput): string {
  if (output.totalMonthlySavings === 0) {
    return "Your AI tool stack looks well-optimized. You're on the right plans for your team size and use case. We'll notify you when new savings opportunities emerge for your stack.";
  }

  const topResult = output.results
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  return `Our audit found $${output.totalMonthlySavings}/month in potential savings across your AI tools. Your biggest opportunity is ${topResult?.tool} — ${topResult?.reason} Review the recommendations below to start saving $${output.totalAnnualSavings}/year.`;
}