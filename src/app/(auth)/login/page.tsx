"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Phone, Mail, ArrowRight, AlertCircle, CheckCircle2, 
  RotateCw, LogOut, User, Zap, KeyRound, Shield, Lock, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { api, setAuthToken, getAuthToken } from "@/lib/api";

const QUICK_PROFILES = [
  {
    name: "Julian Vance",
    email: "julian.vance@gmail.com",
    phone: "+91 99900 00001",
    password: "Password@123",
    role: "Patient Wearer",
    desc: "Active cranial earbud streaming & risk timeline"
  },
  {
    name: "Dr. Arvind Mehta",
    email: "dr.mehta@neuroclinic.in",
    phone: "+91 98201 11223",
    password: "Password@123",
    role: "Attending Neurologist",
    desc: "Clinician circle & critical threshold alerts"
  },
  {
    name: "Priya Vance",
    email: "priya.vance@family.com",
    phone: "+91 98202 33445",
    password: "Password@123",
    role: "Family Caregiver",
    desc: "Authorized emergency contact & SOS receiver"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("julian.vance@gmail.com");
  const [phone, setPhone] = useState("+91 99900 00001");
  const [password, setPassword] = useState("Password@123");
  const [showPassword, setShowPassword] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentSessionUser, setCurrentSessionUser] = useState<any>(null);

  // Check existing session
  useEffect(() => {
    const localUser = localStorage.getItem("prahari_user");
    const token = getAuthToken();
    if (localUser && token) {
      try {
        setCurrentSessionUser(JSON.parse(localUser));
      } catch {}
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentSessionUser(session.user);
        }
      });
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem("prahari_token");
    localStorage.removeItem("prahari_user");
    setCurrentSessionUser(null);
    setSuccessMsg("Signed out successfully.");
  };

  // Pure JWT Authentication Handler with Required Password
  const handleJwtLogin = async (e?: React.FormEvent, customUser?: typeof QUICK_PROFILES[0]) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const loginEmail = customUser ? customUser.email : email.trim().toLowerCase();
    const loginPhone = customUser ? customUser.phone : phone.trim().replace(/\s+/g, "");
    const loginName = customUser ? customUser.name : fullName.trim();
    const loginPassword = customUser ? customUser.password : password.trim();

    // Strict Password Validation
    if (!loginPassword || loginPassword.length < 4) {
      setErrorMsg("Password is required (minimum 4 characters).");
      return;
    }

    setLoading(true);

    try {
      let authResponse;

      if (activeTab === "email" || customUser) {
        if (!loginEmail || !loginEmail.includes("@")) {
          setErrorMsg("Please provide a valid email address.");
          setLoading(false);
          return;
        }
        // Direct FastAPI JWT endpoint with password
        authResponse = await api.auth.emailLogin(loginEmail, loginPassword, loginName || undefined);
      } else {
        if (!loginPhone || loginPhone.length < 8) {
          setErrorMsg("Please provide a valid phone number with country code.");
          setLoading(false);
          return;
        }
        // Direct FastAPI JWT endpoint with password
        authResponse = await api.auth.login(loginPhone, loginPassword, loginName || undefined);
      }

      if (authResponse && authResponse.access_token) {
        // Store JWT token for API requests
        setAuthToken(authResponse.access_token);
        localStorage.setItem("prahari_user", JSON.stringify(authResponse.user));

        // Sync profile to Supabase database
        try {
          await supabase.from("users").upsert({
            id: authResponse.user.id,
            email: authResponse.user.email || loginEmail,
            phone_number: authResponse.user.phone_number || loginPhone,
            full_name: authResponse.user.full_name || loginName || "Wearer",
            role: authResponse.user.role || "patient",
          }, { onConflict: "id" });
        } catch {}

        setCurrentSessionUser(authResponse.user);
        setSuccessMsg("✓ Authenticated via 7-Day JWT Token! Entering companion...");
        
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        throw new Error("Invalid credentials or access token not received.");
      }
    } catch (err: any) {
      console.error("JWT login failed:", err);
      // Strictly report error — no bypass to dashboard
      setErrorMsg(err.message || "Authentication failed: Invalid email/phone or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col justify-center px-4 py-8 sm:px-6 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#a7e26e]/30 text-[#222f30] border border-[#a7e26e] mb-3 shadow-xs">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-black text-[#222f30] tracking-tight">E+ Health Companion</h1>
        <p className="text-xs text-[#445e5f] mt-1">Continuous Biometric &amp; Neurological Anomaly Engine</p>
      </div>

      {/* Active Session Notification Card */}
      {currentSessionUser && (
        <div className="sage-card p-4 mb-5 bg-[#cef79e]/25 border-[#a7e26e] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#a7e26e] text-[#222f30] font-bold flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <div className="font-bold text-[#222f30]">Active JWT Session</div>
              <div className="text-[11px] font-mono text-[#445e5f]">
                {currentSessionUser.full_name || currentSessionUser.email || currentSessionUser.phone_number}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Link href="/" className="px-3 py-1.5 rounded-lg bg-[#222f30] text-white font-bold text-[11px] hover:bg-[#2d3e40] transition-colors">
              Dashboard
            </Link>
            <button onClick={handleSignOut} title="Sign Out" className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="sage-card p-6 sm:p-7 shadow-sm">
        {/* Method Switcher */}
        <div className="flex bg-zinc-100 p-1 rounded-xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("email");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "email" ? "bg-white text-[#222f30] shadow-xs" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Mail size={14} />
            <span>Email Access</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("phone");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "phone" ? "bg-white text-[#222f30] shadow-xs" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Phone size={14} />
            <span>Phone Access</span>
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="font-semibold">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="font-semibold">{successMsg}</div>
          </div>
        )}

        {/* Direct JWT Login Form */}
        <form onSubmit={handleJwtLogin} className="space-y-3.5">
          {activeTab === "email" ? (
            <div>
              <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-[#222f30] focus:outline-none focus:ring-2 focus:ring-[#a7e26e]"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-3 text-zinc-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99900 00001"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-mono text-[#222f30] focus:outline-none focus:ring-2 focus:ring-[#a7e26e]"
                  required
                />
              </div>
            </div>
          )}

          {/* Required Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-zinc-600 uppercase">
                Password <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-400">Required</span>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 text-sm text-[#222f30] focus:outline-none focus:ring-2 focus:ring-[#a7e26e]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase mb-1">
              Full Name <span className="text-zinc-400 font-normal lowercase">(optional for registration)</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Julian Vance"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-[#222f30] focus:outline-none focus:ring-2 focus:ring-[#a7e26e]"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#222f30] hover:bg-[#2d3e40] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <RotateCw size={16} className="animate-spin text-[#a7e26e]" />
                <span>Verifying Credentials &amp; Issuing JWT...</span>
              </>
            ) : (
              <>
                <KeyRound size={16} className="text-[#a7e26e]" />
                <span>Sign In with JWT</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Fast 1-Tap Quick Profiles */}
        <div className="mt-6 pt-5 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Zap size={13} className="text-amber-500" /> Demo Test Profiles
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Auto-Password</span>
          </div>

          <div className="space-y-2">
            {QUICK_PROFILES.map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => {
                  setEmail(p.email);
                  setPhone(p.phone);
                  setPassword(p.password);
                  setFullName(p.name);
                  handleJwtLogin(undefined, p);
                }}
                disabled={loading}
                className="w-full p-2.5 rounded-xl border border-zinc-200 hover:border-[#a7e26e] hover:bg-[#a7e26e]/10 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#222f30] group-hover:text-emerald-950 flex items-center gap-1.5">
                    <span>{p.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-600 font-normal">
                      {p.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">{p.email}</div>
                </div>
                <ArrowRight size={14} className="text-zinc-300 group-hover:text-[#222f30] transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-[#445e5f]">
          <span className="flex items-center gap-1">
            <Shield size={12} className="text-emerald-600" /> PBKDF2 Password + HMAC-SHA256 JWT
          </span>
          <span className="text-zinc-400 font-medium">Authentication Enforced</span>
        </div>
      </div>
    </div>
  );
}
