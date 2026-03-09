import { useState } from "react";
import { appointments as initialAppointments, Appointment } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, Calendar, Clock, X, CheckCircle2 } from "lucide-react";

type FilterStatus = "all" | "upcoming" | "completed" | "cancelled";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showBooking, setShowBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const [form, setForm] = useState({
    doctorName: "", date: "", time: "", reason: "",
  });

  const filtered = appointments.filter((a) => {
    if (filter === "upcoming") return a.status === "pending" || a.status === "confirmed";
    if (filter === "completed") return a.status === "completed";
    if (filter === "cancelled") return a.status === "cancelled";
    return true;
  });

  const handleCancel = (id: string) =>
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "cancelled" as const } : a));

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt: Appointment = {
      id: crypto.randomUUID(), patientId: "pat1", doctorId: "doc-new",
      patientName: "Alex Johnson", doctorName: form.doctorName,
      date: form.date, time: form.time, reason: form.reason, status: "pending",
    };
    setAppointments((prev) => [...prev, newAppt]);
    setBooked(true);
    setTimeout(() => { setBooked(false); setShowBooking(false); setForm({ doctorName: "", date: "", time: "", reason: "" }); }, 2000);
  };

  const statusConfig = {
    pending: { label: "Pending", style: "status-caution" },
    confirmed: { label: "Confirmed", style: "status-healthy" },
    completed: { label: "Completed", style: "bg-muted text-muted-foreground" },
    cancelled: { label: "Cancelled", style: "status-risk" },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Appointments</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your medical appointments</p>
        </div>
        <Button
          className="bg-primary-gradient text-primary-foreground gap-2"
          onClick={() => setShowBooking(!showBooking)}
        >
          <Plus className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      {/* Booking form */}
      {showBooking && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-elevated animate-fade-in">
          {booked ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-healthy mx-auto mb-2" />
              <p className="font-semibold text-foreground">Appointment Requested!</p>
              <p className="text-muted-foreground text-sm mt-1">Your doctor will confirm shortly.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Book New Appointment</h3>
                <button onClick={() => setShowBooking(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleBook} className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Doctor Name *</Label>
                  <Input value={form.doctorName} onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))} placeholder="Dr. Sarah Chen" required className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Date *</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required className="h-10" min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Time *</Label>
                  <select value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} required
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none">
                    <option value="">Select time</option>
                    {["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Reason for Visit *</Label>
                  <Input value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Routine checkup" required className="h-10" />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowBooking(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary-gradient text-primary-foreground">Request Appointment</Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "upcoming", "completed", "cancelled"] as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all border capitalize",
              filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {f} {f === "all" ? `(${appointments.length})` : `(${appointments.filter((a) => {
              if (f === "upcoming") return a.status === "pending" || a.status === "confirmed";
              return a.status === f;
            }).length})`}
          </button>
        ))}
      </div>

      {/* Appointments list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No appointments found</p>
          </div>
        )}
        {filtered.map((appt) => {
          const cfg = statusConfig[appt.status];
          return (
            <div key={appt.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-elevated transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-foreground">{appt.doctorName}</p>
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium", cfg.style)}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{appt.reason}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(appt.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {appt.time}
                    </span>
                  </div>
                </div>
                {(appt.status === "pending" || appt.status === "confirmed") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-risk border-risk/30 hover:bg-risk-bg shrink-0"
                    onClick={() => handleCancel(appt.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
