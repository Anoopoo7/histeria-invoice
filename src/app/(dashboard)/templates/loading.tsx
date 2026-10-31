import React from "react";
import { Loader2 } from "lucide-react";

export default function TemplatesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Invoice Templates
            </h1>
            <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-48" />
        </div>
        <div className="h-9 bg-slate-200 rounded-lg w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4"
          >
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-28" />
              <div className="h-3 bg-slate-100 rounded w-40" />
            </div>
            <div className="h-32 bg-slate-100 rounded-lg w-full" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-7 bg-slate-100 rounded-lg w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
