"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateJson, TemplateComponent } from "@/types";
import { WebInvoiceRenderer } from "./WebInvoiceRenderer";
import { updateTemplateAction, createTemplateAction } from "@/app/actions/template";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Palette,
  Layout,
  Check,
  Loader2,
} from "lucide-react";

interface TemplateEditorProps {
  templateId?: string;
  initialName?: string;
  initialDescription?: string;
  initialJson: TemplateJson;
  isDefault?: boolean;
  isNew?: boolean;
}

export function TemplateEditor({
  templateId,
  initialName = "My Template",
  initialDescription = "",
  initialJson,
  isDefault = false,
  isNew = false,
}: TemplateEditorProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [templateJson, setTemplateJson] = useState<TemplateJson>(initialJson);
  const [makeDefault, setMakeDefault] = useState(isDefault);
  const [activeTab, setActiveTab] = useState<"components" | "styles" | "preview">("components");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sample data for realistic preview rendering
  const dummySeller = {
    name: "Acme Digital Pvt Ltd",
    legalName: "Acme Digital Solutions Private Limited",
    logoUrl: "https://via.placeholder.com/150x50?text=Acme+Logo",
    email: "billing@acme.com",
    phone: "+91 98765 43210",
    address: "Plot 42, Cyber City, Sector 24",
    city: "Mumbai",
    state: "Maharashtra",
    stateCode: "27",
    postalCode: "400001",
    gstRegistered: true,
    gstin: "27AAAAA0000A1Z5",
  };

  const dummyCustomer = {
    name: "Global Tech Services",
    gstin: "27BBBBB1111B2Z6",
    address: "7th Floor, Innovation Park",
    city: "Mumbai",
    state: "Maharashtra",
    stateCode: "27",
    postalCode: "400051",
    email: "accounts@globaltech.com",
  };

  const dummyItems = [
    {
      id: "1",
      description: "Custom SaaS Dashboard Design & Setup",
      quantity: 1,
      unit: "project",
      unitPrice: 35000,
      taxProfileId: "1",
      taxRate: 18,
      taxableAmount: 35000,
      cgstAmount: 3150,
      sgstAmount: 3150,
      igstAmount: 0,
      totalTax: 6300,
      lineTotal: 41300,
    },
    {
      id: "2",
      description: "API Integration & PDF Generator",
      quantity: 2,
      unit: "modules",
      unitPrice: 7500,
      taxProfileId: "1",
      taxRate: 18,
      taxableAmount: 15000,
      cgstAmount: 1350,
      sgstAmount: 1350,
      igstAmount: 0,
      totalTax: 2700,
      lineTotal: 17700,
    },
  ];

  const dummyTotals = {
    subtotal: 50000,
    discountAmount: 5000,
    taxableAmount: 45000,
    cgstAmount: 4050,
    sgstAmount: 4050,
    igstAmount: 0,
    totalTax: 8100,
    grandTotal: 53100,
  };

  const dummyTax = {
    isSameState: true,
    sellerStateCode: "27",
    customerStateCode: "27",
    breakdown: [],
  };

  const dummyPayment = {
    bankName: "HDFC Bank",
    accountName: "Acme Digital Pvt Ltd",
    accountNumber: "50100012345678",
    ifsc: "HDFC0001234",
    upiId: "acmedigital@hdfcbank",
  };

  const toggleComponentVisibility = (id: string) => {
    setTemplateJson((prev: TemplateJson) => ({
      ...prev,
      components: prev.components.map((c: TemplateComponent) =>
        c.id === id ? { ...c, visible: c.visible === false ? true : false } : c
      ),
    }));
  };

  const moveComponent = (index: number, direction: "up" | "down") => {
    const list = [...templateJson.components];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setTemplateJson((prev: TemplateJson) => ({ ...prev, components: list }));
  };

  const updateStyle = (key: keyof TemplateJson["styles"], value: string) => {
    setTemplateJson((prev: TemplateJson) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      if (isNew) {
        const res = await createTemplateAction({
          name,
          description,
          templateJson,
          isDefault: makeDefault,
        });

        if (res.success && res.template) {
          setSaveSuccess(true);
          setTimeout(() => {
            router.push("/templates");
          }, 800);
        }
      } else if (templateId) {
        const res = await updateTemplateAction(templateId, {
          name,
          description,
          templateJson,
          isDefault: makeDefault,
        });

        if (res.success) {
          setSaveSuccess(true);
          setTimeout(() => {
            setSaveSuccess(false);
          }, 2000);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/templates")}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template Name"
              className="font-bold text-slate-900 text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none px-1"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Template Description (optional)"
              className="text-xs text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-900 focus:outline-none px-1 block w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Template
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs (Components, Styles, Live Preview) */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "components" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Layout className="w-4 h-4" /> Components & Order
        </button>
        <button
          onClick={() => setActiveTab("styles")}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "styles" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Palette className="w-4 h-4" /> Colors & Style
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "preview" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Eye className="w-4 h-4" /> Live Preview
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Controls */}
        <div className={`lg:col-span-6 space-y-4 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
          {activeTab === "components" && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Template Block Order
              </h2>

              <div className="space-y-2">
                {templateJson.components.map((comp: TemplateComponent, idx: number) => (
                  <div
                    key={comp.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                      comp.visible !== false
                        ? "bg-white border-slate-200"
                        : "bg-slate-50 border-slate-200 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleComponentVisibility(comp.id)}
                        className={`p-1.5 rounded-md ${
                          comp.visible !== false
                            ? "text-slate-700 hover:bg-slate-100"
                            : "text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {comp.visible !== false ? (
                          <Eye className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-xs font-semibold text-slate-800">
                        {comp.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveComponent(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveComponent(idx, "down")}
                        disabled={idx === templateJson.components.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-100"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "styles" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Color Palette & Branding
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={templateJson.styles.primaryColor || "#0f172a"}
                      onChange={(e) => updateStyle("primaryColor", e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={templateJson.styles.primaryColor || "#0f172a"}
                      onChange={(e) => updateStyle("primaryColor", e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono w-28 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={templateJson.styles.secondaryColor || "#475569"}
                      onChange={(e) => updateStyle("secondaryColor", e.target.value)}
                      className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={templateJson.styles.secondaryColor || "#475569"}
                      onChange={(e) => updateStyle("secondaryColor", e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono w-28 uppercase"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="makeDefault"
                    checked={makeDefault}
                    onChange={(e) => setMakeDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900"
                  />
                  <label htmlFor="makeDefault" className="text-xs font-medium text-slate-800">
                    Set as Organization Default Template
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Web Preview */}
        <div className={`lg:col-span-6 ${activeTab === "components" || activeTab === "styles" ? "hidden lg:block" : "block"}`}>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Real-Time Web Preview
            </h3>
            <WebInvoiceRenderer
              template={templateJson}
              invoiceNumber="INV-1001"
              invoiceDate="2026-09-14"
              dueDate="2026-09-28"
              seller={dummySeller}
              customer={dummyCustomer}
              items={dummyItems}
              discount={{ type: "PERCENTAGE", value: 10 }}
              tax={dummyTax}
              totals={dummyTotals}
              notes="Thank you for choosing Acme Digital for your software services."
              terms="Payment due within 14 days of invoice issue date."
              payment={dummyPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
