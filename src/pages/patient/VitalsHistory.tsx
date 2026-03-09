import { useState } from "react";
import { vitalsHistory } from "@/data/mockData";
import { VitalsChart } from "@/components/vitals/VitalsChart";
import { HealthIndicator } from "@/components/health/HealthIndicator";
import { getVitalStatus } from "@/lib/aiPredictions";
import { cn } from "@/lib/utils";

type MetricKey = "heartRate" | "bloodPressure" | "oxygenLevel" | "temperature" | "bloodSugar";

const METRICS_CONFIG = [
  {
    id: "heartRate" as MetricKey,
    label: "Heart Rate",
    icon: "💓",
    unit: "BPM",
    metrics: [{ key: "heartRate" as const, label: "Heart Rate", color: "#0891b2", unit: "BPM", referenceMin: 60, referenceMax: 100 }],
  },
  {
    id: "bloodPressure" as MetricKey,
    label: "Blood Pressure",
    icon: "🩸",
    unit: "mmHg",
    metrics: [
      { key: "systolic" as const, label: "Systolic", color: "#dc2626", unit: "mmHg", referenceMax: 120 },
      { key: "diastolic" as const, label: "Diastolic", color: "#7c3aed", unit: "mmHg", referenceMax: 80 },
    ],
  },
  {
    id: "oxygenLevel" as MetricKey,
    label: "Oxygen Level",
    icon: "🫁",
    unit: "%",
    metrics: [{ key: "oxygenLevel" as const, label: "SpO2", color: "#16a34a", unit: "%", referenceMin: 95 }],
  },
  {
    id: "temperature" as MetricKey,
    label: "Temperature",
    icon: "🌡️",
    unit: "°F",
    metrics: [{ key: "temperature" as const, label: "Temperature", color: "#d97706", unit: "°F", referenceMax: 99.5 }],
  },
  {
    id: "bloodSugar" as MetricKey,
    label: "Blood Sugar",
    icon: "💉",
    unit: "mg/dL",
    metrics: [{ key: "bloodSugar" as const, label: "Blood Sugar", color: "#ea580c", unit: "mg/dL", referenceMin: 70, referenceMax: 99 }],
  },
];

export default function VitalsHistory() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("heartRate");
  const latest = vitalsHistory[vitalsHistory.length - 1];
  const activeConfig = METRICS_CONFIG.find((m) => m.id === activeMetric)!;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Vitals History</h2>
        <p className="text-muted-foreground text-sm mt-1">Track your health trends over time</p>
      </div>

      {/* Metric selector */}
      <div className="flex gap-2 flex-wrap">
        {METRICS_CONFIG.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMetric(m.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
              activeMetric === m.id
                ? "bg-primary text-primary-foreground border-primary shadow-elevated"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
            )}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">{activeConfig.label} Trend</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Last {vitalsHistory.length} readings</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            {vitalsHistory.length} data points
          </div>
        </div>
        <VitalsChart data={vitalsHistory} metrics={activeConfig.metrics} height={280} />
      </div>

      {/* Summary table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Readings History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">❤️ HR</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">🩸 BP</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">🫁 SpO2</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">🌡️ Temp</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">💉 Sugar</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...vitalsHistory].reverse().map((record, idx) => {
                const bpStatus = getVitalStatus("systolic", record.systolic);
                const hrStatus = getVitalStatus("heartRate", record.heartRate);
                const overallStatus = bpStatus === "risk" || hrStatus === "risk" ? "risk" as const
                  : bpStatus === "caution" || hrStatus === "caution" ? "caution" as const
                  : "healthy" as const;

                return (
                  <tr key={idx} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-foreground font-medium">
                      {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-muted-foreground">{record.heartRate} BPM</td>
                    <td className="px-3 py-3 text-center text-sm text-muted-foreground">{record.systolic}/{record.diastolic}</td>
                    <td className="px-3 py-3 text-center text-sm text-muted-foreground">{record.oxygenLevel}%</td>
                    <td className="px-3 py-3 text-center text-sm text-muted-foreground">{record.temperature}°F</td>
                    <td className="px-3 py-3 text-center text-sm text-muted-foreground">{record.bloodSugar} mg/dL</td>
                    <td className="px-3 py-3 text-center">
                      <HealthIndicator status={overallStatus} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
