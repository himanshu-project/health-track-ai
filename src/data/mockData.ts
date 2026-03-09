export type HealthStatus = "healthy" | "caution" | "risk";

export interface VitalRecord {
  date: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygenLevel: number;
  temperature: number;
  bloodSugar: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  notes: string;
}

export interface AIPrediction {
  id: string;
  type: "info" | "caution" | "risk";
  title: string;
  description: string;
  recommendation: string;
  date: string;
  icon: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bmi: number;
  diseases: string[];
  lastVisit: string;
  keyIssues: string;
  status: HealthStatus;
  email: string;
  address: string;
}

// ─── VITALS HISTORY ─────────────────────────────────────────────────────────

export const vitalsHistory: VitalRecord[] = [
  { date: "2024-12-01", heartRate: 72, systolic: 118, diastolic: 76, oxygenLevel: 98, temperature: 98.4, bloodSugar: 90 },
  { date: "2024-12-05", heartRate: 75, systolic: 122, diastolic: 80, oxygenLevel: 97, temperature: 98.6, bloodSugar: 94 },
  { date: "2024-12-10", heartRate: 80, systolic: 128, diastolic: 84, oxygenLevel: 97, temperature: 98.8, bloodSugar: 98 },
  { date: "2024-12-15", heartRate: 78, systolic: 130, diastolic: 86, oxygenLevel: 96, temperature: 99.0, bloodSugar: 102 },
  { date: "2024-12-20", heartRate: 82, systolic: 135, diastolic: 88, oxygenLevel: 96, temperature: 99.1, bloodSugar: 108 },
  { date: "2024-12-25", heartRate: 85, systolic: 138, diastolic: 90, oxygenLevel: 95, temperature: 99.3, bloodSugar: 112 },
  { date: "2025-01-01", heartRate: 79, systolic: 132, diastolic: 87, oxygenLevel: 97, temperature: 98.7, bloodSugar: 105 },
  { date: "2025-01-08", heartRate: 76, systolic: 126, diastolic: 82, oxygenLevel: 98, temperature: 98.5, bloodSugar: 99 },
  { date: "2025-01-15", heartRate: 74, systolic: 124, diastolic: 80, oxygenLevel: 98, temperature: 98.4, bloodSugar: 95 },
];

// ─── AI PREDICTIONS ──────────────────────────────────────────────────────────

export const aiPredictions: AIPrediction[] = [
  {
    id: "p1",
    type: "risk",
    title: "Hypertension Risk Detected",
    description: "Your blood pressure readings show a consistent upward trend over the past 3 weeks. Values have increased from 118/76 to 138/90 mmHg.",
    recommendation: "Reduce sodium intake, increase physical activity (30 min/day), and schedule a consultation with your doctor. Avoid stress triggers.",
    date: "2025-01-15",
    icon: "🫀",
  },
  {
    id: "p2",
    type: "caution",
    title: "Elevated Blood Sugar Trend",
    description: "Blood sugar levels have been gradually rising. Current readings suggest borderline pre-diabetic range. Monitor closely.",
    recommendation: "Reduce processed sugar and refined carbohydrates. Consider a glucose tolerance test. Increase fiber intake.",
    date: "2025-01-14",
    icon: "🩸",
  },
  {
    id: "p3",
    type: "caution",
    title: "Declining Oxygen Saturation",
    description: "SpO2 levels have declined from 98% to 95% over 3 weeks. This may indicate reduced respiratory function.",
    recommendation: "Practice deep breathing exercises. Avoid polluted environments. If below 94%, seek immediate medical attention.",
    date: "2025-01-13",
    icon: "🫁",
  },
  {
    id: "p4",
    type: "info",
    title: "Heart Rate Within Normal Range",
    description: "Your resting heart rate consistently falls within the healthy range of 60–100 BPM. Minor fluctuations observed.",
    recommendation: "Continue your current activity level. Maintain hydration and consistent sleep schedule.",
    date: "2025-01-12",
    icon: "💚",
  },
];

