"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "Enter your email address").email("Enter a valid email address")
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

function GoogleMark() {
  return (
    <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A8.99 8.99 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.98 10.72a5.41 5.41 0 0 1 0-3.44V4.96H.96a9 9 0 0 0 0 8.08l3.02-2.32z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A8.99 8.99 0 0 0 .96 4.96l3.02 2.32C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

export function SignInForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register
  } = useForm<SignInData>({ defaultValues: { email: "" } });

  async function submit(data: SignInData) {
    schema.parse(data);
    // Frontend prototype: no request is made. This stands in for the real
    // authentication call so the routing and states can be designed now.
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    router.push(next);
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

        <button className="signin-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="signin-divider">
        <span>or</span>
      </div>

      <button className="signin-google" onClick={() => router.push(next)} type="button">
        <GoogleMark />
        Google
      </button>

      <p className="signin-note">Prototype sign-in · no credentials are sent or stored.</p>

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
        New to Credlytic? <Link href="/onboarding">Create a sample profile</Link>
      </p>
    </div>
  );
}
