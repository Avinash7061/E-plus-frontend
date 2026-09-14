"use client";
import React, { useState, useEffect } from "react";
import { 
  BrainCircuit, Activity, Zap, CheckCircle2, AlertTriangle, 
  ShieldAlert, Sparkles, RefreshCw, Sliders, Database, ArrowRight, Server, FileText
} from "lucide-react";
import { api, PredictRiskResponse } from "@/lib/api";
import { supabase } from "@/lib/supabase";

// Pre-tested signal samples extracted directly from the BEED dataset
const PRESETS = [
  {
    name: "Healthy Baseline",
    desc: "Normal cerebral background activity",
    classExpected: "Healthy",
    eeg: [4, 7, 18, 25, 28, 27, 20, 10, -10, -18, -20, -16, 13, 32, 12, 10],
    vitals: { hr: 72, spo2: 98.5, temp: 36.6, heatIndex: 32, aqi: 85 }
  },
  {
    name: "Generalized Seizure",
    desc: "Synchronous bilateral hemisphere paroxysm",
    classExpected: "Generalized Seizure",
    eeg: [6, 8, 3, -3, 5, 7, 8, -7, -2, 1, -4, 3, 6, -3, -4, 0],
    vitals: { hr: 128, spo2: 91.0, temp: 37.8, heatIndex: 41, aqi: 165 }
  },
  {
    name: "Focal Seizure",
    desc: "Localized temporal/frontal focal discharge",
    classExpected: "Focal Seizure",
    eeg: [3, -4, -4, -3, 7, -9, -4, -3, 3, -6, -9, 7, -1, -4, -3, 2],
    vitals: { hr: 104, spo2: 95.0, temp: 37.2, heatIndex: 38, aqi: 120 }
  },
  {
    name: "Seizure Event (Motor)",
    desc: "Rhythmic motor/eyeblink artifact correlate",
    classExpected: "Seizure Event",
    eeg: [-3, 4, 5, 7, -7, 6, -3, 17, -2, -2, 0, 4, 1, 2, -3, -1],
    vitals: { hr: 116, spo2: 94.0, temp: 37.4, heatIndex: 36, aqi: 110 }
  }
];

