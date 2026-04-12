import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { vitals, patientInfo } = await req.json();
    
    if (!vitals || !Array.isArray(vitals) || vitals.length === 0) {
      return new Response(JSON.stringify({ error: "Vitals data is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const latest = vitals[vitals.length - 1];
    const oldest = vitals[0];

    const systemPrompt = `You are a medical AI health analyst for HealthTrack TeleVitals. Analyze patient vitals data and return structured health predictions.

You MUST respond with valid JSON matching this exact structure:
{
  "score": <number 0-100, higher=healthier>,
  "status": "<healthy|caution|risk>",
  "predictions": [
    {
      "type": "<risk|caution|info>",
      "title": "<short title>",
      "description": "<2-3 sentence clinical analysis>",
      "recommendation": "<actionable medical recommendation>",
      "icon": "<single emoji>"
    }
  ]
}

Rules:
- Score 75-100 = healthy, 50-74 = caution, 0-49 = risk
- Include 2-5 predictions covering the most significant findings
- Always include at least one info/positive prediction if vitals are mostly normal
- Use medical terminology but keep it understandable for patients
- Be specific with numbers from the data
- Add appropriate emoji icons (🫀 heart, 🩺 BP, 🫁 oxygen, 🌡️ temp, 🩸 sugar, 💓 heart rate, ✅ healthy)`;

    const userPrompt = `Analyze these patient vitals:

Patient: ${patientInfo?.name || "Patient"}, Age: ${patientInfo?.age || "Unknown"}, BMI: ${patientInfo?.bmi || "Unknown"}
${patientInfo?.diseases?.length ? `Known conditions: ${patientInfo.diseases.join(", ")}` : "No known conditions"}

Latest vitals (${latest.date}):
- Heart Rate: ${latest.heartRate} BPM
- Blood Pressure: ${latest.systolic}/${latest.diastolic} mmHg
- Oxygen Level: ${latest.oxygenLevel}%
- Temperature: ${latest.temperature}°F
- Blood Sugar: ${latest.bloodSugar} mg/dL

Earliest recorded vitals (${oldest.date}):
- Heart Rate: ${oldest.heartRate} BPM
- Blood Pressure: ${oldest.systolic}/${oldest.diastolic} mmHg
- Oxygen Level: ${oldest.oxygenLevel}%
- Temperature: ${oldest.temperature}°F
- Blood Sugar: ${oldest.bloodSugar} mg/dL

Total readings: ${vitals.length} over ${vitals.length} days.
Trends: BP ${latest.systolic > oldest.systolic ? "rising" : "stable/falling"} (+${latest.systolic - oldest.systolic} mmHg), HR ${latest.heartRate > oldest.heartRate ? "rising" : "stable/falling"}, SpO2 ${latest.oxygenLevel < oldest.oxygenLevel ? "declining" : "stable"}, Sugar ${latest.bloodSugar > oldest.bloodSugar ? "rising" : "stable/falling"}.

Provide a comprehensive health analysis with predictions.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse JSON from the response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    // Add IDs and dates to predictions
    const result = {
      score: parsed.score,
      status: parsed.status,
      predictions: parsed.predictions.map((p: any, i: number) => ({
        id: `ai-pred-${Date.now()}-${i}`,
        type: p.type,
        title: p.title,
        description: p.description,
        recommendation: p.recommendation,
        date: latest.date,
        icon: p.icon || "🔍",
      })),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-vitals error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
