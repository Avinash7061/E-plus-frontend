/**
 * API client connecting the Next.js frontend to the FastAPI backend (http://localhost:8000)
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PredictRiskPayload {
  eeg_readings: number[];
  heart_rate?: number;
  spo2?: number;
  skin_temp?: number;
  heat_index?: number;
  aqi?: number;
  user_id?: string;
  save_to_timeline?: boolean;
}

export interface PredictRiskResponse {
  class_id: number;
  class_name: "Healthy" | "Generalized Seizure" | "Focal Seizure" | "Seizure Event" | string;
  confidence: number;
  probabilities: Record<string, number>;
  risk_score: number;
  risk_level: "Low" | "Moderate" | "High" | "Critical" | string;
  contributing_factors: Record<string, any>;
  features: Record<string, number>;
  model_name: string;
}

export interface BiometricBatchPayload {
  readings: Array<{
    recorded_at?: string;
    heart_rate?: number;
    spo2?: number;
    skin_temp?: number;
    eda?: number;
    fall_detected?: boolean;
  }>;
}

// Token storage helpers
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("prahari_token");
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("prahari_token", token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("prahari_token");
    localStorage.removeItem("prahari_user");
  }
};

// Generic request wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Backend Health check
  health: () => request<{ status: string; service: string }>("/"),

  // Auth endpoints
  auth: {
    emailLogin: (email: string, fullName?: string) =>
      request<{ access_token: string; user: any }>("/auth/email-login", {
        method: "POST",
        body: JSON.stringify({ email, full_name: fullName }),
      }),
    login: (phone_number: string) =>
      request<{ access_token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone_number }),
      }),
    register: (phone_number: string, full_name: string, role = "patient") =>
      request<{ access_token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ phone_number, full_name, role }),
      }),
    getMe: () => request<any>("/users/me"),
  },

  // EEG & ML Model Risk Prediction
  eeg: {
    predictRisk: (payload: PredictRiskPayload): Promise<PredictRiskResponse> =>
      request<PredictRiskResponse>("/eeg/predict-risk", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    createSession: (user_id: string, device_id?: string, sample_rate_hz = 250) =>
      request<any>("/eeg/sessions", {
        method: "POST",
        body: JSON.stringify({ user_id, device_id, sample_rate_hz }),
      }),
    getLatestPredictions: (user_id: string, limit = 10) =>
      request<any[]>(`/eeg/users/${user_id}/latest?limit=${limit}`),
  },

  // Telemetry Ingestion (triggers backend Risk Engine calculation)
  ingestion: {
    sendBiometrics: (readings: BiometricBatchPayload["readings"]) =>
      request<{ inserted_count: number; reading_ids: string[] }>("/ingestion/biometrics", {
        method: "POST",
        body: JSON.stringify({ readings }),
      }),
  },

  // Risk Score Retrieval
  risk: {
    getCurrentRisk: (user_id: string) => request<any>(`/risk/${user_id}/current`),
    getRiskHistory: (user_id: string) => request<any>(`/risk/${user_id}/history`),
  },

  // Alerts Management
  alerts: {
    getAlerts: (user_id: string) => request<{ alerts: any[] }>(`/alerts/${user_id}`),
    acknowledge: (alert_id: string) =>
      request<any>(`/alerts/${alert_id}/acknowledge`, {
        method: "POST",
      }),
  },
};
