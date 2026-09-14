"use client";
import React, { useState, useEffect } from "react";
import { AlertListItem, AlertData, EmptyState } from "@/components/ComponentLibrary";
import { Bell, Filter, X, ShieldAlert, MapPin, Send, CheckCircle2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

const fallbackAlerts: AlertData[] = [
  {
    id: "alt-01",
    title: "High Heat & Autonomic Strain Trigger",
    timestamp: "Today, 14:32",
    severity: "High",
    type: "Heat",
    desc: "Persistent core temperature 37.8°C with elevated heart rate in 39°C environment. Heat exhaustion alert dispatched.",
    vitalsSnapshot: { "Heart Rate": "104 bpm", "Core Temp": "37.8°C", "SpO2": "96%", "AQI": "162" },
    dispatchedTo: ["Dr. Arvind Mehta (Neurologist)", "Priya Vance (Caregiver)"],
    location: "28.6139° N, 77.2090° E (New Delhi)"
  },
  {
    id: "alt-02",
    title: "Transient EEG Theta Power Surge",
    timestamp: "Yesterday, 06:12",
    severity: "Moderate",
    type: "EEG",
    desc: "Short 1.4s bursts of rhythmic 4–7Hz cranial oscillations. Classifier flagged as pre-ictal warning (Confidence 78%).",
    vitalsSnapshot: { "EEG Waveform": "Theta Bursts", "Duration": "1.4s", "Heart Rate": "78 bpm" },
    dispatchedTo: ["Priya Vance (Caregiver)"],
    location: "Home Residence"
  }
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>(fallbackAlerts);
  const [loading, setLoading] = useState(false);
  const [ackLoading, setAckLoading] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);

  const handleAcknowledge = async (alertId: string) => {
    setAckLoading(true);
    try {
      await api.alerts.acknowledge(alertId);
    } catch {
      await supabase.from("alerts").update({ acknowledged: true }).eq("id", alertId);
    } finally {
      setAckLoading(false);
      setSelectedAlert(null);
      fetchAlertsFromSupabase();
    }
  };


  const fetchAlertsFromSupabase = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("alerts")
        .select("*")
        .order("sent_at", { ascending: false });

      if (data && data.length > 0) {
        setAlerts(data.map(a => ({
          id: a.id,
          title: a.alert_type === "Heat" ? "Elevated Heat Index Exposure" : a.message.split(":")[0],
          timestamp: new Date(a.sent_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          severity: (a.alert_type === "critical" ? "Critical" : a.alert_type === "Heat" ? "High" : "Moderate") as any,
          type: (a.alert_type === "Heat" ? "Heat" : a.alert_type === "Sensor" ? "Sensor" : a.alert_type === "critical" ? "SOS" : "EEG") as any,
          desc: a.message,
          vitalsSnapshot: { "Status": a.delivery_status, "Channel": a.channel || "both" },
          dispatchedTo: ["Primary Caregiver", "Emergency SMS Contact"],
          location: "Live Device GeoFence"
        })));
      }
    } catch (e) {
      console.error("Failed to load alerts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsFromSupabase();
  }, []);

  const filtered = alerts.filter(a => {
    if (filterSeverity !== "All" && a.severity !== filterSeverity) return false;
    if (filterType !== "All" && a.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#222f30] tracking-tight flex items-center gap-2">
            <Bell className="text-rose-500" size={22} /> Incident & Alert Registry
          </h1>
          <p className="text-xs text-[#445e5f] mt-0.5">Historical log of neurological spikes, thermal events, and emergency transmissions</p>
        </div>
        <button
          onClick={fetchAlertsFromSupabase}
          disabled={loading}
          className="text-xs font-bold text-[#445e5f] hover:text-[#222f30] flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Sync</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase mr-1">Severity:</span>
          {["All", "Critical", "High", "Moderate", "Low"].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-full border transition-all shrink-0 font-medium ${
                filterSeverity === sev
                  ? "bg-[#222f30] text-white border-[#222f30]"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-zinc-400 uppercase mr-1">Type:</span>
          {["All", "EEG", "Heat", "AQI", "SOS"].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full border transition-all shrink-0 font-medium ${
                filterType === t
                  ? "bg-[#a7e26e] text-[#222f30] font-bold border-[#a7e26e]"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(alert => (
            <AlertListItem key={alert.id} alert={alert} onSelect={(a) => setSelectedAlert(a)} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No alerts match filter"
          desc="Try clearing the selected severity or category chips to inspect historical telemetry."
          actionText="Clear Filters"
          onAction={() => { setFilterSeverity("All"); setFilterType("All"); }}
        />
      )}

      {/* Alert Detail Modal Sheet */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                  selectedAlert.severity === "Critical" ? "bg-rose-100 text-rose-800" :
                  selectedAlert.severity === "High" ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {selectedAlert.severity} Incident
                </span>
                <span className="font-mono text-xs text-zinc-400">{selectedAlert.timestamp}</span>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#222f30]">{selectedAlert.title}</h3>
              <p className="text-xs text-[#445e5f] mt-1.5 leading-relaxed">{selectedAlert.desc}</p>
            </div>

            {/* Vitals Snapshot at Incident */}
            {selectedAlert.vitalsSnapshot && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Telemetry Snapshot at Trigger
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(selectedAlert.vitalsSnapshot).map(([k, v]) => (
                    <div key={k} className="p-2 bg-white rounded-xl border border-zinc-100">
                      <div className="text-[10px] text-zinc-400">{k}</div>
                      <div className="text-sm font-bold text-[#222f30] mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Dispatched Channels */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-600">
                <MapPin size={15} className="text-rose-500 shrink-0" />
                <span>Location: <strong className="text-[#222f30]">{selectedAlert.location}</strong></span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <Send size={14} /> Dispatched Via Twilio SMS / Webhook:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-blue-800">
                  {selectedAlert.dispatchedTo?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleAcknowledge(selectedAlert.id)}
                disabled={ackLoading}
                className="flex-1 py-3 rounded-xl bg-[#a7e26e] hover:bg-[#95d459] text-[#222f30] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                <span>{ackLoading ? "Syncing..." : "Acknowledge Alert (API)"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="py-3 px-4 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold hover:bg-zinc-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

