import React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { getInvoiceByIdAction } from "@/app/actions/invoice";
import { WebInvoiceRenderer } from "@/components/template/WebInvoiceRenderer";
import { InvoiceDetailActions } from "@/components/invoice/InvoiceDetailActions";
import { ArrowLeft } from "lucide-react";
import { InvoiceDoc } from "@/types";

export default async function InvoiceDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  const res = await getInvoiceByIdAction(id);
  if (!res.success || !res.invoice) {
    notFound();
  }

  const invoice: InvoiceDoc = res.invoice;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Invoice {invoice.invoiceNumber}
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  invoice.status === "PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Billed to {invoice.customerSnapshot?.name} on {invoice.invoiceDate}
            </p>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <InvoiceDetailActions
        invoiceId={invoice._id}
        publicId={invoice.publicId}
        invoiceNumber={invoice.invoiceNumber}
      />

      {/* Web Invoice Renderer */}
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
    </div>
  );
}
