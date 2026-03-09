import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Loader2, Stethoscope, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await login(email, password, role);
      navigate(role === "patient" ? "/patient/dashboard" : "/doctor/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-health-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-primary-foreground/30"
              style={{
                width: `${(i % 4 + 1) * 80}px`,
                height: `${(i % 4 + 1) * 80}px`,
                top: `${(i * 17) % 90}%`,
                left: `${(i * 23) % 90}%`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-primary-foreground font-bold text-lg">HealthTrack</p>
              <p className="text-primary-foreground/70 text-xs">TeleVitals Platform</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-primary-foreground text-4xl font-bold leading-tight">
            Your health,<br />intelligently monitored.
          </h2>
          <p className="text-primary-foreground/80 text-base leading-relaxed">
            AI-powered predictive analytics for proactive healthcare. Track vitals, detect risks early, and connect with your care team.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Patients Monitored", value: "12,400+" },
              { label: "Risk Predictions", value: "98.2% acc." },
              { label: "Doctors Connected", value: "840+" },
              { label: "Health Alerts Sent", value: "50,000+" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-primary-foreground/10 rounded-xl p-4">
                <p className="text-primary-foreground font-bold text-xl">{value}</p>
                <p className="text-primary-foreground/70 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-primary-foreground/50 text-xs">
          © 2025 HealthTrack TeleVitals. Secure & HIPAA-compliant.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-foreground font-bold">HealthTrack</p>
              <p className="text-muted-foreground text-xs">TeleVitals</p>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-muted rounded-xl">
            {(["patient", "doctor"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                  role === r
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r === "patient" ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                {r === "patient" ? "Patient" : "Doctor"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "patient" ? "patient@demo.com" : "doctor@demo.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-risk bg-risk-bg rounded-lg px-3 py-2">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-primary-gradient text-primary-foreground font-medium"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Signing in..." : `Sign in as ${role === "patient" ? "Patient" : "Doctor"}`}
            </Button>
          </form>

          {/* Quick demo info */}
          <div className="bg-primary-light/60 rounded-xl p-4 text-sm space-y-1">
            <p className="font-medium text-accent-foreground">🚀 Demo credentials</p>
            <p className="text-muted-foreground">Patient: patient@demo.com / any password</p>
            <p className="text-muted-foreground">Doctor: doctor@demo.com / any password</p>
          </div>

          {/* Divider + alternatives */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs text-muted-foreground bg-background px-2">
              or continue with
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10 text-sm gap-2" disabled>
              <span>🔗</span> Magic Link
            </Button>
            <Button variant="outline" className="h-10 text-sm gap-2" disabled>
              <span>🔐</span> SSO Login
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            New to HealthTrack?{" "}
            <Link to="/signup/patient" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
