"use server";

import { connectDB } from "@/lib/db/mongodb";
import { Organization } from "@/lib/models/Organization";
import { Invoice } from "@/lib/models/Invoice";
import { InvoiceTemplate } from "@/lib/models/InvoiceTemplate";
import { requireAuth } from "@/lib/auth/session";
import { getActiveOrgForUser } from "./organization";
import { invoiceCreateSchema } from "@/lib/validation";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice";
import { generatePublicId } from "@/lib/utils/cn";
import { STARTER_TEMPLATES } from "@/lib/templates/starter";
import { z } from "zod";

type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;

export async function createInvoiceAction(data: InvoiceCreateInput) {
  try {
    const session = await requireAuth();
    const validated = invoiceCreateSchema.parse(data);
    const org = await getActiveOrgForUser(session.userId);

    // Atomic invoice number generation
    const prefix = org.invoicePrefix || "INV";
    const currentNum = org.nextInvoiceNumber || 1001;
    const generatedInvoiceNumber = validated.invoiceNumber || `${prefix}-${currentNum}`;

    await connectDB();
    // Update next invoice number atomically
    await Organization.updateOne(
      { _id: org._id },
      { $inc: { nextInvoiceNumber: 1 } }
    );

    // Prepare seller snapshot from org
    const sellerSnapshot = {
      name: org.name,
      legalName: org.legalName,
      logoUrl: org.logoUrl,
      email: org.email,
      phone: org.phone,
      website: org.website,
      address: org.address,
      city: org.city,
      state: org.state,
      country: org.country,
      postalCode: org.postalCode,
      gstRegistered: org.gstRegistered,
      gstin: org.gstin,
      stateCode: org.stateCode,
    };

    // Calculate totals server-side authoritative
    const { itemsSnapshot, taxSnapshot, totals } = calculateInvoiceTotals(
      validated.items,
      validated.discount,
      sellerSnapshot,
      validated.customer
    );

    // Prepare template snapshot
    let templateSnapshot = STARTER_TEMPLATES[0].templateJson;
    if (validated.templateId) {
      const tmpl = await InvoiceTemplate.findOne({
        _id: validated.templateId,
        organizationId: org._id,
      }).lean();
      if (tmpl) {
        templateSnapshot = tmpl.templateJson;
      }
    } else if (org.defaultTemplateId) {
      const tmpl = await InvoiceTemplate.findOne({
        _id: org.defaultTemplateId,
        organizationId: org._id,
      }).lean();
      if (tmpl) {
        templateSnapshot = tmpl.templateJson;
      }
    }

    // Payment snapshot
    const paymentSnapshot = {
      bankName: validated.payment?.bankName || org.bankName,
      accountName: validated.payment?.accountName || org.accountName,
      accountNumber: validated.payment?.accountNumber || org.accountNumber,
      ifsc: validated.payment?.ifsc || org.ifsc,
      upiId: validated.payment?.upiId || org.upiId,
    };

    const publicId = generatePublicId();

    const invoice = await Invoice.create({
      organizationId: org._id,
      invoiceNumber: generatedInvoiceNumber,
      invoiceDate: validated.invoiceDate,
      dueDate: validated.dueDate,
      status: validated.status,
      customerSnapshot: validated.customer,
      sellerSnapshot,
      itemsSnapshot,
      taxSnapshot,
      discount: validated.discount,
      totals,
      notes: validated.notes || org.defaultNotes,
      terms: validated.terms || org.defaultTerms,
      paymentSnapshot,
      templateSnapshot,
      publicId,
    });

    return {
      success: true,
      invoice: JSON.parse(JSON.stringify(invoice)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create invoice";
    return { success: false, error: message };
  }
}

export async function getInvoicesAction() {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);

    await connectDB();
    const invoices = await Invoice.find({ organizationId: org._id })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      invoices: JSON.parse(JSON.stringify(invoices)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch invoices";
    return { success: false, error: message };
  }
}

export async function getInvoiceByIdAction(id: string) {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);

    await connectDB();
    const invoice = await Invoice.findOne({ _id: id, organizationId: org._id }).lean();
    if (!invoice) return { success: false, error: "Invoice not found" };

    return {
      success: true,
      invoice: JSON.parse(JSON.stringify(invoice)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch invoice";
    return { success: false, error: message };
  }
}

export async function getInvoiceByPublicIdAction(publicId: string) {
  try {
    await connectDB();
    const invoice = await Invoice.findOne({ publicId }).lean();
    if (!invoice) return { success: false, error: "Invoice not found" };

    return {
      success: true,
      invoice: JSON.parse(JSON.stringify(invoice)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch public invoice";
    return { success: false, error: message };
  }
}

export async function duplicateInvoiceAction(id: string) {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);

    await connectDB();
    const source = await Invoice.findOne({ _id: id, organizationId: org._id }).lean();
    if (!source) return { success: false, error: "Original invoice not found" };

    // New atomic invoice number
    const prefix = org.invoicePrefix || "INV";
    const currentNum = org.nextInvoiceNumber || 1001;
    const newInvoiceNumber = `${prefix}-${currentNum}`;

    await Organization.updateOne(
      { _id: org._id },
      { $inc: { nextInvoiceNumber: 1 } }
    );

    const today = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const duplicate = await Invoice.create({
      organizationId: org._id,
      invoiceNumber: newInvoiceNumber,
      invoiceDate: today,
      dueDate: dueDate,
      status: "DRAFT",
      customerSnapshot: source.customerSnapshot,
      sellerSnapshot: source.sellerSnapshot,
      itemsSnapshot: source.itemsSnapshot,
      taxSnapshot: source.taxSnapshot,
      discount: source.discount,
      totals: source.totals,
      notes: source.notes,
      terms: source.terms,
      paymentSnapshot: source.paymentSnapshot,
      templateSnapshot: source.templateSnapshot,
      publicId: generatePublicId(),
    });

    return {
      success: true,
      invoice: JSON.parse(JSON.stringify(duplicate)),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to duplicate invoice";
    return { success: false, error: message };
  }
}

export async function deleteInvoiceAction(id: string) {
  try {
    const session = await requireAuth();
    const org = await getActiveOrgForUser(session.userId);

    await connectDB();
    await Invoice.deleteOne({ _id: id, organizationId: org._id });
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete invoice";
    return { success: false, error: message };
  }
}
