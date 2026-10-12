"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { AuthShell } from "@/components/auth-shell";
import {
  checkEligibility,
  loadSession,
  saveEligibilityAssessment,
  saveFinancialProfile,
  saveProfile,
  type EligibilityResponse,
  type FinancialProfileInput
} from "@/lib/api";

const profileSchema = z.object({
  name: z.string().trim().min(2),
  age: z.coerce.number().min(18).max(70),
  city: z.string().trim().min(2),
  employment: z.string().min(1),
  employer: z.string().trim().min(2),
  income: z.coerce.number().min(10000),
  additionalIncome: z.coerce.number().min(0),
  score: z.coerce.number().min(300).max(900),
  historyMonths: z.coerce.number().min(0).max(600),
  paymentHistory: z.coerce.number().min(0).max(100),
  activeLoans: z.coerce.number().min(0),
  monthlyEmi: z.coerce.number().min(0),
  cardsHeld: z.coerce.number().min(0),
  outstandingBalance: z.coerce.number().min(0),
  onlineShopping: z.coerce.number().min(0),
  groceries: z.coerce.number().min(0),
  fuel: z.coerce.number().min(0),
  dining: z.coerce.number().min(0),
  travel: z.coerce.number().min(0),
  utilities: z.coerce.number().min(0),
  entertainment: z.coerce.number().min(0),
  goal: z.string().min(1)
});

type ProfileData = z.infer<typeof profileSchema>;
const steps = ["About you", "Credit snapshot", "Monthly spending", "Your goal"];

const defaults: ProfileData = {
  name: "Meera Shah",
  age: 31,
  city: "Mumbai",
  employment: "Salaried",
  employer: "Example Technologies",
  income: 85000,
  additionalIncome: 0,
  score: 742,
  historyMonths: 64,
  paymentHistory: 97,
  activeLoans: 2,
  monthlyEmi: 18500,
  cardsHeld: 2,
  outstandingBalance: 42000,
  onlineShopping: 20000,
  groceries: 8000,
  fuel: 4000,
  dining: 6000,
  travel: 10000,
  utilities: 5000,
  entertainment: 3000,
  goal: "Cashback"
};

