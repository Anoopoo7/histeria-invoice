import React from "react";
import { getCurrentUserAndOrg } from "@/app/actions/auth";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, organization } = await getCurrentUserAndOrg();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
      <Header user={user} organization={organization} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
