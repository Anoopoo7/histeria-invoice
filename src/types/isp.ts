export interface IspCompany {
  brandName: string; // e.g. "Kerala Connect"
  legalName: string; // e.g. "Kerala Broadband Services"
  logoUrl?: string; // Optional logo image URL or base64 data URI
  address: string; // Registered office address
  city?: string;
  state: string; // e.g. "Kerala"
  stateCode: string; // e.g. "32"
  gstin: string; // e.g. "32XXXXXXXXXXXXXX"
  pan?: string; // e.g. "AABCK1234F"
  phone: string; // Support phone
  email: string; // Support email
  website?: string; // Website URL
}

export interface IspInvoiceInfo {
  invoiceNumber: string; // e.g. "ISP/2026-27/000001"
  invoiceDate: string; // e.g. "31 October 2026"
  billingPeriodStart: string; // e.g. "01 October 2026"
  billingPeriodEnd: string; // e.g. "15 October 2026"
  billingCycle: string; // e.g. "15 Days"
  dueDate: string; // e.g. "05 November 2026"
  placeOfSupply: string; // e.g. "32 - Kerala"
  placeOfSupplyCode?: string; // e.g. "32"
  reverseCharge: "Yes" | "No" | boolean; // Default "No"
}

export interface IspCustomer {
  name: string; // e.g. "Rahul Kumar"
  customerId: string; // e.g. "ISP1001"
  connectionId: string; // e.g. "CON1001"
  phone: string; // e.g. "9876543210"
  email?: string;
  billingAddress: string; // e.g. "Kollam, Kerala"
  installationAddress: string; // Service Installation Address
  state: string; // e.g. "Kerala"
  stateCode: string; // e.g. "32"
  gstin?: string; // Optional customer GSTIN
}

export interface IspServiceItem {
  id?: string;
  description: string; // e.g. "Broadband Internet Subscription – 50 Mbps"
  sac: string; // e.g. "998422"
  billingPeriod: string; // e.g. "15 Days" or "01 Oct - 15 Oct 2026"
  quantity: number; // e.g. 1
  unitPrice: number; // e.g. 299.00
  taxableAmount: number; // line total before tax
  gstRate?: number; // e.g. 18 (percent), defaults to 18
  isGstInclusive?: boolean;
}

export interface IspGstCalculation {
  subtotal: number;
  discount: number;
  taxableValue: number;
  cgstRate: number; // e.g. 9
  cgstAmount: number; // e.g. 26.91
  sgstRate: number; // e.g. 9
  sgstAmount: number; // e.g. 26.91
  igstRate: number; // e.g. 0 or 18
  igstAmount: number; // e.g. 0.00
  totalGst: number; // e.g. 53.82
  finalInvoiceAmount: number; // e.g. 352.82
  isInterState: boolean;
  amountInWords?: string;
}

export interface IspPaymentSummary {
  previousBalance: number; // e.g. 0.00
  currentInvoiceAmount: number; // e.g. 352.82
  previousPayments: number; // e.g. 0.00
  outstandingBalance: number; // e.g. 0.00
  totalAmountPayable: number; // e.g. 352.82
  status: "PAID" | "UNPAID" | "PARTIALLY PAID";
  upiId?: string; // e.g. "keralaconnect@upi"
  bankName?: string; // e.g. "HDFC Bank"
  accountNumber?: string; // e.g. "50200012345678"
  ifsc?: string; // e.g. "HDFC0001234"
  branch?: string;
  paymentInstructions?: string;
  paymentReference?: string; // If already paid
}

export interface IspQrCodeConfig {
  enabled: boolean;
  url: string; // e.g. "https://yourdomain.com/invoice/INV-2026-0001"
  label?: string; // e.g. "Scan to View Invoice / Pay Online"
  dataUri?: string; // Generated base64 image data URI
}

export interface IspFooterConfig {
  amountInWords?: string;
  terms?: string[];
  dueDateReminder?: string;
  supportPhone?: string;
  supportEmail?: string;
  thankYouMessage?: string;
  authorizedSignatoryTitle?: string;
  isComputerGeneratedDeclaration?: boolean;
  eInvoice?: {
    irn?: string;
    ackNo?: string;
    ackDate?: string;
  };
}

export interface IspInvoiceData {
  company: IspCompany;
  invoice: IspInvoiceInfo;
  customer: IspCustomer;
  items: IspServiceItem[];
  gst: IspGstCalculation;
  payment: IspPaymentSummary;
  qrCode: IspQrCodeConfig;
  footer: IspFooterConfig;
}
