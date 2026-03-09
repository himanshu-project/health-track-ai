import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Activity, Shield, Users, BarChart3, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground">HealthTrack</span>
              <span className="text-muted-foreground text-xs ml-1">TeleVitals</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/signup/patient"><Button size="sm" className="bg-primary-gradient text-primary-foreground">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-medium px-4 py-2 rounded-full mb-6 border border-primary/20">
          <Brain className="w-3.5 h-3.5" /> AI-Powered Predictive Healthcare
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
          Monitor Health.<br />
          <span className="text-primary">Predict Risks.</span><br />
          Stay Ahead.
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
          HealthTrack combines daily vitals tracking with AI-driven analysis to detect health risks early and connect patients with doctors remotely.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup/patient">
            <Button size="lg" className="bg-primary-gradient text-primary-foreground gap-2 px-8">
              Start as Patient <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/signup/doctor">
            <Button size="lg" variant="outline" className="gap-2 px-8">
              Join as Doctor
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Demo: Use <strong>patient@demo.com</strong> or <strong>doctor@demo.com</strong> at login
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Activity, title: "Vitals Tracking", desc: "Log heart rate, BP, oxygen, temperature, and blood sugar daily with instant status indicators.", color: "text-primary" },
            { icon: Brain, title: "AI Predictions", desc: "Rule-based AI analyzes trends to detect hypertension, pre-diabetes, and respiratory risks before they escalate.", color: "text-caution" },
            { icon: Users, title: "Doctor Portal", desc: "Doctors monitor patient lists color-coded by health risk, view histories, and manage prescriptions.", color: "text-healthy" },
            { icon: BarChart3, title: "Trend Charts", desc: "Recharts-powered line graphs show vital trends over time with normal threshold reference lines.", color: "text-primary" },
            { icon: Shield, title: "Appointment System", desc: "Patients book, cancel and track appointments. Doctors accept, decline and manage their schedule.", color: "text-caution" },
            { icon: Heart, title: "Health Score", desc: "A dynamic health score (0-100) updates with each vitals entry, giving patients a clear snapshot.", color: "text-risk" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-elevated transition-all">
              <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
