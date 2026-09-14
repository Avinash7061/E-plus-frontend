"use client";
import React, { useState } from "react";
import { UserCheck, Plus, Trash2, Mail, Phone, Send, Shield } from "lucide-react";
import { PrimaryButton } from "@/components/ComponentLibrary";
import Link from "next/link";

export default function CaregiversManagementPage() {
  const [caregivers, setCaregivers] = useState([
    { id: "1", name: "Dr. Arvind Mehta", role: "Attending Neurologist", phone: "+91 98201 11223", notifyOn: "Critical & High Alerts" },
    { id: "2", name: "Priya Vance", role: "Primary Family Caregiver", phone: "+91 98202 33445", notifyOn: "All Incidents & Daily Digest" }
  ]);

  const [inviteModal, setInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [invitePhone, setInvitePhone] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !invitePhone) return;
    setCaregivers(prev => [...prev, {
      id: Date.now().toString(),
      name: inviteName,
      role: "Invited Caregiver",
      phone: invitePhone,
      notifyOn: "All Incidents"
    }]);
    setInviteName("");
    setInvitePhone("");
    setInviteModal(false);
  };

  const removeCaregiver = (id: string) => {
    setCaregivers(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#222f30] tracking-tight">Caregiver Circle</h1>
          <p className="text-xs text-[#445e5f] mt-0.5">Authorised contacts granted access to view live wellness & receive SOS</p>
        </div>
        <button
          onClick={() => setInviteModal(true)}
          className="px-3 py-2 rounded-xl bg-[#a7e26e] hover:bg-[#95d459] text-[#222f30] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus size={16} />
          <span>Invite</span>
        </button>
      </div>

      {/* Caregiver Cards */}
      <div className="space-y-3.5">
        {caregivers.map(c => (
          <div key={c.id} className="sage-card p-4 sm:p-5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#c9cbbe]/60 text-[#222f30] font-bold text-sm flex items-center justify-center shrink-0">
                {c.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#222f30]">{c.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-semibold">{c.role}</span>
                </div>
                <div className="text-xs font-mono text-[#445e5f] mt-1">{c.phone}</div>
                <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
                  <Shield size={12} className="text-emerald-600" /> Notifications: <strong className="text-[#222f30]">{c.notifyOn}</strong>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeCaregiver(c.id)}
              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition-colors"
              title="Revoke Access"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Caregiver Portal Link Demo */}
      <div className="sage-card p-5 bg-[#cef79e]/15 border-[#a7e26e]/40">
        <h4 className="text-sm font-bold text-[#222f30] mb-1">Caregiver Dedicated Web View</h4>
        <p className="text-xs text-[#445e5f] mb-3 leading-relaxed">
          Caregivers can review a simplified, read-only status portal from any web browser without device pairing.
        </p>
        <Link
          href="/caregiver-view"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-[#222f30] hover:bg-zinc-50 transition-colors shadow-xs"
        >
          <span>Open Caregiver Read-Only View</span>
          <Send size={13} />
        </Link>
      </div>

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-base text-[#222f30]">Invite Caregiver</h3>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Maya Vance"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-[#a7e26e] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Phone (SMS Invite)</label>
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+91 00000 00000"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-[#a7e26e] outline-none"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#a7e26e] text-xs font-bold text-[#222f30] hover:bg-[#95d459]"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
