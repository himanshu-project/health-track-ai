import { useParams, Link } from "react-router-dom";
import { patients, vitalsHistory, appointments, prescriptions, aiPredictions } from "@/data/mockData";
import { VitalsChart } from "@/components/vitals/VitalsChart";
import { HealthIndicator } from "@/components/health/HealthIndicator";
import { PredictionCard } from "@/components/health/PredictionCard";
import { ChevronLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PatientDetail() {
  const { id } = useParams();
  const patient = patients.find((p) => p.id === id) || patients[0];
  const patientAppts = appointments.filter((a) => a.patientId === patient.id);
  const patientRx = prescriptions.filter((r) => r.patientId === patient.id);
  const [expandedPred, setExpandedPred] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/doctor/patients">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Patient header */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
              <HealthIndicator status={patient.status} />
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span>Age: {patient.age}</span>
              <span>Gender: {patient.gender}</span>
              <span>BMI: {patient.bmi}</span>
              <span>{patient.email}</span>
            </div>
            {patient.diseases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {patient.diseases.map((d) => (
                  <span key={d} className="text-xs bg-risk-bg text-risk px-2.5 py-1 rounded-full font-medium">{d}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vitals chart */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Vitals History</h3>
        <VitalsChart
          data={vitalsHistory}
          metrics={[
            { key: "systolic", label: "Systolic BP", color: "#dc2626", unit: "mmHg" },
            { key: "heartRate", label: "Heart Rate", color: "#0891b2", unit: "BPM" },
            { key: "bloodSugar", label: "Blood Sugar", color: "#d97706", unit: "mg/dL" },
          ]}
          height={220}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Appointments */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Appointments</h3>
          <div className="space-y-3">
            {patientAppts.map((a) => (
              <div key={a.id} className="flex items-center justify-between bg-muted/40 rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.reason}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.date} at {a.time}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  a.status === "confirmed" ? "status-healthy" :
                  a.status === "completed" ? "bg-muted text-muted-foreground" :
                  "status-caution"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Prescriptions</h3>
          <div className="space-y-3">
            {patientRx.map((rx) => (
              <div key={rx.id} className="bg-muted/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">{rx.date}</p>
                {rx.medications.map((m, i) => (
                  <p key={i} className="text-sm font-medium text-foreground">{m.name} {m.dosage}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">AI Health Predictions</h3>
        <div className="space-y-3">
          {aiPredictions.slice(0, 3).map((p) => (
            <PredictionCard key={p.id} prediction={p} expanded={expandedPred === p.id}
              onClick={() => setExpandedPred(expandedPred === p.id ? null : p.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
