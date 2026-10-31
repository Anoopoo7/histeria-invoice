import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUserAndOrg, logoutUser } from "@/app/actions/auth";
import { User, Mail, Building2 } from "lucide-react";
import { LogoutButton } from "@/components/common/LogoutButton";

export default async function UserSettingsPage() {
  const { user, organization } = await getCurrentUserAndOrg();

  if (!user) redirect("/login");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal profile and account credentials
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          User Profile
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-xs text-slate-400 block">Name</span>
              <span className="font-semibold text-slate-900">{user.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-xs text-slate-400 block">Email Address</span>
              <span className="font-semibold text-slate-900">{user.email}</span>
            </div>
          </div>

          {organization && (
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-xs text-slate-400 block">Active Business</span>
                <span className="font-semibold text-slate-900">{organization.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        action={async () => {
          "use server";
          await logoutUser();
          redirect("/login");
        }}
      >
        <LogoutButton />
      </form>
    </div>
  );
}
