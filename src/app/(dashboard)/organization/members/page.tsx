"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getOrganizationAction,
  addStaffMemberAction,
  removeStaffMemberAction,
} from "@/app/actions/organization";
import { OrganizationDoc, OrganizationMember } from "@/types";
import { UserPlus, Trash2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function StaffMembersPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState<OrganizationDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadOrg();
  }, []);

  async function loadOrg() {
    const res = await getOrganizationAction();
    if (res.success && res.organization) {
      setOrganization(res.organization);
    }
    setLoading(false);
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setAdding(true);
    setError(null);
    setSuccess(false);

    const res = await addStaffMemberAction(email, role);
    if (res.success) {
      setEmail("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      await loadOrg();
    } else {
      setError(res.error || "Failed to add staff member.");
    }
    setAdding(false);
  };

  const handleRemoveMember = async (memberEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from this business?`)) return;
    const res = await removeStaffMemberAction(memberEmail);
    if (res.success) {
      await loadOrg();
    } else {
      alert(res.error || "Failed to remove staff member.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-700" />
      </div>
    );
  }

  if (!organization) return null;

  const membersList: OrganizationMember[] = organization.members || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/organization")}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Staff Members — {organization.name}
          </h1>
          <p className="text-xs text-slate-500">
            Invite team members and staff to collaborate on invoices
          </p>
        </div>
      </div>

      {/* Add Staff Member Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-slate-700" /> Add New Staff Member
        </h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
            Staff member added successfully!
          </div>
        )}

        <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Staff Member Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@business.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "MEMBER")}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={adding}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Add Staff
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Staff Members List */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
        <div className="p-4 bg-slate-50 rounded-t-xl text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>Active Staff Members ({membersList.length})</span>
          <span>Role</span>
        </div>

        {membersList.map((member, idx) => (
          <div key={member.email || idx} className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center font-bold text-sm">
                {member.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  {member.email}
                </span>
                <span className="text-[10px] text-slate-400">
                  Added: {new Date(member.addedAt || Date.now()).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  member.role === "OWNER"
                    ? "bg-slate-900 text-white"
                    : member.role === "ADMIN"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {member.role}
              </span>

              {member.role !== "OWNER" && (
                <button
                  onClick={() => handleRemoveMember(member.email)}
                  title="Remove Staff Member"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
