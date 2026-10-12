"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { getFinancialProfile, loginUser, saveProfile, saveSession, userIdFromAccessToken } from "@/lib/api";

const schema = z.object({
  email: z.string().min(1, "Enter your email address").email("Enter a valid email address"),
  password: z.string().min(8, "Enter your password")
});
type SignInData = z.infer<typeof schema>;

/** Only same-origin paths are honoured, so `next` can't be used to redirect away. */
function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function validateEmail(value: string) {
  const result = schema.shape.email.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
}

export function SignInForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<SignInData>({ defaultValues: { email: "" } });
  const [requestError, setRequestError] = useState("");

  async function submit(data: SignInData) {
    schema.parse(data);
    setRequestError("");
    try {
      const tokens = await loginUser(data);
      const userId = userIdFromAccessToken(tokens.access_token);
      if (!userId) throw new Error("Invalid session response");
      saveSession({ userId, accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
      const profile = await getFinancialProfile(userId);
      if (profile) saveProfile(profile);
      router.push(profile ? next : "/onboarding");
    } catch { setRequestError("Sign-in failed. Check your email and password, then try again."); }
  }

  return (
    <div className="signin-form-wrap">
      <h1>Sign in to your account</h1>
      <p className="signin-lede">
        {next === "/dashboard"
          ? "Enter your email to open your Credlytic dashboard."
          : "Enter your email to access the Credlytic workspace."}
      </p>

      <form className="signin-form" noValidate onSubmit={handleSubmit(submit)}>
        <label className="signin-field" htmlFor="signin-email">
          <span>Email address</span>
          <input
            aria-describedby={errors.email ? "signin-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id="signin-email"
            placeholder="you@company.com"
            type="email"
            {...register("email", { validate: validateEmail })}
          />
          {errors.email ? (
            <small className="signin-error" id="signin-email-error" role="alert">
              {errors.email.message}
            </small>
          ) : null}
        </label>

        <label className="signin-field" htmlFor="signin-password">
          <span>Password</span>
          <input aria-invalid={Boolean(errors.password)} autoComplete="current-password" id="signin-password" type="password" {...register("password", { validate: (value) => schema.shape.password.safeParse(value).success || "Enter your password" })} />
          {errors.password ? <small className="signin-error" role="alert">{errors.password.message}</small> : null}
        </label>
        {requestError ? <small className="signin-error" role="alert">{requestError}</small> : null}

        <button className="signin-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="signin-divider">
        <span>or</span>
      </div>

      <p className="signin-note">Sign in securely to save and update your eligibility profile.</p>

      <div className="signin-demo">
        <p className="signin-demo-label">Just exploring?</p>
        <Link className="signin-demo-action" href="/dashboard">
          <LayoutDashboard aria-hidden="true" />
          View demo dashboard
          <ArrowRight aria-hidden="true" />
        </Link>
        <p className="signin-demo-note">Opens a sample profile with illustrative data. No sign-in required.</p>
      </div>

      <p className="signin-switch">
        New to Credlytic? <Link href="/register">Create an account</Link>
      </p>
    </div>
  );
}
