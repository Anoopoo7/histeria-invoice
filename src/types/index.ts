export type InvoiceStatus =
  | "DRAFT"
  | "GENERATED"
  | "SENT"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  userId?: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  addedAt: string;
}

export interface OrganizationDoc {
  _id: string;
  ownerId: string;
  name: string;
  legalName?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
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
  defaultTaxProfileId?: string;
  defaultTemplateId?: string;
  members: OrganizationMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TaxProfileDoc {
  _id: string;
  organizationId: string;
  name: string;
  type: "GST" | "CUSTOM" | "EXEMPT";
  rate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Template Data Model
export type ComponentType =
  | "HEADER"
  | "LOGO"
  | "BUSINESS_INFO"
  | "CUSTOMER_INFO"
  | "INVOICE_DETAILS"
  | "ITEMS_TABLE"
  | "SUMMARY"
  | "PAYMENT_INFO"
  | "UPI_QR"
  | "NOTES_TERMS"
  | "SIGNATURE"
  | "DIVIDER"
  | "TEXT"
  | "HEADING"
  | "FOOTER";

export interface TemplateComponentProps {
  title?: string;
  text?: string;
  alignment?: "left" | "center" | "right";
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl";
  showLogo?: boolean;
  showGstin?: boolean;
  showBankDetails?: boolean;
  showUpi?: boolean;
  customColor?: string;
  paddingY?: number;
}

export interface TemplateComponent {
  id: string;
  type: ComponentType;
  visible: boolean;
  props?: TemplateComponentProps;
}

export interface TemplateJson {
  version: string;
  page: {
    size: "A4";
    orientation: "portrait";
    padding: number;
  };
  styles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    backgroundColor: string;
    accentColor: string;
    borderRadius: number;
  };
  components: TemplateComponent[];
}

export interface InvoiceTemplateDoc {
  _id: string;
  organizationId: string;
  name: string;
  description?: string;
  templateJson: TemplateJson;
  thumbnail?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItemInput {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxProfileId?: string;
  taxRate: number;
}

export interface InvoiceItemSnapshot extends InvoiceItemInput {
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  lineTotal: number;
}

export interface InvoiceDiscount {
  type: "PERCENTAGE" | "FIXED";
  value: number;
}

export interface CustomerSnapshot {
  name: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
}

export interface SellerSnapshot {
  name: string;
  legalName?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  gstRegistered: boolean;
  gstin?: string;
  stateCode?: string;
}

export interface PaymentSnapshot {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  upiId?: string;
}

export interface TaxBreakdownItem {
  rate: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
}

export interface TaxSnapshot {
  isSameState: boolean;
  sellerStateCode?: string;
  customerStateCode?: string;
  breakdown: TaxBreakdownItem[];
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  grandTotal: number;
}

export interface InvoiceDoc {
  _id: string;
  organizationId: string;
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
  createdAt: string;
  updatedAt: string;
}
