import { useState } from "react";
import { prescriptions as initialPrescriptions, patients, Prescription } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Plus, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ patientId: "", notes: "", medName: "", medDosage: "", medFreq: "", medDuration: "" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);
    if (!patient) return;
    const newRx: Prescription = {
      id: crypto.randomUUID(), patientId: form.patientId, doctorId: "doc1",
      patientName: patient.name, doctorName: "Dr. Sarah Chen",
      date: new Date().toISOString().split("T")[0],
      medications: [{ name: form.medName, dosage: form.medDosage, frequency: form.medFreq, duration: form.medDuration }],
      notes: form.notes,
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setForm({ patientId: "", notes: "", medName: "", medDosage: "", medFreq: "", medDuration: "" }); }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Prescriptions</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage patient prescriptions</p>
        </div>
        <Button className="bg-primary-gradient text-primary-foreground gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> New Prescription
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-elevated animate-fade-in">
          {saved ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-healthy mx-auto mb-2" />
              <p className="font-semibold text-foreground">Prescription created!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">New Prescription</h3>
                <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient *</Label>
                  <select value={form.patientId} onChange={(e) => setForm(f => ({...f, patientId: e.target.value}))} required
                    className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                    <option value="">Select patient</option>
                    {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Medication Name *</Label>
                    <Input value={form.medName} onChange={(e) => setForm(f => ({...f, medName: e.target.value}))} placeholder="e.g. Lisinopril" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Dosage *</Label>
                    <Input value={form.medDosage} onChange={(e) => setForm(f => ({...f, medDosage: e.target.value}))} placeholder="e.g. 10mg" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Input value={form.medFreq} onChange={(e) => setForm(f => ({...f, medFreq: e.target.value}))} placeholder="e.g. Once daily" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input value={form.medDuration} onChange={(e) => setForm(f => ({...f, medDuration: e.target.value}))} placeholder="e.g. 30 days" className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Doctor's Notes</Label>
                  <textarea value={form.notes} onChange={(e) => setForm(f => ({...f, notes: e.target.value}))}
                    className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none resize-none"
                    placeholder="Instructions and notes for the patient..." />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary-gradient text-primary-foreground">Create Prescription</Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      <div className="space-y-4">
        {prescriptions.map((rx) => (
          <div key={rx.id} className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-foreground">{rx.patientName}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{new Date(rx.date).toLocaleDateString("en-US", {month:"long",day:"numeric",year:"numeric"})}</p>
              </div>
              <span className="text-xs bg-primary-light text-primary font-medium px-2.5 py-1 rounded-full">Rx #{rx.id.slice(0,8)}</span>
            </div>
            <div className="space-y-2 mb-4">
              {rx.medications.map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-muted/40 rounded-lg p-3">
                  <Pill className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{m.name} — {m.dosage}</p>
                    <p className="text-muted-foreground text-xs">{m.frequency} · {m.duration}</p>
                  </div>
                </div>
              ))}
            </div>
            {rx.notes && (
              <div className="bg-primary-light/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{rx.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
