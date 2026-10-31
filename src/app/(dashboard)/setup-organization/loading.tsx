import React from "react";
import { Loader2 } from "lucide-react";

export default function SetupOrgLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-200 rounded-xl mx-auto" />
          <div className="h-6 bg-slate-200 rounded w-48 mx-auto" />
          <div className="h-3 bg-slate-100 rounded w-64 mx-auto" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="h-4 bg-slate-200 rounded w-36" />
          <div className="space-y-3">
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-12 bg-slate-200 rounded-xl w-full flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
