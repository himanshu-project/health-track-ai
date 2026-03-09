import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Stethoscope, Save, CheckCircle2 } from "lucide-react";

export default function DoctorProfile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "",
    licenseNumber: user?.licenseNumber || "", specialization: user?.specialization || "",
    hospital: user?.hospital || "", address: user?.address || "",
    practiceHistory: user?.practiceHistory || "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Doctor Profile</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your professional information</p>
      </div>
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{user?.name}</h3>
            <p className="text-muted-foreground text-sm">{user?.specialization}</p>
            <p className="text-xs text-muted-foreground mt-1">License: {user?.licenseNumber}</p>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={set("name")} className="h-11" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={set("email")} className="h-11" /></div>
            <div className="space-y-2"><Label>License Number</Label><Input value={form.licenseNumber} onChange={set("licenseNumber")} className="h-11" /></div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <select value={form.specialization} onChange={set("specialization")}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                {["Cardiology","Endocrinology","Pulmonology","General Practice","Internal Medicine","Neurology","Pediatrics"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>Preferred Hospital</Label><Input value={form.hospital} onChange={set("hospital")} className="h-11" /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={set("address")} className="h-11" /></div>
          </div>
          <div className="space-y-2">
            <Label>Practice History</Label>
            <textarea value={form.practiceHistory} onChange={set("practiceHistory")}
              className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none" />
          </div>
          {saved && <div className="flex items-center gap-2 text-healthy bg-healthy-bg rounded-lg px-4 py-3 text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> Profile updated!</div>}
          <Button type="submit" className="w-full h-11 bg-primary-gradient text-primary-foreground gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
