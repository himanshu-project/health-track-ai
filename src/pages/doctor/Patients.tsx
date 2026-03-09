import { patients } from "@/data/mockData";
import { HealthIndicator } from "@/components/health/HealthIndicator";
import { Link } from "react-router-dom";
import { Users, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function DoctorPatients() {
  const [search, setSearch] = useState("");
  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Patients</h2>
          <p className="text-muted-foreground text-sm mt-1">{patients.length} patients under your care</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." className="pl-9 h-10" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <Link key={p.id} to={`/doctor/patients/${p.id}`}>
            <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-elevated transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.age}y · {p.gender} · BMI {p.bmi}</p>
                  </div>
                </div>
                <HealthIndicator status={p.status} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground mt-3">{p.keyIssues}</p>
              {p.diseases.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.diseases.map((d) => (
                    <span key={d} className="text-xs bg-risk-bg/60 text-risk px-2 py-0.5 rounded-full">{d}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Last visit: {new Date(p.lastVisit).toLocaleDateString("en-US", {month:"short",day:"numeric"})}</p>
                <span className="text-xs text-primary flex items-center gap-1">View <ChevronRight className="w-3 h-3" /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
