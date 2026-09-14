"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SignalQualityMeter, PrimaryButton } from "@/components/ComponentLibrary";
import { RotateCw, ArrowRight, Zap, Radio } from "lucide-react";
import Link from "next/link";

export default function SignalQualityCheckPage() {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const [eegGrade, setEegGrade] = useState<"good" | "fair" | "poor">("good");
  const [hrGrade, setHrGrade] = useState<"good" | "fair" | "poor">("good");
  const [tempGrade, setTempGrade] = useState<"good" | "fair" | "poor">("good");

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setEegGrade("good");
    }, 1200);
  };

  return (
    <div className="p-5 sm:p-7 max-w-lg mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
          <Radio size={13} className="animate-pulse" /> ADS1292 + BMI270 Active
        </div>
        <h1 className="text-2xl font-extrabold text-[#222f30] tracking-tight">Signal Quality Verification</h1>
        <p className="text-xs text-[#445e5f] mt-1 leading-relaxed">
          The earbud and watch run pre-baseline contact impedance checks to eliminate motion and dry-electrode artifacts before starting the anomaly engine.
        </p>
      </div>

      {/* Traffic Light Sensor Checkers */}
      <div className="space-y-3.5">
        <SignalQualityMeter
          label="Cranial EEG Electrode Contact"
          grade={eegGrade}
          statusText={eegGrade === "good" ? "Impedance: 4.8 kΩ (Optimal contact)" : "Adjust left earbud placement"}
        />
        <SignalQualityMeter
          label="Photoplethysmography (PPG Heart Rate)"
          grade={hrGrade}
          statusText="Perfusion Index: 1.8% (Strong arterial pulse)"
        />
        <SignalQualityMeter
          label="Infrared Epidermal Thermistor"
          grade={tempGrade}
          statusText="Surface Temp: 36.6°C (Sensor seated properly)"
        />
      </div>

      {/* Live Mini Trace Preview */}
      <div className="sage-card p-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
          <span>Live Raw Electrode Trace (CH1)</span>
          <span className="text-emerald-600 font-bold">50Hz Notch Filter On</span>
        </div>
        <div className="h-16 w-full bg-zinc-50 rounded-xl border border-zinc-100 p-2 overflow-hidden flex items-center">
          <svg viewBox="0 0 300 40" className="w-full h-full stroke-[#222f30]" fill="none" strokeWidth="1.5">
            <path d="M0,20 Q15,5 30,20 T60,20 T90,32 T120,8 T150,22 T180,18 T210,25 T240,15 T270,22 T300,20" />
          </svg>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="py-3 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-[#222f30] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RotateCw size={14} className={retrying ? "animate-spin" : ""} />
          <span>{retrying ? "Sampling..." : "Re-test"}</span>
        </button>
        <PrimaryButton onClick={() => router.push("/pairing/calibrate")} className="flex-1">
          <span>Proceed to Calibration</span>
          <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
}
