import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { connectDB } from "@/lib/db/mongodb";
import { Invoice } from "@/lib/models/Invoice";
import { InvoicePdfDocument } from "@/lib/pdf/InvoicePdfDocument";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await props.params;
    await connectDB();

    const invoice = await Invoice.findOne({ publicId }).lean();
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
        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "PDF Generation Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
