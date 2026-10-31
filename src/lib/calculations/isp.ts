import QRCode from "qrcode";
import {
  IspCompany,
  IspCustomer,
  IspFooterConfig,
  IspGstCalculation,
  IspInvoiceData,
  IspInvoiceInfo,
  IspPaymentSummary,
  IspQrCodeConfig,
  IspServiceItem,
} from "@/types/isp";

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertLessThanThousand(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) {
    const unit = n % 10;
    return TENS[Math.floor(n / 10)] + (unit ? "-" + ONES[unit] : "");
  }
  const rem = n % 100;
  return (
    ONES[Math.floor(n / 100)] +
    " Hundred" +
    (rem ? " and " + convertLessThanThousand(rem) : "")
  );
}

/**
 * Converts Indian Rupee amounts to formal Indian English words (Crores, Lakhs, Thousands, Hundreds)
 * Example: 352.82 -> "INR Three Hundred Fifty-Two and Eighty-Two Paise Only"
 */
export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return "INR Zero Only";
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const rupees = Math.floor(absAmount);
  const paise = Math.round((absAmount - rupees) * 100);

  let remaining = rupees;
  const parts: string[] = [];

  // Crores (1,00,00,000)
  const crores = Math.floor(remaining / 10000000);
  if (crores > 0) {
    parts.push(convertLessThanThousand(crores) + " Crore");
    remaining %= 10000000;
  }

  // Lakhs (1,00,000)
  const lakhs = Math.floor(remaining / 100000);
  if (lakhs > 0) {
    parts.push(convertLessThanThousand(lakhs) + " Lakh");
    remaining %= 100000;
  }

  // Thousands (1,000)
  const thousands = Math.floor(remaining / 1000);
  if (thousands > 0) {
    parts.push(convertLessThanThousand(thousands) + " Thousand");
    remaining %= 1000;
  }

  // Remaining hundreds, tens and units
  if (remaining > 0) {
    parts.push(convertLessThanThousand(remaining));
  }

  let words = "INR " + (parts.length > 0 ? parts.join(" ") : "Zero");

  if (paise > 0) {
    words += " and " + convertLessThanThousand(paise) + " Paise";
  }

  words += " Only";

  return isNegative ? "Minus " + words : words;
}

/**
 * Calculates GST components (CGST + SGST vs IGST) based on Place of Supply and GST rates
 */
export function calculateIspGst(
  items: IspServiceItem[],
  discountAmount: number = 0,
  sellerStateCode: string = "32",
  placeOfSupplyCode: string = "32"
): {
  items: IspServiceItem[];
  gst: IspGstCalculation;
} {
  // Normalize state codes
  const sState = (sellerStateCode || "32").trim().padStart(2, "0");
  const pState = (placeOfSupplyCode || "32").trim().padStart(2, "0");
  const isInterState = sState !== pState;

  let rawSubtotal = 0;

  // Process items
  const processedItems = items.map((item) => {
    const qty = item.quantity || 1;
    let taxable = item.taxableAmount;

    if (item.isGstInclusive) {
      const rate = item.gstRate ?? 18;
      taxable = round2((item.unitPrice * qty) / (1 + rate / 100));
    } else if (!taxable && item.unitPrice) {
      taxable = round2(item.unitPrice * qty);
    } else {
      taxable = round2(taxable || 0);
    }

    rawSubtotal += taxable;

    return {
      ...item,
      quantity: qty,
      unitPrice: round2(item.unitPrice || taxable / qty),
      taxableAmount: taxable,
      gstRate: item.gstRate ?? 18,
      sac: item.sac || "998422",
      billingPeriod: item.billingPeriod || "15 Days",
    };
  });

  rawSubtotal = round2(rawSubtotal);
  const safeDiscount = round2(Math.min(rawSubtotal, Math.max(0, discountAmount)));
  const taxableValue = round2(Math.max(0, rawSubtotal - safeDiscount));

  // Determine weighted or primary GST rate (default 18%)
  const primaryGstRate = processedItems[0]?.gstRate ?? 18;

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstRate = primaryGstRate;
    igstAmount = round2(taxableValue * (igstRate / 100));
  } else {
    cgstRate = primaryGstRate / 2;
    sgstRate = primaryGstRate / 2;
    cgstAmount = round2(taxableValue * (cgstRate / 100));
    sgstAmount = round2(taxableValue * (sgstRate / 100));
  }

  const totalGst = round2(cgstAmount + sgstAmount + igstAmount);
  const finalInvoiceAmount = round2(taxableValue + totalGst);

  const gst: IspGstCalculation = {
    subtotal: rawSubtotal,
    discount: safeDiscount,
    taxableValue,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalGst,
    finalInvoiceAmount,
    isInterState,
    amountInWords: numberToIndianWords(finalInvoiceAmount),
  };

  return {
    items: processedItems,
    gst,
  };
}

