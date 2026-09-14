"use client";
import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Calendar, TrendingUp, Sparkles, AlertCircle, ChevronDown } from "lucide-react";

const trendDataToday = [
  { time: "06:00", hr: 62, temp: 36.4, spo2: 99 },
  { time: "09:00", hr: 78, temp: 36.7, spo2: 98 },
  { time: "12:00", hr: 84, temp: 37.1, spo2: 97 },
  { time: "15:00", hr: 92, temp: 37.3, spo2: 96 },
  { time: "18:00", hr: 74, temp: 36.8, spo2: 98 },
  { time: "21:00", hr: 68, temp: 36.6, spo2: 99 },
];

export default function ReportsPage() {
  const [range, setRange] = useState<"today" | "7d" | "30d">("today");
  const [metric, setMetric] = useState<"hr" | "spo2" | "temp">("hr");

  const metricConfigs = {
    hr: { label: "Heart Rate", unit: "bpm", color: "#e11d48", domain: [50, 120] },
    spo2: { label: "Blood Oxygen (SpO2)", unit: "%", color: "#0284c7", domain: [90, 100] },
    temp: { label: "Body Temperature", unit: "°C", color: "#059669", domain: [35.5, 38.5] },
  }[metric];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header & Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-[#222f30] tracking-tight">Biometric Telemetry Reports</h1>
          <p className="text-xs text-[#445e5f] mt-0.5">Aggregated multi-sensor trend history and risk correlation</p>
        </div>

        <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
          {(["today", "7d", "30d"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                range === r ? "bg-white text-[#222f30] shadow-xs" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {r === "today" ? "Today" : r === "7d" ? "7-Day" : "30-Day"}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["hr", "spo2", "temp"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              metric === m
                ? "bg-[#222f30] text-white border-[#222f30] shadow-xs"
                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {m === "hr" ? "Heart Rate (BPM)" : m === "spo2" ? "Oxygen (SpO2)" : "Core Temp (°C)"}
          </button>
        ))}
      </div>

      {/* TrendLineChart Area */}
      <div className="sage-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#222f30]">{metricConfigs.label} Trend</h3>
            <p className="text-[11px] text-zinc-400">Continuous 1Hz rolling window sampling</p>
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 text-[#222f30]">
            Avg: 76 {metricConfigs.unit}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendDataToday} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricConfigs.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={metricConfigs.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={metricConfigs.domain} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={metricConfigs.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#metricGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk History Timeline */}
      <div className="sage-card p-5">
        <h3 className="text-sm font-bold text-[#222f30] mb-2">Daily Risk Exposure Index</h3>
        <p className="text-xs text-[#445e5f] mb-4">Color blocks demonstrate peak risk classification across past 7 days</p>
        
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {[
            { day: "Mon", risk: "Low", color: "bg-emerald-400" },
            { day: "Tue", risk: "Low", color: "bg-emerald-400" },
            { day: "Wed", risk: "Moderate", color: "bg-amber-400" },
            { day: "Thu", risk: "Low", color: "bg-emerald-400" },
            { day: "Fri", risk: "High", color: "bg-orange-500" },
            { day: "Sat", risk: "Low", color: "bg-emerald-400" },
            { day: "Today", risk: "Low", color: "bg-emerald-400" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-full h-9 rounded-lg ${item.color} shadow-xs flex items-center justify-center text-white text-[10px] font-bold`}>
                {item.risk[0]}
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-500 mt-1.5">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Plain-Language Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sage-card p-4 flex items-start gap-3 bg-[#cef79e]/20 border-[#a7e26e]/50">
          <div className="p-2 rounded-xl bg-[#a7e26e]/40 text-[#222f30] shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#222f30]">Neural Stability Insight</h4>
            <p className="text-xs text-[#445e5f] mt-1 leading-relaxed">
              Zero temporal lobe EEG spike-wave paroxysms registered during past 48 hours. Seizure vulnerability remains low.
            </p>
          </div>
        </div>

        <div className="sage-card p-4 flex items-start gap-3 bg-amber-50/60 border-amber-200">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <AlertCircle size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">Thermal Autonomic Warning</h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Elevated heart rate (+16 bpm above resting) detected during Friday afternoon 41°C heat index peak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
