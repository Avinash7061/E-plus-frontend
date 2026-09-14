"use client";
import React from "react";
import { AlertCircle, Wifi, WifiOff, Heart, Activity, Thermometer, ChevronRight, ShieldAlert, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

// 1. RiskLevelBadge
export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export function RiskLevelBadge({ level, size = "md" }: { level: RiskLevel; size?: "sm" | "md" | "lg" }) {
  const styles: Record<RiskLevel, { bg: string; dot: string; text: string; border: string }> = {
    Low: {
      bg: "bg-emerald-50",
      dot: "bg-emerald-500",
      text: "text-emerald-900",
      border: "border-emerald-200"
    },
    Moderate: {
      bg: "bg-amber-50",
      dot: "bg-amber-500",
      text: "text-amber-900",
      border: "border-amber-200"
    },
    High: {
      bg: "bg-orange-50",
      dot: "bg-orange-500",
      text: "text-orange-900",
      border: "border-orange-200"
    },
    Critical: {
      bg: "bg-rose-50",
      dot: "bg-rose-600 pulse-red",
      text: "text-rose-900 font-extrabold",
      border: "border-rose-300"
    }
  };

  const style = styles[level] || styles.Low;
  const sizeClasses = size === "sm" ? "px-2.5 py-1 text-xs" : size === "lg" ? "px-5 py-2.5 text-base" : "px-3.5 py-1.5 text-sm";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border font-semibold shadow-xs ${style.bg} ${style.border} ${style.text} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
      <span>{level} Risk</span>
    </span>
  );
}

// 2. SyncStatusIndicator
export function SyncStatusIndicator({ isOnline = true, lastSync = "Just now" }: { isOnline?: boolean; lastSync?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      {isOnline ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cef79e]/40 text-[#222f30] border border-[#a7e26e]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#445e5f] animate-pulse" />
          <Wifi size={13} className="text-[#445e5f]" />
          <span>Live Sync</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          <WifiOff size={13} className="text-amber-600" />
          <span>Offline • {lastSync}</span>
        </span>
      )}
    </div>
  );
}

// 3. OfflineBanner
export function OfflineBanner({ pendingSyncCount = 12 }: { pendingSyncCount?: number }) {
  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <WifiOff size={14} className="text-amber-600 shrink-0" />
        <span><strong>Offline mode active:</strong> Telemetry caching locally on device ({pendingSyncCount} readings pending upload).</span>
      </div>
      <span className="font-mono text-[10px] bg-amber-200/60 px-2 py-0.5 rounded font-bold">BLE Active</span>
    </div>
  );
}

// 4. VitalCard & VitalsRow
export interface VitalItem {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  type: "hr" | "spo2" | "temp";
  status?: "normal" | "warning" | "critical";
  trend?: number[];
}

export function VitalCard({ item }: { item: VitalItem }) {
  const icons = {
    hr: Heart,
    spo2: Activity,
    temp: Thermometer
  };
  const Icon = icons[item.type] || Activity;

  const colorConfig = {
    hr: { text: "text-rose-600", bg: "bg-rose-50", stroke: "#e11d48" },
    spo2: { text: "text-sky-600", bg: "bg-sky-50", stroke: "#0284c7" },
    temp: { text: "text-emerald-700", bg: "bg-emerald-50", stroke: "#059669" }
  }[item.type];

  return (
    <div className="sage-card p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.label}</span>
        <div className={`p-2 rounded-xl ${colorConfig.bg} ${colorConfig.text}`}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#222f30] tracking-tight">{item.value}</span>
          <span className="font-mono text-sm font-semibold text-[#445e5f]">{item.unit}</span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span>Target: Optimal</span>
        <span className="text-emerald-700 font-medium">✓ In Range</span>
      </div>
    </div>
  );
}

export function VitalsRow({ vitals }: { vitals: VitalItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {vitals.map(v => (
        <VitalCard key={v.id} item={v} />
      ))}
    </div>
  );
}