/**
 * Dynamically generates a high-resolution QR code data URI
 */
export async function generateIspQrCodeDataUri(url: string): Promise<string> {
  if (!url || !url.trim()) return "";
  try {
    const dataUri = await QRCode.toDataURL(url.trim(), {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
    return dataUri;
  } catch (err) {
    console.error("Failed to generate QR code:", err);
    return "";
  }
}

export const ISP_QR_DOMAIN = "https://histeriainvoice.vercel.app";

/**
 * Builds a clean PDF preview URL pointing to /api/isp/invoice?inv=<invoiceNumber>
 * so scanning the QR code fetches the saved invoice record directly from MongoDB.
 */
export function buildIspInvoicePreviewUrl(
  input: {
    invoice?: Partial<IspInvoiceInfo>;
  },
  baseOrigin: string = ISP_QR_DOMAIN
): string {
  const origin = baseOrigin.replace(/\/$/, "");
  const inv = input.invoice?.invoiceNumber || "ISP/2026-27/000001";
  return `${origin}/api/isp/invoice?inv=${encodeURIComponent(inv)}`;
}

/**
 * Takes raw API input or partial invoice data and produces fully calculated, ready-to-render IspInvoiceData
 */
export async function prepareIspInvoiceData(
  input: Partial<IspInvoiceData>,
  baseOrigin: string = ISP_QR_DOMAIN
): Promise<IspInvoiceData> {
  const company: IspCompany = {
    brandName: input.company?.brandName || "Kerala Connect",
    legalName: input.company?.legalName || "Kerala Broadband Services",
    logoUrl: input.company?.logoUrl,
    address: input.company?.address || "Kerala, India",
    city: input.company?.city || "Kollam",
    state: input.company?.state || "Kerala",
    stateCode: input.company?.stateCode || "32",
    gstin: input.company?.gstin ?? "",
    pan: input.company?.pan ?? "",
    phone: input.company?.phone || "+91 98765 43210",
    email: input.company?.email || "support@keralaconnect.net",
    website: input.company?.website || "www.keralaconnect.net",
  };

  const invoice: IspInvoiceInfo = {
    invoiceNumber: input.invoice?.invoiceNumber || "ISP/2026-27/000001",
    invoiceDate: input.invoice?.invoiceDate || "31 October 2026",
    billingPeriodStart: input.invoice?.billingPeriodStart || "01 October 2026",
    billingPeriodEnd: input.invoice?.billingPeriodEnd || "15 October 2026",
    billingCycle: input.invoice?.billingCycle || "15 Days",
    dueDate: input.invoice?.dueDate || "05 November 2026",
    placeOfSupply: input.invoice?.placeOfSupply || "32 - Kerala",
    placeOfSupplyCode:
      input.invoice?.placeOfSupplyCode ||
      (input.invoice?.placeOfSupply?.match(/^\d+/)?.[0] ?? "32"),
    reverseCharge: input.invoice?.reverseCharge ?? "No",
  };

  const customer: IspCustomer = {
    name: input.customer?.name || "Rahul Kumar",
    customerId: input.customer?.customerId || "ISP1001",
    connectionId: input.customer?.connectionId || "CON1001",
    phone: input.customer?.phone || "9876543210",
    email: input.customer?.email || "rahul.kumar@example.com",
    billingAddress: input.customer?.billingAddress || "Kollam, Kerala",
    installationAddress:
      input.customer?.installationAddress ||
      input.customer?.billingAddress ||
      "Kollam, Kerala",
    state: input.customer?.state || "Kerala",
    stateCode: input.customer?.stateCode || "32",
    gstin: input.customer?.gstin,
  };

  const rawItems: IspServiceItem[] =
    input.items && input.items.length > 0
      ? input.items
      : [
        {
          description: "Broadband Internet Subscription – 50 Mbps",
          sac: "998422",
          billingPeriod: "15 Days",
          quantity: 1,
          unitPrice: 299.0,
          taxableAmount: 299.0,
          gstRate: 18,
        },
      ];

  const discountAmount = input.gst?.discount || 0;
  const { items, gst } = calculateIspGst(
    rawItems,
    discountAmount,
    company.stateCode,
    invoice.placeOfSupplyCode || customer.stateCode
  );

  const prevBalance = round2(input.payment?.previousBalance || 0);
  const prevPayments = round2(input.payment?.previousPayments || 0);
  const outstanding = round2(prevBalance - prevPayments + gst.finalInvoiceAmount);

  const payment: IspPaymentSummary = {
    previousBalance: prevBalance,
    currentInvoiceAmount: gst.finalInvoiceAmount,
    previousPayments: prevPayments,
    outstandingBalance: Math.max(0, outstanding),
    totalAmountPayable: Math.max(0, outstanding),
    status: input.payment?.status || "UNPAID",
    upiId: input.payment?.upiId || "keralaconnect@upi",
    bankName: input.payment?.bankName || "Federal Bank",
    accountNumber: input.payment?.accountNumber || "12340200056789",
    ifsc: input.payment?.ifsc || "FDRL0001234",
    branch: input.payment?.branch || "Kollam Main Branch",
    paymentInstructions:
      input.payment?.paymentInstructions ||
      "Please pay on or before the due date to avoid service disconnection. Use your Connection ID as reference.",
    paymentReference: input.payment?.paymentReference,
  };

  // QR Code configuration: Always encode /api/isp/invoice?inv=<invoiceNumber>
  const qrEnabled = input.qrCode?.enabled !== false;
  const qrUrl = buildIspInvoicePreviewUrl({ invoice }, baseOrigin);
  const qrLabel =
    input.qrCode?.label || "Scan to View Invoice / Pay Online";

  let qrDataUri = "";
  if (qrEnabled && qrUrl) {
    qrDataUri = await generateIspQrCodeDataUri(qrUrl);
  }

  const qrCode: IspQrCodeConfig = {
    enabled: qrEnabled,
    url: qrUrl,
    label: qrLabel,
    dataUri: qrDataUri,
  };

  const footer: IspFooterConfig = {
    amountInWords: gst.amountInWords,
    terms: input.footer?.terms || [
      "This invoice is issued for the 15-day billing cycle specified above.",
      "Payments must be made on or before the due date to ensure uninterrupted broadband connectivity.",
      "Charges are billed strictly in advance according to the subscribed telecom plan.",
      "For queries or complaints regarding billing, contact customer support within 7 days of invoice date.",
    ],
    dueDateReminder:
      input.footer?.dueDateReminder ||
      `Please clear the payable amount on or before ${invoice.dueDate} to prevent automated disconnection.`,
    supportPhone: input.footer?.supportPhone || company.phone,
    supportEmail: input.footer?.supportEmail || company.email,
    thankYouMessage:
      input.footer?.thankYouMessage ||
      "Thank you for choosing us. We appreciate your trust in our services.\nYour connection matters to us. For assistance, contact our customer support team.",
    authorizedSignatoryTitle:
      input.footer?.authorizedSignatoryTitle || "Authorized Signatory",
    isComputerGeneratedDeclaration:
      input.footer?.isComputerGeneratedDeclaration !== false,
    eInvoice: input.footer?.eInvoice,
  };

  return {
    company,
    invoice,
    customer,
    items,
    gst,
    payment,
    qrCode,
    footer,
  };
}
