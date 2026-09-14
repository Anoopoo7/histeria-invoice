import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { getTemplatesAction, setDefaultTemplateAction } from "@/app/actions/template";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlusCircle, Check, Edit, Star } from "lucide-react";
import { InvoiceTemplateDoc } from "@/types";

export default async function TemplatesListPage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");
  if (!organization) redirect("/setup-organization");

  const res = await getTemplatesAction();
  const templates: InvoiceTemplateDoc[] = res.success && res.templates ? res.templates : [];

  return (
    <AppLayout>
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
                    <button
                      type="submit"
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      Set as Default
                    </button>
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
    </AppLayout>
  );
}
