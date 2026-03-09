import { VitalRecord, AIPrediction } from "@/data/mockData";

export interface PredictionResult {
  status: "healthy" | "caution" | "risk";
  score: number; // 0–100, higher = better
  predictions: AIPrediction[];
}

/**
 * Analyze vitals history and generate AI predictions.
 * This is a rule-based placeholder for actual ML model integration.
 */
export function analyzeVitals(vitals: VitalRecord[]): PredictionResult {
  if (vitals.length < 2) {
    return { status: "healthy", score: 85, predictions: [] };
  }

  const latest = vitals[vitals.length - 1];
  const oldest = vitals[0];
  const predictions: AIPrediction[] = [];
  let scoreDeductions = 0;

  // ─── Blood Pressure Analysis ────────────────────────────────────────
  const bpTrend = latest.systolic - oldest.systolic;
  if (latest.systolic >= 140 || latest.diastolic >= 90) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Stage 2 Hypertension Risk",
      description: `Current reading ${latest.systolic}/${latest.diastolic} mmHg meets hypertension criteria. BP has risen ${bpTrend} mmHg over the tracking period.`,
      recommendation: "Immediate medical consultation recommended. Reduce sodium, DASH diet, medication evaluation.",
      date: latest.date,
      icon: "🫀",
    });
    scoreDeductions += 30;
  } else if (latest.systolic >= 130 || bpTrend > 10) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "caution",
      title: "Elevated Blood Pressure Trend",
      description: `BP trending upward (+${bpTrend} mmHg). Current: ${latest.systolic}/${latest.diastolic} mmHg. Stage 1 hypertension range.`,
      recommendation: "Monitor daily. Lifestyle modifications: reduce salt, exercise 30 min/day, limit alcohol.",
      date: latest.date,
      icon: "🩺",
    });
    scoreDeductions += 15;
  }

  // ─── Oxygen Saturation Analysis ─────────────────────────────────────
  const spo2Trend = latest.oxygenLevel - oldest.oxygenLevel;
  if (latest.oxygenLevel < 95) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Low Oxygen Saturation",
      description: `SpO2 at ${latest.oxygenLevel}% — below normal threshold of 95%. Trend: ${spo2Trend}% change.`,
      recommendation: "Seek immediate medical evaluation. Avoid strenuous activity. Practice deep breathing.",
      date: latest.date,
      icon: "🫁",
    });
    scoreDeductions += 25;
  } else if (spo2Trend <= -2) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "caution",
      title: "Declining Oxygen Trend",
      description: `SpO2 has decreased by ${Math.abs(spo2Trend)}% over the tracking period. Currently ${latest.oxygenLevel}%.`,
      recommendation: "Monitor closely. Deep breathing exercises. Avoid polluted environments.",
      date: latest.date,
      icon: "🫁",
    });
    scoreDeductions += 10;
  }

  // ─── Blood Sugar Analysis ────────────────────────────────────────────
  const sugarTrend = latest.bloodSugar - oldest.bloodSugar;
  if (latest.bloodSugar >= 126) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Diabetic Range Blood Sugar",
      description: `Fasting blood sugar ${latest.bloodSugar} mg/dL is in the diabetic range (≥126). Trend: +${sugarTrend} mg/dL.`,
      recommendation: "Urgent: Schedule HbA1c test. Strict dietary modifications. Medical consultation required.",
      date: latest.date,
      icon: "🩸",
    });
    scoreDeductions += 28;
  } else if (latest.bloodSugar >= 100 || sugarTrend > 10) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "caution",
      title: "Pre-diabetic Blood Sugar Pattern",
      description: `Blood sugar ${latest.bloodSugar} mg/dL in pre-diabetic range (100–125). Rising trend of +${sugarTrend} mg/dL.`,
      recommendation: "Reduce refined carbs and sugar. Exercise regularly. Annual glucose tolerance test.",
      date: latest.date,
      icon: "🩸",
    });
    scoreDeductions += 12;
  }

  // ─── Heart Rate Analysis ─────────────────────────────────────────────
  if (latest.heartRate > 100) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Tachycardia Detected",
      description: `Resting heart rate ${latest.heartRate} BPM exceeds normal range (60–100 BPM). May indicate stress, dehydration, or cardiac issue.`,
      recommendation: "Medical evaluation recommended. Check hydration. Avoid stimulants (caffeine, nicotine).",
      date: latest.date,
      icon: "💓",
    });
    scoreDeductions += 20;
  } else if (latest.heartRate < 60) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "caution",
      title: "Low Resting Heart Rate",
      description: `Resting HR ${latest.heartRate} BPM is below normal (60 BPM). May be normal for athletes.`,
      recommendation: "Monitor symptoms. If experiencing dizziness or fatigue, consult your doctor.",
      date: latest.date,
      icon: "💓",
    });
    scoreDeductions += 8;
  }

  // ─── Temperature Analysis ────────────────────────────────────────────
  if (latest.temperature >= 100.4) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "risk",
      title: "Fever Detected",
      description: `Body temperature ${latest.temperature}°F indicates fever. May signal infection or inflammation.`,
      recommendation: "Rest and hydrate. Antipyretics if needed. Seek care if above 103°F or lasting > 3 days.",
      date: latest.date,
      icon: "🌡️",
    });
    scoreDeductions += 20;
  }

  // ─── Positive Prediction ─────────────────────────────────────────────
  if (scoreDeductions < 15) {
    predictions.push({
      id: crypto.randomUUID(),
      type: "info",
      title: "Vitals Within Healthy Range",
      description: "All key indicators are within normal parameters. Your health metrics demonstrate consistent stability.",
      recommendation: "Maintain current lifestyle. Continue regular monitoring. Annual checkups recommended.",
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
  value: number
): "healthy" | "caution" | "risk" {
  const ranges: Record<string, { healthy: [number, number]; caution: [number, number] }> = {
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
  // within caution range lower bound too
  if (vital === "heartRate" && value >= r.caution[0] && value <= r.caution[1]) return "caution";
  return "risk";
}
