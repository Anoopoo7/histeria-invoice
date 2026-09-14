import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { getTaxProfilesAction } from "@/app/actions/tax";
import { getTemplatesAction } from "@/app/actions/template";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";

export default async function NewInvoicePage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  const [taxRes, tmplRes] = await Promise.all([
    getTaxProfilesAction(),
    getTemplatesAction(),
  ]);

  const taxProfiles = taxRes.success && taxRes.taxProfiles ? taxRes.taxProfiles : [];
  const templates = tmplRes.success && tmplRes.templates ? tmplRes.templates : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Create Invoice
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill in customer & item details for instant GST calculation
        </p>
      </div>

      <InvoiceForm
        organization={organization}
        taxProfiles={taxProfiles}
        templates={templates}
      />
    </div>
  );
}
