import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Audit from "@/lib/models/Audit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();
    const audit = await Audit.findById(id).select("aiSummary").lean();

    if (!audit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      summary: audit.aiSummary || null,
    });
  } catch (error) {
    console.error("Summary fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}