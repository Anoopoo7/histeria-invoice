import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Transition Status Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading page...
          </span>
        </div>
      </div>

      {/* Hero / Banner Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="h-3.5 bg-slate-200 rounded w-28" />
        <div className="h-7 bg-slate-200 rounded-lg w-56" />
        <div className="h-4 bg-slate-100 rounded w-3/4 max-w-md" />
        <div className="pt-2 flex gap-3">
          <div className="h-9 bg-slate-200 rounded-lg w-36" />
          <div className="h-9 bg-slate-100 rounded-lg w-32" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2"
          >
            <div className="h-3 bg-slate-200 rounded w-16" />
            <div className="h-6 bg-slate-200 rounded-md w-24" />
            <div className="h-2.5 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>

      {/* Main Content List Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="h-4 bg-slate-200 rounded w-32" />
          <div className="h-4 bg-slate-100 rounded w-20" />
        </div>

        <div className="space-y-3 pt-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
            >
              <div className="space-y-2 flex-1 max-w-xs">
                <div className="h-4 bg-slate-200 rounded w-36" />
                <div className="h-3 bg-slate-100 rounded w-24" />
              </div>
              <div className="space-y-1.5 flex flex-col items-end">
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="h-3 bg-slate-100 rounded w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
