"use client";

import React, { useState, useRef } from "react";
import { Download, ExternalLink, Loader2, RefreshCw, Code, CheckCircle2 } from "lucide-react";
import { SAMPLE_ISP_INVOICE_DATA } from "@/lib/templates/ispSampleData";
import { IspInvoiceData } from "@/types/isp";
import { prepareIspInvoiceData, buildIspInvoicePreviewUrl } from "@/lib/calculations/isp";
import { IspBroadbandWebInvoice } from "@/components/template/IspBroadbandWebInvoice";

export default function IspGeneratorPage() {
  const [data, setData] = useState<IspInvoiceData>(SAMPLE_ISP_INVOICE_DATA);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "api" | "edit">("preview");
  const [customerName, setCustomerName] = useState("Rahul Kumar");
  const [customerId, setCustomerId] = useState("ISP1001");
  const [connectionId, setConnectionId] = useState("CON1001");
  const [planAmount, setPlanAmount] = useState(299);
  const [billingPeriod, setBillingPeriod] = useState("01 October 2026 – 15 October 2026");
  const [qrUrl, setQrUrl] = useState(SAMPLE_ISP_INVOICE_DATA.qrCode.url);
  const [copied, setCopied] = useState(false);

  // Generate QR code data on initial mount
  const initializedRef = useRef<boolean | null>(null);
  if (initializedRef.current == null) {
    initializedRef.current = true;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    prepareIspInvoiceData({ ...SAMPLE_ISP_INVOICE_DATA, qrCode: { enabled: true, url: "", label: "Scan to View Invoice" } }, origin).then((prepared) => {
      setData(prepared);
      setQrUrl(prepared.qrCode.url);
    });
  }

  const applyChanges = async (
    name: string,
    cId: string,
    connId: string,
    amount: number,
    period: string,
    customUrl?: string
  ) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const [periodStart, periodEnd] = period.split(/\s*[–-]\s*/);
    const invoiceInfo = {
      ...SAMPLE_ISP_INVOICE_DATA.invoice,
      billingPeriodStart: periodStart || SAMPLE_ISP_INVOICE_DATA.invoice.billingPeriodStart,
      billingPeriodEnd: periodEnd || SAMPLE_ISP_INVOICE_DATA.invoice.billingPeriodEnd,
    };
    const customerInfo = {
      ...SAMPLE_ISP_INVOICE_DATA.customer,
      name,
      customerId: cId,
      connectionId: connId,
    };
    const itemsList = [
      {
        description: `Broadband Internet Subscription – 50 Mbps (Home 50 Mbps)`,
        sac: "998422",
        billingPeriod: "15 Days",
        quantity: 1,
        unitPrice: Number(amount),
        taxableAmount: Number(amount),
        gstRate: 18,
      },
    ];

    const autoPreviewUrl = buildIspInvoicePreviewUrl(
      { invoice: invoiceInfo, customer: customerInfo, items: itemsList },
      origin
    );
    const effectiveQrUrl = customUrl !== undefined ? customUrl : autoPreviewUrl;
    if (customUrl === undefined) {
      setQrUrl(autoPreviewUrl);
    }

    const updated = await prepareIspInvoiceData(
      {
        ...SAMPLE_ISP_INVOICE_DATA,
        invoice: invoiceInfo,
        customer: customerInfo,
        items: itemsList,
        qrCode: {
          enabled: true,
          url: effectiveQrUrl,
          label: "Scan to View Invoice / Pay Online",
        },
      },
      origin
    );
    setData(updated);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      // POST the current state to the API to receive the exact generated PDF
      const res = await fetch("/api/isp/invoice?download=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data || SAMPLE_ISP_INVOICE_DATA),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data?.invoice.invoiceNumber || "ISP-INVOICE").replace(/[/\\?%*:|"<>]/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyApiExample = () => {
    const curlCommand = `curl -X POST "${typeof window !== "undefined" ? window.location.origin : ""}/api/isp/invoice" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(
      {
        company: SAMPLE_ISP_INVOICE_DATA.company,
        invoice: SAMPLE_ISP_INVOICE_DATA.invoice,
        customer: SAMPLE_ISP_INVOICE_DATA.customer,
        items: SAMPLE_ISP_INVOICE_DATA.items,
        qrCode: SAMPLE_ISP_INVOICE_DATA.qrCode,
      },
      null,
      2
    )}' \\
  --output invoice.pdf`;

    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ISP Telecom Generator
            </span>
            <span className="text-xs font-semibold text-slate-500">
              SAC 998422 • Kerala GST (32)
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            15-Day Broadband Subscription Invoice Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Designed for Kerala Connect with dynamic QR codes, 15-day billing cycles, and print-ready A4 PDF streaming.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating A4 PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Print-Ready PDF</span>
              </>
            )}
          </button>

          <a
            href={data?.qrCode?.url || "/api/isp/invoice"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <span>Raw PDF Stream</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold gap-1">
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === "preview" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
        >
          Live Invoice Preview
        </button>
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === "edit" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
        >
          Quick Parameters (Live Recalculate)
        </button>
        <button
          onClick={() => setActiveTab("api")}
          className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${activeTab === "api" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
        >
          API Integration Guide (cURL & JSON)
        </button>
      </div>

      {/* Tab: Quick Edit Controls */}
      {activeTab === "edit" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tune Invoice Parameters
            </h2>
            <button
              onClick={() => {
                setCustomerName("Rahul Kumar");
                setCustomerId("ISP1001");
                setConnectionId("CON1001");
                setPlanAmount(299);
                setBillingPeriod("01 October 2026 – 15 October 2026");
                applyChanges(
                  "Rahul Kumar",
                  "ISP1001",
                  "CON1001",
                  299,
                  "01 October 2026 – 15 October 2026"
                );
              }}
              className="text-xs font-semibold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset to Prompt Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  applyChanges(e.target.value, customerId, connectionId, planAmount, billingPeriod);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Customer ID
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  applyChanges(customerName, e.target.value, connectionId, planAmount, billingPeriod);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Connection ID
              </label>
              <input
                type="text"
                value={connectionId}
                onChange={(e) => {
                  setConnectionId(e.target.value);
                  applyChanges(customerName, customerId, e.target.value, planAmount, billingPeriod);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Plan Amount (₹ Taxable)
              </label>
              <input
                type="number"
                value={planAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setPlanAmount(val);
                  applyChanges(customerName, customerId, connectionId, val, billingPeriod);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Calculates: ₹{planAmount} + 9% CGST (₹{(planAmount * 0.09).toFixed(2)}) + 9% SGST (₹{(planAmount * 0.09).toFixed(2)}) = ₹{(planAmount * 1.18).toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Billing Period
              </label>
              <input
                type="text"
                value={billingPeriod}
                onChange={(e) => {
                  setBillingPeriod(e.target.value);
                  applyChanges(customerName, customerId, connectionId, planAmount, e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dynamic QR Code URL (PDF Preview Link)
              </label>
              <input
                type="text"
                value={qrUrl}
                onChange={(e) => {
                  setQrUrl(e.target.value);
                  applyChanges(customerName, customerId, connectionId, planAmount, billingPeriod, e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: API Documentation */}
      {activeTab === "api" && (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                POST /api/isp/invoice
              </span>
              <h3 className="text-sm font-bold text-white mt-1">
                Generate 15-Day Broadband PDF via API
              </h3>
            </div>
            <button
              onClick={handleCopyApiExample}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-sans flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied cURL!</span>
                </>
              ) : (
                <>
                  <Code className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy cURL Command</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-slate-400 font-sans text-xs">
              This API is completely dynamic: Pass any broadband subscriber, 15-day period, plan charges, and QR URL. The API will calculate intra-state (CGST+SGST) vs inter-state (IGST) GST, generate the high-res QR code, and return an A4 print-ready PDF stream.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-slate-300">
              <pre>{`curl -X POST "${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/isp/invoice" \\
  -H "Content-Type: application/json" \\
  -d '{
    "company": {
      "brandName": "Kerala Connect",
      "legalName": "Kerala Broadband Services",
      "state": "Kerala",
      "stateCode": "32"
    },
    "customer": {
      "name": "Rahul Kumar",
      "customerId": "ISP1001",
      "connectionId": "CON1001",
      "phone": "9876543210",
      "billingAddress": "Door No. 12/450, Beach Road, Kollam, Kerala - 691001",
      "installationAddress": "Door No. 12/450, Beach Road, Kollam, Kerala - 691001",
      "state": "Kerala",
      "stateCode": "32"
    },
    "invoice": {
      "invoiceNumber": "ISP/2026-27/000001",
      "invoiceDate": "31 October 2026",
      "billingPeriodStart": "01 October 2026",
      "billingPeriodEnd": "15 October 2026",
      "billingCycle": "15 Days",
      "dueDate": "05 November 2026",
      "placeOfSupply": "32 - Kerala"
    },
    "items": [
      {
        "description": "Broadband Internet Subscription – 50 Mbps (Home 50 Mbps)",
        "sac": "998422",
        "billingPeriod": "15 Days",
        "quantity": 1,
        "unitPrice": 299.00,
        "taxableAmount": 299.00,
        "gstRate": 18
      }
    ],
    "qrCode": {
      "enabled": true,
      "url": "http://localhost:3000/api/isp/invoice",
      "label": "Scan to View Invoice"
    }
  }' \\
  --output invoice.pdf`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Live Preview */}
      {data && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Live Web & Print Preview</span>
            <span className="font-medium text-slate-700">
              A4 Portrait • Standard 15-Day Subscription Layout
            </span>
          </div>
          <IspBroadbandWebInvoice data={data} />
        </div>
      )}
    </div>
  );
}
