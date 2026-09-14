"use client";
import { useState, useEffect } from "react";
import { BluetoothSearching, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const [found, setFound] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFound(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75" />
        <div className="relative bg-blue-500 text-white p-6 rounded-full shadow-xl">
          <BluetoothSearching size={48} />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Scanning for Devices</h2>
      <p className="text-zinc-500 mb-8 max-w-[250px]">Bring your E+ Smartwatch and EEG Earbud close to your phone.</p>

      {found && (
        <div className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold">E-Plus Hub</div>
              <div className="text-xs text-zinc-500 font-mono">Signal: Excellent (-42dBm)</div>
            </div>
          </div>
          <Link 
            href="/pairing/signal"
            className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
            Connect
          </Link>
        </div>
      )}
    </div>
  );
}
