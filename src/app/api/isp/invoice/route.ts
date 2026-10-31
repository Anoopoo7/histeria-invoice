import { NextRequest, NextResponse } from "next/server";
import React from "react";
import mongoose from "mongoose";
import { renderToBuffer } from "@react-pdf/renderer";
import { connectDB } from "@/lib/db/mongodb";
import { IspInvoice } from "@/lib/models/IspInvoice";
import { Invoice, IInvoice } from "@/lib/models/Invoice";
import { IspBroadbandPdfDocument } from "@/lib/pdf/IspBroadbandPdfDocument";
import { prepareIspInvoiceData, ISP_QR_DOMAIN } from "@/lib/calculations/isp";
import { SAMPLE_ISP_INVOICE_DATA } from "@/lib/templates/ispSampleData";
import { generatePublicId } from "@/lib/utils/cn";
import { IspInvoiceData } from "@/types/isp";

/**
 * Maps a standard Invoice document (from the main Invoice collection) into IspInvoiceData
 * in case the invoice was created via the standard invoice flow.
 */
function mapStandardInvoiceToIspInput(doc: IInvoice): Partial<IspInvoiceData> {
  return {
    company: {
      brandName: doc.sellerSnapshot?.name || "Kerala Connect",
      legalName: doc.sellerSnapshot?.legalName || doc.sellerSnapshot?.name || "Kerala Broadband Services",
      logoUrl: doc.sellerSnapshot?.logoUrl,
      address: doc.sellerSnapshot?.address || "Kerala, India",
      city: doc.sellerSnapshot?.city || "Kollam",
      state: doc.sellerSnapshot?.state || "Kerala",
      stateCode: doc.sellerSnapshot?.stateCode || "32",
      gstin: doc.sellerSnapshot?.gstin || "",
      pan: "",
      phone: doc.sellerSnapshot?.phone || "+91 98765 43210",
      email: doc.sellerSnapshot?.email || "support@keralaconnect.net",
      website: doc.sellerSnapshot?.website || "www.keralaconnect.net",
    },
    invoice: {
      invoiceNumber: doc.invoiceNumber,
      invoiceDate: doc.invoiceDate,
      billingPeriodStart: doc.invoiceDate,
      billingPeriodEnd: doc.dueDate,
      billingCycle: "15 Days",
      dueDate: doc.dueDate,
      placeOfSupply: doc.customerSnapshot?.state
        ? `${doc.customerSnapshot.stateCode || "32"} - ${doc.customerSnapshot.state}`
        : "32 - Kerala",
      placeOfSupplyCode: doc.customerSnapshot?.stateCode || "32",
      reverseCharge: "No",
    },
    customer: {
      name: doc.customerSnapshot?.name || "Subscriber",
      customerId: doc.publicId || "ISP1001",
      connectionId: doc.invoiceNumber,
      phone: doc.customerSnapshot?.phone || "",
      email: doc.customerSnapshot?.email,
      billingAddress: doc.customerSnapshot?.address || "Kerala",
      installationAddress: doc.customerSnapshot?.address || "Kerala",
      state: doc.customerSnapshot?.state || "Kerala",
      stateCode: doc.customerSnapshot?.stateCode || "32",
      gstin: doc.customerSnapshot?.gstin,
    },
    items: (doc.itemsSnapshot || []).map((item) => ({
      description: item.description || "Broadband Subscription",
      sac: "998422",
      billingPeriod: "15 Days",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      taxableAmount: item.taxableAmount || item.quantity * item.unitPrice || 0,
      gstRate: item.taxRate ?? 18,
    })),
    payment: {
      previousBalance: 0,
      currentInvoiceAmount: doc.totals?.grandTotal || 0,
      previousPayments: 0,
      outstandingBalance: doc.totals?.grandTotal || 0,
      totalAmountPayable: doc.totals?.grandTotal || 0,
      status: doc.status === "PAID" ? "PAID" : "UNPAID",
      upiId: doc.paymentSnapshot?.upiId,
      bankName: doc.paymentSnapshot?.bankName,
      accountNumber: doc.paymentSnapshot?.accountNumber,
      ifsc: doc.paymentSnapshot?.ifsc,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    let body: Partial<IspInvoiceData> = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const origin = ISP_QR_DOMAIN;
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format");
    const saveOnly = searchParams.get("saveOnly") === "true";
    const download = searchParams.get("download") === "true";
    const acceptHeader = request.headers.get("accept") || "";

    // Prepare, calculate GST, and encode QR code pointing to /api/isp/invoice?inv=<invoiceNumber>
    const invoiceData = await prepareIspInvoiceData(body, origin);

    // Save/upsert the generated invoice input and computed data in MongoDB
    let savedDocId: string | undefined;
    try {
      await connectDB();
      const saved = await IspInvoice.findOneAndUpdate(
        { invoiceNumber: invoiceData.invoice.invoiceNumber },
        {
          $set: {
            invoiceNumber: invoiceData.invoice.invoiceNumber,
            customerId: invoiceData.customer.customerId,
            connectionId: invoiceData.customer.connectionId,
            customerName: invoiceData.customer.name,
            rawInput: body,
            invoiceData,
          },
          $setOnInsert: {
            publicId: generatePublicId(),
          },
        },
        { upsert: true, new: true }
      ).lean();
      savedDocId = saved?.publicId;
    } catch (dbErr) {
      console.error("Failed to save ISP invoice to MongoDB:", dbErr);
    }

    // If caller only wanted to persist state to DB and get calculated JSON (e.g. live preview editor)
    if (saveOnly) {
      return NextResponse.json({
        success: true,
        publicId: savedDocId,
        invoiceNumber: invoiceData.invoice.invoiceNumber,
        qrCodeUrl: invoiceData.qrCode.url,
        invoiceData,
      });
    }

    // Generate PDF Buffer
    const element = React.createElement(IspBroadbandPdfDocument, {
      data: invoiceData,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any);
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    if (format === "json" || acceptHeader.includes("application/json")) {
      const base64Pdf = Buffer.from(pdfBuffer).toString("base64");
      return NextResponse.json({
        success: true,
        publicId: savedDocId,
        invoiceNumber: invoiceData.invoice.invoiceNumber,
        grandTotal: invoiceData.gst.finalInvoiceAmount,
        totalGst: invoiceData.gst.totalGst,
        billingCycle: invoiceData.invoice.billingCycle,
        qrCodeUrl: invoiceData.qrCode.url,
        invoiceData,
        pdfBase64: base64Pdf,
      });
    }

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
    const origin = ISP_QR_DOMAIN;

    // Identify which invoice to load from MongoDB (by id, inv/invoiceNumber, or latest saved invoice)
    const idParam = searchParams.get("id");
    const invParam =
      searchParams.get("inv") || searchParams.get("invoiceNumber");

    let dbInput: Partial<IspInvoiceData> | null = null;

    try {
      await connectDB();

      if (idParam || invParam) {
        const lookupKey = (idParam || invParam) as string;
        const orConditions: Record<string, unknown>[] = [
          { publicId: lookupKey },
          { invoiceNumber: lookupKey },
        ];
        if (mongoose.Types.ObjectId.isValid(lookupKey)) {
          orConditions.push({ _id: lookupKey });
        }

        // 1. Check IspInvoice collection first
        const ispDoc = await IspInvoice.findOne({ $or: orConditions })
          .sort({ updatedAt: -1 })
          .lean();

        if (ispDoc) {
          const hasRawInput =
            ispDoc.rawInput && Object.keys(ispDoc.rawInput).length > 0;
          dbInput = hasRawInput ? ispDoc.rawInput : ispDoc.invoiceData;
        } else {
          // 2. Fallback: Check standard Invoice collection
          const stdDoc = await Invoice.findOne({ $or: orConditions })
            .sort({ updatedAt: -1 })
            .lean();
          if (stdDoc) {
            dbInput = mapStandardInvoiceToIspInput(stdDoc as unknown as IInvoice);
          } else if (lookupKey !== SAMPLE_ISP_INVOICE_DATA.invoice.invoiceNumber) {
            return NextResponse.json(
              { error: `Invoice "${lookupKey}" not found in database` },
              { status: 404 }
            );
          }
        }
      } else {
        // No query param provided (e.g. bare http://localhost:3000/api/isp/invoice):
        // Load the most recently generated/updated ISP invoice from MongoDB
        const latestIspDoc = await IspInvoice.findOne()
          .sort({ updatedAt: -1 })
          .lean();
        if (latestIspDoc) {
          const hasRawInput =
            latestIspDoc.rawInput && Object.keys(latestIspDoc.rawInput).length > 0;
          dbInput = hasRawInput ? latestIspDoc.rawInput : latestIspDoc.invoiceData;
        }
      }
    } catch (dbErr) {
      console.error("Failed to fetch ISP invoice from MongoDB:", dbErr);
    }

    const invoiceData = await prepareIspInvoiceData(
      dbInput || SAMPLE_ISP_INVOICE_DATA,
      origin
    );

    if (format === "json") {
      return NextResponse.json({
        success: true,
        source: dbInput ? "database" : "sample_fallback",
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
    const msg = err instanceof Error ? err.message : "Failed to generate PDF from database";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
