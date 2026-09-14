# PRAHARI / E+ Health Companion — Web Dashboard 🛡️✨

**AI-Powered Personal Health Companion & Real-Time Neurological Risk Monitoring**  
*Problem Statement: SIH26181 — Wearable Biometric & Environmental Multi-Modal Health Resilience Engine.*

---

## 🌟 Overview

The **E+ Companion Frontend** is a modern, responsive web application built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS**. It connects wearers, caregivers, and clinical teams with real-time biometric tracking, live EEG neural anomaly classification, and environmental hazard warnings (extreme heat & AQI).

### Key Features:
- 🧠 **Interactive EEG ML Risk Predictor:** Live 16-channel EEG signal evaluator connected directly to the FastAPI Random Forest seizure classification engine.
- ⚡ **Multi-Modal Risk Gauge:** Real-time composite score (0–100) combining neural anomalies, autonomic biomarkers (HR, SpO2, skin temp), and environmental stress.
- 👥 **Caregiver Circle & Read-Only Portal:** Dedicated views for family members and attending neurologists with one-tap emergency call triggers.
- 🚨 **Incident & Alert Center:** Real-time alert notifications with one-click API acknowledgment and SMS dispatch tracking.
- 🆘 **Emergency SOS Dispatch:** 10-second countdown beacon that transmits live GPS coordinates and biometric telemetry.
- 📶 **Offline-First Resilience:** Visual offline banners with automatic local telemetry caching when network connectivity drops.

---

## 📸 Key Application Screens

1. **Dashboard Home (`/`)**: Real-time vital signs, streak indicator, composite risk badge, and environmental advisories.
2. **EEG Risk ML Predictor (`/risk-calculator`)**: Interactive 16-channel EEG input matrix with 1-click BEED dataset benchmark presets (*Healthy Baseline*, *Generalized Seizure*, *Focal Seizure*, *Seizure Event*).
3. **Live EEG Earbud Stream (`/eeg`)**: Real-time waveform canvas showing cranial earbud impedance and context states.
4. **Caregiver Circle (`/caregivers`)**: Contact management for authorized emergency alert recipients.
5. **Caregiver Portal (`/caregiver-view`)**: Clean, read-only dashboard designed specifically for remote monitoring.
6. **Alerts Incident Sheet (`/alerts`)**: Severity filters (Critical, High, Moderate) and direct incident acknowledgment.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or bun

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Avinash7061/E-plus-frontend.git
cd E-plus-frontend

# Install dependencies
npm install
```

### 3. Configure Environment Variables

Create `.env.local` based on `.env.example`:

```env
# URL of your FastAPI Backend API (Repo: Avinash7061/E-plus-backend)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture & Component Hierarchy

```
src/
├── app/
│   ├── (auth)/                  # Login, Consent, and Onboarding
│   │   ├── login/page.tsx       # Email/Phone OTP Auth + Dev Bypass
│   │   ├── consent/page.tsx     # Data sharing & privacy consent
│   │   └── profile/page.tsx     # Medical baseline setup
│   ├── (main)/                  # Core Wearer Experience
│   │   ├── page.tsx             # Main Telemetry Dashboard
│   │   ├── risk-calculator/     # Interactive EEG ML Predictor UI
│   │   ├── eeg/                 # Live Earbud Waveform Stream
│   │   ├── alerts/              # Incident Center & Acknowledgment
│   │   ├── caregivers/          # Authorized Contact Management
│   │   ├── reports/             # Longitudinal Health Summaries
│   │   ├── settings/            # Device & Sync Preferences
│   │   └── sos/                 # Emergency SOS Dispatch
│   ├── caregiver-view/          # Remote Caregiver Read-Only Portal
│   └── pairing/                 # BLE Earbud Pairing Flow
├── components/
│   ├── BottomTabBar.tsx         # Mobile-first floating navigation
│   ├── ComponentLibrary.tsx     # Risk badges, vitals cards, buttons
│   └── DashboardComponents.tsx  # Environmental widgets & charts
└── lib/
    ├── api.ts                   # Central typed FastAPI API client
    └── supabase.ts              # Supabase client singleton
```

---

## 🚢 Deployment (Vercel)

1. Push your changes to GitHub.
2. Go to **[Vercel Dashboard](https://vercel.com)** and click **"Add New Project"**.
3. Import `Avinash7061/E-plus-frontend`.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` (your deployed backend on Render/Railway)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically build and assign a production HTTPS URL!

---

## 📄 License
MIT License. Part of the PRAHARI / E+ Companion Health Resilience System.
