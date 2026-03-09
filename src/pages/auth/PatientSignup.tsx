import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Account", "Personal", "Medical", "Schedule"];

export default function PatientSignup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    age: "", gender: "", bmi: "",
    diseases: "", address: "",
    schedule: "Daily at 8:00 AM",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.password) return "Please fill in all required fields.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
      if (form.password.length < 6) return "Password must be at least 6 characters.";
    }
    if (step === 1) {
      if (!form.age || !form.gender) return "Please fill in all required fields.";
    }
    return "";
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup({
        name: form.name, email: form.email, password: form.password,
        role: "patient",
        age: Number(form.age), gender: form.gender,
        bmi: form.bmi ? Number(form.bmi) : undefined,
        diseases: form.diseases ? form.diseases.split(",").map((d) => d.trim()) : [],
        address: form.address, schedule: form.schedule,
      });
      navigate("/patient/dashboard");
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">HealthTrack</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Patient Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join thousands monitoring their health with AI</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                i < step ? "bg-healthy text-healthy-foreground" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={cn("text-xs hidden sm:block", i === step ? "text-foreground font-medium" : "text-muted-foreground")}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className={cn("flex-1 h-0.5 ml-1", i < step ? "bg-healthy" : "bg-border")} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next(); }}>
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-semibold text-foreground text-lg mb-4">Account Details</h2>
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.name} onChange={set("name")} placeholder="Alex Johnson" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className="h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input type="password" value={form.password} onChange={set("password")} placeholder="Min. 6 chars" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password *</Label>
                    <Input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" className="h-11" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-semibold text-foreground text-lg mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age *</Label>
                    <Input type="number" value={form.age} onChange={set("age")} placeholder="35" min="1" max="120" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <select
                      value={form.gender} onChange={set("gender")}
                      className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>BMI (optional)</Label>
                  <Input type="number" value={form.bmi} onChange={set("bmi")} placeholder="e.g. 24.5" step="0.1" className="h-11" />
                  <p className="text-xs text-muted-foreground">Body Mass Index — weight(kg) / height²(m²)</p>
                </div>
                <div className="space-y-2">
                  <Label>Home Address</Label>
                  <Input value={form.address} onChange={set("address")} placeholder="123 Main St, City, State" className="h-11" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-semibold text-foreground text-lg mb-4">Medical History</h2>
                <div className="space-y-2">
                  <Label>History of Diseases (optional)</Label>
                  <textarea
                    value={form.diseases} onChange={set("diseases")}
                    placeholder="e.g. Diabetes, Hypertension, Asthma (comma-separated)"
                    className="w-full h-28 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none"
                  />
                  <p className="text-xs text-muted-foreground">This information helps AI provide better health predictions.</p>
                </div>
                <div className="bg-primary-light/60 rounded-xl p-4 text-sm">
                  <p className="font-medium text-accent-foreground mb-1">🔒 Privacy Notice</p>
                  <p className="text-muted-foreground text-xs">Your medical history is encrypted and only shared with authorized healthcare providers you connect with.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-semibold text-foreground text-lg mb-4">Vitals Collection Schedule</h2>
                <div className="space-y-2">
                  <Label>Preferred Schedule</Label>
                  <select
                    value={form.schedule} onChange={set("schedule")}
                    className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  >
                    <option value="Daily at 8:00 AM">Daily at 8:00 AM</option>
                    <option value="Daily at 12:00 PM">Daily at 12:00 PM</option>
                    <option value="Daily at 8:00 PM">Daily at 8:00 PM</option>
                    <option value="Twice daily">Twice daily (8 AM & 8 PM)</option>
                    <option value="Every 3 days">Every 3 days</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div className="bg-healthy-bg rounded-xl p-4">
                  <p className="font-medium text-healthy text-sm">📅 {form.schedule}</p>
                  <p className="text-muted-foreground text-xs mt-1">You'll receive reminders at this time to log your vitals.</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-sm space-y-2">
                  <p className="font-medium text-foreground">Review your information</p>
                  <div className="text-muted-foreground text-xs space-y-1">
                    <p>Name: <span className="text-foreground">{form.name}</span></p>
                    <p>Email: <span className="text-foreground">{form.email}</span></p>
                    <p>Age / Gender: <span className="text-foreground">{form.age} / {form.gender}</span></p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 text-sm text-risk bg-risk-bg rounded-lg px-3 py-2">{error}</p>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <Button
                  type="button" variant="outline"
                  onClick={() => { setError(""); setStep((s) => s - 1); }}
                  className="flex-1 h-11 gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 h-11 gap-2 bg-primary-gradient text-primary-foreground"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {step === STEPS.length - 1
                  ? (loading ? "Creating..." : "Create Account")
                  : <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
                }
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Are you a doctor?{" "}
          <Link to="/signup/doctor" className="text-primary font-medium hover:underline">Doctor signup</Link>
        </p>
      </div>
    </div>
  );
}
