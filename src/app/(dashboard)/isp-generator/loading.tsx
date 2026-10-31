import React from "react";
import { Loader2 } from "lucide-react";

export default function IspGeneratorLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Transition Status Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading ISP Invoice Generator...
          </span>
        </div>
      </div>

      {/* Header / Title Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="h-3.5 bg-slate-200 rounded w-40" />
        <div className="h-7 bg-slate-200 rounded-lg w-64" />
        <div className="h-4 bg-slate-100 rounded w-3/4 max-w-md" />
        <div className="pt-2 flex gap-3">
          <div className="h-9 bg-slate-200 rounded-lg w-36" />
          <div className="h-9 bg-slate-100 rounded-lg w-32" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <div className="h-8 bg-slate-200 rounded-lg w-24" />
        <div className="h-8 bg-slate-100 rounded-lg w-32" />
        <div className="h-8 bg-slate-100 rounded-lg w-24" />
      </div>

      {/* Invoice Preview Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Company Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-44" />
            <div className="h-3 bg-slate-100 rounded w-56" />
            <div className="h-3 bg-slate-100 rounded w-48" />
          </div>
          <div className="h-16 w-16 bg-slate-200 rounded-lg" />
        </div>

        {/* Invoice Title */}
        <div className="h-6 bg-slate-200 rounded w-32 mx-auto" />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-4 border border-slate-100 rounded-lg">
            <div className="h-3.5 bg-slate-200 rounded w-28" />
            <div className="h-3 bg-slate-100 rounded w-40" />
            <div className="h-3 bg-slate-100 rounded w-36" />
            <div className="h-3 bg-slate-100 rounded w-32" />
          </div>
          <div className="space-y-2 p-4 border border-slate-100 rounded-lg">
            <div className="h-3.5 bg-slate-200 rounded w-20" />
            <div className="h-3 bg-slate-100 rounded w-44" />
            <div className="h-3 bg-slate-100 rounded w-36" />
            <div className="h-3 bg-slate-100 rounded w-28" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 p-3 flex justify-between">
            <div className="h-3 bg-slate-200 rounded w-28" />
            <div className="h-3 bg-slate-200 rounded w-16" />
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-3 bg-slate-200 rounded w-24" />
          </div>
          <div className="p-3 flex justify-between border-t border-slate-100">
            <div className="h-3 bg-slate-100 rounded w-52" />
            <div className="h-3 bg-slate-100 rounded w-14" />
            <div className="h-3 bg-slate-100 rounded w-10" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        </div>

        {/* GST Summary */}
        <div className="flex justify-end">
          <div className="space-y-2 w-64">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-100 rounded w-20" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-slate-100 rounded w-16" />
              <div className="h-3 bg-slate-200 rounded w-14" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-slate-100 rounded w-16" />
              <div className="h-3 bg-slate-200 rounded w-14" />
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
