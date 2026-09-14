"use client";
import { Activity, Bluetooth, BrainCircuit, Info } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { useEffect, useState } from "react";

// Mock data generator for EEG trace
const generateEEGData = () => {
  return Array.from({ length: 60 }).map((_, i) => ({
    time: i,
    value: Math.sin(i / 2) * 50 + Math.random() * 20 - 10
  }));
};

export default function EEGLivePage() {
  const [data, setData] = useState(generateEEGData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = prev[prev.length - 1].time;
        newData.push({
          time: lastTime + 1,
          value: Math.sin((lastTime + 1) / 2) * 50 + Math.random() * 20 - 10
        });
        return newData;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BrainCircuit className="text-blue-600" /> Live EEG
        </h1>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
          <Bluetooth size={14} /> Earbud Connected
        </div>
      </div>

      {/* Anomaly Status Banner */}
      <div className="bg-zinc-950 text-white rounded-2xl p-4 flex items-center gap-4 shadow-md">
        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <div className="flex-1">
          <div className="font-bold text-sm">Normal Pattern Detected</div>
          <div className="text-xs text-zinc-400 mt-0.5 font-mono">Model confidence: 99.2%</div>
        </div>
      </div>

      {/* Activity Context */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Current Context:</span>
        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">Resting / Seated</span>
      </div>

      {/* EEG Chart Area */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="font-mono text-xs font-bold text-zinc-500">CH1 (Cz-A1) • 250Hz</div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Info size={14} /> Raw Trace
          </div>
        </div>
        <div className="flex-1 w-full relative">
          {/* Grid lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
              <YAxis domain={[-100, 100]} hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#18181b" 
                strokeWidth={1.5} 
                dot={false}
                isAnimationActive={false} // Crucial for scrolling effect performance
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
