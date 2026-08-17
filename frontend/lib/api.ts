import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

export type CreditCard = {
  id: string;
  bank: string;
  name: string;
  network: string;
  annual_fee: number;
  min_monthly_income: number;
  min_credit_score: number;
  reward_rates: Record<string, number>;
  category_benefits: Record<string, string>;
};
