"use client";

import React, { useState } from "react";
import { InvoiceItemInput, TaxProfileDoc } from "@/types";
import { X, Check } from "lucide-react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InvoiceItemInput) => void;
  initialItem?: InvoiceItemInput | null;
  taxProfiles: TaxProfileDoc[];
}

export function ItemModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
  taxProfiles,
}: ItemModalProps) {
  const defaultTax = taxProfiles.find((t) => t.rate === 18) || taxProfiles[0];

  const [description, setDescription] = useState(initialItem?.description || "");
  const [quantity, setQuantity] = useState<number>(initialItem?.quantity ?? 1);
  const [unit, setUnit] = useState(initialItem?.unit || "pcs");
  const [unitPrice, setUnitPrice] = useState<number>(initialItem?.unitPrice ?? 0);
  const [taxProfileId, setTaxProfileId] = useState<string>(
    initialItem?.taxProfileId || defaultTax?._id || ""
  );
  const [taxRate, setTaxRate] = useState<number>(
    initialItem?.taxRate ?? defaultTax?.rate ?? 18
  );

  if (!isOpen) return null;

  const handleTaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setTaxProfileId(selectedId);
    const profile = taxProfiles.find((t) => t._id === selectedId);
    if (profile) {
      setTaxRate(profile.rate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || quantity <= 0 || unitPrice < 0) return;

    onSave({
      id: initialItem?.id || `item-${Date.now()}`,
      description: description.trim(),
      quantity: Number(quantity),
      unit: unit.trim() || "pcs",
      unitPrice: Number(unitPrice),
      taxProfileId,
      taxRate: Number(taxRate),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-base">
            {initialItem ? "Edit Line Item" : "Add Line Item"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Service Name *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Website Development / Consulting Services"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qty *
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pcs / hrs"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GST Tax Rate
            </label>
            <select
              value={taxProfileId}
              onChange={handleTaxChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            >
              {taxProfiles.map((tp) => (
                <option key={tp._id} value={tp._id}>
                  {tp.name} ({tp.rate}%)
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              {initialItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
