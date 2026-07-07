import { VitalRecord, AIPrediction } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

export interface PredictionResult {
  status: "healthy" | "caution" | "risk";
  score: number; // 0–100, higher = better
  predictions: AIPrediction[];
}

/**
 * Call the AI edge function to analyze vitals with HealthTrack AI (Gemini).
 * Falls back to rule-based analysis if the AI call fails.
 */
export async function analyzeVitalsAI(
  vitals: VitalRecord[],
  patientInfo?: {
    name?: string;
    age?: number;
    bmi?: number;
    diseases?: string[];
  },
): Promise<PredictionResult> {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-vitals", {
      body: { vitals, patientInfo },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    return {
      score: data.score,
      status: data.status,
      predictions: data.predictions,
    };
  } catch (err) {
    console.error("AI analysis failed, falling back to rule-based:", err);
    return analyzeVitals(vitals);
  }
}

/**
 * Rule-based fallback analysis.
 */
export function analyzeVitals(vitals: VitalRecord[]): PredictionResult {
  if (vitals.length < 2) {
    return { status: "healthy", score: 85, predictions: [] };
  }

  const latest = vitals[vitals.length - 1];
  const oldest = vitals[0];
  const predictions: AIPrediction[] = [];
  let scoreDeductions = 0;

  const bpTrend = latest.systolic - oldest.systolic;
  if (latest.systolic >= 140 || latest.diastolic >= 90) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Stage 2 Hypertension Risk",
      description: `Current reading ${latest.systolic}/${latest.diastolic} mmHg meets hypertension criteria. BP has risen ${bpTrend} mmHg.`,
      recommendation:
        "Immediate medical consultation recommended. Reduce sodium, DASH diet, medication evaluation.",
      date: latest.date,
      icon: "🫀",
    });
    scoreDeductions += 30;
  } else if (latest.systolic >= 130 || bpTrend > 10) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "caution",
      title: "Elevated Blood Pressure Trend",
      description: `BP trending upward (+${bpTrend} mmHg). Current: ${latest.systolic}/${latest.diastolic} mmHg.`,
      recommendation:
        "Monitor daily. Reduce salt, exercise 30 min/day, limit alcohol.",
      date: latest.date,
      icon: "🩺",
    });
    scoreDeductions += 15;
  }

  if (latest.oxygenLevel < 95) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Low Oxygen Saturation",
      description: `SpO2 at ${latest.oxygenLevel}% — below normal threshold of 95%.`,
      recommendation:
        "Seek immediate medical evaluation. Practice deep breathing.",
      date: latest.date,
      icon: "🫁",
    });
    scoreDeductions += 25;
  }

  if (latest.bloodSugar >= 126) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Diabetic Range Blood Sugar",
      description: `Fasting blood sugar ${latest.bloodSugar} mg/dL is in the diabetic range.`,
      recommendation:
        "Schedule HbA1c test. Strict dietary modifications required.",
      date: latest.date,
      icon: "🩸",
    });
    scoreDeductions += 28;
  } else if (latest.bloodSugar >= 100) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "caution",
      title: "Pre-diabetic Blood Sugar",
      description: `Blood sugar ${latest.bloodSugar} mg/dL in pre-diabetic range.`,
      recommendation: "Reduce refined carbs. Exercise regularly.",
      date: latest.date,
      icon: "🩸",
    });
    scoreDeductions += 12;
  }

  if (latest.heartRate > 100) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Tachycardia Detected",
      description: `Resting heart rate ${latest.heartRate} BPM exceeds normal range.`,
      recommendation: "Medical evaluation recommended. Avoid stimulants.",
      date: latest.date,
      icon: "💓",
    });
    scoreDeductions += 20;
  }

  if (scoreDeductions < 15) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "info",
      title: "Vitals Within Healthy Range",
      description: "All key indicators are within normal parameters.",
      recommendation:
        "Maintain current lifestyle. Continue regular monitoring.",
      date: latest.date,
      icon: "✅",
    });
  }

  const score = Math.max(0, Math.min(100, 100 - scoreDeductions));
  const status: "healthy" | "caution" | "risk" =
    score >= 75 ? "healthy" : score >= 50 ? "caution" : "risk";

  return { status, score, predictions: predictions.slice(0, 4) };
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 35) return "Poor";
  return "Critical";
}

export function getVitalStatus(
  vital: keyof Omit<VitalRecord, "date">,
  value: number,
): "healthy" | "caution" | "risk" {
  const ranges: Record<
    string,
    { healthy: [number, number]; caution: [number, number] }
  > = {
    heartRate: { healthy: [60, 100], caution: [55, 110] },
    systolic: { healthy: [90, 120], caution: [120, 140] },
    diastolic: { healthy: [60, 80], caution: [80, 90] },
    oxygenLevel: { healthy: [96, 100], caution: [94, 96] },
    temperature: { healthy: [97, 99.5], caution: [99.5, 100.4] },
    bloodSugar: { healthy: [70, 99], caution: [100, 125] },
  };

  const r = ranges[vital];
  if (!r) return "healthy";
  if (value >= r.healthy[0] && value <= r.healthy[1]) return "healthy";
  if (value >= r.caution[0] && value <= r.caution[1]) return "caution";
  return "risk";
}
