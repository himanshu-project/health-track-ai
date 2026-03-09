import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "patient" | "doctor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Patient fields
  age?: number;
  gender?: string;
  bmi?: number;
  diseases?: string[];
  address?: string;
  schedule?: string;
  // Doctor fields
  licenseNumber?: string;
  specialization?: string;
  hospital?: string;
  practiceHistory?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (data: Partial<AuthUser> & { password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PATIENT: AuthUser = {
  id: "pat1",
  name: "Alex Johnson",
  email: "patient@demo.com",
  role: "patient",
  age: 45,
  gender: "Male",
  bmi: 27.4,
  diseases: ["Hypertension", "Pre-diabetes"],
  address: "123 Oak St, New York, NY",
  schedule: "Daily at 8:00 AM",
};

const DEMO_DOCTOR: AuthUser = {
  id: "doc1",
  name: "Dr. Sarah Chen",
  email: "doctor@demo.com",
  role: "doctor",
  specialization: "Cardiology",
  hospital: "Metropolitan Medical Center",
  licenseNumber: "MD-2019-4521",
  practiceHistory: "8 years in internal medicine and cardiology",
  address: "456 Medical Plaza, New York, NY",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, _password: string, role: UserRole) => {
    // Simulate async auth
    await new Promise((r) => setTimeout(r, 600));
    if (role === "patient") {
      setUser({ ...DEMO_PATIENT, email });
    } else {
      setUser({ ...DEMO_DOCTOR, email });
    }
  };

  const signup = async (data: Partial<AuthUser> & { password: string }) => {
    await new Promise((r) => setTimeout(r, 800));
    const { password: _p, ...rest } = data;
    setUser({
      id: crypto.randomUUID(),
      name: rest.name || "New User",
      email: rest.email || "",
      role: rest.role || "patient",
      ...rest,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
