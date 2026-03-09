import { AIPrediction } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface PredictionCardProps {
  prediction: AIPrediction;
  expanded?: boolean;
  onClick?: () => void;
}

const typeConfig = {
  info: { bg: "bg-primary-light/80", border: "border-primary/20", badge: "bg-primary/10 text-primary", label: "Insight" },
  caution: { bg: "bg-caution-bg", border: "border-caution/20", badge: "bg-caution/10 text-caution", label: "Caution" },
  risk: { bg: "bg-risk-bg", border: "border-risk/20", badge: "bg-risk/10 text-risk", label: "Risk Alert" },
};

export function PredictionCard({ prediction, expanded = false, onClick }: PredictionCardProps) {
  const cfg = typeConfig[prediction.type];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all hover:shadow-elevated",
        cfg.bg, cfg.border
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{prediction.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cfg.badge)}>
              {cfg.label}
            </span>
            <span className="text-xs text-muted-foreground">{prediction.date}</span>
          </div>
          <p className="font-semibold text-foreground text-sm">{prediction.title}</p>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
            {prediction.description}
          </p>
          {expanded && (
            <div className="mt-3 p-3 bg-card/60 rounded-lg border border-border/50">
              <p className="text-xs font-medium text-foreground mb-1">💡 Recommendation</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{prediction.recommendation}</p>
            </div>
          )}
        </div>
        {!expanded && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
      </div>
    </button>
  );
}
