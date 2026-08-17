import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Check, CircleAlert, Info } from "lucide-react";
import type { CardTone, MatchStatus } from "@/types/product";

export function Surface({ children, className = "", as: Tag = "section" }: { children: React.ReactNode; className?: string; as?: "section" | "article" | "div" }) {
  return <Tag className={`surface ${className}`}>{children}</Tag>;
}

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

export function MetricCard({ icon: Icon, label, value, detail, trend }: { icon: LucideIcon; label: string; value: string; detail: string; trend?: string }) {
  return (
    <Surface as="article" className="metric-card">
      <div className="metric-card-top">
        <div className="metric-icon"><Icon aria-hidden="true" /></div>
        {trend ? <span className="metric-trend">{trend}</span> : null}
      </div>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-detail">{detail}</p>
    </Surface>
  );
}

export function ProgressBar({ value, tone = "blue", label }: { value: number; tone?: "blue" | "success" | "warning"; label?: string }) {
  return (
    <div className="progress-wrap" aria-label={label} aria-valuemax={100} aria-valuemin={0} aria-valuenow={value} role="progressbar">
      <div className="progress-track"><span className={`progress-fill progress-${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
    </div>
  );
}

export function MatchBadge({ status }: { status: MatchStatus }) {
  const tone = status === "Strong match" ? "success" : status === "Good match" ? "blue" : status === "Borderline" ? "warning" : "muted";
  return <span className={`status-badge status-${tone}`}>{status}</span>;
}

export function StatusBadge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "success" | "warning" | "danger" | "muted" }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}

export function CreditCardVisual({ bank, name, network, tone = "ink", compact = false }: { bank: string; name: string; network: string; tone?: CardTone; compact?: boolean }) {
  return (
    <div className={`credit-card-visual card-tone-${tone} ${compact ? "credit-card-compact" : ""}`} aria-label={`${bank} ${name} card illustration`} role="img">
      <div className="credit-card-head"><span>{bank}</span><span className="card-contactless">)))</span></div>
      <div className="credit-card-chip" />
      <div className="credit-card-foot"><div><strong>{name}</strong><span>•••• 4826</span></div><b>{network}</b></div>
    </div>
  );
}

export function InsightIcon({ level }: { level: "positive" | "attention" | "neutral" }) {
  const Icon = level === "positive" ? Check : level === "attention" ? CircleAlert : Info;
  return <span className={`insight-icon insight-${level}`}><Icon aria-hidden="true" /></span>;
}

export function TextLink({ children }: { children: React.ReactNode }) {
  return <span className="text-link">{children}<ArrowUpRight aria-hidden="true" /></span>;
}
