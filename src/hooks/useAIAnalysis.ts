import { useState, useEffect, useCallback } from "react";
import { VitalRecord } from "@/data/mockData";
import { analyzeVitalsAI, analyzeVitals, PredictionResult } from "@/lib/aiPredictions";

interface UseAIAnalysisOptions {
  vitals: VitalRecord[];
  patientInfo?: { name?: string; age?: number; bmi?: number; diseases?: string[] };
  enabled?: boolean;
}

export function useAIAnalysis({ vitals, patientInfo, enabled = true }: UseAIAnalysisOptions) {
  const [result, setResult] = useState<PredictionResult>(() => analyzeVitals(vitals));
  const [isLoading, setIsLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    if (!enabled || vitals.length < 2) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyzeVitalsAI(vitals, patientInfo);
      setResult(res);
      setIsAI(true);
    } catch (err) {
      console.error("AI analysis error:", err);
      setError("AI analysis failed. Showing rule-based results.");
      setResult(analyzeVitals(vitals));
      setIsAI(false);
    } finally {
      setIsLoading(false);
    }
  }, [vitals, patientInfo, enabled]);

  useEffect(() => {
    runAnalysis();
  }, []);

  return { analysis: result, isLoading, isAI, error, reanalyze: runAnalysis };
}
