import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { IspBroadbandPdfDocument } from "@/lib/pdf/IspBroadbandPdfDocument";
import { prepareIspInvoiceData } from "@/lib/calculations/isp";
import { SAMPLE_ISP_INVOICE_DATA } from "@/lib/templates/ispSampleData";
import { IspInvoiceData } from "@/types/isp";

// In-memory store for recently generated invoices so QR scans retrieve exact custom fields
const globalForIsp = globalThis as unknown as {
  ispInvoiceCache?: Map<string, Partial<IspInvoiceData>>;
};
const ispInvoiceCache =
  globalForIsp.ispInvoiceCache ?? new Map<string, Partial<IspInvoiceData>>();
globalForIsp.ispInvoiceCache = ispInvoiceCache;

export async function POST(request: NextRequest) {
  try {
    let body: Partial<IspInvoiceData> = {};
    try {
      body = await request.json();
    } catch {
      // Empty body or non-JSON falls back to sample defaults
      body = {};
    }

    const origin = request.nextUrl.origin || "http://localhost:3000";

    // Prepare, calculate GST, and dynamically encode QR code pointing to /api/isp/invoice?...
    const invoiceData = await prepareIspInvoiceData(body, origin);

    // Cache invoice by invoiceNumber so scanning QR code can also recover full custom payload
    if (invoiceData.invoice?.invoiceNumber) {
      ispInvoiceCache.set(invoiceData.invoice.invoiceNumber, invoiceData);
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format");
    const download = searchParams.get("download") === "true";
    const acceptHeader = request.headers.get("accept") || "";

    // Generate PDF Buffer
    const element = React.createElement(IspBroadbandPdfDocument, {
      data: invoiceData,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any);
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    // If client requested JSON representation (e.g. for API integrations storing base64)
    if (format === "json" || acceptHeader.includes("application/json")) {
      const base64Pdf = Buffer.from(pdfBuffer).toString("base64");
      return NextResponse.json({
        success: true,
        invoiceNumber: invoiceData.invoice.invoiceNumber,
        grandTotal: invoiceData.gst.finalInvoiceAmount,
        totalGst: invoiceData.gst.totalGst,
        billingCycle: invoiceData.invoice.billingCycle,
        qrCodeUrl: invoiceData.qrCode.url,
        invoiceData,
        pdfBase64: base64Pdf,
      });
    }

    // Default: Stream the PDF binary
    const dispositionType = download ? "attachment" : "inline";
    const filename = `${invoiceData.invoice.invoiceNumber.replace(/[/\\?%*:|"<>]/g, "-")}.pdf`;

    return new NextResponse(pdfUint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("ISP Invoice Generation Error:", err);
    const msg =
      err instanceof Error ? err.message : "Failed to generate ISP broadband invoice PDF";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format");
    const download = searchParams.get("download") === "true";
    const origin = request.nextUrl.origin || "http://localhost:3000";

    // Reconstruct the specific invoice from query parameters or cache when QR code is scanned
    const invParam = searchParams.get("inv");
    const nameParam = searchParams.get("name");
    const cidParam = searchParams.get("cid");
    const connParam = searchParams.get("conn");
    const amtParam = searchParams.get("amt");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const dateParam = searchParams.get("date");
    const dueParam = searchParams.get("due");
    const phoneParam = searchParams.get("phone");
    const addrParam = searchParams.get("addr");
    const planParam = searchParams.get("plan");
    const statusParam = searchParams.get("status") as
      | "PAID"
      | "UNPAID"
      | "PARTIALLY PAID"
      | null;
    const dataParam = searchParams.get("data");

    let baseInput: Partial<IspInvoiceData> = { ...SAMPLE_ISP_INVOICE_DATA };

    // 1. Check if full invoice was cached during POST /api/isp/invoice
    if (invParam && ispInvoiceCache.has(invParam)) {
      baseInput = { ...baseInput, ...ispInvoiceCache.get(invParam) };
    }

    // 2. Check if base64 JSON payload was passed via ?data=
    if (dataParam) {
      try {
        const decoded = JSON.parse(Buffer.from(dataParam, "base64").toString("utf-8"));
        baseInput = { ...baseInput, ...decoded };
      } catch {
        // Ignore malformed data param and rely on individual query params
      }
    }

    // 3. Apply query parameters from QR code URL so the preview matches the exact invoice
    const parsedAmount =
      amtParam !== null && !Number.isNaN(Number(amtParam))
        ? Number(amtParam)
        : baseInput.items?.[0]?.taxableAmount ?? 299;

    const mergedInput: Partial<IspInvoiceData> = {
      ...baseInput,
      invoice: {
        ...(baseInput.invoice || SAMPLE_ISP_INVOICE_DATA.invoice),
        ...(invParam ? { invoiceNumber: invParam } : {}),
        ...(dateParam ? { invoiceDate: dateParam } : {}),
        ...(startParam ? { billingPeriodStart: startParam } : {}),
        ...(endParam ? { billingPeriodEnd: endParam } : {}),
        ...(dueParam ? { dueDate: dueParam } : {}),
      },
      customer: {
        ...(baseInput.customer || SAMPLE_ISP_INVOICE_DATA.customer),
        ...(nameParam ? { name: nameParam } : {}),
        ...(cidParam ? { customerId: cidParam } : {}),
        ...(connParam ? { connectionId: connParam } : {}),
        ...(phoneParam ? { phone: phoneParam } : {}),
        ...(addrParam
          ? { billingAddress: addrParam, installationAddress: addrParam }
          : {}),
      },
      items:
        amtParam !== null || planParam !== null
          ? [
              {
                description:
                  planParam ||
                  baseInput.items?.[0]?.description ||
                  "Broadband Internet Subscription – 50 Mbps (Home 50 Mbps)",
                sac: baseInput.items?.[0]?.sac || "998422",
                billingPeriod: baseInput.items?.[0]?.billingPeriod || "15 Days",
                quantity: baseInput.items?.[0]?.quantity || 1,
                unitPrice: parsedAmount,
                taxableAmount: parsedAmount,
                gstRate: baseInput.items?.[0]?.gstRate ?? 18,
              },
            ]
          : baseInput.items,
      payment: {
        ...(baseInput.payment || SAMPLE_ISP_INVOICE_DATA.payment),
        ...(statusParam ? { status: statusParam } : {}),
      },
      qrCode: {
        enabled: true,
        url: "", // Let prepareIspInvoiceData build the exact verification URL for this invoice
        label: baseInput.qrCode?.label || "Scan to View Invoice",
      },
    };

    const invoiceData = await prepareIspInvoiceData(mergedInput, origin);

    if (format === "json") {
      return NextResponse.json({
        success: true,
        message: "15-day ISP broadband invoice schema and calculation",
        data: invoiceData,
      });
    }

    const element = React.createElement(IspBroadbandPdfDocument, {
      data: invoiceData,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any);
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    const dispositionType = download ? "attachment" : "inline";
    const filename = `${invoiceData.invoice.invoiceNumber.replace(/[/\\?%*:|"<>]/g, "-")}.pdf`;

    return new NextResponse(pdfUint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate sample PDF";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
