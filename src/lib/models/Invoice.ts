import mongoose, { Schema, Document, Model } from "mongoose";
import {
  CustomerSnapshot,
  InvoiceDiscount,
  InvoiceItemSnapshot,
  InvoiceStatus,
  InvoiceTotals,
  PaymentSnapshot,
  SellerSnapshot,
  TaxSnapshot,
  TemplateJson,
} from "@/types";

export interface IInvoice extends Document {
  organizationId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  customerSnapshot: CustomerSnapshot;
  sellerSnapshot: SellerSnapshot;
  itemsSnapshot: InvoiceItemSnapshot[];
  taxSnapshot: TaxSnapshot;
  discount: InvoiceDiscount;
  totals: InvoiceTotals;
  notes?: string;
  terms?: string;
  paymentSnapshot: PaymentSnapshot;
  templateSnapshot: TemplateJson;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    invoiceNumber: { type: String, required: true, trim: true },
    invoiceDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "GENERATED", "SENT", "PAID", "OVERDUE", "CANCELLED"],
      default: "GENERATED",
    },
    customerSnapshot: { type: Schema.Types.Mixed, required: true },
    sellerSnapshot: { type: Schema.Types.Mixed, required: true },
    itemsSnapshot: { type: Schema.Types.Mixed, required: true },
    taxSnapshot: { type: Schema.Types.Mixed, required: true },
    discount: { type: Schema.Types.Mixed, required: true },
    totals: { type: Schema.Types.Mixed, required: true },
    notes: { type: String },
    terms: { type: String },
    paymentSnapshot: { type: Schema.Types.Mixed, default: {} },
    templateSnapshot: { type: Schema.Types.Mixed, required: true },
    publicId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

InvoiceSchema.index({ organizationId: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ publicId: 1 }, { unique: true });
InvoiceSchema.index({ organizationId: 1, createdAt: -1 });

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
