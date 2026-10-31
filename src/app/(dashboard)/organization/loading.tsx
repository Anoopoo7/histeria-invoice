import React from "react";
import { Loader2 } from "lucide-react";

export default function OrganizationLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Business Profile
            </h1>
            <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-60" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-36" />
              <div className="h-3 bg-slate-100 rounded w-28" />
            </div>
          </div>
          <div className="h-7 bg-slate-100 rounded-lg w-24" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="h-8 bg-slate-50 rounded" />
          <div className="h-8 bg-slate-50 rounded" />
          <div className="h-8 bg-slate-50 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm"
          >
            <div className="w-9 h-9 bg-slate-100 rounded-lg" />
            <div className="h-4 bg-slate-200 rounded w-28" />
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
