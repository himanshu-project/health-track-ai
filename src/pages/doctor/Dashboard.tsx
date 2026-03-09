import { patients } from "@/data/mockData";
import { HealthIndicator } from "@/components/health/HealthIndicator";
import { Link } from "react-router-dom";
import { Users, Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function DoctorDashboard() {
  const [search, setSearch] = useState("");
  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.keyIssues.toLowerCase().includes(search.toLowerCase())
  );

  const riskCount = patients.filter((p) => p.status === "risk").length;
  const cautionCount = patients.filter((p) => p.status === "caution").length;
  const healthyCount = patients.filter((p) => p.status === "healthy").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Patients", value: patients.length, icon: "👥", color: "text-primary" },
          { label: "High Risk", value: riskCount, icon: "🚨", color: "text-risk" },
          { label: "Moderate Risk", value: cautionCount, icon: "⚠️", color: "text-caution" },
          { label: "Healthy", value: healthyCount, icon: "✅", color: "text-healthy" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{icon}</span>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Patient List */}
      <div className="bg-card rounded-2xl border border-border shadow-card">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Patient Overview
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="pl-9 h-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                {["Patient", "Age/Gender", "Last Visit", "Key Issues", "BMI", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-foreground text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.age} / {p.gender[0]}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(p.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[180px] truncate">{p.keyIssues}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.bmi}</td>
                  <td className="px-4 py-3">
                    <HealthIndicator status={p.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/doctor/patients/${p.id}`} className="text-primary hover:underline text-xs flex items-center gap-1">
                      View <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
