import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  subtitle?: string;
}

export function MetricCard({ title, value, change, changeType = "neutral", icon: Icon, subtitle }: MetricCardProps) {
  const changeColor = changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-hierarchy-4";

  return (
    <div className="glass-card p-5 hover:glow-accent transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-hierarchy-4 uppercase tracking-wider font-display">{title}</p>
          <p className="text-2xl font-medium text-hierarchy-1 font-display">{value}</p>
          {subtitle && <p className="text-xs text-hierarchy-4">{subtitle}</p>}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {change && (
        <p className={`text-xs mt-3 ${changeColor}`}>
          {change}
        </p>
      )}
    </div>
  );
}
