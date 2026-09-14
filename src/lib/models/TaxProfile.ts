import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITaxProfile extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  type: "GST" | "CUSTOM" | "EXEMPT";
  rate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaxProfileSchema = new Schema<ITaxProfile>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["GST", "CUSTOM", "EXEMPT"], default: "GST" },
    rate: { type: Number, required: true, min: 0 },
    cgstRate: { type: Number, default: 0, min: 0 },
    sgstRate: { type: Number, default: 0, min: 0 },
    igstRate: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TaxProfileSchema.index({ organizationId: 1 });

export const TaxProfile: Model<ITaxProfile> =
  mongoose.models.TaxProfile || mongoose.model<ITaxProfile>("TaxProfile", TaxProfileSchema);
