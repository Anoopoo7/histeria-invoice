"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getUserOrganizationsAction,
  switchOrganizationAction,
} from "@/app/actions/organization";
import { OrganizationDoc } from "@/types";
import { ChevronDown, Check, Plus, Loader2 } from "lucide-react";

interface OrgSwitcherProps {
  currentOrg: OrganizationDoc | null;
}

export function OrgSwitcher({ currentOrg }: OrgSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState<OrganizationDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = async () => {
    if (!isOpen && organizations.length === 0) {
      setLoading(true);
      const res = await getUserOrganizationsAction();
      if (res.success && res.organizations) {
        setOrganizations(res.organizations);
      }
      setLoading(false);
    }
    setIsOpen(!isOpen);
  };

  const handleSwitch = async (orgId: string) => {
    if (currentOrg && currentOrg._id === orgId) {
      setIsOpen(false);
      return;
    }

    setSwitchingId(orgId);
    try {
      const res = await switchOrganizationAction(orgId);
      if (res.success) {
        setIsOpen(false);
        router.refresh();
      }
    } finally {
      setSwitchingId(null);
    }
  };

  if (!currentOrg) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left group border border-transparent hover:border-slate-200"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-slate-800 transition-colors shrink-0">
          {currentOrg.name.charAt(0)}
        </div>
        <div className="min-w-0 max-w-[150px] sm:max-w-[200px]">
          <span className="font-bold text-slate-900 text-xs leading-tight block truncate">
            {currentOrg.name}
          </span>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block truncate">
            {currentOrg.gstRegistered ? "GST Business" : "Invoice SaaS"}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Your Organizations ({organizations.length || 1})
          </div>

          {loading ? (
            <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading businesses...
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto space-y-0.5 px-1">
              {(organizations.length > 0 ? organizations : [currentOrg]).map((org) => {
                const isActive = currentOrg._id === org._id;
                const isSwitching = switchingId === org._id;

                return (
                  <button
                    key={org._id}
                    onClick={() => handleSwitch(org._id)}
                    disabled={isSwitching}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      isActive ? "bg-slate-100 font-bold text-slate-900" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {org.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs truncate block">{org.name}</span>
                        {org.gstin && (
                          <span className="text-[9px] text-slate-400 block -mt-0.5 truncate">
                            {org.gstin}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSwitching ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                    ) : isActive ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}

          <div className="border-t border-slate-100 mt-1.5 pt-1 px-1">
            <Link
              href="/setup-organization"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-700" /> Create New Business
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
