import React from "react";
import { Loader2 } from "lucide-react";

export default function InvoiceDetailLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-200 rounded-lg" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-slate-200 rounded w-36" />
            <div className="h-4 bg-slate-100 rounded-full w-14" />
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-48" />
        </div>
      </div>

      {/* Action Bar Skeleton */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 bg-slate-200 rounded-lg w-32" />
          <div className="h-9 bg-slate-100 rounded-lg w-20" />
          <div className="h-9 bg-slate-100 rounded-lg w-28" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 bg-slate-100 rounded-lg w-24" />
          <div className="h-9 bg-slate-100 rounded-lg w-24" />
        </div>
      </div>

      {/* Invoice Renderer Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-40" />
            <div className="h-3 bg-slate-100 rounded w-28" />
          </div>
          <div className="space-y-1.5 flex flex-col items-end">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-3 bg-slate-100 rounded w-32" />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="h-8 bg-slate-100 rounded w-full" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-50 rounded w-full" />
          ))}
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <div className="w-56 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-100 rounded w-16" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-4 bg-slate-900 rounded w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
