import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, Save, CheckCircle2 } from "lucide-react";
import { HealthIndicator } from "@/components/health/HealthIndicator";

export default function PatientProfile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    bmi: user?.bmi?.toString() || "",
    address: user?.address || "",
    schedule: user?.schedule || "Daily at 8:00 AM",
    diseases: (user?.diseases || []).join(", "),
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">My Profile</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal and medical information</p>
      </div>

      {/* Profile card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{user?.name}</h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <HealthIndicator status="caution" size="sm" />
              <span className="text-xs text-muted-foreground">Patient ID: {user?.id}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={set("name")} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={form.email} onChange={set("email")} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" value={form.age} onChange={set("age")} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <select value={form.gender} onChange={set("gender")}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>BMI</Label>
              <Input type="number" value={form.bmi} onChange={set("bmi")} step="0.1" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Vitals Schedule</Label>
              <select value={form.schedule} onChange={set("schedule")}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                <option>Daily at 8:00 AM</option>
                <option>Daily at 12:00 PM</option>
                <option>Daily at 8:00 PM</option>
                <option>Twice daily</option>
                <option>Every 3 days</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Home Address</Label>
            <Input value={form.address} onChange={set("address")} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label>Medical History (diseases)</Label>
            <textarea
              value={form.diseases} onChange={set("diseases")}
              className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none"
              placeholder="Comma-separated conditions..."
            />
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-healthy bg-healthy-bg rounded-lg px-4 py-3 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          <Button type="submit" className="w-full h-11 bg-primary-gradient text-primary-foreground gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </form>
      </div>

      {/* Account security */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Account Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
