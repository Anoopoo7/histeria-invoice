import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const organizationSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  legalName: z.string().optional(),
  logoUrl: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("India"),
  postalCode: z.string().optional(),
  gstRegistered: z.boolean().default(true),
  gstin: z.string().optional(),
  stateCode: z.string().optional(),
  currency: z.string().default("INR"),
  invoicePrefix: z.string().min(1, "Invoice prefix is required").default("INV"),
  nextInvoiceNumber: z.number().int().positive().default(1001),
  defaultPaymentTerms: z.string().optional(),
  defaultNotes: z.string().optional(),
  defaultTerms: z.string().optional(),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifsc: z.string().optional(),
  upiId: z.string().optional(),
  defaultTaxProfileId: z.string().optional(),
  defaultTemplateId: z.string().optional(),
});

export const taxProfileSchema = z.object({
  name: z.string().min(1, "Tax name is required"),
  type: z.enum(["GST", "CUSTOM", "EXEMPT"]).default("GST"),
  rate: z.number().min(0, "Tax rate must be non-negative"),
  cgstRate: z.number().min(0).default(0),
  sgstRate: z.number().min(0).default(0),
  igstRate: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const templateComponentPropsSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  alignment: z.enum(["left", "center", "right"]).optional(),
  fontSize: z.enum(["xs", "sm", "base", "lg", "xl"]).optional(),
  showLogo: z.boolean().optional(),
  showGstin: z.boolean().optional(),
  showBankDetails: z.boolean().optional(),
  showUpi: z.boolean().optional(),
  customColor: z.string().optional(),
  paddingY: z.number().optional(),
});

export const templateComponentSchema = z.object({
  id: z.string(),
  type: z.enum([
    "HEADER",
    "LOGO",
    "BUSINESS_INFO",
    "CUSTOMER_INFO",
    "INVOICE_DETAILS",
    "ITEMS_TABLE",
    "SUMMARY",
    "PAYMENT_INFO",
    "UPI_QR",
    "NOTES_TERMS",
    "SIGNATURE",
    "DIVIDER",
    "TEXT",
    "HEADING",
    "FOOTER",
  ]),
  visible: z.boolean().default(true),
  props: templateComponentPropsSchema.optional(),
});

export const templateJsonSchema = z.object({
  version: z.string().default("1.0"),
  page: z.object({
    size: z.literal("A4").default("A4"),
    orientation: z.literal("portrait").default("portrait"),
    padding: z.number().default(32),
  }),
  styles: z.object({
    fontFamily: z.string().default("Inter"),
    primaryColor: z.string().default("#0f172a"),
    secondaryColor: z.string().default("#475569"),
    textColor: z.string().default("#1e293b"),
    backgroundColor: z.string().default("#ffffff"),
    accentColor: z.string().default("#2563eb"),
    borderRadius: z.number().default(6),
  }),
  components: z.array(templateComponentSchema),
});

export const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  templateJson: templateJsonSchema,
  thumbnail: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  gstin: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  stateCode: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export const invoiceItemInputSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().gt(0, "Quantity must be greater than 0"),
  unit: z.string().default("pcs"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  taxProfileId: z.string().optional(),
  taxRate: z.number().min(0).default(0),
});

export const invoiceDiscountSchema = z.object({
  type: z.enum(["PERCENTAGE", "FIXED"]).default("PERCENTAGE"),
  value: z.number().min(0).default(0),
});

export const invoiceCreateSchema = z.object({
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z
    .enum(["DRAFT", "GENERATED", "SENT", "PAID", "OVERDUE", "CANCELLED"])
    .default("GENERATED"),
  customer: customerSchema,
  items: z.array(invoiceItemInputSchema).min(1, "At least one line item is required"),
  discount: invoiceDiscountSchema.default({ type: "PERCENTAGE", value: 0 }),
  notes: z.string().optional(),
  terms: z.string().optional(),
  payment: z
    .object({
      bankName: z.string().optional(),
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      ifsc: z.string().optional(),
      upiId: z.string().optional(),
    })
    .optional(),
  templateId: z.string().optional(),
});
