import React from "react";
import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Brand Logo */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-slate-200/60 animate-pulse">
            H
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-sm -z-10 animate-pulse" />
        </div>

        {/* Loading Spinner & Label */}
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
}
