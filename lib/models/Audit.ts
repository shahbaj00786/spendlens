import mongoose, { Schema, Document } from "mongoose";
import { AuditInput, AuditOutput } from "@/lib/audit-engine/types";

export interface IAudit extends Document {
  // User input
  toolsInput: AuditInput["tools"];
  teamSize: number;
  useCase: string;

  // Computed results
  auditResults: AuditOutput["results"];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  aiSummary: string | null;

  // Lead info (filled after email capture)
  email: string | null;
  companyName: string | null;
  role: string | null;
  emailSent: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    toolsInput: { type: Schema.Types.Mixed, required: true },
    teamSize: { type: Number, required: true },
    useCase: { type: String, required: true },
    auditResults: { type: Schema.Types.Mixed, required: true },
    totalMonthlySavings: { type: Number, required: true },
    totalAnnualSavings: { type: Number, required: true },
    isHighSavings: { type: Boolean, default: false },
    aiSummary: { type: String, default: null },
    email: { type: String, default: null },
    companyName: { type: String, default: null },
    role: { type: String, default: null },
    emailSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Audit ||
  mongoose.model<IAudit>("Audit", AuditSchema);