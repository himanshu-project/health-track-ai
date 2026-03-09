import { prescriptions, aiPredictions } from "@/data/mockData";
import { PredictionCard } from "@/components/health/PredictionCard";
import { FileText, Pill, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

export default function PatientReports() {
  const [expandedPred, setExpandedPred] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Medical Reports</h2>
        <p className="text-muted-foreground text-sm mt-1">Prescriptions, predictions, and health analysis</p>
      </div>

      {/* Health Trend Analysis */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" /> Health Trend Analysis
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Blood Pressure", trend: "worsening", change: "+20 mmHg over 4 weeks", icon: "🩸", status: "risk" as const },
            { label: "Blood Sugar", trend: "worsening", change: "+22 mg/dL over 4 weeks", icon: "💉", status: "caution" as const },
            { label: "Heart Rate", trend: "stable", change: "±3 BPM variance", icon: "💓", status: "healthy" as const },
          ].map(({ label, trend, change, icon, status }) => (
            <div key={label} className={`rounded-xl p-4 border ${
              status === "risk" ? "bg-risk-bg border-risk/20" :
              status === "caution" ? "bg-caution-bg border-caution/20" :
              "bg-healthy-bg border-healthy/20"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{icon}</span>
                {trend === "worsening"
                  ? <TrendingUp className={`w-4 h-4 ${status === "risk" ? "text-risk" : "text-caution"}`} />
                  : <span className="text-xs font-medium text-healthy">Stable</span>
                }
              </div>
              <p className="font-semibold text-foreground text-sm">{label}</p>
              <p className="text-muted-foreground text-xs mt-1">{change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prescriptions */}
      <div>
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Pill className="w-4 h-4 text-primary" /> Active Prescriptions
        </h3>
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-foreground">{rx.doctorName}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Prescribed {new Date(rx.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="text-xs bg-primary-light text-primary font-medium px-2.5 py-1 rounded-full">
                  Rx #{rx.id}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {rx.medications.map((med, i) => (
                  <div key={i} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Pill className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{med.name} — {med.dosage}</p>
                      <p className="text-muted-foreground text-xs">{med.frequency} · {med.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-primary-light/50 rounded-lg p-3">
                <p className="text-xs font-medium text-accent-foreground mb-1">📝 Doctor's Notes</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{rx.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical AI predictions */}
      <div>
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" /> Historical AI Predictions
        </h3>
        <div className="space-y-3">
          {aiPredictions.map((p) => (
            <PredictionCard
              key={p.id}
              prediction={p}
              expanded={expandedPred === p.id}
              onClick={() => setExpandedPred(expandedPred === p.id ? null : p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
