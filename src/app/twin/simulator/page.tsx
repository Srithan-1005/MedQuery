"use client";

import React, { useState } from "react";
import {
  RefreshCw, Sliders, Activity, Heart, Droplets, Brain, TrendingUp,
  TrendingDown, AlertTriangle, CheckCircle2, Info, ArrowRight, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

interface SliderParam {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  step: number;
  normalMin: number;
  normalMax: number;
  icon: React.ReactNode;
  color: string;
}

function computeRiskScore(params: SliderParam[]): { score: number; level: "low" | "moderate" | "high" | "critical"; findings: string[] } {
  let score = 0;
  const findings: string[] = [];

  const get = (key: string) => params.find(p => p.key === key)?.value ?? 0;

  const glucose = get("glucose");
  const bp = get("bp");
  const bmi = get("bmi");
  const cholesterol = get("cholesterol");
  const hr = get("hr");

  if (glucose > 126) { score += 30; findings.push("Fasting glucose ≥126 mg/dL — Diabetic range. High cardiovascular risk."); }
  else if (glucose > 100) { score += 15; findings.push("Fasting glucose 100–125 mg/dL — Prediabetic range. Monitor closely."); }
  else findings.push("Fasting glucose in normal range. ✓");

  if (bp > 140) { score += 25; findings.push("Systolic BP ≥140 mmHg — Stage 2 Hypertension. Medication likely needed."); }
  else if (bp > 130) { score += 12; findings.push("Systolic BP 130–139 mmHg — Stage 1 Hypertension. Lifestyle modification advised."); }
  else findings.push("Blood pressure in normal range. ✓");

  if (bmi > 35) { score += 20; findings.push("BMI ≥35 — Class II Obesity. Significantly elevates metabolic disease risk."); }
  else if (bmi > 30) { score += 12; findings.push("BMI 30–35 — Class I Obesity. Lifestyle intervention recommended."); }
  else if (bmi > 25) { score += 5; findings.push("BMI 25–30 — Overweight. Mild increased risk."); }
  else findings.push("BMI within healthy range. ✓");

  if (cholesterol > 240) { score += 20; findings.push("Total cholesterol ≥240 mg/dL — High. Statin therapy discussion warranted."); }
  else if (cholesterol > 200) { score += 8; findings.push("Total cholesterol 200–239 mg/dL — Borderline high. Dietary changes recommended."); }
  else findings.push("Total cholesterol in healthy range. ✓");

  if (hr > 100) { score += 5; findings.push("Resting heart rate ≥100 bpm — Tachycardia. May indicate stress or thyroid issue."); }
  else if (hr < 50) { score += 3; findings.push("Resting heart rate <50 bpm — Bradycardia. Monitor if symptomatic."); }
  else findings.push("Resting heart rate in normal range. ✓");

  const level = score >= 60 ? "critical" : score >= 35 ? "high" : score >= 15 ? "moderate" : "low";
  return { score: Math.min(100, score), level, findings };
}

const RISK_STYLES = {
  low: { color: "text-green-600 dark:text-green-400", bg: "bg-green-500", label: "Low Risk", ring: "ring-green-200 dark:ring-green-900" },
  moderate: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500", label: "Moderate Risk", ring: "ring-amber-200 dark:ring-amber-900" },
  high: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500", label: "High Risk", ring: "ring-orange-200 dark:ring-orange-900" },
  critical: { color: "text-red-600 dark:text-red-400", bg: "bg-red-500", label: "Critical Risk", ring: "ring-red-200 dark:ring-red-900" },
};

export default function SimulatorPage() {
  const [params, setParams] = useState<SliderParam[]>([
    { key: "glucose", label: "Fasting Glucose", unit: "mg/dL", min: 70, max: 300, value: 98, step: 1, normalMin: 70, normalMax: 99, icon: <Droplets className="h-4 w-4" />, color: "accent-amber-500" },
    { key: "bp", label: "Systolic Blood Pressure", unit: "mmHg", min: 80, max: 200, value: 118, step: 1, normalMin: 90, normalMax: 120, icon: <Activity className="h-4 w-4" />, color: "accent-blue-500" },
    { key: "bmi", label: "Body Mass Index (BMI)", unit: "kg/m²", min: 15, max: 50, value: 23, step: 0.1, normalMin: 18.5, normalMax: 24.9, icon: <TrendingUp className="h-4 w-4" />, color: "accent-teal-500" },
    { key: "cholesterol", label: "Total Cholesterol", unit: "mg/dL", min: 100, max: 350, value: 185, step: 1, normalMin: 0, normalMax: 200, icon: <Heart className="h-4 w-4" />, color: "accent-red-500" },
    { key: "hr", label: "Resting Heart Rate", unit: "bpm", min: 30, max: 150, value: 72, step: 1, normalMin: 60, normalMax: 100, icon: <Brain className="h-4 w-4" />, color: "accent-purple-500" },
  ]);

  const updateParam = (key: string, value: number) => {
    setParams(prev => prev.map(p => p.key === key ? { ...p, value } : p));
  };

  const resetAll = () => setParams(prev => prev.map(p => {
    const defaults: Record<string, number> = { glucose: 98, bp: 118, bmi: 23, cholesterol: 185, hr: 72 };
    return { ...p, value: defaults[p.key] ?? p.value };
  }));

  const { score, level, findings } = computeRiskScore(params);
  const styles = RISK_STYLES[level];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Disease Risk Simulator</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adjust health parameters to see how they affect your risk</p>
              </div>
            </div>
            <button onClick={resetAll} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
              <RefreshCw className="h-4 w-4" /> Reset to Baseline
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT: Sliders */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-6">
                <Sliders className="h-4 w-4" /> Adjust Health Parameters
              </h2>
              <div className="space-y-6">
                {params.map(p => {
                  const isNormal = p.value >= p.normalMin && p.value <= p.normalMax;
                  const pct = ((p.value - p.min) / (p.max - p.min)) * 100;
                  return (
                    <div key={p.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            {p.icon}
                          </div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{p.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black ${isNormal ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                            {p.value}
                          </span>
                          <span className="text-xs text-slate-400">{p.unit}</span>
                          {!isNormal && <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />}
                          {isNormal && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      <input
                        type="range"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={p.value}
                        onChange={e => updateParam(p.key, +e.target.value)}
                        className={`w-full h-2 rounded-full ${p.color} cursor-pointer`}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>{p.min} {p.unit}</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold">Normal: {p.normalMin}–{p.normalMax}</span>
                        <span>{p.max} {p.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Risk Score + Findings */}
          <div className="lg:col-span-5 space-y-5">

            {/* Score Dial */}
            <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center ring-4 ${styles.ring} transition-all`}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Overall Metabolic Risk Score</p>
              <div className="relative inline-flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-36 h-36 -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-slate-800" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={score >= 60 ? "#ef4444" : score >= 35 ? "#f97316" : score >= 15 ? "#f59e0b" : "#22c55e"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 314} 314`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-3xl font-black ${styles.color}`}>{score}</span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <p className={`text-lg font-black mt-3 ${styles.color}`}>{styles.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Based on 5 metabolic markers</p>
            </div>

            {/* Findings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-500" /> AI Risk Analysis
              </h3>
              <div className="space-y-2.5">
                {findings.map((f, i) => {
                  const isOk = f.includes("✓");
                  return (
                    <div key={i} className={`flex items-start gap-2.5 text-sm p-3 rounded-xl ${isOk ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"}`}>
                      {isOk ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
                      <span className="leading-relaxed">{f}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <a
              href="/analyze"
              className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-700 px-5 py-3.5 text-sm font-bold text-white transition"
            >
              <Sparkles className="h-4 w-4" />
              Import From Your Real Report
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
