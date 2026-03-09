import { cn } from "@/lib/utils";
import { getVitalStatus } from "@/lib/aiPredictions";
import { VitalRecord } from "@/data/mockData";
import { MiniSparkline } from "@/components/vitals/VitalsChart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VitalCardProps {
  title: string;
  value: string;
  unit: string;
  icon: string;
  vitalKey: keyof Omit<VitalRecord, "date">;
  numericValue: number;
  history?: number[];
  normalRange?: string;
}

export function VitalCard({ title, value, unit, icon, vitalKey, numericValue, history, normalRange }: VitalCardProps) {
  const status = getVitalStatus(vitalKey, numericValue);

  const statusColor = {
    healthy: "text-healthy border-healthy/20 bg-healthy-bg/30",
    caution: "text-caution border-caution/20 bg-caution-bg/30",
    risk: "text-risk border-risk/20 bg-risk-bg/30",
  }[status];

  const sparklineColor = {
    healthy: "#16a34a",
    caution: "#d97706",
    risk: "#dc2626",
  }[status];

  const trend = history && history.length >= 2
    ? history[history.length - 1] - history[history.length - 2]
    : 0;

  return (
    <div className={cn("bg-card rounded-xl border p-4 shadow-card transition-all hover:shadow-elevated", statusColor)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-muted-foreground text-xs font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <span className="text-muted-foreground text-xs">{unit}</span>
          </div>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>

      {history && (
        <div className="mb-3">
          <MiniSparkline data={history} color={sparklineColor} height={36} />
        </div>
      )}

      <div className="flex items-center justify-between">
        {normalRange && (
          <p className="text-muted-foreground text-xs">Normal: {normalRange}</p>
        )}
        {history && trend !== 0 && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend > 0 ? "text-risk" : "text-healthy"
          )}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}
          </div>
        )}
        {history && trend === 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Minus className="w-3 h-3" /> Stable
          </div>
        )}
      </div>
    </div>
  );
}
