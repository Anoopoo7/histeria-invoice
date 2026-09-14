import React from "react";
import { notFound } from "next/navigation";
import { getInvoiceByPublicIdAction } from "@/app/actions/invoice";
import { WebInvoiceRenderer } from "@/components/template/WebInvoiceRenderer";
import { Download } from "lucide-react";
import { InvoiceDoc } from "@/types";

export default async function PublicInvoicePage(props: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await props.params;

  const res = await getInvoiceByPublicIdAction(publicId);
  if (!res.success || !res.invoice) {
    notFound();
  }

  const invoice: InvoiceDoc = res.invoice;

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 md:py-10 antialiased text-slate-900">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Header Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              H
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                {invoice.sellerSnapshot?.name || "Tax Invoice"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">
                Invoice #{invoice.invoiceNumber}
              </span>
            </div>
          </div>

          <a
            href={`/api/public/invoices/${invoice.publicId}/pdf`}
            download
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Download A4 PDF
          </a>
        </div>

        {/* Read-only Web Renderer */}
        <div className="shadow-sm">
          <WebInvoiceRenderer
            template={invoice.templateSnapshot}
            invoiceNumber={invoice.invoiceNumber}
            invoiceDate={invoice.invoiceDate}
            dueDate={invoice.dueDate}
            seller={invoice.sellerSnapshot}
            customer={invoice.customerSnapshot}
            items={invoice.itemsSnapshot}
            discount={invoice.discount}
            tax={invoice.taxSnapshot}
            totals={invoice.totals}
            notes={invoice.notes}
            terms={invoice.terms}
            payment={invoice.paymentSnapshot}
          />
        </div>

        <div className="text-center text-xs text-slate-400 py-4">
          Powered by Histeria Invoice SaaS • Secure Public Invoice View
        </div>
      </div>
    </div>
  );
}
