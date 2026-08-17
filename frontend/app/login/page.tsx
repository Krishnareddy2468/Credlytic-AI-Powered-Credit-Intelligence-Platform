"use client";

import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthShell } from "@/components/auth-shell";

const loginSchema = z.object({ email: z.string().email("Enter a valid email address"), password: z.string().min(8, "Password must be at least 8 characters") });
type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [complete, setComplete] = useState(false);
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginData>({ defaultValues: { email: "meera.shah@example.com", password: "demo12345" } });

  async function submit(data: LoginData) {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => setError(issue.path[0] as keyof LoginData, { message: issue.message }));
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setComplete(true);
  }

  return <AuthShell description="Use the prefilled demo account to enter the frontend workspace." eyebrow="Welcome back" title="Sign in to Credlytic">
    {complete ? <div className="auth-success"><span><Check /></span><h3>Demo account ready</h3><p>No authentication request was sent. Continue to the sample workspace.</p><Link className="button button-primary" href="/dashboard">Open dashboard<ArrowRight /></Link></div> : <form className="auth-form" onSubmit={handleSubmit(submit)} noValidate><label className="field"><span>Email address</span><input autoComplete="email" type="email" {...register("email")} />{errors.email ? <small className="field-error">{errors.email.message}</small> : null}</label><label className="field"><span>Password</span><div className="password-field"><input autoComplete="current-password" type={showPassword ? "text" : "password"} {...register("password")} /><button aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? <EyeOff /> : <Eye />}</button></div>{errors.password ? <small className="field-error">{errors.password.message}</small> : null}</label><div className="auth-form-meta"><label><input defaultChecked type="checkbox" />Keep me signed in</label><button type="button">Forgot password?</button></div><button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">{isSubmitting ? "Checking…" : "Sign in"}<ArrowRight /></button><p className="auth-switch">New to Credlytic? <Link href="/onboarding">Create a sample profile</Link></p></form>}
  </AuthShell>;
}
