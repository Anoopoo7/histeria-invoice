"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { duplicateInvoiceAction } from "@/app/actions/invoice";
import { Download, Share2, Copy, Check, ExternalLink, Loader2 } from "lucide-react";

interface InvoiceDetailActionsProps {
  invoiceId: string;
  publicId: string;
  invoiceNumber: string;
}

export function InvoiceDetailActions({
  invoiceId,
  publicId,
  invoiceNumber,
}: InvoiceDetailActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/i/${publicId}`
    : `/i/${publicId}`;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Invoice ${invoiceNumber}`,
            text: `View Tax Invoice ${invoiceNumber}`,
            url: publicUrl,
          });
        } catch {
          handleCopyLink();
        }
      } else {
        handleCopyLink();
      }
    } finally {
      setSharing(false);
    }
  };

  const handleDuplicate = async () => {
    setDuplicating(true);
    try {
      const res = await duplicateInvoiceAction(invoiceId);
      if (res.success && res.invoice) {
        router.push(`/invoices/${res.invoice._id}`);
      }
    } finally {
      setDuplicating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <a
          href={`/api/invoices/${invoiceId}/pdf`}
          download
          onClick={handleDownload}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Preparing PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download A4 PDF
            </>
          )}
        </a>

        <button
          onClick={handleShare}
          disabled={sharing}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs px-3.5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {sharing ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
          ) : (
            <Share2 className="w-4 h-4 text-slate-700" />
          )}
          <span>Share</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-2.5 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" /> Link Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Public Link
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={`/i/${publicId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Public View <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleDuplicate}
          disabled={duplicating}
          className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs px-3.5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {duplicating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Copy className="w-4 h-4" /> Duplicate
            </>
          )}
        </button>
      </div>
    </div>
  );
}
