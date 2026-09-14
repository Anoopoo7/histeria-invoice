import mongoose, { Schema, Document, Model } from "mongoose";
import { TemplateJson } from "@/types";

export interface IInvoiceTemplate extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  templateJson: TemplateJson;
  thumbnail?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceTemplateSchema = new Schema<IInvoiceTemplate>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    templateJson: { type: Schema.Types.Mixed, required: true },
    thumbnail: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

InvoiceTemplateSchema.index({ organizationId: 1 });

export const InvoiceTemplate: Model<IInvoiceTemplate> =
  mongoose.models.InvoiceTemplate ||
  mongoose.model<IInvoiceTemplate>("InvoiceTemplate", InvoiceTemplateSchema);
