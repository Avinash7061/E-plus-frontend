import { AlertCircle, Flame, Wind, Activity, Heart, Thermometer, Wifi, WifiOff } from "lucide-react";

export function RiskLevelBadge({ level }: { level: "Low" | "Moderate" | "High" | "Critical" }) {
  const colors = {
    Low: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Moderate: "bg-amber-100 text-amber-800 border-amber-200",
    High: "bg-orange-100 text-orange-800 border-orange-200",
    Critical: "bg-red-100 text-red-800 border-red-200 animate-pulse",
  };

  return (
    <div className={`px-4 py-2 rounded-full border font-bold text-sm shadow-sm inline-flex items-center gap-2 ${colors[level]}`}>
      <div className="w-2 h-2 rounded-full bg-current" />
      {level} Risk Status
    </div>
  );
}

export function VitalCard({ icon: Icon, label, value, unit, colorClass }: { icon: any, label: string, value: string, unit: string, colorClass: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg bg-zinc-50 ${colorClass}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-3xl font-bold tracking-tight text-zinc-900">{value}</span>
        <span className="font-mono text-sm font-medium text-zinc-500">{unit}</span>
      </div>
      <div className="mt-3 h-8 w-full bg-zinc-50 rounded-lg overflow-hidden flex items-end">
        {/* Mock Sparkline */}
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full opacity-40">
          <polyline points="0,15 20,10 40,18 60,8 80,12 100,5" fill="none" stroke="currentColor" strokeWidth="2" className={colorClass} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function SyncStatusIndicator({ isOnline, lastSync }: { isOnline: boolean, lastSync: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      {isOnline ? (
        <>
          <Wifi size={14} className="text-emerald-600" />
          <span className="text-emerald-700">Live Syncing</span>
        </>
      ) : (
        <>
          <WifiOff size={14} className="text-amber-600" />
          <span className="text-amber-700">Offline • Last synced {lastSync}</span>
        </>
      )}
    </div>
  );
}

export function EnvironmentalRiskCard({ heatIndex, aqi, riskNote }: { heatIndex: number, aqi: number, riskNote: string }) {
  return (
    <div className="bg-zinc-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Environmental Risk</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
            <Flame size={20} />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Heat Index</div>
            <div className="font-mono text-lg font-bold">{heatIndex}°C</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
            <Wind size={20} />
          </div>
          <div>
            <div className="text-xs text-zinc-400">AQI</div>
            <div className="font-mono text-lg font-bold">{aqi}</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-xl p-3 text-sm flex items-start gap-3">
        <AlertCircle size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <p className="text-zinc-300 leading-snug">{riskNote}</p>
      </div>
    </div>
  );
}
