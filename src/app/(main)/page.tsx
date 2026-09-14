"use client";
import React, { useState, useEffect } from "react";
import { 
  RiskLevelBadge, VitalsRow, SyncStatusIndicator, 
  OfflineBanner, AlertListItem, VitalItem, AlertData, RiskLevel 
} from "@/components/ComponentLibrary";
import { ShieldAlert, Flame, Wind, AlertCircle, ChevronRight, Sparkles, MapPin, RefreshCw, BrainCircuit, Zap, ArrowRight, Server } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";


export default function DashboardHomePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("Julian Vance");
  const [streak, setStreak] = useState(42);
  const [lastSyncText, setLastSyncText] = useState("Just now");

  const [currentRisk, setCurrentRisk] = useState<{
    level: RiskLevel;
    score: number;
    notes: string;
  }>({
    level: "Low",
    score: 0.12,
    notes: "No pre-ictal EEG spikes or extreme thermal thresholds crossed. Standard activity level maintained."
  });

  const [vitals, setVitals] = useState<VitalItem[]>([
    { id: "v1", label: "Heart Rate", value: "72", unit: "bpm", type: "hr" },
    { id: "v2", label: "Oxygen SpO2", value: "98.4", unit: "%", type: "spo2" },
    { id: "v3", label: "Core Temp", value: "36.8", unit: "°C", type: "temp" },
  ]);

  const [environment, setEnvironment] = useState({
    region: "New Delhi (Sector 14)",
    heatIndex: 38.4,
    aqi: 142,
    advisory: "Thermal discomfort threshold reached. Seizure threshold lowers under continuous dehydration. Hydration advisory active."
  });

  const [recentAlerts, setRecentAlerts] = useState<AlertData[]>([
    {
      id: "alt-1",
      title: "Elevated Heat Index Exposure",
      timestamp: "Today, 14:32",
      severity: "High",
      type: "Heat",
      desc: "Heat index reached 39°C with sustained core body temperature rise."
    },
    {
      id: "alt-2",
      title: "Normal Baseline Synced",
      timestamp: "Today, 08:00",
      severity: "Low",
      type: "Sensor",
      desc: "Contact impedance checks optimal on Cranial EEG Earbud."
    }
  ]);

  // Load real-time data from Supabase
  const loadSupabaseData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user
      const { data: userData } = await supabase.from("users").select("*").limit(1);
      if (userData && userData.length > 0) {
        setUserName(userData[0].full_name);
      }

      // 2. Fetch latest biometrics
      const { data: bioData } = await supabase
        .from("biometric_readings")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1);

      if (bioData && bioData.length > 0) {
        const latest = bioData[0];
        setVitals([
          { id: "v1", label: "Heart Rate", value: latest.heart_rate ?? 72, unit: "bpm", type: "hr" },
          { id: "v2", label: "Oxygen SpO2", value: latest.spo2 ?? 98.4, unit: "%", type: "spo2" },
          { id: "v3", label: "Core Temp", value: latest.skin_temp ?? 36.8, unit: "°C", type: "temp" },
        ]);
      }

      // 3. Fetch latest risk score
      const { data: riskData } = await supabase
        .from("risk_scores")
        .select("*")
        .order("computed_at", { ascending: false })
        .limit(1);

      if (riskData && riskData.length > 0) {
        const r = riskData[0];
        const capLevel = (r.risk_level.charAt(0).toUpperCase() + r.risk_level.slice(1)) as RiskLevel;
        setCurrentRisk({
          level: capLevel,
          score: r.score,
          notes: r.score > 50 
            ? "Elevated autonomic biomarkers detected. Heat or metabolic threshold breached." 
            : "No pre-ictal EEG spikes or extreme thermal thresholds crossed. Standard activity level maintained."
        });
      }

      // 4. Fetch environmental readings
      const { data: envData } = await supabase
        .from("environmental_readings")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1);

      if (envData && envData.length > 0) {
        const env = envData[0];
        setEnvironment({
          region: env.region || "Jaipur / North India",
          heatIndex: env.heat_index || 38.4,
          aqi: env.aqi || 142,
          advisory: env.heat_index > 40
            ? "Severe heat advisory active. Minimize continuous outdoor physical exertion."
            : "Thermal discomfort threshold reached. Seizure threshold lowers under continuous dehydration. Hydration advisory active."
        });
      }

      // 5. Fetch alerts
      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(2);

      if (alertsData && alertsData.length > 0) {
        setRecentAlerts(alertsData.map(a => ({
          id: a.id,
          title: a.alert_type === "Heat" ? "Elevated Heat Index Exposure" : a.message.split(":")[0],
          timestamp: new Date(a.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: a.alert_type === "critical" ? "Critical" : a.alert_type === "Heat" ? "High" : "Moderate",
          type: (a.alert_type === "Heat" ? "Heat" : a.alert_type === "Sensor" ? "Sensor" : "EEG") as any,
          desc: a.message
        })));
      }

      setLastSyncText("Just now");
      setIsOnline(true);
    } catch (err) {
      console.error("Supabase sync error:", err);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const [simulating, setSimulating] = useState(false);

  const handleSimulateIngestion = async () => {
    setSimulating(true);
    try {
      await api.ingestion.sendBiometrics([
        {
          heart_rate: Math.floor(Math.random() * 30) + 70,
          spo2: Math.floor(Math.random() * 4) + 96,
          skin_temp: parseFloat((36.4 + Math.random() * 0.8).toFixed(1)),
          recorded_at: new Date().toISOString()
        }
      ]);
      await loadSupabaseData();
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Offline banner if disconnected */}
      {!isOnline && <OfflineBanner pendingSyncCount={6} />}

      <div className="p-4 sm:p-6 space-y-6">
        {/* Top Header: Wearer info & Sync honesty */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#222f30] tracking-tight">
                Morning, {userName.split(" ")[0]}
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#cef79e]/60 text-[#222f30] border border-[#a7e26e]/50">
                STREAK: {streak}D
              </span>
            </div>
            <p className="text-xs text-[#445e5f] mt-0.5">Connected to FastAPI Backend (Port 8000) &amp; Supabase DB</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateIngestion}
              disabled={simulating}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1 transition-all disabled:opacity-50"
              title="Push live sensor reading to FastAPI backend"
            >
              <RefreshCw size={12} className={simulating ? "animate-spin" : ""} />
              <span>{simulating ? "Ingesting..." : "Simulate Sensor Ingest"}</span>
            </button>
            <button
              onClick={loadSupabaseData}
              disabled={loading}
              className="text-[11px] text-[#445e5f] hover:text-[#222f30] flex items-center gap-1 font-semibold"
              title="Refresh telemetry from Supabase"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Syncing..." : "Sync DB"}</span>
            </button>
            <SyncStatusIndicator isOnline={isOnline} lastSync={lastSyncText} />
          </div>
        </div>

        {/* Backend ML Integration Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <BrainCircuit size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#222f30] flex items-center gap-1.5">
                <span>FastAPI EEG ML Model &amp; Risk Engine Connected</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-[#445e5f]">
                Input 16-channel EEG signals directly to predict seizure status &amp; calculate multimodal risk.
              </div>
            </div>
          </div>
          <Link
            href="/risk-calculator"
            className="px-3.5 py-2 rounded-xl bg-[#222f30] hover:bg-[#2d3e40] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors shadow-xs"
          >
            <Zap size={14} className="text-[#a7e26e]" />
            <span>Open Risk Predictor</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 1. Large Top Risk Level Badge */}
        <div className={`sage-card p-5 sm:p-6 bg-gradient-to-br from-white to-[#f7f7f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${

          currentRisk.level === "Critical" ? "border-l-rose-500" :
          currentRisk.level === "High" ? "border-l-orange-500" :
          currentRisk.level === "Moderate" ? "border-l-amber-500" : "border-l-emerald-500"
        }`}>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Continuous Threat Engine (Supabase live)</span>
            <div className="flex items-center gap-3">
              <RiskLevelBadge level={currentRisk.level} size="lg" />
              <span className="text-xs font-mono text-emerald-800 font-bold">Score: {currentRisk.score} / 100</span>
            </div>
            <p className="text-xs text-[#445e5f] max-w-md pt-1 leading-relaxed">
              {currentRisk.notes}
            </p>
          </div>
          <Link
            href="/eeg"
            className="px-4 py-2.5 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            <span>Live EEG Trace</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* 2. Vitals Row (Compact Cards) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live Biometric Stream</h3>
            <span className="text-[11px] font-mono text-zinc-400">biometric_readings (Supabase)</span>
          </div>
          <VitalsRow vitals={vitals} />
        </div>

        {/* 3. Environmental Risk Card */}
        <div className="sage-card p-5 bg-[#222f30] text-white overflow-hidden relative shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a7e26e]/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#a7e26e]" />
              <span className="text-xs font-mono font-bold text-zinc-300">{environment.region}</span>
            </div>
            <span className="text-[10px] font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-zinc-300">
              environmental_readings (Supabase)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3.5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                <Flame size={20} />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Heat Index</div>
                <div className="font-mono text-xl font-bold">{environment.heatIndex}°C</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                <Wind size={20} />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">AQI (PM2.5)</div>
                <div className="font-mono text-xl font-bold">{environment.aqi} <span className="text-xs font-normal text-amber-400">Moderate</span></div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 text-xs text-zinc-200 flex items-start gap-2.5">
            <AlertCircle size={15} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {environment.advisory}
            </p>
          </div>
        </div>

        {/* 4. Recent Alerts Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Recent Incident Events</h3>
            <Link href="/alerts" className="text-xs font-bold text-[#445e5f] hover:underline flex items-center gap-0.5">
              <span>View All Logged Alerts</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {recentAlerts.map(alt => (
              <AlertListItem key={alt.id} alert={alt} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Persistent Thumb-Reachable SOS Button (Floating FAB) */}
      <Link
        href="/sos"
        className="fixed bottom-24 right-4 sm:right-8 z-40 p-4 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xl shadow-rose-600/40 flex items-center justify-center transition-all pulse-red"
        title="Trigger Immediate Emergency SOS"
      >
        <ShieldAlert size={28} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
