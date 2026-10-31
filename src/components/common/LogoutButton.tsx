"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 px-4 rounded-xl border border-red-200 text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          <span>Log Out of Account</span>
        </>
      )}
    </button>
  );
}
