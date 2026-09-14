import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { getInvoicesAction } from "@/app/actions/invoice";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlusCircle, FileText, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/cn";
import { InvoiceDoc } from "@/types";

export default async function DashboardPage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) {
    redirect("/login");
  }

  if (!organization) {
    redirect("/setup-organization");
  }

  const res = await getInvoicesAction();
  const invoices: InvoiceDoc[] = res.success && res.invoices ? res.invoices : [];

  // Calculate monthly stats
  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  const thisMonthInvoices = invoices.filter((inv) =>
    inv.invoiceDate?.startsWith(currentMonthStr)
  );

  const thisMonthAmount = thisMonthInvoices.reduce(
    (acc, inv) => acc + (inv.totals?.grandTotal || 0),
    0
  );

  const paidCount = invoices.filter((i) => i.status === "PAID").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {organization.name}
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Hello, {user.name} 👋
            </h1>
            <p className="text-xs text-slate-300 max-w-md">
              Create, preview, and share professional GST invoices in seconds from any phone or desktop.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:bg-slate-100 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-slate-900" />
                Create New Invoice
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors"
              >
                Templates
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">
              Total Invoices
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {invoices.length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">
              This Month ({thisMonthInvoices.length})
            </span>
            <span className="text-xl font-extrabold text-emerald-700">
              {formatCurrency(thisMonthAmount)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">
              Paid Invoices
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {paidCount} / {invoices.length}
            </span>
          </div>
        </div>

        {/* Recent Invoices Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Invoices
            </h2>
            {invoices.length > 0 && (
              <Link
                href="/invoices"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {invoices.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">No invoices generated yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Create your first invoice for a client with automatic GST calculations and A4 PDF export.
                </p>
              </div>
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:bg-slate-800 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Create First Invoice
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.slice(0, 5).map((inv) => (
                <Link
                  key={inv._id}
                  href={`/invoices/${inv._id}`}
                  className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between transition-colors shadow-sm group"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {inv.invoiceNumber}
                      </span>
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
                    <p className="text-xs text-slate-600 truncate font-medium">
                      {inv.customerSnapshot?.name || "Unnamed Customer"}
                    </p>
                    <p className="text-[10px] text-slate-400">{inv.invoiceDate}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 text-sm block">
                      {formatCurrency(inv.totals?.grandTotal || 0)}
                    </span>
                    <span className="text-[11px] text-slate-400 group-hover:text-slate-900 flex items-center justify-end gap-0.5 mt-1 transition-colors">
                      View details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
