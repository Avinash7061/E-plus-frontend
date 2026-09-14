"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ComponentLibrary";
import { User, HeartHandshake, Plus, Trash2, Shield, ArrowRight } from "lucide-react";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("Julian Vance");
  const [age, setAge] = useState("34");
  const [conditions, setConditions] = useState("Temporal Lobe Epilepsy (diagnosed 2022)");
  const [contacts, setContacts] = useState([
    { id: "1", name: "Dr. Arvind Mehta", phone: "+91 98201 11223", relation: "Neurologist" },
    { id: "2", name: "Priya Vance", phone: "+91 98202 33445", relation: "Spouse / Caregiver" }
  ]);

  const addContact = () => {
    setContacts(prev => [...prev, { id: Date.now().toString(), name: "", phone: "", relation: "Family" }]);
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/pairing/scan");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col justify-center px-4 py-8 sm:px-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#222f30] tracking-tight">Patient Profile & SOS Contacts</h1>
        <p className="text-xs text-[#445e5f] mt-1">Configure your personal companion profile and critical dispatch contacts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <div className="sage-card p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
            <div className="w-12 h-12 rounded-full bg-[#c9cbbe]/60 text-[#222f30] font-bold text-lg flex items-center justify-center">
              JV
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#222f30]">Wearer Identity</h3>
              <p className="text-xs text-zinc-500">Device ID: EPLUS-8492-IN</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-[#a7e26e] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-[#a7e26e] outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-zinc-600 uppercase">Medical Conditions</label>
              <span className="text-[10px] text-zinc-400 font-medium">Optional</span>
            </div>
            <input
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Epilepsy, Heat intolerance"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:ring-2 focus:ring-[#a7e26e] outline-none"
            />
            <p className="text-[11px] text-zinc-400 mt-1">Informs local risk engine weighting for threshold triggering.</p>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="sage-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake size={18} className="text-[#445e5f]" />
              <h3 className="font-bold text-sm text-[#222f30]">Emergency SMS / Voice Dispatch List</h3>
            </div>
            <button
              type="button"
              onClick={addContact}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((contact, idx) => (
              <div key={contact.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#222f30]">{contact.name || "New Contact"}</div>
                  <div className="text-[11px] font-mono text-[#445e5f]">{contact.phone || "Add phone"} • {contact.relation}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeContact(contact.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <PrimaryButton type="submit">
          Save Profile & Pair Hardware
          <ArrowRight size={16} />
        </PrimaryButton>
      </form>
    </div>
  );
}
