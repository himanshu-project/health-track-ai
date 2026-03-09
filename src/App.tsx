import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import PatientSignup from "./pages/auth/PatientSignup";
import DoctorSignup from "./pages/auth/DoctorSignup";

import PatientLayout from "./layouts/PatientLayout";
import PatientDashboard from "./pages/patient/Dashboard";
import VitalsEntry from "./pages/patient/VitalsEntry";
import VitalsHistory from "./pages/patient/VitalsHistory";
import HealthForecast from "./pages/patient/HealthForecast";
import PatientAppointments from "./pages/patient/Appointments";
import PatientReports from "./pages/patient/Reports";
import PatientProfile from "./pages/patient/Profile";

import DoctorLayout from "./layouts/DoctorLayout";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatients from "./pages/doctor/Patients";
import PatientDetail from "./pages/doctor/PatientDetail";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorProfile from "./pages/doctor/Profile";

const queryClient = new QueryClient();

function ProtectedPatient({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "patient") return <Navigate to="/doctor/dashboard" replace />;
  return <PatientLayout>{children}</PatientLayout>;
}

function ProtectedDoctor({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "doctor") return <Navigate to="/patient/dashboard" replace />;
  return <DoctorLayout>{children}</DoctorLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/patient" element={<PatientSignup />} />
      <Route path="/signup/doctor" element={<DoctorSignup />} />

      {/* Patient routes */}
      <Route path="/patient/dashboard" element={<ProtectedPatient><PatientDashboard /></ProtectedPatient>} />
      <Route path="/patient/vitals" element={<ProtectedPatient><VitalsEntry /></ProtectedPatient>} />
      <Route path="/patient/vitals/history" element={<ProtectedPatient><VitalsHistory /></ProtectedPatient>} />
      <Route path="/patient/health-forecast" element={<ProtectedPatient><HealthForecast /></ProtectedPatient>} />
      <Route path="/patient/appointments" element={<ProtectedPatient><PatientAppointments /></ProtectedPatient>} />
      <Route path="/patient/reports" element={<ProtectedPatient><PatientReports /></ProtectedPatient>} />
      <Route path="/patient/profile" element={<ProtectedPatient><PatientProfile /></ProtectedPatient>} />

      {/* Doctor routes */}
      <Route path="/doctor/dashboard" element={<ProtectedDoctor><DoctorDashboard /></ProtectedDoctor>} />
      <Route path="/doctor/patients" element={<ProtectedDoctor><DoctorPatients /></ProtectedDoctor>} />
      <Route path="/doctor/patients/:id" element={<ProtectedDoctor><PatientDetail /></ProtectedDoctor>} />
      <Route path="/doctor/prescriptions" element={<ProtectedDoctor><DoctorPrescriptions /></ProtectedDoctor>} />
      <Route path="/doctor/appointments" element={<ProtectedDoctor><DoctorAppointments /></ProtectedDoctor>} />
      <Route path="/doctor/profile" element={<ProtectedDoctor><DoctorProfile /></ProtectedDoctor>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
