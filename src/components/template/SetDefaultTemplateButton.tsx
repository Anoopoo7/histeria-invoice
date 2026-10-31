"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function SetDefaultTemplateButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
          <span>Setting...</span>
        </>
      ) : (
        <span>Set as Default</span>
      )}
    </button>
  );
}
