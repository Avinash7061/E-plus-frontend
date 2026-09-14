"use client";
import React from "react";
import { RiskLevelBadge, SyncStatusIndicator, AlertListItem } from "@/components/ComponentLibrary";
import { Heart, Activity, Thermometer, ShieldCheck, PhoneCall, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CaregiverPortalView() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#445e5f] hover:underline">
          <ArrowLeft size={14} /> Back to Patient App
        </Link>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-200/70 text-zinc-700 font-semibold">
          Caregiver Read-Only Mode
        </span>
      </div>

      {/* Patient Status Overview Card */}
      <div className="sage-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div>
            <span className="text-xs font-mono text-zinc-400">Monitoring Subject</span>
            <h1 className="text-2xl font-extrabold text-[#222f30]">Julian Vance</h1>
            <p className="text-xs text-[#445e5f] mt-0.5">Device: EPLUS-8492-IN • Last active 2m ago</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <RiskLevelBadge level="Low" size="lg" />
            <SyncStatusIndicator isOnline={true} lastSync="2 minutes ago" />
          </div>
        </div>

        {/* Vitals Summary Grid (Read Only) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Heart Rate</span>
            <div className="font-mono text-2xl font-black text-[#222f30] mt-1">72 <span className="text-xs font-normal">bpm</span></div>
            <span className="text-[10px] text-emerald-700 font-semibold">Normal</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Blood Oxygen</span>
            <div className="font-mono text-2xl font-black text-[#222f30] mt-1">98 <span className="text-xs font-normal">%</span></div>
            <span className="text-[10px] text-emerald-700 font-semibold">Optimal</span>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Temperature</span>
            <div className="font-mono text-2xl font-black text-[#222f30] mt-1">36.8 <span className="text-xs font-normal">°C</span></div>
            <span className="text-[10px] text-emerald-700 font-semibold">Normal</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <a
            href="tel:+919876543210"
            className="flex-1 py-3 px-4 rounded-xl bg-[#a7e26e] hover:bg-[#95d459] text-[#222f30] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <PhoneCall size={15} />
            <span>Call Patient Directly</span>
          </a>
        </div>
      </div>

      {/* Read-Only Recent Alert History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#222f30] uppercase tracking-wider">Patient Incident Stream</h3>
        <AlertListItem
          alert={{
            id: "cg-1",
            title: "Elevated Heat Index Trigger",
            timestamp: "Today, 14:32",
            severity: "High",
            type: "Heat",
            desc: "Patient exposed to 39°C environment. Advisory notified to seek shade and hydrate."
          }}
        />
        <AlertListItem
          alert={{
            id: "cg-2",
            title: "Routine Baseline Completed",
            timestamp: "Today, 08:00",
            severity: "Low",
            type: "Sensor",
            desc: "Daily morning cranial electrode impedance test passed successfully."
          }}
        />
      </div>
    </div>
  );
}
