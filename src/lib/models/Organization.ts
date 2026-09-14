import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrganizationMember {
  userId?: mongoose.Types.ObjectId;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  addedAt: Date;
}

export interface IOrganization extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  legalName?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  postalCode?: string;
  gstRegistered: boolean;
  gstin?: string;
  stateCode?: string;
  currency: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  defaultPaymentTerms?: string;
  defaultNotes?: string;
  defaultTerms?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  upiId?: string;
  defaultTaxProfileId?: mongoose.Types.ObjectId;
  defaultTemplateId?: mongoose.Types.ObjectId;
  members: IOrganizationMember[];
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IOrganizationMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ["OWNER", "ADMIN", "MEMBER"], default: "MEMBER" },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrganizationSchema = new Schema<IOrganization>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    legalName: { type: String, trim: true },
    logoUrl: { type: String },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, default: "India", trim: true },
    postalCode: { type: String, trim: true },
    gstRegistered: { type: Boolean, default: true },
    gstin: { type: String, trim: true, uppercase: true },
    stateCode: { type: String, trim: true },
    currency: { type: String, default: "INR" },
    invoicePrefix: { type: String, default: "INV", trim: true },
    nextInvoiceNumber: { type: Number, default: 1001 },
    defaultPaymentTerms: { type: String },
    defaultNotes: { type: String },
    defaultTerms: { type: String },
    bankName: { type: String, trim: true },
    accountName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    ifsc: { type: String, trim: true, uppercase: true },
    upiId: { type: String, trim: true },
    defaultTaxProfileId: { type: Schema.Types.ObjectId, ref: "TaxProfile" },
    defaultTemplateId: { type: Schema.Types.ObjectId, ref: "InvoiceTemplate" },
    members: { type: [MemberSchema], default: [] },
  },
  { timestamps: true }
);

OrganizationSchema.index({ ownerId: 1 });
OrganizationSchema.index({ "members.userId": 1 });
OrganizationSchema.index({ "members.email": 1 });

export const Organization: Model<IOrganization> =
  mongoose.models.Organization || mongoose.model<IOrganization>("Organization", OrganizationSchema);
