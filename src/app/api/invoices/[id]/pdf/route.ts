import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { connectDB } from "@/lib/db/mongodb";
import { Invoice } from "@/lib/models/Invoice";
import { Organization } from "@/lib/models/Organization";
import { getSession } from "@/lib/auth/session";
import { InvoicePdfDocument } from "@/lib/pdf/InvoicePdfDocument";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    await connectDB();

    const org = await Organization.findOne({ ownerId: session.userId }).lean();
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const invoice = await Invoice.findOne({ _id: id, organizationId: org._id }).lean();
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const element = React.createElement(InvoicePdfDocument, {
      template: invoice.templateSnapshot,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      seller: invoice.sellerSnapshot,
      customer: invoice.customerSnapshot,
      items: invoice.itemsSnapshot,
      discount: invoice.discount,
      tax: invoice.taxSnapshot,
      totals: invoice.totals,
      notes: invoice.notes,
      terms: invoice.terms,
      payment: invoice.paymentSnapshot,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any);
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfUint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "PDF Generation Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
