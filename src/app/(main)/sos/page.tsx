"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DangerButton } from "@/components/ComponentLibrary";
import { ShieldAlert, X, PhoneCall, MapPin, CheckCircle2, AlertOctagon, Radio } from "lucide-react";

export default function EmergencySOSPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [dispatched, setDispatched] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setDispatched(true);
      return;
    }
    if (cancelled) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, cancelled]);

  const handleCancel = () => {
    setCancelled(true);
    router.push("/");
  };

  const progress = (secondsLeft / 10) * 100;

  return (
    <div className="min-h-[85vh] p-5 sm:p-7 flex flex-col justify-between max-w-lg mx-auto">
      {/* Top Status */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold animate-pulse">
          <AlertOctagon size={15} /> EMERGENCY SOS TRIGGERED
        </div>
        <h1 className="text-2xl font-black text-[#222f30] tracking-tight">
          {dispatched ? "Emergency Beacon Broadcasted" : "Initiating Emergency Dispatch"}
        </h1>
        <p className="text-xs text-[#445e5f]">
          {dispatched 
            ? "Live GPS packet and telemetry transmitted to care team & ambulance." 
            : "Transmitting satellite distress packet if not cancelled."}
        </p>
      </div>

      {/* Countdown Ring or Dispatched State */}
      <div className="my-8 flex flex-col items-center justify-center">
        {!dispatched ? (
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className="stroke-rose-100" strokeWidth="8" fill="none" />
              <circle
                cx="50" cy="50" r="42"
                className="stroke-rose-600 transition-all duration-1000 ease-linear"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progress) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-5xl font-black text-rose-600">{secondsLeft}</span>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Seconds</span>
            </div>
          </div>
        ) : (
          <div className="sage-card p-6 w-full text-center border-rose-300 bg-rose-50/40 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto animate-bounce">
              <PhoneCall size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-900">112 Emergency Dispatch Alerted</h3>
              <p className="text-xs text-rose-700 mt-1">Twilio encrypted payload dispatched with location coordinates & biometric packet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Live Location & Caregiver Notified List */}
      <div className="space-y-4">
        {/* Mock Live Map Card */}
        <div className="sage-card p-3 flex items-center gap-3 bg-zinc-50">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <div className="font-bold text-[#222f30]">Live GPS Location Shared</div>
            <div className="font-mono text-zinc-500 truncate">28.6139° N, 77.2090° E (Accuracy: ±4m)</div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Transmitted</span>
        </div>

        {/* Contacts Dispatched */}
        <div className="sage-card p-4 space-y-2.5">
          <div className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Emergency Contacts Queue</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50">
              <span className="font-medium text-[#222f30]">Dr. Arvind Mehta (Neurologist)</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                <CheckCircle2 size={13} /> SMS Delivered
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50">
              <span className="font-medium text-[#222f30]">Priya Vance (Spouse)</span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                <CheckCircle2 size={13} /> Voice Ringing
              </span>
            </div>
          </div>
        </div>

        {/* Big Cancel Button */}
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-4 px-6 rounded-2xl font-extrabold text-base bg-white border-2 border-zinc-300 hover:bg-zinc-100 text-zinc-800 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <X size={20} />
            <span>Cancel SOS / False Alarm</span>
          </button>
        </div>
      </div>
    </div>
  );
}
