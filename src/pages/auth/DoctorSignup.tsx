import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Account", "Professional", "Practice"];

export default function DoctorSignup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    licenseNumber: "", specialization: "", practiceHistory: "",
    hospital: "", address: "",
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
      if (!form.licenseNumber || !form.specialization) return "Medical license number and specialization are required.";
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
        role: "doctor",
        licenseNumber: form.licenseNumber, specialization: form.specialization,
        practiceHistory: form.practiceHistory, hospital: form.hospital, address: form.address,
      });
      navigate("/doctor/dashboard");
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SPECIALIZATIONS = [
    "Cardiology", "Endocrinology", "Pulmonology", "Neurology",
    "General Practice", "Internal Medicine", "Pediatrics",
    "Oncology", "Orthopedics", "Dermatology",
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">HealthTrack</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Doctor Registration</h1>
          <p className="text-muted-foreground text-sm mt-1">Join our network of healthcare professionals</p>
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

        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next(); }}>
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-semibold text-foreground text-lg mb-4">Account Details</h2>
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.name} onChange={set("name")} placeholder="Dr. Sarah Chen" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" value={form.email} onChange={set("email")} placeholder="doctor@hospital.com" className="h-11" />
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
                <h2 className="font-semibold text-foreground text-lg mb-4">Professional Information</h2>
                <div className="space-y-2">
                  <Label>Medical License Number *</Label>
                  <Input value={form.licenseNumber} onChange={set("licenseNumber")} placeholder="e.g. MD-2019-4521" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Specialization *</Label>
                  <select
                    value={form.specialization} onChange={set("specialization")}
                    className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  >
                    <option value="">Select specialization</option>
                    {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Practice History</Label>
                  <textarea
                    value={form.practiceHistory} onChange={set("practiceHistory")}
                    placeholder="Brief description of your experience and practice..."
                    className="w-full h-28 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-semibold text-foreground text-lg mb-4">Practice Details</h2>
                <div className="space-y-2">
                  <Label>Preferred Hospital / Clinic</Label>
                  <Input value={form.hospital} onChange={set("hospital")} placeholder="Metropolitan Medical Center" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Practice Address</Label>
                  <Input value={form.address} onChange={set("address")} placeholder="456 Medical Plaza, City, State" className="h-11" />
                </div>
                <div className="bg-muted rounded-xl p-4 text-sm space-y-2">
                  <p className="font-medium text-foreground">Review your information</p>
                  <div className="text-muted-foreground text-xs space-y-1">
                    <p>Name: <span className="text-foreground">{form.name}</span></p>
                    <p>License: <span className="text-foreground">{form.licenseNumber}</span></p>
                    <p>Specialization: <span className="text-foreground">{form.specialization}</span></p>
                  </div>
                </div>
                <div className="bg-primary-light/60 rounded-xl p-4 text-sm">
                  <p className="font-medium text-accent-foreground mb-1">⚕️ Verification</p>
                  <p className="text-muted-foreground text-xs">Your medical license will be verified within 1-2 business days before full access is granted.</p>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 text-sm text-risk bg-risk-bg rounded-lg px-3 py-2">{error}</p>
            )}

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
                  ? (loading ? "Registering..." : "Complete Registration")
                  : <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
                }
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Registering as a patient?{" "}
          <Link to="/signup/patient" className="text-primary font-medium hover:underline">Patient signup</Link>
        </p>
      </div>
    </div>
  );
}
