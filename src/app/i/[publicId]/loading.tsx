import React from "react";
import { Loader2 } from "lucide-react";

export default function PublicInvoiceLoading() {
  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 md:py-10 text-slate-900 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Header Bar Skeleton */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-4 bg-slate-200 rounded w-28" />
              <div className="h-3 bg-slate-100 rounded w-20" />
            </div>
          </div>
          <div className="h-9 bg-slate-200 rounded-lg w-32" />
        </div>

        {/* Invoice Page Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex justify-between border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="h-6 bg-slate-200 rounded w-36" />
              <div className="h-3 bg-slate-100 rounded w-44" />
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
              <span>Loading invoice...</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-50 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
