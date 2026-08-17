"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { AuthShell } from "@/components/auth-shell";

const profileSchema = z.object({ name: z.string().min(2), city: z.string().min(2), employment: z.string(), income: z.coerce.number().min(10000), score: z.coerce.number().min(300).max(900), utilization: z.coerce.number().min(0).max(100), goal: z.string() });
type ProfileData = z.infer<typeof profileSchema>;
const steps = ["About you", "Credit snapshot", "Your goal"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const { control, register, handleSubmit } = useForm<ProfileData>({ defaultValues: { name: "Meera Shah", city: "Mumbai", employment: "Salaried", income: 85000, score: 742, utilization: 38, goal: "Cashback" } });
  const [score, income, utilization] = useWatch({ control, name: ["score", "income", "utilization"] });

  function finish(data: ProfileData) {
    if (profileSchema.safeParse(data).success) setComplete(true);
  }

  return <AuthShell description="A short sample setup gives Credlytic enough context to explain useful matches." eyebrow="Private eligibility check" title={complete ? "Your sample profile is ready" : "Tell us what matters"}>
    {complete ? <div className="auth-success onboarding-success"><span><Check /></span><h3>2 strong matches found</h3><p>Your sample profile supports everyday cashback cards. No bureau or issuer request was made.</p><div><span><b>92%</b> Amazon Pay ICICI</span><span><b>84%</b> Axis Ace</span></div><Link className="button button-primary" href="/eligibility">See my matches<ArrowRight /></Link></div> : <form className="onboarding-form" onSubmit={handleSubmit(finish)}><div className="onboarding-progress">{steps.map((label, index) => <div className={index <= step ? "onboarding-step-active" : ""} key={label}><span>{index < step ? <Check /> : index + 1}</span><b>{label}</b></div>)}</div>
      {step === 0 ? <div className="form-grid onboarding-fields"><label className="field"><span>Full name</span><input {...register("name")} /></label><label className="field"><span>City</span><input {...register("city")} /></label><label className="field"><span>Employment</span><select {...register("employment")}><option>Salaried</option><option>Self-employed</option><option>Business owner</option></select></label><label className="field"><span>Monthly gross income</span><div className="field-input"><i>₹</i><input type="number" {...register("income")} /></div></label></div> : null}
      {step === 1 ? <div className="form-grid onboarding-fields"><label className="field"><span>Last known credit score</span><input type="number" {...register("score")} /><small>Use an estimate if you are unsure.</small></label><label className="field"><span>Credit utilization</span><div className="field-input"><input type="number" {...register("utilization")} /><i>%</i></div><small>Balance used as a share of total limit.</small></label><div className="onboarding-info"><ShieldCheck /><p><strong>This does not fetch your bureau report.</strong> The prototype uses only the values entered here.</p></div></div> : null}
      {step === 2 ? <div><p className="choice-label">What should your next card do best?</p><div className="goal-choice-grid">{["Cashback", "Travel", "Rewards", "Fuel savings", "Build credit", "Premium benefits"].map((goal) => <label key={goal}><input type="radio" value={goal} {...register("goal")} /><span><Check />{goal}</span></label>)}</div><div className="onboarding-review"><span><b>{score}</b> credit score</span><span><b>₹{Number(income).toLocaleString("en-IN")}</b> monthly income</span><span><b>{utilization}%</b> utilization</span></div></div> : null}
      <div className="onboarding-actions">{step > 0 ? <button className="button button-secondary" onClick={() => setStep(step - 1)} type="button"><ArrowLeft />Back</button> : <span />}{step < steps.length - 1 ? <button className="button button-primary" onClick={() => setStep(step + 1)} type="button">Continue<ArrowRight /></button> : <button className="button button-primary" type="submit">See my matches<ArrowRight /></button>}</div><p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p></form>}
  </AuthShell>;
}
