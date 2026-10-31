import React from "react";
import { Loader2 } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 bg-slate-200 rounded-xl mx-auto" />
        <div className="h-6 bg-slate-200 rounded w-40 mx-auto" />
        <div className="h-3 bg-slate-100 rounded w-60 mx-auto" />
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-sm rounded-xl border border-slate-200 sm:px-8 space-y-4">
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-11 bg-slate-200 rounded-lg w-full flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
