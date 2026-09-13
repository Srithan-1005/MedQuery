"use client";

import React, { useState, useEffect } from "react";
import { 
  Dna, Heart, Activity, Droplets, Wind, TrendingUp, TrendingDown,
  Minus, Calendar, User, Edit3, Save, X, Plus, CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

interface HealthMetric {
  key: string;
  label: string;
  value: string;
  unit: string;
  status: "normal" | "high" | "low";
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
  history: number[];
}

const DEFAULT_METRICS: HealthMetric[] = [
  { key: "heartrate", label: "Heart Rate", value: "72", unit: "bpm", status: "normal", trend: "stable", icon: <Heart className="h-5 w-5" />, history: [68, 71, 75, 73, 69, 72, 72] },
  { key: "bp", label: "Blood Pressure", value: "118/76", unit: "mmHg", status: "normal", trend: "stable", icon: <Activity className="h-5 w-5" />, history: [120, 122, 118, 116, 120, 118, 118] },
  { key: "glucose", label: "Blood Glucose", value: "98", unit: "mg/dL", status: "normal", trend: "down", icon: <Droplets className="h-5 w-5" />, history: [115, 110, 108, 103, 100, 99, 98] },
  { key: "oxygen", label: "Oxygen Saturation", value: "98", unit: "%", status: "normal", trend: "stable", icon: <Wind className="h-5 w-5" />, history: [97, 98, 98, 99, 98, 98, 98] },
  { key: "weight", label: "Body Weight", value: "72.5", unit: "kg", status: "normal", trend: "down", icon: <User className="h-5 w-5" />, history: [75, 74.5, 74, 73.5, 73, 72.8, 72.5] },
  { key: "hba1c", label: "HbA1c", value: "5.8", unit: "%", status: "low", trend: "down", icon: <Dna className="h-5 w-5" />, history: [6.4, 6.2, 6.1, 6.0, 5.9, 5.9, 5.8] },
];

const CONDITIONS = [
  { label: "Pre-diabetes", active: true, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  { label: "Mild Hypertension", active: false, color: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
  { label: "Iron Deficiency", active: true, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
];

const TIMELINE = [
  { date: "Jul 15, 2026", event: "CBC Blood Test", type: "lab", note: "Hemoglobin 11.2 g/dL — Low" },
  { date: "Jun 28, 2026", event: "Cardiology Consultation", type: "visit", note: "BP managed — continue Amlodipine" },
  { date: "May 10, 2026", event: "HbA1c Test", type: "lab", note: "6.4% — borderline high" },
  { date: "Apr 2, 2026", event: "Vaccination — Flu Shot", type: "vaccine", note: "Annual influenza immunization completed" },
];

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-teal-500" />;
  return <Minus className="h-4 w-4 text-slate-400" />;
}

function MiniSparkline({ history }: { history: number[] }) {
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const w = 64, h = 28;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TwinPage() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [profileName, setProfileName] = useState("Your Health Profile");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const saveEdit = (key: string) => {
    setMetrics(prev => prev.map(m => m.key === key ? { ...m, value: editValue } : m));
    setEditingMetric(null);
  };

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
                <Dna className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="text-xl font-bold bg-transparent border-b border-teal-500 outline-none text-slate-900 dark:text-white"
                    autoFocus
                  />
                  <button onClick={() => { setProfileName(nameInput); setEditingName(false); }} className="text-teal-600 cursor-pointer"><Save className="h-4 w-4" /></button>
                  <button onClick={() => setEditingName(false)} className="text-slate-400 cursor-pointer"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profileName}</h1>
                  <button onClick={() => { setNameInput(profileName); setEditingName(true); }} className="text-slate-400 hover:text-teal-600 cursor-pointer"><Edit3 className="h-4 w-4" /></button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
              <Calendar className="h-4 w-4" /> Last updated: July 26, 2026
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Your secure AI-powered health digital twin. Update your metrics manually or import from reports. Edit any value to keep your profile current.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">

          {/* Metrics Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {metrics.map(m => (
                <div key={m.key} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        {m.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.label}</span>
                    </div>
                    <TrendIcon trend={m.trend} />
                  </div>

                  {editingMetric === m.key ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="w-full rounded-lg border border-teal-500 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 text-base font-bold text-teal-700 dark:text-teal-300 outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(m.key)} className="text-teal-600 cursor-pointer"><Save className="h-4 w-4" /></button>
                      <button onClick={() => setEditingMetric(null)} className="text-slate-400 cursor-pointer"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{m.value}</span>
                        <span className="text-xs text-slate-400 ml-1">{m.unit}</span>
                      </div>
                      <button
                        onClick={() => { setEditingMetric(m.key); setEditValue(m.value); }}
                        className="text-slate-300 hover:text-teal-500 transition cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="mt-3">
                    <MiniSparkline history={m.history} />
                    <p className="text-[10px] text-slate-400 mt-1">Last 7 readings</p>
                  </div>

                  <div className="mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      m.status === "normal" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : m.status === "high" ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                    }`}>
                      {m.status === "normal" ? "✓ Normal" : m.status === "high" ? "↑ High" : "↓ Low"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div className="lg:col-span-4 space-y-5">

            {/* Known Conditions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Known Conditions</h3>
              <div className="space-y-2">
                {CONDITIONS.map((c, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${c.color}`}>
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    {c.label}
                    {c.active && <span className="ml-auto opacity-60 text-[9px] uppercase tracking-wider">Active</span>}
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-teal-600 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl transition cursor-pointer">
                  <Plus className="h-3.5 w-3.5" /> Add Condition
                </button>
              </div>
            </div>

            {/* Medical Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Medical Timeline</h3>
              <div className="space-y-3 relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
                {TIMELINE.map((ev, i) => (
                  <div key={i} className="pl-9 relative">
                    <div className={`absolute left-2.5 top-2 h-3 w-3 rounded-full border-2 ${
                      ev.type === "lab" ? "bg-blue-500 border-blue-300"
                      : ev.type === "vaccine" ? "bg-green-500 border-green-300"
                      : "bg-teal-500 border-teal-300"
                    }`} />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{ev.event}</p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400">{ev.date}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ev.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
