import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { Building2, Percent, Users } from "lucide-react";

export default async function OrganizationOverviewPage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Business Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company details, GST rates, staff members, and invoice defaults
          </p>
        </div>
      </div>

      {/* Business Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-lg">
              {organization.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">{organization.name}</h2>
              <p className="text-xs text-slate-500">
                {organization.gstRegistered ? `GSTIN: ${organization.gstin}` : "Unregistered Business"}
              </p>
            </div>
          </div>

          <Link
            href="/organization/settings"
            className="text-xs font-semibold text-slate-900 hover:underline bg-slate-100 px-3 py-1.5 rounded-lg"
          >
            Edit Details
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">State Code</span>
            <span className="font-semibold text-slate-800">
              {organization.state} ({organization.stateCode || "N/A"})
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Invoice Prefix</span>
            <span className="font-semibold text-slate-800">{organization.invoicePrefix}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Next Invoice #</span>
            <span className="font-semibold text-slate-800">
              {organization.invoicePrefix}-{organization.nextInvoiceNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/organization/settings"
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 bg-slate-100 text-slate-900 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
            Business & Bank
          </h3>
          <p className="text-xs text-slate-500">
            Update legal name, GSTIN, bank details, UPI ID, default payment terms and notes.
          </p>
        </Link>

        <Link
          href="/organization/taxes"
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 bg-slate-100 text-slate-900 rounded-lg flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
            GST Tax Profiles
          </h3>
          <p className="text-xs text-slate-500">
            Configure 5%, 12%, 18%, 28% GST rates and CGST/SGST/IGST breakdown rules.
          </p>
        </Link>

        <Link
          href="/organization/members"
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm transition-all group"
        >
          <div className="w-9 h-9 bg-slate-100 text-slate-900 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
            Staff Members ({organization.members?.length || 1})
          </h3>
          <p className="text-xs text-slate-500">
            Add team members, assign admin or member roles, and manage permissions.
          </p>
        </Link>
      </div>
    </div>
  );
}
