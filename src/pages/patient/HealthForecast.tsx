import { useState } from "react";
import { vitalsHistory } from "@/data/mockData";
import { analyzeVitals, getHealthScoreLabel } from "@/lib/aiPredictions";
import { HealthIndicator, HealthScoreRing } from "@/components/health/HealthIndicator";
import { PredictionCard } from "@/components/health/PredictionCard";
import { VitalsChart } from "@/components/vitals/VitalsChart";
import { Brain, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HealthForecast() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analysis = analyzeVitals(vitalsHistory);

  const handleReanalyze = async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAnalyzing(false);
  };

  const statusConfig = {
    healthy: { bg: "bg-healthy-bg", border: "border-healthy/20", text: "text-healthy", label: "Healthy" },
    caution: { bg: "bg-caution-bg", border: "border-caution/20", text: "text-caution", label: "Moderate Risk" },
    risk: { bg: "bg-risk-bg", border: "border-risk/20", text: "text-risk", label: "High Risk" },
  }[analysis.status];

  const risks = analysis.predictions.filter((p) => p.type === "risk");
  const cautions = analysis.predictions.filter((p) => p.type === "caution");
  const insights = analysis.predictions.filter((p) => p.type === "info");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> AI Health Forecast
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Predictive analysis based on your vitals history</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleReanalyze}
          disabled={analyzing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? "animate-spin" : ""}`} />
          {analyzing ? "Analyzing..." : "Re-analyze"}
        </Button>
      </div>

      {/* Overall Score Card */}
      <div className={`rounded-2xl border p-6 ${statusConfig.bg} ${statusConfig.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Overall Health Score</p>
            <h3 className={`text-3xl font-bold mt-1 ${statusConfig.text}`}>
              {analysis.score} / 100
            </h3>
            <p className={`text-sm font-medium mt-1 ${statusConfig.text}`}>
              {getHealthScoreLabel(analysis.score)} — {statusConfig.label}
            </p>
            <p className="text-muted-foreground text-xs mt-3 max-w-sm">
              Based on {vitalsHistory.length} vitals readings. AI analysis detected {risks.length} risk{risks.length !== 1 ? "s" : ""} and {cautions.length} caution{cautions.length !== 1 ? "s" : ""}.
            </p>
          </div>
          <HealthScoreRing score={analysis.score} status={analysis.status} size={100} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Risk Alerts", count: risks.length, color: "text-risk", bg: "bg-risk/10" },
            { label: "Cautions", count: cautions.length, color: "text-caution", bg: "bg-caution/10" },
            { label: "Insights", count: insights.length, color: "text-healthy", bg: "bg-healthy/10" },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed predictions */}
      {risks.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-risk inline-block pulse-risk" />
            Risk Alerts
          </h3>
          <div className="space-y-3">
            {risks.map((p) => (
              <PredictionCard
                key={p.id}
                prediction={p}
                expanded={expanded === p.id}
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {cautions.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-caution inline-block" />
            Cautions
          </h3>
          <div className="space-y-3">
            {cautions.map((p) => (
              <PredictionCard
                key={p.id}
                prediction={p}
                expanded={expanded === p.id}
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            AI Insights
          </h3>
          <div className="space-y-3">
            {insights.map((p) => (
              <PredictionCard
                key={p.id}
                prediction={p}
                expanded={expanded === p.id}
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trend chart */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Blood Pressure Trend Analysis</h3>
        <VitalsChart
          data={vitalsHistory}
          metrics={[
            { key: "systolic", label: "Systolic", color: "#dc2626", unit: "mmHg", referenceMax: 120 },
            { key: "diastolic", label: "Diastolic", color: "#7c3aed", unit: "mmHg", referenceMax: 80 },
          ]}
          height={220}
        />
        <p className="text-xs text-muted-foreground mt-3 italic">
          ⚠️ Dashed lines indicate normal thresholds. Values above indicate elevated levels.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>⚕️ Medical Disclaimer:</strong> AI predictions are for informational purposes only and do not replace professional medical advice. Always consult your healthcare provider before making health decisions.
        </p>
      </div>
    </div>
  );
}
