import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getVitalStatus } from "@/lib/aiPredictions";
import { HealthIndicator } from "@/components/health/HealthIndicator";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VitalField {
  key: string;
  label: string;
  unit: string;
  icon: string;
  min: number;
  max: number;
  step: number;
  normalRange: string;
  placeholder: string;
}

const VITAL_FIELDS: VitalField[] = [
  { key: "heartRate", label: "Heart Rate", unit: "BPM", icon: "💓", min: 30, max: 250, step: 1, normalRange: "60–100 BPM", placeholder: "e.g. 72" },
  { key: "systolic", label: "Systolic BP", unit: "mmHg", icon: "🩸", min: 60, max: 250, step: 1, normalRange: "90–120 mmHg", placeholder: "e.g. 120" },
  { key: "diastolic", label: "Diastolic BP", unit: "mmHg", icon: "🫀", min: 40, max: 150, step: 1, normalRange: "60–80 mmHg", placeholder: "e.g. 80" },
  { key: "oxygenLevel", label: "Oxygen Saturation", unit: "%", icon: "🫁", min: 70, max: 100, step: 0.1, normalRange: "96–100%", placeholder: "e.g. 98" },
  { key: "temperature", label: "Body Temperature", unit: "°F", icon: "🌡️", min: 90, max: 108, step: 0.1, normalRange: "97–99.5°F", placeholder: "e.g. 98.6" },
  { key: "bloodSugar", label: "Blood Sugar (Fasting)", unit: "mg/dL", icon: "💉", min: 40, max: 600, step: 1, normalRange: "70–99 mg/dL", placeholder: "e.g. 90" },
];

export default function VitalsEntry() {
  const { user } = useAuth();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState("");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const getStatusForField = (field: VitalField) => {
    const val = parseFloat(form[field.key] || "");
    if (isNaN(val)) return null;
    return getVitalStatus(field.key as any, val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filled = VITAL_FIELDS.some((f) => form[f.key]);
    if (!filled) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-card">
          <div className="w-16 h-16 rounded-full bg-healthy-bg flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-healthy" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Vitals Logged Successfully!</h2>
          <p className="text-muted-foreground text-sm mt-2">Your health data has been recorded. AI is analyzing your latest readings.</p>
          <div className="mt-6 space-y-2">
            {VITAL_FIELDS.filter((f) => form[f.key]).map((f) => {
              const status = getStatusForField(f);
              return (
                <div key={f.key} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span>{f.icon}</span>
                    <span className="text-sm text-muted-foreground">{f.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{form[f.key]} {f.unit}</span>
                    {status && <HealthIndicator status={status} size="sm" />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={() => { setSubmitted(false); setForm({}); }}>
              Log More
            </Button>
            <Button className="flex-1 bg-primary-gradient text-primary-foreground" onClick={() => window.location.href = "/patient/vitals/history"}>
              View History
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Log Today's Vitals</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Record your health measurements for {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        {user?.schedule && (
          <div className="mt-3 inline-flex items-center gap-2 bg-primary-light/60 text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full">
            ⏰ Scheduled: {user.schedule}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="grid sm:grid-cols-2 gap-5">
            {VITAL_FIELDS.map((field) => {
              const status = getStatusForField(field);
              return (
                <div key={field.key} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>{field.icon}</span>
                    <span>{field.label}</span>
                    {status && <HealthIndicator status={status} size="sm" />}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={form[field.key] || ""}
                      onChange={set(field.key)}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className={cn(
                        "h-11 pr-16",
                        status === "risk" && "border-risk/50 focus:ring-risk/30",
                        status === "caution" && "border-caution/50 focus:ring-caution/30",
                        status === "healthy" && "border-healthy/50 focus:ring-healthy/30"
                      )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                      {field.unit}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Normal: {field.normalRange}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 space-y-2">
            <Label>Notes (optional)</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any symptoms, medications taken, or observations..."
              className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Status summary */}
        {Object.keys(form).some((k) => form[k]) && (
          <div className="bg-muted/50 rounded-xl p-4 animate-fade-in">
            <p className="text-xs font-medium text-muted-foreground mb-2">READINGS SUMMARY</p>
            <div className="flex flex-wrap gap-2">
              {VITAL_FIELDS.filter((f) => form[f.key]).map((f) => {
                const s = getStatusForField(f);
                return s ? (
                  <span key={f.key} className="text-xs flex items-center gap-1">
                    {f.icon} {f.label}: <HealthIndicator status={s} size="sm" />
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-primary-gradient text-primary-foreground font-medium gap-2"
          disabled={loading || !VITAL_FIELDS.some((f) => form[f.key])}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "💾"}
          {loading ? "Saving vitals..." : "Save Vitals"}
        </Button>
      </form>
    </div>
  );
}
