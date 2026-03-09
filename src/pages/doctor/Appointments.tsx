import { useState } from "react";
import { appointments, patients } from "@/data/mockData";
import { Calendar, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DoctorAppointments() {
  const [appts, setAppts] = useState(appointments);

  const update = (id: string, status: "confirmed" | "cancelled") =>
    setAppts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Appointment Management</h2>
        <p className="text-muted-foreground text-sm mt-1">Review and manage patient appointment requests</p>
      </div>
      <div className="space-y-3">
        {appts.map((a) => {
          const patient = patients.find((p) => p.id === a.patientId);
          return (
            <div key={a.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-elevated transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                    {a.patientName.split(" ").map((n) => n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{a.patientName}</p>
                    <p className="text-muted-foreground text-sm">{a.reason}</p>
                    {patient && <p className="text-xs text-muted-foreground mt-0.5">Age: {patient.age} · {patient.gender}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium",
                    a.status === "confirmed" ? "status-healthy" :
                    a.status === "cancelled" ? "status-risk" :
                    a.status === "completed" ? "bg-muted text-muted-foreground" : "status-caution")}>
                    {a.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(a.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{a.time}</span>
              </div>
              {a.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="gap-1.5 bg-healthy text-healthy-foreground hover:bg-healthy/90 flex-1"
                    onClick={() => update(a.id, "confirmed")}>
                    <Check className="w-3.5 h-3.5" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 text-risk border-risk/30 hover:bg-risk-bg flex-1"
                    onClick={() => update(a.id, "cancelled")}>
                    <X className="w-3.5 h-3.5" /> Decline
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
