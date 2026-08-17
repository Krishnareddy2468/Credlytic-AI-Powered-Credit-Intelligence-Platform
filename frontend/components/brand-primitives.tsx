import Link from "next/link";
import { forwardRef, useId } from "react";
import type { LucideIcon } from "lucide-react";

function joinClasses(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SurfaceTone = "semantic" | "midnight" | "raised" | "paper" | "transparent";
type SurfaceElement = "section" | "article" | "div" | "aside";

export function BrandSurface({
  as: Tag = "section",
  tone = "semantic",
  className,
  children
}: {
  as?: SurfaceElement;
  tone?: SurfaceTone;
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={joinClasses("brand-surface", `brand-surface-${tone}`, className)}>{children}</Tag>;
}

export function IntelligenceIndex({ index, children, className }: { index: string; children: React.ReactNode; className?: string }) {
  return <p className={joinClasses("section-index", className)}>{index} / {children}</p>;
}

export function SignalLine({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return <span aria-hidden="true" className={joinClasses("credlytic-signal-line", vertical && "credlytic-signal-line-vertical", className)} />;
}

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "default" | "small" | "product";

export function BrandButton({
  children,
  className,
  disabled = false,
  href,
  icon: Icon,
  iconPosition = "end",
  onClick,
  size = "default",
  type = "button",
  variant = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  icon?: LucideIcon;
  iconPosition?: "start" | "end";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
}) {
  const classes = joinClasses(
    "button",
    `button-${variant}`,
    size === "small" && "button-small",
    size === "product" && "button-app",
    disabled && "button-disabled",
    className
  );
  const content = <>{Icon && iconPosition === "start" ? <Icon aria-hidden="true" /> : null}{children}{Icon && iconPosition === "end" ? <Icon aria-hidden="true" /> : null}</>;

  if (href) {
    return <Link aria-disabled={disabled} className={classes} href={disabled ? "#" : href}>{content}</Link>;
  }

  return <button className={classes} disabled={disabled} onClick={onClick} type={type}>{content}</button>;
}

type BadgeTone = "intelligence" | "positive" | "caution" | "risk" | "muted";

export function BrandBadge({ children, icon: Icon, tone = "intelligence" }: { children: React.ReactNode; icon?: LucideIcon; tone?: BadgeTone }) {
  const statusTone = tone === "intelligence" ? "blue" : tone === "positive" ? "success" : tone === "caution" ? "warning" : tone === "risk" ? "danger" : "muted";
  return <span className={`status-badge status-${statusTone}`}>{Icon ? <Icon aria-hidden="true" /> : null}{children}</span>;
}

export interface BrandInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  error?: string;
  hint?: string;
  label: string;
  prefixText?: string;
  suffixText?: string;
}

export const BrandInput = forwardRef<HTMLInputElement, BrandInputProps>(function BrandInput(
  { className, error, hint, id, label, prefixText, suffixText, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <label className={joinClasses("brand-field", className)} htmlFor={inputId}>
      <span className="brand-field-label">{label}</span>
      <span className={joinClasses("brand-input-shell", error && "brand-input-error")}>
        {prefixText ? <i>{prefixText}</i> : null}
        <input aria-describedby={describedBy} aria-invalid={Boolean(error)} id={inputId} ref={ref} {...props} />
        {suffixText ? <i>{suffixText}</i> : null}
      </span>
      {error ? <small className="brand-field-error" id={`${inputId}-error`}>{error}</small> : hint ? <small id={`${inputId}-hint`}>{hint}</small> : null}
    </label>
  );
});
