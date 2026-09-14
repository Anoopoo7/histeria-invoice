import { TemplateJson, TemplateComponent } from "@/types";

const defaultComponents: TemplateComponent[] = [
  {
    id: "c-logo-header",
    type: "HEADER",
    visible: true,
    props: { title: "TAX INVOICE", showLogo: true },
  },
  {
    id: "c-business-info",
    type: "BUSINESS_INFO",
    visible: true,
    props: { showGstin: true },
  },
  {
    id: "c-customer-info",
    type: "CUSTOMER_INFO",
    visible: true,
    props: { title: "Billed To" },
  },
  {
    id: "c-invoice-details",
    type: "INVOICE_DETAILS",
    visible: true,
  },
  {
    id: "c-divider-1",
    type: "DIVIDER",
    visible: true,
  },
  {
    id: "c-items-table",
    type: "ITEMS_TABLE",
    visible: true,
  },
  {
    id: "c-summary",
    type: "SUMMARY",
    visible: true,
  },
  {
    id: "c-divider-2",
    type: "DIVIDER",
    visible: true,
  },
  {
    id: "c-payment-info",
    type: "PAYMENT_INFO",
    visible: true,
    props: { showBankDetails: true, showUpi: true },
  },
  {
    id: "c-notes-terms",
    type: "NOTES_TERMS",
    visible: true,
  },
  {
    id: "c-footer",
    type: "FOOTER",
    visible: true,
    props: { text: "Thank you for your business!" },
  },
];

export const STARTER_TEMPLATES: {
  name: string;
  description: string;
  isDefault: boolean;
  templateJson: TemplateJson;
}[] = [
  {
    name: "Modern",
    description: "Sleek and contemporary with dark slate accents and clear visual hierarchy.",
    isDefault: true,
    templateJson: {
      version: "1.0",
      page: { size: "A4", orientation: "portrait", padding: 32 },
      styles: {
        fontFamily: "Inter",
        primaryColor: "#0f172a",
        secondaryColor: "#334155",
        textColor: "#1e293b",
        backgroundColor: "#ffffff",
        accentColor: "#2563eb",
        borderRadius: 6,
      },
      components: defaultComponents,
    },
  },
  {
    name: "Minimal",
    description: "Clean monochrome layout focusing on readability and simplicity.",
    isDefault: false,
    templateJson: {
      version: "1.0",
      page: { size: "A4", orientation: "portrait", padding: 28 },
      styles: {
        fontFamily: "Inter",
        primaryColor: "#171717",
        secondaryColor: "#525252",
        textColor: "#262626",
        backgroundColor: "#ffffff",
        accentColor: "#404040",
        borderRadius: 2,
      },
      components: defaultComponents.map((c) =>
        c.type === "DIVIDER" ? { ...c, visible: false } : c
      ),
    },
  },
  {
    name: "Corporate",
    description: "Formal business template with classic navy headers and clear structure.",
    isDefault: false,
    templateJson: {
      version: "1.0",
      page: { size: "A4", orientation: "portrait", padding: 36 },
      styles: {
        fontFamily: "Inter",
        primaryColor: "#1e3a8a",
        secondaryColor: "#1d4ed8",
        textColor: "#1e293b",
        backgroundColor: "#ffffff",
        accentColor: "#1e40af",
        borderRadius: 4,
      },
      components: defaultComponents,
    },
  },
  {
    name: "GST Classic",
    description: "Optimized for Indian GST compliance with explicit state codes & tax breakdown.",
    isDefault: false,
    templateJson: {
      version: "1.0",
      page: { size: "A4", orientation: "portrait", padding: 32 },
      styles: {
        fontFamily: "Inter",
        primaryColor: "#065f46",
        secondaryColor: "#047857",
        textColor: "#064e3b",
        backgroundColor: "#ffffff",
        accentColor: "#059669",
        borderRadius: 4,
      },
      components: defaultComponents,
    },
  },
];

export const STARTER_TAX_PROFILES = [
  { name: "GST 5%", type: "GST", rate: 5, cgstRate: 2.5, sgstRate: 2.5, igstRate: 5 },
  { name: "GST 12%", type: "GST", rate: 12, cgstRate: 6, sgstRate: 6, igstRate: 12 },
  { name: "GST 18%", type: "GST", rate: 18, cgstRate: 9, sgstRate: 9, igstRate: 18 },
  { name: "GST 28%", type: "GST", rate: 28, cgstRate: 14, sgstRate: 14, igstRate: 28 },
  { name: "Exempt / 0%", type: "EXEMPT", rate: 0, cgstRate: 0, sgstRate: 0, igstRate: 0 },
];
