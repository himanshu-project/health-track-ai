import { cn } from "@/lib/utils";
import { HealthStatus } from "@/data/mockData";

interface HealthIndicatorProps {
  status: HealthStatus;
  label?: string;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

const configs = {
  healthy: { dot: "bg-healthy", badge: "status-healthy", label: "Healthy" },
  caution: { dot: "bg-caution", badge: "status-caution", label: "Moderate Risk" },
  risk: { dot: "bg-risk", badge: "status-risk pulse-risk", label: "High Risk" },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs gap-1.5",
  md: "px-3 py-1 text-sm gap-2",
  lg: "px-4 py-1.5 text-sm gap-2",
};

export function HealthIndicator({ status, label, size = "md", showDot = true, className }: HealthIndicatorProps) {
  const cfg = configs[status];
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      cfg.badge, sizeClasses[size], className
    )}>
      {showDot && (
        <span className={cn("rounded-full shrink-0", cfg.dot,
          size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
        )} />
      )}
      {label || cfg.label}
    </span>
  );
}

interface HealthScoreRingProps {
  score: number;
  size?: number;
  status: HealthStatus;
}

export function HealthScoreRing({ score, size = 80, status }: HealthScoreRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colorMap = { healthy: "#16a34a", caution: "#d97706", risk: "#dc2626" };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="6" className="stroke-muted fill-none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth="6" fill="none"
          stroke={colorMap[status]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-foreground font-bold" style={{ fontSize: size * 0.22 }}>{score}</span>
      </div>
    </div>
  );
}
