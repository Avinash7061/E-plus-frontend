"use client";
import React, { useState } from "react";
import { 
  Watch, Headphones, Battery, Bluetooth, Bell, Shield, 
  Download, Trash2, LogOut, User, ChevronRight, Moon, RefreshCw 
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [quietHours, setQuietHours] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceAlerts, setVoiceAlerts] = useState(true);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#222f30] tracking-tight">Settings & Hardware</h1>
        <p className="text-xs text-[#445e5f] mt-0.5">Manage paired sensors, notification rules, and DPDP compliance</p>
      </div>

      {/* 1. Device Management Section */}
      <div className="sage-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Paired Hardware</h3>
          <Link href="/pairing/scan" className="text-xs font-bold text-[#445e5f] hover:underline flex items-center gap-1">
            <RefreshCw size={12} /> Re-pair Devices
          </Link>
        </div>

        <div className="space-y-3">
          {/* Smartwatch Card */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 text-[#222f30]">
                <Watch size={20} />
              </div>
              <div>
                <div className="font-bold text-xs text-[#222f30]">E+ Biometric Smartwatch</div>
                <div className="text-[11px] font-mono text-zinc-500">BLE ID: EPLUS-SW-992</div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700">
              <Battery size={16} /> 84%
            </div>
          </div>

          {/* EEG Earbud Card */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 text-[#222f30]">
                <Headphones size={20} />
              </div>
              <div>
                <div className="font-bold text-xs text-[#222f30]">Cranial EEG Earbud (Left)</div>
                <div className="text-[11px] font-mono text-zinc-500">ADS1292 • Single Channel</div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700">
              <Battery size={16} /> 72%
            </div>
          </div>
        </div>
      </div>

      {/* 2. Notification Preferences Section */}
      <div className="sage-card p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Alert Dispatch Channels</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="font-bold text-[#222f30]">Encrypted SMS Broadcast</div>
              <div className="text-zinc-500 text-[11px]">Direct SMS to contacts during High/Critical alerts</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={() => setSmsAlerts(!smsAlerts)}
              className="w-5 h-5 accent-[#a7e26e] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-zinc-100">
            <div>
              <div className="font-bold text-[#222f30]">Automated Twilio Voice Call</div>
              <div className="text-zinc-500 text-[11px]">Triggers synthetic speech siren during seizure detection</div>
            </div>
            <input
              type="checkbox"
              checked={voiceAlerts}
              onChange={() => setVoiceAlerts(!voiceAlerts)}
              className="w-5 h-5 accent-[#a7e26e] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-t border-zinc-100">
            <div>
              <div className="font-bold text-[#222f30]">Quiet Hours (Non-Critical Muting)</div>
              <div className="text-zinc-500 text-[11px]">Suppress environmental notices between 22:00 – 07:00</div>
            </div>
            <input
              type="checkbox"
              checked={quietHours}
              onChange={() => setQuietHours(!quietHours)}
              className="w-5 h-5 accent-[#a7e26e] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Privacy & DPDP Consent Section */}
      <div className="sage-card p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">DPDP Act Privacy & Rights</h3>
        <div className="space-y-2 text-xs">
          <Link
            href="/consent"
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 border border-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield size={16} className="text-[#445e5f]" />
              <span className="font-bold text-[#222f30]">Review / Withdraw Data Consents</span>
            </div>
            <ChevronRight size={16} className="text-zinc-400" />
          </Link>

          <button
            type="button"
            onClick={() => alert("Telemetric data archive export triggered. Download link will be sent via SMS.")}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 border border-zinc-200 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Download size={16} className="text-blue-600" />
              <span className="font-bold text-[#222f30]">Export My Health & EEG Telemetry (CSV)</span>
            </div>
            <ChevronRight size={16} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 4. Account Section */}
      <div className="sage-card p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Account</h3>
        <div className="space-y-2 text-xs">
          <Link
            href="/profile"
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 border border-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <User size={16} className="text-[#445e5f]" />
              <span className="font-bold text-[#222f30]">Edit Profile & Conditions</span>
            </div>
            <ChevronRight size={16} className="text-zinc-400" />
          </Link>

          <Link
            href="/caregivers"
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 border border-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <User size={16} className="text-[#445e5f]" />
              <span className="font-bold text-[#222f30]">Manage Caregiver Circle</span>
            </div>
            <ChevronRight size={16} className="text-zinc-400" />
          </Link>

          <Link
            href="/login"
            className="w-full flex items-center gap-2.5 p-3 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors font-bold"
          >
            <LogOut size={16} />
            <span>Sign Out of Session</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
