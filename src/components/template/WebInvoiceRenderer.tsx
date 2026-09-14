"use client";

import React from "react";
import {
  CustomerSnapshot,
  InvoiceDiscount,
  InvoiceItemSnapshot,
  InvoiceTotals,
  PaymentSnapshot,
  SellerSnapshot,
  TaxSnapshot,
  TemplateJson,
  TemplateComponent,
} from "@/types";
import { formatCurrency } from "@/lib/utils/cn";

interface WebInvoiceRendererProps {
  template: TemplateJson;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  seller: SellerSnapshot;
  customer: CustomerSnapshot;
  items: InvoiceItemSnapshot[];
  discount: InvoiceDiscount;
  tax: TaxSnapshot;
  totals: InvoiceTotals;
  notes?: string;
  terms?: string;
  payment?: PaymentSnapshot;
}

export function WebInvoiceRenderer({
  template,
  invoiceNumber,
  invoiceDate,
  dueDate,
  seller,
  customer,
  items,
  discount,
  tax,
  totals,
  notes,
  terms,
  payment,
}: WebInvoiceRendererProps) {
  const { styles, components } = template;
  const primaryColor = styles?.primaryColor || "#0f172a";
  const secondaryColor = styles?.secondaryColor || "#475569";
  const textColor = styles?.textColor || "#1e293b";

  const visibleComponents = components
    ? components.filter((c: TemplateComponent) => c.visible !== false)
    : [];

  return (
    <div
      className="w-full bg-white text-slate-800 rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 space-y-6 text-sm"
      style={{
        color: textColor,
        fontFamily: styles?.fontFamily || "inherit",
      }}
    >
      {visibleComponents.map((comp: TemplateComponent) => {
        switch (comp.type) {
          case "HEADER":
            return (
              <div key={comp.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: primaryColor }}
                  >
                    {comp.props?.title || "TAX INVOICE"}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Invoice #{invoiceNumber}
                  </p>
                </div>
                {comp.props?.showLogo && seller.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={seller.logoUrl}
                    alt={seller.name}
                    className="h-12 max-w-[160px] object-contain"
                  />
                )}
              </div>
            );

          case "BUSINESS_INFO":
            return (
              <div key={comp.id} className="space-y-1">
                <h2 className="font-bold text-base text-slate-900">{seller.name}</h2>
                {seller.legalName && seller.legalName !== seller.name && (
                  <p className="text-xs text-slate-500">{seller.legalName}</p>
                )}
                {seller.address && <p className="text-xs text-slate-600">{seller.address}</p>}
                {(seller.city || seller.state || seller.postalCode) && (
                  <p className="text-xs text-slate-600">
                    {[seller.city, seller.state, seller.postalCode].filter(Boolean).join(", ")}
                    {seller.stateCode && ` (State Code: ${seller.stateCode})`}
                  </p>
                )}
                {seller.gstRegistered && seller.gstin && (
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    GSTIN: {seller.gstin}
                  </p>
                )}
                {(seller.email || seller.phone) && (
                  <p className="text-xs text-slate-500">
                    {[seller.email, seller.phone].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>
            );

          case "CUSTOMER_INFO":
            return (
              <div key={comp.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-1">
                <span
                  className="text-xs uppercase font-bold tracking-wider"
                  style={{ color: secondaryColor }}
                >
                  {comp.props?.title || "Billed To"}
                </span>
                <p className="font-bold text-slate-900 text-sm">{customer.name || "N/A"}</p>
                {customer.address && <p className="text-xs text-slate-600">{customer.address}</p>}
                {(customer.city || customer.state || customer.postalCode) && (
                  <p className="text-xs text-slate-600">
                    {[customer.city, customer.state, customer.postalCode].filter(Boolean).join(", ")}
                    {customer.stateCode && ` (State Code: ${customer.stateCode})`}
                  </p>
                )}
                {customer.gstin && (
                  <p className="text-xs font-semibold text-slate-700">
                    GSTIN: {customer.gstin}
                  </p>
                )}
                {(customer.email || customer.phone) && (
                  <p className="text-xs text-slate-500">
                    {[customer.email, customer.phone].filter(Boolean).join(" • ")}
                  </p>
                )}
              </div>
            );

          case "INVOICE_DETAILS":
            return (
              <div key={comp.id} className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Date</span>
                  <span className="font-semibold text-slate-900">{invoiceDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Due Date</span>
                  <span className="font-semibold text-slate-900">{dueDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Place of Supply</span>
                  <span className="font-semibold text-slate-900">
                    {tax.customerStateCode
                      ? tax.isSameState
                        ? "Intra-State (CGST + SGST)"
                        : "Inter-State (IGST)"
                      : "Standard GST"}
                  </span>
                </div>
              </div>
            );

          case "DIVIDER":
            return <hr key={comp.id} className="border-slate-200" />;

          case "ITEMS_TABLE":
            return (
              <div key={comp.id} className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className="border-b border-slate-200 text-slate-700 uppercase font-semibold tracking-wider"
                      style={{ backgroundColor: `${primaryColor}0D` }}
                    >
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Tax Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-3 px-3 font-medium text-slate-900">
                          {item.description}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          {item.taxRate}%
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-900">
                          {formatCurrency(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "SUMMARY":
            return (
              <div key={comp.id} className="flex flex-col items-end pt-2">
                <div className="w-full max-w-xs space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totals.subtotal)}</span>
                  </div>

                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>
                        Discount {discount.type === "PERCENTAGE" ? `(${discount.value}%)` : ""}
                      </span>
                      <span className="font-semibold">-{formatCurrency(totals.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-100">
                    <span>Taxable Amount</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totals.taxableAmount)}</span>
                  </div>

                  {tax.isSameState ? (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST Total</span>
                        <span className="font-semibold">{formatCurrency(totals.cgstAmount)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST Total</span>
                        <span className="font-semibold">{formatCurrency(totals.sgstAmount)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-600">
                      <span>IGST Total</span>
                      <span className="font-semibold">{formatCurrency(totals.igstAmount)}</span>
                    </div>
                  )}

                  <div
                    className="flex justify-between text-sm font-bold pt-2 border-t-2 border-slate-900"
                    style={{ color: primaryColor }}
                  >
                    <span>Grand Total</span>
                    <span>{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>
            );

          case "PAYMENT_INFO":
            return (
              (payment?.bankName || payment?.accountNumber || payment?.upiId) && (
                <div key={comp.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-2 text-xs">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {payment?.bankName && (
                      <div>
                        <span className="text-slate-500">Bank Name:</span>{" "}
                        <span className="font-medium text-slate-800">{payment.bankName}</span>
                      </div>
                    )}
                    {payment?.accountName && (
                      <div>
                        <span className="text-slate-500">Account Name:</span>{" "}
                        <span className="font-medium text-slate-800">{payment.accountName}</span>
                      </div>
                    )}
                    {payment?.accountNumber && (
                      <div>
                        <span className="text-slate-500">Account No:</span>{" "}
                        <span className="font-medium text-slate-800">{payment.accountNumber}</span>
                      </div>
                    )}
                    {payment?.ifsc && (
                      <div>
                        <span className="text-slate-500">IFSC Code:</span>{" "}
                        <span className="font-medium text-slate-800">{payment.ifsc}</span>
                      </div>
                    )}
                    {payment?.upiId && (
                      <div>
                        <span className="text-slate-500">UPI ID:</span>{" "}
                        <span className="font-semibold text-indigo-700">{payment.upiId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            );

          case "NOTES_TERMS":
            return (
              (notes || terms) && (
                <div key={comp.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  {notes && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 uppercase tracking-wider">Notes</span>
                      <p className="text-slate-600 whitespace-pre-line leading-relaxed">{notes}</p>
                    </div>
                  )}
                  {terms && (
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 uppercase tracking-wider">Terms & Conditions</span>
                      <p className="text-slate-600 whitespace-pre-line leading-relaxed">{terms}</p>
                    </div>
                  )}
                </div>
              )
            );

          case "FOOTER":
            return (
              <div key={comp.id} className="text-center pt-4 text-xs text-slate-400 border-t border-slate-100">
                {comp.props?.text || "Thank you for your business!"}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
