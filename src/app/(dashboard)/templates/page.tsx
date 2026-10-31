import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { getTemplatesAction, setDefaultTemplateAction } from "@/app/actions/template";
import { PlusCircle, Check, Edit, Star, Wifi, ArrowRight } from "lucide-react";
import { InvoiceTemplateDoc } from "@/types";
import { SetDefaultTemplateButton } from "@/components/template/SetDefaultTemplateButton";

export default async function TemplatesListPage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  const res = await getTemplatesAction();
  const templates: InvoiceTemplateDoc[] = res.success && res.templates ? res.templates : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Invoice Templates
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize layouts, colors, and component ordering
          </p>
        </div>
        <Link
          href="/templates/new"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" /> New Template
        </Link>
      </div>

      {/* Featured ISP Broadband Template Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl p-5 border border-slate-700/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-sky-400/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Specialized Telecom Model
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                SAC 998422 • Kerala GST (32)
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Kerala Connect — 15-Day ISP Broadband Invoice Generator
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Professional print-ready A4 PDF with dynamic QR codes, 15-day billing cycles, residential installation addresses, and instant REST API generation.
            </p>
          </div>
        </div>

        <Link
          href="/isp-generator"
          className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <span>Open Generator & API</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((tmpl) => (
          <div
            key={tmpl._id}
            className={`bg-white rounded-xl border p-4 space-y-3 transition-all ${
              tmpl.isDefault
                ? "border-slate-900 ring-2 ring-slate-900/10 shadow-sm"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{tmpl.name}</h3>
                  {tmpl.isDefault && (
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Default
                    </span>
                  )}
                </div>
                {tmpl.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tmpl.description}
                  </p>
                )}
              </div>
            </div>

            {/* Color Bar Indicator */}
            <div className="h-2 rounded-full overflow-hidden flex bg-slate-100">
              <div
                className="h-full"
                style={{
                  width: "60%",
                  backgroundColor: tmpl.templateJson?.styles?.primaryColor || "#0f172a",
                }}
              />
              <div
                className="h-full"
                style={{
                  width: "40%",
                  backgroundColor: tmpl.templateJson?.styles?.accentColor || "#2563eb",
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {!tmpl.isDefault ? (
                <form
                  action={async () => {
                    "use server";
                    await setDefaultTemplateAction(tmpl._id);
                  }}
                >
                  <SetDefaultTemplateButton />
                </form>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active Default
                </span>
              )}

              <Link
                href={`/templates/${tmpl._id}`}
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