function toApiProfile(data: ProfileData): FinancialProfileInput {
  return {
    age: data.age,
    city: data.city,
    employment_type: data.employment.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_"),
    employer_name: data.employer,
    monthly_gross_income: data.income,
    additional_income: data.additionalIncome,
    existing_loan_count: data.activeLoans,
    total_emi_amount: data.monthlyEmi,
    credit_card_count: data.cardsHeld,
    outstanding_balances: data.outstandingBalance,
    credit_score: data.score,
    credit_history_months: data.historyMonths,
    payment_history_percent: data.paymentHistory,
    spending: {
      online_shopping: data.onlineShopping,
      groceries: data.groceries,
      fuel: data.fuel,
      dining: data.dining,
      travel: data.travel,
      utilities: data.utilities,
      entertainment: data.entertainment
    },
    primary_goal: data.goal.toLowerCase()
  };
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [assessment, setAssessment] = useState<EligibilityResponse | null>(null);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();
  const { control, register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileData>({ defaultValues: defaults });
  const [score, income, monthlyEmi] = useWatch({ control, name: ["score", "income", "monthlyEmi"] });

  async function finish(rawData: ProfileData) {
    const parsed = profileSchema.safeParse(rawData);
    if (!parsed.success) {
      setSubmitError("Review the profile values and complete every field before continuing.");
      return;
    }
    const session = loadSession();
    if (!session) {
      router.push("/register?next=/onboarding");
      return;
    }
    const profile = toApiProfile(parsed.data);
    setSubmitError("");
    try {
      const [, result] = await Promise.all([
        saveFinancialProfile(session.userId, profile),
        checkEligibility(profile)
      ]);
      saveProfile(profile);
      saveEligibilityAssessment(result);
      setAssessment(result);
    } catch {
      setSubmitError("We couldn’t save and assess your profile. Check that the API is running and try again.");
    }
  }

  const leadingMatches = assessment?.results.slice(0, 2) ?? [];
  const strongMatches = assessment?.results.filter((result) => result.probability >= 0.8).length ?? 0;

  return <AuthShell description="A short setup gives Credlytic enough context to explain useful card matches." eyebrow="Private eligibility check" title={assessment ? "Your live assessment is ready" : "Tell us what matters"}>
    {assessment ? <div className="auth-success onboarding-success"><span><Check /></span><h3>{strongMatches} strong {strongMatches === 1 ? "match" : "matches"} found</h3><p>Your profile was evaluated by the live eligibility model. No bureau or issuer request was made.</p><div>{leadingMatches.map((match) => <span key={match.card_id}><b>{Math.round(match.probability * 100)}%</b> {match.name} · {match.bank}</span>)}</div><Link className="button button-primary" href="/eligibility">See all matches<ArrowRight /></Link></div> : <form className="onboarding-form" onSubmit={handleSubmit(finish)}><div className="onboarding-progress">{steps.map((label, index) => <div className={index <= step ? "onboarding-step-active" : ""} key={label}><span>{index < step ? <Check /> : index + 1}</span><b>{label}</b></div>)}</div>
      {step === 0 ? <div className="form-grid onboarding-fields"><label className="field"><span>Full name</span><input {...register("name")} /></label><label className="field"><span>Age</span><input type="number" {...register("age", { valueAsNumber: true })} /></label><label className="field"><span>City</span><input {...register("city")} /></label><label className="field"><span>Employment</span><select {...register("employment")}><option>Salaried</option><option>Self-employed</option><option>Business owner</option><option>Freelancer</option></select></label><label className="field"><span>Employer or business</span><input {...register("employer")} /></label><label className="field"><span>Monthly gross income</span><div className="field-input"><i>₹</i><input type="number" {...register("income", { valueAsNumber: true })} /></div></label><label className="field"><span>Additional monthly income</span><div className="field-input"><i>₹</i><input type="number" {...register("additionalIncome", { valueAsNumber: true })} /></div></label></div> : null}
      {step === 1 ? <div className="form-grid onboarding-fields"><label className="field"><span>Last known credit score</span><input type="number" {...register("score", { valueAsNumber: true })} /><small>Use an estimate if you are unsure.</small></label><label className="field"><span>Credit history</span><div className="field-input"><input type="number" {...register("historyMonths", { valueAsNumber: true })} /><i>months</i></div></label><label className="field"><span>On-time payments</span><div className="field-input"><input type="number" {...register("paymentHistory", { valueAsNumber: true })} /><i>%</i></div></label><label className="field"><span>Active loans</span><input type="number" {...register("activeLoans", { valueAsNumber: true })} /></label><label className="field"><span>Total monthly EMI</span><div className="field-input"><i>₹</i><input type="number" {...register("monthlyEmi", { valueAsNumber: true })} /></div></label><label className="field"><span>Cards currently held</span><input type="number" {...register("cardsHeld", { valueAsNumber: true })} /></label><label className="field"><span>Outstanding card balances</span><div className="field-input"><i>₹</i><input type="number" {...register("outstandingBalance", { valueAsNumber: true })} /></div></label><div className="onboarding-info"><ShieldCheck /><p><strong>This does not fetch your bureau report.</strong> Credlytic only evaluates the values you provide.</p></div></div> : null}
      {step === 2 ? <div className="form-grid onboarding-fields"><label className="field"><span>Online shopping</span><div className="field-input"><i>₹</i><input type="number" {...register("onlineShopping", { valueAsNumber: true })} /></div></label><label className="field"><span>Groceries</span><div className="field-input"><i>₹</i><input type="number" {...register("groceries", { valueAsNumber: true })} /></div></label><label className="field"><span>Fuel</span><div className="field-input"><i>₹</i><input type="number" {...register("fuel", { valueAsNumber: true })} /></div></label><label className="field"><span>Dining</span><div className="field-input"><i>₹</i><input type="number" {...register("dining", { valueAsNumber: true })} /></div></label><label className="field"><span>Travel</span><div className="field-input"><i>₹</i><input type="number" {...register("travel", { valueAsNumber: true })} /></div></label><label className="field"><span>Utilities</span><div className="field-input"><i>₹</i><input type="number" {...register("utilities", { valueAsNumber: true })} /></div></label><label className="field"><span>Entertainment</span><div className="field-input"><i>₹</i><input type="number" {...register("entertainment", { valueAsNumber: true })} /></div></label></div> : null}
      {step === 3 ? <div><p className="choice-label">What should your next card do best?</p><div className="goal-choice-grid">{["Cashback", "Travel", "Rewards", "Fuel", "Dining", "Premium lifestyle"].map((goal) => <label key={goal}><input type="radio" value={goal} {...register("goal")} /><span><Check />{goal}</span></label>)}</div><div className="onboarding-review"><span><b>{score}</b> credit score</span><span><b>₹{Number(income).toLocaleString("en-IN")}</b> monthly income</span><span><b>₹{Number(monthlyEmi).toLocaleString("en-IN")}</b> monthly EMI</span></div></div> : null}
      {submitError ? <p className="field-error" role="alert">{submitError}</p> : null}<div className="onboarding-actions">{step > 0 ? <button className="button button-secondary" onClick={() => setStep(step - 1)} type="button"><ArrowLeft />Back</button> : <span />}{step < steps.length - 1 ? <button className="button button-primary" onClick={() => setStep(step + 1)} type="button">Continue<ArrowRight /></button> : <button className="button button-primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Assessing…" : "See my matches"}<ArrowRight /></button>}</div><p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p></form>}
  </AuthShell>;
}
