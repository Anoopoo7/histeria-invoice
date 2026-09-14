"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CustomerSnapshot,
  InvoiceDiscount,
  InvoiceItemInput,
  OrganizationDoc,
  TaxProfileDoc,
  InvoiceTemplateDoc,
} from "@/types";
import { calculateInvoiceTotals } from "@/lib/calculations/invoice";
import { createInvoiceAction } from "@/app/actions/invoice";
import { ItemModal } from "./ItemModal";
import { WebInvoiceRenderer } from "../template/WebInvoiceRenderer";
import { formatCurrency } from "@/lib/utils/cn";
import {
  PlusCircle,
  Trash2,
  Edit2,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  User,
} from "lucide-react";

interface InvoiceFormProps {
  organization: OrganizationDoc;
  taxProfiles: TaxProfileDoc[];
  templates: InvoiceTemplateDoc[];
}

export function InvoiceForm({
  organization,
  taxProfiles,
  templates,
}: InvoiceFormProps) {
  const router = useRouter();

  const [invoiceNumber, setInvoiceNumber] = useState(
    `${organization.invoicePrefix || "INV"}-${organization.nextInvoiceNumber || 1001}`
  );

  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });

  // Step 2: Customer details
  const [customer, setCustomer] = useState<CustomerSnapshot>({
    name: "",
    gstin: "",
    address: "",
    city: "",
    state: "Maharashtra",
    stateCode: "27",
    postalCode: "",
    email: "",
    phone: "",
  });

  // Step 3: Items
  const [items, setItems] = useState<InvoiceItemInput[]>([
    {
      id: "item-1",
      description: "Software Services & Consultation",
      quantity: 1,
      unit: "service",
      unitPrice: 25000,
      taxProfileId: taxProfiles[0]?._id,
      taxRate: taxProfiles[0]?.rate || 18,
    },
  ]);

  // Step 4: Discount
  const [discount, setDiscount] = useState<InvoiceDiscount>({
    type: "PERCENTAGE",
    value: 0,
  });

  // Step 5: Notes, Terms, Payment, Template
  const [notes, setNotes] = useState(organization.defaultNotes || "Thank you for your business!");
  const [terms, setTerms] = useState(organization.defaultTerms || "Payment is due within 14 days.");
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    organization.defaultTemplateId || templates[0]?._id || ""
  );

  const [payment, setPayment] = useState({
    bankName: organization.bankName || "",
    accountName: organization.accountName || organization.name,
    accountNumber: organization.accountNumber || "",
    ifsc: organization.ifsc || "",
    upiId: organization.upiId || "",
  });

  // Item Modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InvoiceItemInput | null>(null);

  // Mobile View mode (Form vs Web Preview)
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time calculation engine call
  const { itemsSnapshot, taxSnapshot, totals } = useMemo(() => {
    return calculateInvoiceTotals(items, discount, organization, customer);
  }, [items, discount, organization, customer]);

  const selectedTemplate = useMemo(() => {
    const found = templates.find((t) => t._id === selectedTemplateId);
    return found ? found.templateJson : templates[0]?.templateJson;
  }, [templates, selectedTemplateId]);

  const handleSaveItem = (newItem: InvoiceItemInput) => {
    if (editingItem) {
      setItems((prev) => prev.map((item) => (item.id === newItem.id ? newItem : item)));
    } else {
      setItems((prev) => [...prev, newItem]);
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateInvoice = async (status: "GENERATED" | "DRAFT") => {
    if (!customer.name.trim()) {
      setError("Please enter customer name.");
      return;
    }
    if (items.length === 0) {
      setError("Please add at least one line item.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const res = await createInvoiceAction({
        invoiceNumber,
        invoiceDate,
        dueDate,
        status,
        customer,
        items,
        discount,
        notes,
        terms,
        payment,
        templateId: selectedTemplateId,
      });

      if (!res.success || !res.invoice) {
        setError(res.error || "Failed to create invoice.");
        setSaving(false);
        return;
      }

      router.push(`/invoices/${res.invoice._id}`);
    } catch {
      setError("An error occurred while creating invoice.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Mobile Tab Toggle */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 text-xs font-semibold md:hidden">
        <button
          onClick={() => setMobileTab("form")}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === "form" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          <FileText className="w-4 h-4" /> Edit Invoice Details
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === "preview" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          <Eye className="w-4 h-4" /> Live Web Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls Column */}
        <div className={`lg:col-span-7 space-y-5 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Dates & Numbering */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-700" /> 1. Invoice Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Customer */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-700" /> 2. Customer Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer / Business Name *
              </label>
              <input
                type="text"
                required
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="TechCorp Innovations Ltd"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={customer.gstin}
                  onChange={(e) => setCustomer({ ...customer, gstin: e.target.value.toUpperCase() })}
                  placeholder="27ABCDE1234F1ZH"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State & State Code
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={customer.stateCode}
                    onChange={(e) => setCustomer({ ...customer, stateCode: e.target.value })}
                    placeholder="27"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billing Address
              </label>
              <input
                type="text"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="Building 4, Commerce Zone"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Section 3: Line Items */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Invoice Line Items ({items.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                className="inline-flex items-center gap-1 bg-slate-900 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-xs hover:bg-slate-800 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">
                      {item.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)} | GST {item.taxRate}%
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      Line Total: {formatCurrency(item.quantity * item.unitPrice * (1 + (item.taxRate || 0) / 100))}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setIsItemModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Discount, Template, Notes & Payment */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              4. Discount & Payment Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice Discount
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={discount.type}
                    onChange={(e) =>
                      setDiscount({ ...discount, type: e.target.value as "PERCENTAGE" | "FIXED" })
                    }
                    className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="PERCENTAGE">% Discount</option>
                    <option value="FIXED">₹ Fixed Amount</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={discount.value}
                    onChange={(e) =>
                      setDiscount({ ...discount, value: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice Template
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                >
                  {templates.map((tmpl) => (
                    <option key={tmpl._id} value={tmpl._id}>
                      {tmpl.name} {tmpl.isDefault ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  rows={2}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={payment.bankName}
                  onChange={(e) => setPayment({ ...payment, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={payment.upiId}
                  onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Web Preview Column (Desktop side-by-side) */}
        <div className={`lg:col-span-5 space-y-4 ${mobileTab === "form" ? "hidden lg:block" : "block"}`}>
          <div className="sticky top-20 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Live Web Preview
            </h3>

            <WebInvoiceRenderer
              template={selectedTemplate}
              invoiceNumber={invoiceNumber}
              invoiceDate={invoiceDate}
              dueDate={dueDate}
              seller={organization}
              customer={customer}
              items={itemsSnapshot}
              discount={discount}
              tax={taxSnapshot}
              totals={totals}
              notes={notes}
              terms={terms}
              payment={payment}
            />

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleCreateInvoice("GENERATED")}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Save & Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 lg:hidden shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleCreateInvoice("GENERATED")}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Save & Generate PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Item Modal */}
      <ItemModal
        key={editingItem?.id || "new-item"}
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        taxProfiles={taxProfiles}
      />
    </div>
  );
}
