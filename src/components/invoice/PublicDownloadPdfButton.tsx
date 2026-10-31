"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function PublicDownloadPdfButton({
  publicId,
}: {
  publicId: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleClick = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 3000);
  };

  return (
    <a
      href={`/api/public/invoices/${publicId}/pdf`}
      download
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-95"
    >
      {downloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download A4 PDF</span>
        </>
      )}
    </a>
  );
}
