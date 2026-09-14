"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getTaxProfilesAction,
  createTaxProfileAction,
  deleteTaxProfileAction,
} from "@/app/actions/tax";
import { TaxProfileDoc } from "@/types";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";

export default function TaxProfilesPage() {
  const router = useRouter();
  const [taxProfiles, setTaxProfiles] = useState<TaxProfileDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Add form state
  const [name, setName] = useState("");
  const [rate, setRate] = useState<number>(18);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaxes();
  }, []);

  async function loadTaxes() {
    const res = await getTaxProfilesAction();
    if (res.success && res.taxProfiles) {
      setTaxProfiles(res.taxProfiles);
    }
    setLoading(false);
  }

  const handleAddTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rate < 0) return;

    setAdding(true);
    setError(null);

    const half = rate / 2;
    const res = await createTaxProfileAction({
      name: name.trim(),
      type: "GST",
      rate: Number(rate),
      cgstRate: half,
      sgstRate: half,
      igstRate: Number(rate),
      isActive: true,
    });

    if (res.success) {
      setName("");
      setRate(18);
      await loadTaxes();
    } else {
      setError(res.error || "Failed to add tax profile");
    }
    setAdding(false);
  };

  const handleDeleteTax = async (id: string) => {
    await deleteTaxProfileAction(id);
    await loadTaxes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/organization")}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            GST Tax Profiles
          </h1>
          <p className="text-xs text-slate-500">
            Configure reusable tax rates for your invoice items
          </p>
        </div>
      </div>

      {/* Add New Tax Profile Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Add New Tax Profile
        </h2>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <form onSubmit={handleAddTax} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Tax Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GST 18%"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="w-24">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Rate (%)
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Tax Rate
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tax Profiles List */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
        {taxProfiles.map((tp) => (
          <div key={tp._id} className="p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{tp.name}</h3>
                <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Total: {tp.rate}%
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Intra-State: CGST ({tp.cgstRate}%) + SGST ({tp.sgstRate}%) | Inter-State: IGST ({tp.igstRate}%)
              </p>
            </div>

            <button
              onClick={() => handleDeleteTax(tp._id)}
              className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
