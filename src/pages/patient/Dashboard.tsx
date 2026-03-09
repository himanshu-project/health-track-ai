import { useAuth } from "@/context/AuthContext";
import { aiPredictions, vitalsHistory, appointments } from "@/data/mockData";
import { analyzeVitals, getHealthScoreLabel } from "@/lib/aiPredictions";
import { HealthIndicator, HealthScoreRing } from "@/components/health/HealthIndicator";
import { PredictionCard } from "@/components/health/PredictionCard";
import { VitalCard } from "@/components/vitals/VitalCard";
import { Link } from "react-router-dom";
import { Activity, Calendar, ChevronRight, Bell, Brain, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);

  const analysis = analyzeVitals(vitalsHistory);
  const latest = vitalsHistory[vitalsHistory.length - 1];
  const upcomingAppts = appointments.filter((a) => a.status !== "completed" && a.status !== "cancelled");
  const topPredictions = aiPredictions.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-primary-gradient rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-6 top-6 w-40 h-40 rounded-full border border-primary-foreground/30" />
          <div className="absolute right-16 top-12 w-24 h-24 rounded-full border border-primary-foreground/30" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm">{greeting} 👋</p>
            <h2 className="text-xl font-bold mt-0.5">{user?.name}</h2>
            <p className="text-primary-foreground/70 text-sm mt-1">
              {user?.schedule ? `Next vitals reminder: ${user.schedule}` : "Remember to log your vitals today"}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <HealthScoreRing score={analysis.score} status={analysis.status} size={72} />
            <p className="text-primary-foreground/80 text-xs mt-1">{getHealthScoreLabel(analysis.score)}</p>
          </div>
        </div>
        <div className="relative z-10 flex gap-3 mt-4">
          <Link to="/patient/vitals">
            <Button size="sm" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0 gap-2">
              <Plus className="w-3.5 h-3.5" /> Log Vitals
            </Button>
          </Link>
          <Link to="/patient/health-forecast">
            <Button size="sm" variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2">
              <Brain className="w-3.5 h-3.5" /> AI Forecast
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Health Score", value: analysis.score.toString(), sub: getHealthScoreLabel(analysis.score), icon: "💚", status: analysis.status },
          { label: "Active Alerts", value: aiPredictions.filter(p => p.type === "risk").length.toString(), sub: "Risk predictions", icon: "🚨", status: "risk" as const },
          { label: "Upcoming Appts", value: upcomingAppts.length.toString(), sub: "Scheduled visits", icon: "📅", status: "healthy" as const },
          { label: "Vitals Logged", value: vitalsHistory.length.toString(), sub: "Total records", icon: "📊", status: "healthy" as const },
        ].map(({ label, value, sub, icon, status }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{icon}</span>
              <HealthIndicator status={status} size="sm" showDot />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Latest Vitals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Latest Vitals
            </h3>
            <Link to="/patient/vitals/history" className="text-xs text-primary hover:underline flex items-center gap-1">
              View history <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <VitalCard
              title="Heart Rate" value={latest.heartRate.toString()} unit="BPM"
              icon="💓" vitalKey="heartRate" numericValue={latest.heartRate}
              history={vitalsHistory.map((v) => v.heartRate)}
              normalRange="60–100 BPM"
            />
            <VitalCard
              title="Blood Pressure" value={`${latest.systolic}/${latest.diastolic}`} unit="mmHg"
              icon="🩸" vitalKey="systolic" numericValue={latest.systolic}
              history={vitalsHistory.map((v) => v.systolic)}
              normalRange="< 120/80"
            />
            <VitalCard
              title="Oxygen Level" value={latest.oxygenLevel.toString()} unit="%"
              icon="🫁" vitalKey="oxygenLevel" numericValue={latest.oxygenLevel}
              history={vitalsHistory.map((v) => v.oxygenLevel)}
              normalRange="96–100%"
            />
            <VitalCard
              title="Temperature" value={latest.temperature.toString()} unit="°F"
              icon="🌡️" vitalKey="temperature" numericValue={latest.temperature}
              history={vitalsHistory.map((v) => v.temperature)}
              normalRange="97–99.5°F"
            />
            <VitalCard
              title="Blood Sugar" value={latest.bloodSugar.toString()} unit="mg/dL"
              icon="💉" vitalKey="bloodSugar" numericValue={latest.bloodSugar}
              history={vitalsHistory.map((v) => v.bloodSugar)}
              normalRange="70–99 mg/dL"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming appointments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Appointments
              </h3>
              <Link to="/patient/appointments" className="text-xs text-primary hover:underline flex items-center gap-1">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {upcomingAppts.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-4 text-center text-muted-foreground text-sm">
                  No upcoming appointments
                </div>
              ) : (
                upcomingAppts.slice(0, 2).map((appt) => (
                  <div key={appt.id} className="bg-card rounded-xl border border-border p-3 shadow-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{appt.doctorName}</p>
                        <p className="text-muted-foreground text-xs">{appt.reason}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        appt.status === "confirmed" ? "status-healthy" : "status-caution"
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-2">
                      📅 {new Date(appt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {appt.time}
                    </p>
                  </div>
                ))
              )}
              <Link to="/patient/appointments">
                <Button variant="outline" size="sm" className="w-full mt-1 gap-2">
                  <Plus className="w-3.5 h-3.5" /> Book Appointment
                </Button>
              </Link>
            </div>
          </div>

          {/* Daily reminder */}
          <div className="bg-caution-bg border border-caution/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-caution shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-caution text-sm">Daily Vitals Reminder</p>
                <p className="text-muted-foreground text-xs mt-1">Don't forget to log your vitals today for accurate AI predictions.</p>
                <Link to="/patient/vitals">
                  <Button size="sm" className="mt-2 bg-caution/90 hover:bg-caution text-caution-foreground gap-1.5 h-7 text-xs">
                    <Plus className="w-3 h-3" /> Log Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> AI Health Predictions
          </h3>
          <Link to="/patient/health-forecast" className="text-xs text-primary hover:underline flex items-center gap-1">
            Full forecast <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {topPredictions.map((p) => (
            <PredictionCard
              key={p.id}
              prediction={p}
              expanded={expandedPrediction === p.id}
              onClick={() => setExpandedPrediction(expandedPrediction === p.id ? null : p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
