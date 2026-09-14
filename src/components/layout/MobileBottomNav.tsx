"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, PlusCircle, LayoutTemplate, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Invoices", href: "/invoices", icon: FileText },
    { label: "Create", href: "/invoices/new", icon: PlusCircle, highlight: true },
    { label: "Templates", href: "/templates", icon: LayoutTemplate },
    { label: "More", href: "/organization", icon: MoreHorizontal },
  ];

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/i/")
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/invoices/new");

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="bg-slate-900 text-white p-3.5 rounded-full shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-slate-800 mt-1">Create</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors",
                isActive ? "text-slate-900 font-bold" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive ? "stroke-[2.5]" : "stroke-[1.75]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