// ─── APPOINTMENTS ────────────────────────────────────────────────────────────

export const appointments: Appointment[] = [
  {
    id: "a1", patientId: "pat1", doctorId: "doc1",
    patientName: "Alex Johnson", doctorName: "Dr. Sarah Chen",
    date: "2025-01-20", time: "10:00 AM", reason: "Blood pressure follow-up", status: "confirmed",
  },
  {
    id: "a2", patientId: "pat1", doctorId: "doc2",
    patientName: "Alex Johnson", doctorName: "Dr. Raj Patel",
    date: "2025-01-25", time: "2:30 PM", reason: "Diabetes screening", status: "pending",
  },
  {
    id: "a3", patientId: "pat1", doctorId: "doc1",
    patientName: "Alex Johnson", doctorName: "Dr. Sarah Chen",
    date: "2024-12-15", time: "11:00 AM", reason: "Routine checkup", status: "completed",
  },
];

// ─── PRESCRIPTIONS ────────────────────────────────────────────────────────────

export const prescriptions: Prescription[] = [
  {
    id: "rx1", patientId: "pat1", doctorId: "doc1",
    patientName: "Alex Johnson", doctorName: "Dr. Sarah Chen",
    date: "2024-12-15",
    medications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days" },
    ],
    notes: "Monitor blood pressure daily. Return if BP exceeds 140/90 mmHg. Reduce salt intake.",
  },
  {
    id: "rx2", patientId: "pat1", doctorId: "doc2",
    patientName: "Alex Johnson", doctorName: "Dr. Raj Patel",
    date: "2024-11-10",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily with meals", duration: "60 days" },
    ],
    notes: "Fasting blood sugar target: below 100 mg/dL. Dietary modification required.",
  },
];

// ─── PATIENTS (for doctor view) ───────────────────────────────────────────────

export const patients: Patient[] = [
  {
    id: "pat1", name: "Alex Johnson", age: 45, gender: "Male", bmi: 27.4,
    diseases: ["Hypertension", "Pre-diabetes"],
    lastVisit: "2024-12-15", keyIssues: "Rising BP, elevated sugar",
    status: "risk", email: "alex@example.com", address: "123 Oak St, NYC",
  },
  {
    id: "pat2", name: "Maria Garcia", age: 32, gender: "Female", bmi: 22.1,
    diseases: ["Asthma"],
    lastVisit: "2024-12-20", keyIssues: "Mild respiratory concern",
    status: "caution", email: "maria@example.com", address: "456 Pine Ave, LA",
  },
  {
    id: "pat3", name: "James Chen", age: 28, gender: "Male", bmi: 23.5,
    diseases: [],
    lastVisit: "2025-01-02", keyIssues: "Routine checkup",
    status: "healthy", email: "james@example.com", address: "789 Elm Rd, Chicago",
  },
  {
    id: "pat4", name: "Priya Patel", age: 55, gender: "Female", bmi: 29.8,
    diseases: ["Type 2 Diabetes", "Hypertension"],
    lastVisit: "2025-01-05", keyIssues: "Uncontrolled blood sugar, high BP",
    status: "risk", email: "priya@example.com", address: "321 Maple Dr, Houston",
  },
  {
    id: "pat5", name: "Robert Kim", age: 39, gender: "Male", bmi: 25.0,
    diseases: ["Hyperlipidemia"],
    lastVisit: "2024-12-28", keyIssues: "Cholesterol management",
    status: "caution", email: "robert@example.com", address: "654 Cedar Blvd, Miami",
  },
  {
    id: "pat6", name: "Emily Watson", age: 24, gender: "Female", bmi: 21.3,
    diseases: [],
    lastVisit: "2025-01-10", keyIssues: "Annual wellness exam",
    status: "healthy", email: "emily@example.com", address: "987 Birch Ln, Seattle",
  },
];
