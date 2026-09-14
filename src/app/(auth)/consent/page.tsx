"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ComponentLibrary";
import { ShieldCheck, Lock, Activity, MapPin, Eye, ExternalLink } from "lucide-react";

export default function ConsentPage() {
  const router = useRouter();
  const [consents, setConsents] = useState({
    biometric: true,
    location: true,
    eeg: true,
    caregiverShare: false,
  });

  const toggle = (key: keyof typeof consents) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const requiredChecked = consents.biometric && consents.eeg;

  const handleNext = () => {
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col justify-center px-4 py-8 sm:px-6 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-3 border border-blue-200">
          <Lock size={13} /> DPDP Act 2023 Compliant
        </div>
        <h1 className="text-2xl font-extrabold text-[#222f30] tracking-tight">Data Consent & Privacy</h1>
        <p className="text-xs text-[#445e5f] mt-1.5 leading-relaxed">
          In compliance with India&apos;s Digital Personal Data Protection Act, we require explicit, granular authorization for biometric telemetry processing and emergency dispatch.
        </p>
      </div>

      <div className="space-y-3.5 mb-8">
        {/* Consent Card 1 */}
        <div className="sage-card p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
              <Activity size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-[#222f30]">Biometric Vitals Stream</h4>
                <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Required</span>
              </div>
              <p className="text-xs text-[#445e5f] mt-1">Continuous heart rate, SpO2, and skin temperature processed on-device for baseline inference.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={consents.biometric}
            onChange={() => toggle("biometric")}
            className="w-5 h-5 accent-[#a7e26e] rounded mt-1 shrink-0 cursor-pointer"
          />
        </div>

        {/* Consent Card 2 */}
        <div className="sage-card p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 shrink-0 mt-0.5">
              <Eye size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-[#222f30]">EEG Neurological Telemetry</h4>
                <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Required</span>
              </div>
              <p className="text-xs text-[#445e5f] mt-1">Single-channel earbud EEG signals routed to pre-trained Random Forest seizure risk classifier.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={consents.eeg}
            onChange={() => toggle("eeg")}
            className="w-5 h-5 accent-[#a7e26e] rounded mt-1 shrink-0 cursor-pointer"
          />
        </div>

        {/* Consent Card 3 */}
        <div className="sage-card p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 shrink-0 mt-0.5">
              <MapPin size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-[#222f30]">Location During SOS</h4>
                <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">Optional</span>
              </div>
              <p className="text-xs text-[#445e5f] mt-1">GPS coordinates attached strictly to outbound satellite/Twilio emergency alerts when risk is Critical.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={consents.location}
            onChange={() => toggle("location")}
            className="w-5 h-5 accent-[#a7e26e] rounded mt-1 shrink-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        <PrimaryButton onClick={handleNext} disabled={!requiredChecked}>
          Accept Consents & Continue
        </PrimaryButton>
        <p className="text-center text-xs text-zinc-500">
          Read our <a href="#" className="underline font-medium text-[#445e5f]">DPDP Privacy Charter & Data Retention Policy</a>
        </p>
      </div>
    </div>
  );
}
