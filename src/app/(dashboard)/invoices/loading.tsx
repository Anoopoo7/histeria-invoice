import React from "react";
import { Loader2 } from "lucide-react";

export default function InvoicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Invoices
            </h1>
            <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-48" />
        </div>
        <div className="h-9 bg-slate-200 rounded-lg w-28" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="h-10 bg-slate-100 rounded-lg w-full" />
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-32" />
                <div className="h-3 bg-slate-100 rounded w-20" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 bg-slate-100 rounded-full w-16" />
                <div className="h-4 bg-slate-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
