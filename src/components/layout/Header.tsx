"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Plus, LogOut, FileText, LayoutTemplate, Home } from "lucide-react";
import { logoutUser } from "@/app/actions/auth";

interface HeaderProps {
  user?: { name: string; email: string } | null;
  organization?: { name: string; logoUrl?: string } | null;
}

export function Header({ user, organization }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/i/")
  ) {
    return null;
  }

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-slate-800 transition-colors">
            H
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base leading-tight block">
              {organization?.name || "Histeria Invoice"}
            </span>
            {organization?.name && (
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block -mt-0.5">
                GST Invoice SaaS
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              pathname === "/dashboard" ? "bg-slate-100 text-slate-900 font-semibold" : "hover:text-slate-900"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/invoices"
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              pathname.startsWith("/invoices") && pathname !== "/invoices/new"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoices
          </Link>
          <Link
            href="/templates"
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              pathname.startsWith("/templates") ? "bg-slate-100 text-slate-900 font-semibold" : "hover:text-slate-900"
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Templates
          </Link>
          <Link
            href="/organization"
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              pathname.startsWith("/organization") ? "bg-slate-100 text-slate-900 font-semibold" : "hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Business
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/invoices/new"
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
