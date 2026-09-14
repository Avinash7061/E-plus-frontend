"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ComponentLibrary";
import { CheckCircle2, ShieldCheck, Heart, Wind } from "lucide-react";

export default function BaselineCalibrationPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(45);
  const totalSeconds = 45;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const isDone = secondsLeft === 0;

  return (
    <div className="p-6 sm:p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[75vh] text-center space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#222f30] tracking-tight">Baseline Calibration</h1>
        <p className="text-xs text-[#445e5f] mt-1.5 max-w-sm">
          Please remain still, seated, and breathe naturally while the Risk Engine calculates your resting neural and autonomic baseline.
        </p>
      </div>

      {/* Calibration Progress Ring */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-zinc-100"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-[#a7e26e] transition-all duration-500 ease-linear"
            strokeWidth="6"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * progress) / 100}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {isDone ? (
            <div className="text-emerald-600 animate-in zoom-in">
              <CheckCircle2 size={48} />
            </div>
          ) : (
            <>
              <span className="font-mono text-4xl font-extrabold text-[#222f30]">{secondsLeft}s</span>
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1">Calibrating</span>
            </>
          )}
        </div>
      </div>

      {/* Guidance Checklist */}
      <div className="w-full sage-card p-4 text-left space-y-2.5 text-xs text-[#445e5f]">
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-rose-500 shrink-0" />
          <span>Resting heart rate stabilizing (Current: ~71 bpm)</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-blue-500 shrink-0" />
          <span>Respiratory sinus arrhythmia tracking in sync</span>
        </div>
      </div>

      <div className="w-full pt-4">
        {isDone ? (
          <PrimaryButton onClick={() => router.push("/")}>
            <ShieldCheck size={18} />
            <span>Launch Active Monitoring Dashboard</span>
          </PrimaryButton>
        ) : (
          <button
            type="button"
            onClick={() => setSecondsLeft(0)}
            className="text-xs text-zinc-400 hover:text-zinc-700 underline"
          >
            Skip calibration (demo mode)
          </button>
        )}
      </div>
    </div>
  );
}
