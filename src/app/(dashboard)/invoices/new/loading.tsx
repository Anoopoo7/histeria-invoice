import React from "react";
import { Loader2 } from "lucide-react";

export default function NewInvoiceLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Create Invoice
          </h1>
          <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
        </div>
        <div className="h-3 bg-slate-200 rounded w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="h-4 bg-slate-200 rounded w-36" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-9 bg-slate-100 rounded-lg" />
              <div className="h-9 bg-slate-100 rounded-lg" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="h-4 bg-slate-200 rounded w-32" />
            <div className="h-9 bg-slate-100 rounded-lg" />
            <div className="h-9 bg-slate-100 rounded-lg" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="h-4 bg-slate-200 rounded w-28" />
            <div className="h-16 bg-slate-50 rounded-lg" />
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="h-4 bg-slate-200 rounded w-28" />
            <div className="h-64 bg-slate-50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
