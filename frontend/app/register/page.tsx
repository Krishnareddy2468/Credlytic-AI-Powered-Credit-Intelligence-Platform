"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { loginUser, registerUser, saveSession } from "@/lib/api";

type Registration = { email: string; phone: string; password: string };

function RegisterForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/onboarding";
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Registration>();
  const [error, setError] = useState("");

  async function submit(values: Registration) {
    setError("");
    try {
      const user = await registerUser(values);
      const tokens = await loginUser({ email: values.email, password: values.password });
      saveSession({ userId: user.id, accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
      router.push(next.startsWith("/") && !next.startsWith("//") ? next : "/onboarding");
    } catch (cause) {
      setError(cause instanceof Error ? "We couldn’t create your account. The email or phone may already be in use." : "We couldn’t create your account.");
    }
  }

  return <AuthShell eyebrow="Create account" title="Start your private eligibility check" description="Create an account to save your financial profile and view live eligibility results.">
    <form className="onboarding-form" onSubmit={handleSubmit(submit)}>
      <div className="form-grid onboarding-fields">
        <label className="field"><span>Email address</span><input autoComplete="email" type="email" {...register("email", { required: "Enter a valid email address" })} />{errors.email ? <small role="alert">{errors.email.message}</small> : null}</label>
        <label className="field"><span>Phone number</span><input autoComplete="tel" type="tel" {...register("phone", { required: "Enter your phone number", minLength: 8 })} />{errors.phone ? <small role="alert">{errors.phone.message}</small> : null}</label>
        <label className="field"><span>Password</span><input autoComplete="new-password" type="password" {...register("password", { required: "Choose a password", minLength: { value: 8, message: "Use at least 8 characters" } })} />{errors.password ? <small role="alert">{errors.password.message}</small> : null}</label>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      <div className="onboarding-actions"><span /><button className="button button-primary" disabled={isSubmitting} type="submit">{isSubmitting ? "Creating account…" : "Create account"}</button></div>
      <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
    </form>
  </AuthShell>;
}

export default function RegisterPage() {
  return <Suspense fallback={null}><RegisterForm /></Suspense>;
}
