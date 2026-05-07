import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Audit from "@/lib/models/Audit";
import Lead from "@/lib/models/Lead";
import { sendAuditEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { auditId, email, companyName, role } = await req.json();

    // Basic validation
    if (!auditId || !email) {
      return NextResponse.json(
        { error: "Audit ID and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the audit
    const audit = await Audit.findById(auditId);
    if (!audit) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    // Update audit with lead info
    audit.email = email;
    audit.companyName = companyName || null;
    audit.role = role || null;
    await audit.save();

    // Create lead record
    await Lead.create({
      auditId: audit._id,
      email,
      companyName: companyName || null,
      role: role || null,
      monthlySavings: audit.totalMonthlySavings,
      isHighValue: audit.isHighSavings,
    });

    // Send confirmation email
    try {
      await sendAuditEmail({
        to: email,
        monthlySavings: audit.totalMonthlySavings,
        annualSavings: audit.totalAnnualSavings,
        isHighSavings: audit.isHighSavings,
        auditId: auditId,
      });
      audit.emailSent = true;
      await audit.save();
    } catch (emailError) {
      // Non-fatal — lead is saved even if email fails
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 }
    );
  }
}