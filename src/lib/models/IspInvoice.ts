import mongoose, { Schema, Document, Model } from "mongoose";
import { IspInvoiceData } from "@/types/isp";

export interface IIspInvoice extends Document {
  publicId: string;
  invoiceNumber: string;
  customerId: string;
  connectionId: string;
  customerName: string;
  rawInput: Partial<IspInvoiceData>;
  invoiceData: IspInvoiceData;
  createdAt: Date;
  updatedAt: Date;
}

const IspInvoiceSchema = new Schema<IIspInvoice>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    invoiceNumber: { type: String, required: true, trim: true, index: true },
    customerId: { type: String, required: true, trim: true, index: true },
    connectionId: { type: String, required: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    rawInput: { type: Schema.Types.Mixed, default: {} },
    invoiceData: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

IspInvoiceSchema.index({ invoiceNumber: 1, createdAt: -1 });

export const IspInvoice: Model<IIspInvoice> =
  mongoose.models.IspInvoice ||
  mongoose.model<IIspInvoice>("IspInvoice", IspInvoiceSchema);
