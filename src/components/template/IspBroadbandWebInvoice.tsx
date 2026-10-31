"use client";

import React from "react";
import { IspInvoiceData } from "@/types/isp";
import { formatCurrency } from "@/lib/utils/cn";
import { Phone, Mail, Globe } from "lucide-react";
import { DEFAULT_ISP_LOGO_DATA_URI } from "@/lib/templates/ispLogoDataUri";

export function IspBroadbandWebInvoice({ data }: { data: IspInvoiceData }) {
  const {
    company,
    invoice,
    customer,
    items,
    gst,
    payment,
    qrCode,
    footer,
  } = data;

  const hasDifferentInstallationAddress =
    Boolean(customer.installationAddress) &&
    customer.installationAddress.trim().toLowerCase() !==
    customer.billingAddress.trim().toLowerCase();

  return (
    <div className="bg-white text-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 max-w-4xl mx-auto font-sans">
      {/* SECTION A: Company Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b-2 border-sky-600">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg border border-slate-300 bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.logoUrl || DEFAULT_ISP_LOGO_DATA_URI}
                alt={company.brandName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                {company.brandName}
              </h1>
              <span className="text-[11px] font-semibold text-slate-600">
                {company.legalName}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-1 leading-relaxed">
            {company.address}
          </p>
          {(company.gstin || company.pan) && (
            <div className="flex flex-wrap gap-x-3 text-xs text-slate-600 pt-0.5 font-medium">
              {company.gstin && (
                <span>
                  <strong className="text-slate-800">GSTIN:</strong> {company.gstin}
                </span>
              )}
              {company.pan && (
                <span>
                  <strong className="text-slate-800">PAN:</strong> {company.pan}
                </span>
              )}
              {company.state && (
                <span>
                  <strong className="text-slate-800">State:</strong> {company.state}{company.stateCode ? ` (${company.stateCode})` : ""}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="text-left sm:text-right space-y-1 self-stretch sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
            PAYMENT INVOICE
          </div>
          <div className="text-xs text-sky-700 font-semibold uppercase tracking-wide">
            Broadband Telecom Service
          </div>
          <div className="text-xs text-slate-500 space-y-0.5 pt-1">
            <div className="flex items-center sm:justify-end gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{company.phone}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{company.email}</span>
            </div>
            {company.website && (
              <div className="flex items-center sm:justify-end gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{company.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION B & C: Customer Information & Invoice Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-5">
        {/* Bill To */}
        <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-sky-700 border-b border-slate-200 pb-1">
            Bill To / Subscriber
          </h2>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              {customer.name}
            </h3>
            <div className="flex flex-wrap gap-x-4 text-xs text-slate-600 mt-1">
              <span>
                <strong>Cust ID:</strong> {customer.customerId}
              </span>
              <span>
                <strong>Connection ID:</strong> {customer.connectionId}
              </span>
              <span>
                <strong>Mobile:</strong> {customer.phone}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Billing Address:
              </span>
              <p className="text-slate-700">{customer.billingAddress}</p>
            </div>

            {hasDifferentInstallationAddress && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Service Installation Address:
                </span>
                <p className="text-slate-700">{customer.installationAddress}</p>
              </div>
            )}

            <div className="text-slate-700 pt-0.5">
              <strong>State:</strong> {customer.state} ({customer.stateCode})
              {customer.gstin ? `  |  GSTIN: ${customer.gstin}` : ""}
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 text-xs">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-sky-700 border-b border-slate-200 pb-1 mb-2">
            Invoice Details
          </h2>

          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">Invoice Number:</span>
            <span className="font-bold text-slate-900">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">Invoice Date:</span>
            <span className="font-semibold text-slate-800">{invoice.invoiceDate}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">Billing Period:</span>
            <span className="font-semibold text-slate-800">
              {invoice.billingPeriodStart} – {invoice.billingPeriodEnd}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">Billing Cycle:</span>
            <span className="font-extrabold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded text-[11px]">
              {invoice.billingCycle || "15 Days"}
            </span>
          </div>
          {payment.status !== "PAID" && (
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Due Date:</span>
              <span className="font-bold text-red-600">{invoice.dueDate}</span>
            </div>
          )}
          <div className="flex justify-between py-0.5">
            <span className="text-slate-500">Place of Supply:</span>
            <span className="font-semibold text-slate-800">{invoice.placeOfSupply}</span>
          </div>
          {company.gstin && (
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Reverse Charge:</span>
              <span className="font-semibold text-slate-800">{String(invoice.reverseCharge)}</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION D: Internet Service Details (Line Item Table) */}
      <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-center">SAC</th>
              <th className="py-2.5 px-3 text-center">Billing Period</th>
              <th className="py-2.5 px-3 text-center">Qty</th>
              <th className="py-2.5 px-3 text-right">
                {gst.totalGst > 0 || company.gstin ? "Taxable Amount" : "Amount"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-slate-50/50">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{item.description}</div>
                  <div className="text-[10px] text-slate-400">
                    SAC Code: {item.sac || "998422"} | Rate: {formatCurrency(item.unitPrice)}
                    {gst.totalGst > 0 || company.gstin ? ` | GST: ${item.gstRate ?? 0}%` : ""}
                  </div>
                </td>
                <td className="py-3 px-3 text-center font-medium text-slate-600">
                  {item.sac || "998422"}
                </td>
                <td className="py-3 px-3 text-center text-slate-600">
                  {item.billingPeriod || invoice.billingCycle || "15 Days"}
                </td>
                <td className="py-3 px-3 text-center font-semibold text-slate-800">
                  {item.quantity}
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">
                  {formatCurrency(item.taxableAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Amount in words */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-5 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Amount in Words (INR):
        </span>
        <span className="font-bold text-slate-900">
          {gst.amountInWords || "INR Zero Only"}
        </span>
      </div>

      {/* LOWER SECTION: Payment Summary & Invoice/GST Breakdown & QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
        {/* Section F: Payment Summary */}
        <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
              Payment Summary
            </h2>
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${payment.status === "PAID"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : payment.status === "PARTIALLY PAID"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-red-100 text-red-800 border border-red-300"
                }`}
            >
              {payment.status}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Previous Balance:</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(payment.previousBalance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Invoice Amount:</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(payment.currentInvoiceAmount)}
              </span>
            </div>
            {payment.previousPayments > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>
                  {payment.status === "PAID" ? "Amount Paid:" : "Previous Payments:"}
                </span>
                <span>
                  {payment.status === "PAID"
                    ? formatCurrency(payment.previousPayments)
                    : `-${formatCurrency(payment.previousPayments)}`}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Outstanding Balance:</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(payment.outstandingBalance)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-2">
              <span>Total Amount Payable:</span>
              <span className="text-sky-700">
                {formatCurrency(payment.totalAmountPayable)}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2 mt-3 space-y-1 text-[11px]">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Payment Details:
            </span>
            {payment.upiId && (
              <div className="flex justify-between">
                <span className="text-slate-500">UPI ID:</span>
                <span className="font-bold text-slate-800">{payment.upiId}</span>
              </div>
            )}
            {payment.bankName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Bank:</span>
                <span className="font-semibold text-slate-800">
                  {payment.bankName} {payment.branch ? `(${payment.branch})` : ""}
                </span>
              </div>
            )}
            {payment.accountNumber && (
              <div className="flex justify-between">
                <span className="text-slate-500">Account No:</span>
                <span className="font-mono font-bold text-slate-800">
                  {payment.accountNumber}
                </span>
              </div>
            )}
            {payment.ifsc && (
              <div className="flex justify-between">
                <span className="text-slate-500">IFSC Code:</span>
                <span className="font-mono font-bold text-slate-800">
                  {payment.ifsc}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section E: Invoice/GST Summary & Section G: Dynamic QR Code */}
        <div className="md:col-span-6 flex flex-col justify-between gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-sky-700 border-b border-slate-200 pb-1.5">
              {gst.totalGst > 0 || company.gstin
                ? "GST Tax Computation"
                : "Invoice Summary"}
            </h2>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-medium text-slate-800">
                  {formatCurrency(gst.subtotal)}
                </span>
              </div>
              {gst.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-{formatCurrency(gst.discount)}</span>
                </div>
              )}

              {(gst.totalGst > 0 || Boolean(company.gstin)) && (
                <>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                    <span>Taxable Value:</span>
                    <span>{formatCurrency(gst.taxableValue)}</span>
                  </div>

                  {!gst.isInterState ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">CGST ({gst.cgstRate}%):</span>
                        <span className="font-medium text-slate-800">
                          {formatCurrency(gst.cgstAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SGST ({gst.sgstRate}%):</span>
                        <span className="font-medium text-slate-800">
                          {formatCurrency(gst.sgstAmount)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-slate-500">IGST ({gst.igstRate}%):</span>
                      <span className="font-medium text-slate-800">
                        {formatCurrency(gst.igstAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Total GST:</span>
                    <span>{formatCurrency(gst.totalGst)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-2">
                <span>Final Invoice Amount:</span>
                <span>{formatCurrency(gst.finalInvoiceAmount)}</span>
              </div>
            </div>
          </div>

          {/* Dynamic QR Code */}
          {qrCode.enabled && qrCode.dataUri && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCode.dataUri}
                alt="Invoice QR Code"
                className="w-16 h-16 shrink-0 border border-slate-100 rounded"
              />
              <div className="text-xs space-y-0.5 min-w-0">
                <span className="font-bold text-slate-900 block truncate">
                  {qrCode.label || "Scan to View Invoice"}
                </span>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Scan with your phone camera to view and verify this digital invoice online.
                </p>
                <a
                  href={qrCode.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-sky-600 hover:underline block truncate font-mono"
                >
                  {qrCode.url}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION H: Invoice Footer */}
      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-end">
          <div className="space-y-1 sm:max-w-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Terms & Conditions:
            </span>
            <ul className="space-y-1 text-[11px] text-slate-500">
              {footer.terms?.map((term, i) => (
                <li key={i}>• {term}</li>
              ))}
            </ul>
            <p className="font-semibold text-slate-700 text-xs pt-1">
              {footer.thankYouMessage ||
                "Thank you for choosing us. We appreciate your trust in our services."}
            </p>
          </div>

          <div className="flex flex-col items-end text-right sm:self-end">
            <div className="font-bold text-slate-900 text-xs mb-1">
              {footer.authorizedSignatoryTitle || company.brandName}
            </div>

            {/* Digital Seal Image (PAID) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://png.pngtree.com/png-clipart/20230317/original/pngtree-paid-stamp-vector-illustration-png-image_8991938.png"
              alt="PAID Digital Seal"
              className="w-24 h-24 object-contain select-none"
            />
          </div>
        </div>

        {footer.isComputerGeneratedDeclaration && (
          <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
            This is a computer-generated invoice and does not require a physical signature.
          </div>
        )}
      </div>
    </div>
  );
}
