"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Copy, Loader2 } from "lucide-react";

export function DuplicateInvoiceButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
          <span>Duplicating...</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate</span>
        </>
      )}
    </button>
  );
}
