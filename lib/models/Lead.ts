import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  auditId: mongoose.Types.ObjectId;
  email: string;
  companyName: string | null;
  role: string | null;
  monthlySavings: number;
  isHighValue: boolean;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    auditId: {
      type: Schema.Types.ObjectId,
      ref: "Audit",
      required: true,
    },
    email: { type: String, required: true },
    companyName: { type: String, default: null },
    role: { type: String, default: null },
    monthlySavings: { type: Number, required: true },
    isHighValue: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate leads from same email
LeadSchema.index({ email: 1 });

export default mongoose.models.Lead ||
  mongoose.model<ILead>("Lead", LeadSchema);