// 5. AlertListItem
export interface AlertData {
  id: string;
  title: string;
  timestamp: string;
  severity: "Low" | "Moderate" | "High" | "Critical";
  type: "EEG" | "Heat" | "AQI" | "SOS" | "Sensor";
  desc: string;
  vitalsSnapshot?: Record<string, string>;
  dispatchedTo?: string[];
  location?: string;
}

export function AlertListItem({ alert, onSelect }: { alert: AlertData; onSelect?: (a: AlertData) => void }) {
  const badgeColors: Record<AlertData["severity"], string> = {
    Low: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-800 border-amber-200",
    High: "bg-orange-50 text-orange-800 border-orange-200",
    Critical: "bg-rose-50 text-rose-800 border-rose-200"
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(alert)}
      className="sage-card p-4 cursor-pointer hover:border-[#445e5f]/30 transition-all flex items-start gap-3.5"
    >
      <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${
        alert.severity === "Critical" ? "bg-rose-100 text-rose-600" :
        alert.severity === "High" ? "bg-orange-100 text-orange-600" :
        alert.severity === "Moderate" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
      }`}>
        <AlertCircle size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-sm text-[#222f30] truncate">{alert.title}</h4>
          <span className="font-mono text-xs text-zinc-500 shrink-0">{alert.timestamp}</span>
        </div>
        <p className="text-xs text-[#445e5f] mt-1 line-clamp-2 leading-relaxed">{alert.desc}</p>
        <div className="flex items-center gap-2 mt-2.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColors[alert.severity]}`}>
            {alert.severity}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-medium">
            {alert.type}
          </span>
        </div>
      </div>
      <ChevronRight size={18} className="text-zinc-400 shrink-0 self-center" />
    </div>
  );
}

// 6. SignalQualityMeter
export type SignalGrade = "good" | "fair" | "poor";

export function SignalQualityMeter({
  label,
  grade,
  statusText
}: {
  label: string;
  grade: SignalGrade;
  statusText: string;
}) {
  const configs = {
    good: {
      color: "bg-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-900",
      icon: CheckCircle2
    },
    fair: {
      color: "bg-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      icon: AlertTriangle
    },
    poor: {
      color: "bg-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-900",
      icon: XCircle
    }
  }[grade];

  const Icon = configs.icon;

  return (
    <div className={`p-4 rounded-2xl border ${configs.bg} ${configs.border} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <Icon size={20} className={configs.text} />
        <div>
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</div>
          <div className={`text-sm font-bold ${configs.text} mt-0.5`}>{statusText}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 p-1 bg-white/70 rounded-full border border-black/5">
        <span className={`w-3 h-3 rounded-full transition-all ${grade === "poor" ? "bg-rose-500" : "bg-zinc-200"}`} />
        <span className={`w-3 h-3 rounded-full transition-all ${grade === "fair" ? "bg-amber-500" : "bg-zinc-200"}`} />
        <span className={`w-3 h-3 rounded-full transition-all ${grade === "good" ? "bg-emerald-500" : "bg-zinc-200"}`} />
      </div>
    </div>
  );
}

// 7. PrimaryButton & DangerButton
export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm text-[#222f30] bg-[#a7e26e] hover:bg-[#95d459] active:scale-[0.98] transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#a7e26e] disabled:active:scale-100 flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
  disabled = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

// 8. EmptyState
export function EmptyState({
  icon: Icon = AlertCircle,
  title,
  desc,
  actionText,
  onAction
}: {
  icon?: any;
  title: string;
  desc: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="sage-card p-8 text-center flex flex-col items-center justify-center my-6">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-[#445e5f] flex items-center justify-center mb-3">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-bold text-[#222f30]">{title}</h3>
      <p className="text-xs text-zinc-500 max-w-xs mt-1.5 leading-relaxed">{desc}</p>
      {actionText && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-[#222f30] bg-[#c9cbbe]/40 hover:bg-[#c9cbbe]/70 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
