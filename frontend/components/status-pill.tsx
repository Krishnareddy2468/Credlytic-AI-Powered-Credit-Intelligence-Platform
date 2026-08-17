import { CheckCircle2, CircleAlert } from "lucide-react";

type StatusPillProps = {
  healthy: boolean;
};

export function StatusPill({ healthy }: StatusPillProps) {
  const Icon = healthy ? CheckCircle2 : CircleAlert;
  return (
    <div className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700">
      <Icon className={healthy ? "h-4 w-4 text-mint" : "h-4 w-4 text-coral"} />
      <span>{healthy ? "API ready" : "API offline"}</span>
    </div>
  );
}
