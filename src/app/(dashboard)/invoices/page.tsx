import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { getInvoicesAction, duplicateInvoiceAction } from "@/app/actions/invoice";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  FileText,
  PlusCircle,
  Download,
  Copy,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/cn";
import { InvoiceDoc } from "@/types";

export default async function InvoicesHistoryPage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  const res = await getInvoicesAction();
  const invoices: InvoiceDoc[] = res.success && res.invoices ? res.invoices : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Invoice History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage and track all generated GST invoices ({invoices.length})
            </p>
          </div>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Create Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No invoices yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Start by creating your first GST invoice. You can duplicate past invoices anytime.
            </p>
            <Link
              href="/invoices/new"
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Create Invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/invoices/${inv._id}`}
                        className="font-extrabold text-slate-900 text-base hover:underline"
                      >
                        {inv.invoiceNumber}
                      </Link>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          inv.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "GENERATED" || inv.status === "SENT"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {inv.customerSnapshot?.name || "Unnamed Customer"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Issued: {inv.invoiceDate} | Due: {inv.dueDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-base block">
                      {formatCurrency(inv.totals?.grandTotal || 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Taxable: {formatCurrency(inv.totals?.taxableAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/invoices/${inv._id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={`/api/invoices/${inv._id}/pdf`}
                      download
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                  </div>

                  <form
                    action={async () => {
                      "use server";
                      await duplicateInvoiceAction(inv._id);
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" /> Duplicate
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
