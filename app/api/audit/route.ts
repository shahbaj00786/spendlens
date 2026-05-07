import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { AuditInput } from "@/lib/audit-engine/types";
import connectDB from "@/lib/db/mongoose";
import Audit from "@/lib/models/Audit";

export async function POST(req: NextRequest) {
  try {
    const body: AuditInput = await req.json();

    // Basic validation
    if (!body.tools || !body.teamSize || !body.useCase) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.tools.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one tool" },
        { status: 400 }
      );
    }

    // Run the audit engine
    const auditOutput = runAudit(body);

    // Connect to MongoDB and save
    await connectDB();

    const audit = await Audit.create({
      toolsInput: body.tools,
      teamSize: body.teamSize,
      useCase: body.useCase,
      auditResults: auditOutput.results,
      totalMonthlySavings: auditOutput.totalMonthlySavings,
      totalAnnualSavings: auditOutput.totalAnnualSavings,
      isHighSavings: auditOutput.isHighSavings,
    });

    // Generate AI summary in background (non-blocking)
    generateSummary(audit._id.toString(), body, auditOutput).catch(
      console.error
    );

    return NextResponse.json({
      auditId: audit._id.toString(),
      results: auditOutput.results,
      totalMonthlySavings: auditOutput.totalMonthlySavings,
      totalAnnualSavings: auditOutput.totalAnnualSavings,
      isHighSavings: auditOutput.isHighSavings,
    });
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Failed to process audit" },
      { status: 500 }
    );
  }
}

// Generates AI summary after audit is saved
// Non-blocking — runs in background
async function generateSummary(
  auditId: string,
  input: AuditInput,
  output: ReturnType<typeof runAudit>
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditId, input, output }),
    });

    if (!response.ok) throw new Error("Summary generation failed");
  } catch (error) {
    console.error("Background summary failed:", error);
    // Non-fatal — audit still works without summary
  }
}