export default function RiskCalculatorPage() {
  const [eegValues, setEegValues] = useState<number[]>(PRESETS[0].eeg);
  const [heartRate, setHeartRate] = useState(72);
  const [spo2, setSpO2] = useState(98.5);
  const [skinTemp, setSkinTemp] = useState(36.6);
  const [heatIndex, setHeatIndex] = useState(32.0);
  const [aqi, setAqi] = useState(85);
  
  const [saveToTimeline, setSaveToTimeline] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [usersList, setUsersList] = useState<any[]>([]);

  // Execution state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<PredictRiskResponse | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Raw text paste helper
  const [rawText, setRawText] = useState(PRESETS[0].eeg.join(", "));

  // Check backend connection & fetch user IDs
  useEffect(() => {
    api.health()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));

    supabase.from("users").select("id, full_name, email").limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setUsersList(data);
          setSelectedUser(data[0].id);
        }
      });
  }, []);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setEegValues(preset.eeg);
    setRawText(preset.eeg.join(", "));
    setHeartRate(preset.vitals.hr);
    setSpO2(preset.vitals.spo2);
    setSkinTemp(preset.vitals.temp);
    setHeatIndex(preset.vitals.heatIndex);
    setAqi(preset.vitals.aqi);
    setErrorMsg(null);
  };

  const handleEegValueChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const next = [...eegValues];
    next[index] = num;
    setEegValues(next);
    setRawText(next.join(", "));
  };

  const handleRawTextChange = (text: string) => {
    setRawText(text);
    const parsed = text
      .split(/[\s,]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
    if (parsed.length === 16) {
      setEegValues(parsed);
      setErrorMsg(null);
    }
  };

  const handleRunInference = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (eegValues.length !== 16) {
      setErrorMsg(`Exactly 16 EEG channel readings are required (currently have ${eegValues.length})`);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.eeg.predictRisk({
        eeg_readings: eegValues,
        heart_rate: heartRate,
        spo2: spo2,
        skin_temp: skinTemp,
        heat_index: heatIndex,
        aqi: aqi,
        user_id: saveToTimeline ? selectedUser : undefined,
        save_to_timeline: saveToTimeline
      });
      setResult(response);
      setBackendOnline(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to communicate with FastAPI backend");
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on load
  useEffect(() => {
    handleRunInference();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low": return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "moderate": return "bg-amber-50 text-amber-800 border-amber-300";
      case "high": return "bg-orange-50 text-orange-800 border-orange-300";
      case "critical": return "bg-rose-50 text-rose-800 border-rose-300";
      default: return "bg-zinc-50 text-zinc-800 border-zinc-300";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <BrainCircuit size={22} />
            </span>
            <h1 className="text-2xl font-black text-[#222f30] tracking-tight">
              EEG ML Predictor &amp; Risk Engine
            </h1>
          </div>
          <p className="text-xs text-[#445e5f] mt-1">
            Direct real-time inference using FastAPI Random Forest model &amp; multi-modal autonomic risk calculation
          </p>
        </div>

        {/* Backend Status Pill */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            backendOnline 
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : backendOnline === false
              ? "bg-rose-50 text-rose-800 border-rose-300"
              : "bg-zinc-100 text-zinc-700 border-zinc-300"
          }`}>
            <Server size={14} />
            <span>{backendOnline ? "FastAPI Connected (Port 8000)" : "Backend Disconnected"}</span>
          </div>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
          Quick-Load EEG Dataset Presets (BEED Benchmark):
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3 rounded-xl border border-zinc-200 bg-white hover:border-[#a7e26e] hover:shadow-xs text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-[#222f30] group-hover:text-emerald-800">
                  {preset.name}
                </div>
                <Zap size={13} className="text-zinc-400 group-hover:text-emerald-600" />
              </div>
              <div className="text-[11px] text-[#445e5f] mt-1 line-clamp-1">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Direct Inputs */}
        <div className="lg:col-span-6 space-y-5">
          <form onSubmit={handleRunInference} className="space-y-5">
            {/* 16 EEG Channel Matrix */}
            <div className="sage-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-emerald-700" />
                  <h2 className="text-sm font-bold text-[#222f30]">
                    16-Channel Raw EEG Window (X1 - X16)
                  </h2>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold">
                  16 Values
                </span>
              </div>

              {/* 4x4 Grid of Inputs */}
              <div className="grid grid-cols-4 gap-2">
                {eegValues.map((val, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute left-2 top-1 text-[9px] font-mono font-bold text-zinc-400">
                      X{idx + 1}
                    </span>
                    <input
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => handleEegValueChange(idx, e.target.value)}
                      className="w-full pt-4 pb-1.5 px-2 text-center text-xs font-mono font-bold text-[#222f30] bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#a7e26e] outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Raw CSV String Quick Input */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                  Or Paste Comma-Separated Values:
                </label>
                <input
                  type="text"
                  value={rawText}
                  onChange={(e) => handleRawTextChange(e.target.value)}
                  placeholder="e.g. 4, 7, 18, 25, 28, 27, 20, 10, -10, -18, -20, -16, 13, 32, 12, 10"
                  className="w-full px-3 py-2 text-xs font-mono text-[#222f30] bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#a7e26e] outline-none"
                />
              </div>
            </div>

            {/* Vitals & Environment Sliders */}
            <div className="sage-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-emerald-700" />
                <h2 className="text-sm font-bold text-[#222f30]">
                  Biometric &amp; Environmental Factors
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                    <span>Heart Rate (bpm)</span>
                    <span className="font-mono font-bold">{heartRate} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full accent-[#222f30]"
                  />
                </div>

                {/* SpO2 */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                    <span>Blood Oxygen (SpO2)</span>
                    <span className="font-mono font-bold">{spo2}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="100"
                    step="0.5"
                    value={spo2}
                    onChange={(e) => setSpO2(Number(e.target.value))}
                    className="w-full accent-[#222f30]"
                  />
                </div>

                {/* Skin Temperature */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                    <span>Skin Temperature</span>
                    <span className="font-mono font-bold">{skinTemp} °C</span>
                  </div>
                  <input
                    type="range"
                    min="34"
                    max="41"
                    step="0.1"
                    value={skinTemp}
                    onChange={(e) => setSkinTemp(Number(e.target.value))}
                    className="w-full accent-[#222f30]"
                  />
                </div>

                {/* Heat Index */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                    <span>Heat Index</span>
                    <span className="font-mono font-bold">{heatIndex} °C</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="0.5"
                    value={heatIndex}
                    onChange={(e) => setHeatIndex(Number(e.target.value))}
                    className="w-full accent-[#222f30]"
                  />
                </div>

                {/* AQI */}
                <div className="sm:col-span-2">
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                    <span>Air Quality Index (AQI)</span>
                    <span className="font-mono font-bold">{aqi}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    value={aqi}
                    onChange={(e) => setAqi(Number(e.target.value))}
                    className="w-full accent-[#222f30]"
                  />
                </div>
              </div>

              {/* Timeline Recording Toggle */}
              <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={saveToTimeline}
                    onChange={(e) => setSaveToTimeline(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Save prediction &amp; risk score to Supabase timeline</span>
                </label>

                {saveToTimeline && usersList.length > 0 && (
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-zinc-200 bg-white"
                  >
                    {usersList.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.full_name || u.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Run Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#222f30] hover:bg-[#2d3e40] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin text-[#a7e26e]" />
                  <span>Executing ML Inference Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-[#a7e26e]" />
                  <span>Run ML Model &amp; Calculate Risk</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
              <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right Column: Live Model Output & Risk Analysis */}
        <div className="lg:col-span-6 space-y-5">
          {result ? (
            <div className="space-y-5">
              {/* Composite Risk Score Badge Card */}
              <div className={`sage-card p-6 border-2 ${getRiskColor(result.risk_level)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    Holistic Health Risk Engine
                  </span>
                  <span className="px-3 py-1 rounded-full font-black text-xs uppercase tracking-wide border bg-white/70">
                    {result.risk_level} Risk
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <div className="text-5xl font-black font-mono tracking-tight">
                    {result.risk_score}
                  </div>
                  <span className="text-base font-bold text-zinc-500">/ 100</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-zinc-200/70 mt-4 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      result.risk_level === "Critical" ? "bg-rose-600" :
                      result.risk_level === "High" ? "bg-orange-500" :
                      result.risk_level === "Moderate" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(result.risk_score, 100)}%` }}
                  />
                </div>

                <div className="mt-3 text-xs opacity-90 leading-relaxed">
                  {result.risk_level === "Critical" ? "Urgent intervention required. High probability seizure anomaly synchronized with critical vital thresholds." :
                   result.risk_level === "High" ? "High risk detected. Notable neurological discharge or heat/environmental strain." :
                   result.risk_level === "Moderate" ? "Moderate risk. Monitor patient for persistent autonomic deviation." :
                   "Normal physiological & neurological state. No significant anomalies detected."}
                </div>
              </div>

              {/* EEG Classification Card */}
              <div className="sage-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={18} className="text-blue-600" />
                    <h3 className="font-bold text-sm text-[#222f30]">
                      Random Forest EEG Classifier
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Model: {result.model_name}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Predicted State</span>
                    <div className="text-lg font-black text-[#222f30]">{result.class_name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Confidence</span>
                    <div className="text-lg font-black font-mono text-blue-700">
                      {Math.round(result.confidence * 100)}%
                    </div>
                  </div>
                </div>

                {/* Class Probabilities Distribution */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-zinc-600">Classification Probability Distribution:</div>
                  {Object.entries(result.probabilities || {}).map(([cName, prob]) => (
                    <div key={cName} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className={cName === result.class_name ? "font-bold text-[#222f30]" : "text-zinc-500"}>
                          {cName}
                        </span>
                        <span className="font-mono text-xs">{Math.round(prob * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${cName === result.class_name ? "bg-blue-600" : "bg-zinc-300"}`}
                          style={{ width: `${Math.round(prob * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributing Factors & Extracted Features */}
              <div className="sage-card p-5 space-y-3">
                <h3 className="font-bold text-sm text-[#222f30] flex items-center gap-1.5">
                  <FileText size={16} className="text-emerald-700" />
                  Risk Factors &amp; Extracted Biomarkers
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">Hjorth Mobility</div>
                    <div className="font-mono font-bold mt-0.5">{result.features?.hjorth_mobility?.toFixed(3) ?? "—"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">Hjorth Complexity</div>
                    <div className="font-mono font-bold mt-0.5">{result.features?.hjorth_complexity?.toFixed(3) ?? "—"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">Spectral Entropy</div>
                    <div className="font-mono font-bold mt-0.5">{result.features?.spectral_entropy?.toFixed(3) ?? "—"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">Zero Crossing Rate</div>
                    <div className="font-mono font-bold mt-0.5">{result.features?.zero_crossing_rate?.toFixed(3) ?? "—"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">Low Band Power</div>
                    <div className="font-mono font-bold mt-0.5">{result.features?.power_ratio_low ? `${Math.round(result.features.power_ratio_low * 100)}%` : "—"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">High Band Power</div>
                    <div className="font-mono font-bold mt-0.5">{result.features?.power_ratio_high ? `${Math.round(result.features.power_ratio_high * 100)}%` : "—"}</div>
                  </div>
                </div>

                {/* Factors List */}
                <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase">Active Risk Factor Contributions:</div>
                  {Object.entries(result.contributing_factors || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-zinc-50">
                      <span className="font-semibold text-zinc-700 capitalize">{key}:</span>
                      <span className="font-mono text-zinc-900 font-bold">
                        {typeof val === "object" ? `${val.type} (${val.confidence})` : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="sage-card p-12 text-center text-zinc-400 flex flex-col items-center justify-center min-h-[350px]">
              <BrainCircuit size={48} className="text-zinc-300 mb-3 animate-pulse" />
              <div className="font-bold text-sm text-zinc-600">Awaiting ML Model Execution</div>
              <div className="text-xs text-zinc-400 mt-1 max-w-xs">
                Select a preset or enter 16 EEG readings and click &quot;Run ML Model &amp; Calculate Risk&quot; to inspect real-time predictions.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
