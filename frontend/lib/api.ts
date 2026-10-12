import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" }
});

export type SpendingBreakdown = Record<
  "online_shopping" | "groceries" | "fuel" | "dining" | "travel" | "utilities" | "entertainment",
  number
>;

export type FinancialProfileInput = {
  age: number;
  city: string;
  employment_type: string;
  employer_name?: string;
  monthly_gross_income: number;
  additional_income: number;
  existing_loan_count: number;
  total_emi_amount: number;
  credit_card_count: number;
  outstanding_balances: number;
  credit_score: number;
  credit_history_months: number;
  payment_history_percent: number;
  spending: SpendingBreakdown;
  primary_goal: string;
};

export type FinancialProfileResponse = FinancialProfileInput & {
  id: string;
  user_id: string;
  debt_to_income_ratio: number;
  credit_utilization_proxy: number;
  affordability_index: number;
};

export type CreditCard = {
  id: string;
  bank: string;
  name: string;
  network: string;
  joining_fee: number;
  annual_fee: number;
  waiver_condition: string;
  min_monthly_income: number;
  min_credit_score: number;
  reward_rates: Record<string, number>;
  category_benefits: Record<string, string>;
  welcome_benefits: string;
  fuel_surcharge_waiver: string;
  lounge_access: string;
  foreign_markup_percent: number;
};

export type ShapFactor = {
  feature: string;
  value: string;
  impact: number;
  direction: "increasing" | "decreasing";
  explanation: string;
};

export type EligibilityResult = {
  card_id: string;
  bank: string;
  name: string;
  probability: number;
  risk_tier: "low" | "moderate" | "elevated" | "high";
  limit_range: { min: number; max: number; currency: string };
  shap_top5: ShapFactor[];
  meets_income_requirement: boolean;
  meets_score_requirement: boolean;
};

export type EligibilityResponse = {
  model_version: string;
  base_probability: number;
  evaluated_cards: number;
  latency_ms: number;
  results: EligibilityResult[];
};

export type Session = { userId: string; accessToken: string; refreshToken: string };

const sessionKey = "credlytic.session";
const profileKey = "credlytic.profile";
const assessmentKey = "credlytic.eligibility";

function browserStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function readStored<T>(key: string): T | null {
  const storage = browserStorage();
  if (!storage) return null;
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    storage.removeItem(key);
    return null;
  }
}

export function loadSession() {
  return readStored<Session>(sessionKey);
}

export function saveSession(session: Session) {
  browserStorage()?.setItem(sessionKey, JSON.stringify(session));
}

export function clearSession() {
  const storage = browserStorage();
  storage?.removeItem(sessionKey);
  storage?.removeItem(profileKey);
  storage?.removeItem(assessmentKey);
}

export function userIdFromAccessToken(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalised = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    return (JSON.parse(atob(normalised)) as { sub?: string }).sub ?? null;
  } catch {
    return null;
  }
}

export function loadProfile() {
  return readStored<FinancialProfileInput>(profileKey);
}

export function saveProfile(profile: FinancialProfileInput) {
  browserStorage()?.setItem(profileKey, JSON.stringify(profile));
}

export function loadEligibilityAssessment() {
  return readStored<EligibilityResponse>(assessmentKey);
}

export function saveEligibilityAssessment(assessment: EligibilityResponse) {
  browserStorage()?.setItem(assessmentKey, JSON.stringify(assessment));
}

api.interceptors.request.use((config) => {
  const token = loadSession()?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser(payload: { email: string; phone: string; password: string }) {
  return (await api.post<{ id: string }>("/api/v1/auth/register", payload)).data;
}

export async function loginUser(payload: { email: string; password: string }) {
  return (await api.post<{ access_token: string; refresh_token: string }>("/api/v1/auth/login", payload)).data;
}

export async function logoutUser() {
  await api.post("/api/v1/auth/logout");
  clearSession();
}

export async function getFinancialProfile(userId: string) {
  const response = await api.get<FinancialProfileResponse>(`/api/v1/profile/${userId}`, {
    validateStatus: (status) => status === 200 || status === 404
  });
  return response.status === 404 ? null : response.data;
}

export async function saveFinancialProfile(userId: string, profile: FinancialProfileInput) {
  return (await api.put<FinancialProfileResponse>(`/api/v1/profile/${userId}`, profile)).data;
}

export async function checkEligibility(profile: FinancialProfileInput) {
  return (await api.post<EligibilityResponse>("/api/v1/eligibility/check", { profile })).data;
}

export async function listCards() {
  return (await api.get<CreditCard[]>("/api/v1/cards")).data;
}
