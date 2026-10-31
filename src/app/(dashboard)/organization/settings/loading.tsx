import React from "react";
import { Loader2 } from "lucide-react";

export default function OrgSettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-200 rounded-lg" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Organization Settings
            </h1>
            <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-64" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="h-4 bg-slate-200 rounded w-32" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded-lg" />
          <div className="h-10 bg-slate-100 rounded-lg" />
          <div className="h-10 bg-slate-100 rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="h-4 bg-slate-200 rounded w-32" />
        <div className="space-y-3">
          <div className="h-10 bg-slate-100 rounded-lg" />
          <div className="h-10 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
