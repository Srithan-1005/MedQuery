"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, Search, Plus, Activity, Trash2, MessageSquare, ChevronRight, 
  ShieldCheck, AlertTriangle, Calendar, User, Building, ExternalLink, HelpCircle,
  TrendingDown, TrendingUp, RefreshCw, Heart, Eye, Award, CheckCircle2,
  Watch, UserCheck, Flame, Compass, Edit, Clipboard, Smile, ShieldAlert
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { MOCK_REPORTS, MedicalDocument } from "@/utils/mockData";
import { loadReportsFromStorage } from "@/utils/reportStorage";

interface HealthMetric {
  month: string;
  sugar: number;
  systolic: number;
  diastolic: number;
  weight: number;
  heartRate: number;
  oxygen: number;
  sleep: number;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodGroup: string;
  healthScore: number;
  metrics: HealthMetric[];
}

const FAMILY_PROFILES: FamilyMember[] = [
  {
    id: "self",
    name: "John Doe",
    relation: "Self",
    age: 34,
    bloodGroup: "O+",
    healthScore: 78,
    metrics: [
      { month: "Jan", sugar: 180, systolic: 135, diastolic: 88, weight: 82, heartRate: 76, oxygen: 97, sleep: 6.2 },
      { month: "Feb", sugar: 165, systolic: 130, diastolic: 85, weight: 81, heartRate: 74, oxygen: 98, sleep: 6.5 },
      { month: "Mar", sugar: 155, systolic: 128, diastolic: 84, weight: 80, heartRate: 72, oxygen: 98, sleep: 7.0 },
      { month: "Apr", sugar: 140, systolic: 124, diastolic: 82, weight: 79, heartRate: 70, oxygen: 99, sleep: 7.2 },
      { month: "May", sugar: 130, systolic: 122, diastolic: 80, weight: 78, heartRate: 68, oxygen: 99, sleep: 7.4 },
      { month: "Jun", sugar: 120, systolic: 120, diastolic: 80, weight: 77, heartRate: 66, oxygen: 99, sleep: 7.5 }
    ]
  },
  {
    id: "spouse",
    name: "Sarah Doe",
    relation: "Spouse",
    age: 32,
    bloodGroup: "A-",
    healthScore: 88,
    metrics: [
      { month: "Jan", sugar: 105, systolic: 118, diastolic: 78, weight: 64, heartRate: 70, oxygen: 99, sleep: 7.5 },
      { month: "Feb", sugar: 102, systolic: 116, diastolic: 76, weight: 63, heartRate: 68, oxygen: 99, sleep: 7.6 },
      { month: "Mar", sugar: 100, systolic: 115, diastolic: 75, weight: 63, heartRate: 69, oxygen: 99, sleep: 7.8 },
      { month: "Apr", sugar: 98, systolic: 114, diastolic: 75, weight: 62, heartRate: 67, oxygen: 99, sleep: 8.0 },
      { month: "May", sugar: 96, systolic: 112, diastolic: 74, weight: 62, heartRate: 65, oxygen: 99, sleep: 8.1 },
      { month: "Jun", sugar: 95, systolic: 110, diastolic: 72, weight: 61, heartRate: 64, oxygen: 99, sleep: 8.2 }
    ]
  },
  {
    id: "parent",
    name: "Robert Doe",
    relation: "Father",
    age: 65,
    bloodGroup: "O+",
    healthScore: 64,
    metrics: [
      { month: "Jan", sugar: 210, systolic: 145, diastolic: 92, weight: 88, heartRate: 80, oxygen: 95, sleep: 5.5 },
      { month: "Feb", sugar: 198, systolic: 142, diastolic: 90, weight: 87, heartRate: 79, oxygen: 96, sleep: 5.8 },
      { month: "Mar", sugar: 188, systolic: 140, diastolic: 88, weight: 86, heartRate: 77, oxygen: 96, sleep: 6.0 },
      { month: "Apr", sugar: 175, systolic: 138, diastolic: 86, weight: 85, heartRate: 76, oxygen: 97, sleep: 6.2 },
      { month: "May", sugar: 168, systolic: 135, diastolic: 84, weight: 85, heartRate: 74, oxygen: 97, sleep: 6.5 },
      { month: "Jun", sugar: 160, systolic: 132, diastolic: 82, weight: 84, heartRate: 72, oxygen: 97, sleep: 6.8 }
    ]
  }
];

export default function DashboardPage() {
  const [reports, setReports] = useState<MedicalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "lab" | "cardiology" | "mri" | "metabolic">("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showToast, setShowToast] = useState("");
  const [dashboardTab, setDashboardTab] = useState<"health" | "library">("health");

  // Family profile management
  const [activeMember, setActiveMember] = useState<FamilyMember>(FAMILY_PROFILES[0]);

  // Wearable Device Sync States
  const [syncing, setSyncing] = useState(false);
  const [wearableSteps, setWearableSteps] = useState(8420);
  const [wearableHR, setWearableHR] = useState(72);
  const [wearableSpO2, setWearableSpO2] = useState(98);

  // Health Journal Log State
  const [journalMood, setJournalMood] = useState("Good");
  const [journalSleep, setJournalSleep] = useState(7);
  const [journalPain, setJournalPain] = useState(0);
  const [journalMeal, setJournalMeal] = useState("");
  const [journalLogs, setJournalLogs] = useState<any[]>([]);

  // Disease Predictor States
  const [predAge, setPredAge] = useState(35);
  const [predWeight, setPredWeight] = useState(80);
  const [predBP, setPredBP] = useState("130/85");
  const [predSugar, setPredSugar] = useState(140);
  const [predSymptom, setPredSymptom] = useState("None");
  const [predResult, setPredResult] = useState<any>(null);
  const [predRunning, setPredRunning] = useState(false);

  // Load documents
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("medquery-documents");
      if (stored) {
        setReports(JSON.parse(stored));
      } else {
        setReports(MOCK_REPORTS);
        localStorage.setItem("medquery-documents", JSON.stringify(MOCK_REPORTS));
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem("medquery-documents", JSON.stringify(updated));
    setDeleteTarget(null);
    triggerToast("Report permanently deleted and purged from secure vectors.");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3500);
  };

  // Sync wearables simulation
  const handleWearableSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setWearableSteps(10240);
      setWearableHR(68);
      setWearableSpO2(99);
      triggerToast("Wearable health indicators synchronized successfully.");
    }, 1200);
  };

  // Journal log submit
  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      date: new Date().toLocaleDateString(),
      mood: journalMood,
      sleep: journalSleep,
      pain: journalPain,
      meal: journalMeal || "Standard healthy meal"
    };
    setJournalLogs([newLog, ...journalLogs]);
    setJournalMeal("");
    triggerToast("Daily health log saved in secure memory.");
  };

  // Disease Risk Predictor Simulation
  const handlePredictDisease = (e: React.FormEvent) => {
    e.preventDefault();
    setPredRunning(true);
    setTimeout(() => {
      setPredRunning(false);
      
      // Calculate basic risk indicators based on inputs
      let diab = 10;
      let heart = 15;
      let kidney = 8;
      
      if (predSugar > 130) diab += 45;
      if (predSugar > 180) diab += 35;
      const systolic = parseInt(predBP.split("/")[0]) || 120;
      if (systolic > 140) heart += 40;
      if (predAge > 50) { heart += 20; diab += 15; }
      if (predWeight > 90) { heart += 15; diab += 20; }
      
      setPredResult({
        diabetes: Math.min(diab, 95),
        heartDisease: Math.min(heart, 95),
        kidneyDisease: Math.min(kidney + (systolic > 140 ? 25 : 0), 95),
        thyroid: 12,
        liverDisease: 15
      });
      triggerToast("Risk analysis model calculated successfully.");
    }, 1000);
  };

  // Filter reports
  const filteredReports = reports.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.rawText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeFilter === "all" || doc.type === activeFilter;
    return matchesSearch && matchesType;
  });

  const totalReports = reports.length;
  const totalAbnormal = reports.reduce((acc, curr) => acc + curr.abnormalValues.length, 0);

  // SVG Chart points calculations
  const calculateSvgPoints = (data: number[], minVal: number, maxVal: number, width: number, height: number) => {
    const len = data.length;
    const padding = 15;
    const range = maxVal - minVal;
    
    return data.map((val, idx) => {
      const x = padding + (idx * (width - padding * 2)) / (len - 1);
      const normalizedY = range === 0 ? 0.5 : (val - minVal) / range;
      const y = height - padding - normalizedY * (height - padding * 2);
      return `${x},${y}`;
    }).join(" ");
  };

  // Get selected profile metric arrays
  const sugarData = activeMember.metrics.map(m => m.sugar);
  const systolicData = activeMember.metrics.map(m => m.systolic);
  const diastolicData = activeMember.metrics.map(m => m.diastolic);
  const weightData = activeMember.metrics.map(m => m.weight);
  const sleepData = activeMember.metrics.map(m => m.sleep);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-teal-500 text-xs font-semibold px-4.5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-in-right">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-400 dark:text-slate-950 shrink-0" />
            <span>{showToast}</span>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 dark:border-slate-800 pb-6 mb-8 text-left">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Health Metrics & Analytics Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Continuous vitals tracking, AI disease predictors, family health profiles, and wearable integrations.
            </p>
          </div>
          
          {/* Profile Switcher */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
            <UserCheck className="h-4.5 w-4.5 text-teal-650 shrink-0" />
            <select
              value={activeMember.id}
              onChange={(e) => {
                const selected = FAMILY_PROFILES.find(p => p.id === e.target.value);
                if (selected) setActiveMember(selected);
              }}
              className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {FAMILY_PROFILES.map(member => (
                <option key={member.id} value={member.id} className="dark:bg-slate-900">{member.name} ({member.relation})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1 bg-slate-200/65 dark:bg-slate-900 rounded-xl w-fit mb-8">
          <button
            onClick={() => setDashboardTab("health")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dashboardTab === "health" 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Health Vitals & Predictive AI
          </button>
          <button
            onClick={() => setDashboardTab("library")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dashboardTab === "library" 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Report History Library ({totalReports})
          </button>
        </div>

        {/* ================================== TAB 1: VISUAL HEALTH DASHBOARD ================================== */}
        {dashboardTab === "health" && (
          <div className="space-y-8">
            
            {/* Scanned Patient Information Form — Analyzed Recovery & Action Plan */}
            <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-900/10 via-slate-900/40 to-slate-950 p-6 shadow-xl text-left space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-teal-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-2xl shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Scanned Patient Intake Analysis</span>
                    <h2 className="text-lg font-bold text-white">Patient Form Clinical Insights & Recovery Plan</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-red-500/20 border border-red-500/30 text-red-300 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" /> Penicillin & Latex Allergies Confirmed
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Conditions</p>
                  <p className="font-bold text-white text-xs">Type 2 Diabetes, Hypertension, Asthma, Headaches</p>
                  <p className="text-[10px] text-teal-400 pt-1">Grounded in Intake Form [X]</p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Prescriptions</p>
                  <p className="font-bold text-white text-xs">Metformin 500mg, Lisinopril 10mg, Salbutamol 100mcg</p>
                  <p className="text-[10px] text-teal-400 pt-1">3 Prescriptions Active</p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Surgical History</p>
                  <p className="font-bold text-white text-xs">Lumbar Discectomy (2022), Appendectomy (2018)</p>
                  <p className="text-[10px] text-amber-400 pt-1">Residual Back Stiffness</p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Allergen Safety Protocol</p>
                  <p className="font-bold text-red-400 text-xs">Penicillin (Skin Rash) & Latex Reaction</p>
                  <p className="text-[10px] text-red-300 pt-1">Strict Medical Warning</p>
                </div>
              </div>

              {/* Action Plan & Measures to Take */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-teal-500/20 space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Activity className="h-4 w-4" /> Recommended Clinical Action & Recovery Measures
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">1.</span>
                    <span><strong>Glycemic & Blood Pressure Routine</strong>: Take Metformin 500mg BD with meals and Lisinopril 10mg OD. Maintain low-glycemic dietary planning to keep fasting glucose &lt;100 mg/dL.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">2.</span>
                    <span><strong>Allergy Precaution Protocol</strong>: Ensure all clinical staff use synthetic non-latex gloves and avoid Penicillin/Amoxicillin derivatives.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">3.</span>
                    <span><strong>Lumbar Ergonomics & Decompression</strong>: Following your 2022 Lumbar Discectomy, avoid heavy axial lifting (&gt;15 kg) and perform low-impact core stabilizer exercises.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">4.</span>
                    <span><strong>Respiratory & Exertion Management</strong>: Keep Salbutamol inhaler accessible when exercising to relieve exertional asthma wheezing.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Charts Hub */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Metric 1: Blood Sugar Trend */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vitals Tracking</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Fasting Blood Sugar</h3>
                  </div>
                  <span className="text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center gap-0.5">
                    <TrendingDown className="h-4 w-4" /> -33.3%
                  </span>
                </div>
                
                {/* SVG Line Graph */}
                <div className="h-32 bg-slate-50 dark:bg-slate-950/60 rounded-xl relative overflow-hidden flex items-end">
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="3.5"
                      points={calculateSvgPoints(sugarData, 90, 220, 320, 128)}
                    />
                    {/* Render helper gridlines */}
                    <line x1="0" y1="64" x2="350" y2="64" stroke="#94a3b8" strokeDasharray="3,3" opacity="0.15" />
                  </svg>
                  
                  {/* Labels overlay */}
                  <div className="absolute inset-x-0 bottom-1 px-3 flex justify-between text-[9px] font-bold text-slate-400">
                    {activeMember.metrics.map((m, idx) => <span key={idx}>{m.month}</span>)}
                  </div>
                  <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-500 bg-white/70 dark:bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-200/40">
                    Current: {sugarData[sugarData.length - 1]} mg/dL
                  </div>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Fast sugar levels show progressive management. Goal target: &lt;100 mg/dL.
                </p>
              </div>

              {/* Metric 2: Blood Pressure Trend */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vitals Tracking</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Blood Pressure (BP)</h3>
                  </div>
                  <span className="text-teal-650 dark:text-teal-400 text-xs font-bold flex items-center gap-0.5">
                    <TrendingDown className="h-4 w-4" /> Stable
                  </span>
                </div>
                
                {/* SVG BP Graph */}
                <div className="h-32 bg-slate-50 dark:bg-slate-950/60 rounded-xl relative overflow-hidden flex items-end">
                  <svg className="w-full h-full">
                    {/* Systolic Line */}
                    <polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      points={calculateSvgPoints(systolicData, 100, 150, 320, 128)}
                    />
                    {/* Diastolic Line */}
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      points={calculateSvgPoints(diastolicData, 60, 100, 320, 128)}
                    />
                  </svg>
                  
                  {/* Labels overlay */}
                  <div className="absolute inset-x-0 bottom-1 px-3 flex justify-between text-[9px] font-bold text-slate-400">
                    {activeMember.metrics.map((m, idx) => <span key={idx}>{m.month}</span>)}
                  </div>
                  <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-550 bg-white/70 dark:bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-200/40">
                    Current: {systolicData[systolicData.length - 1]}/{diastolicData[diastolicData.length - 1]} mmHg
                  </div>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Systolic (Red) and Diastolic (Blue) readings indicate controlled normotensive trends.
                </p>
              </div>

              {/* Metric 3: Weight & Sleep Vitals */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vitals Tracking</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Weight & Sleep Duration</h3>
                  </div>
                  <span className="text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center gap-0.5">
                    <TrendingUp className="h-4 w-4" /> Sleep Improvement
                  </span>
                </div>
                
                {/* SVG sleep/weight trend */}
                <div className="h-32 bg-slate-50 dark:bg-slate-950/60 rounded-xl relative overflow-hidden flex items-end">
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                      points={calculateSvgPoints(weightData, 50, 100, 320, 128)}
                    />
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      points={calculateSvgPoints(sleepData, 4, 9, 320, 128)}
                    />
                  </svg>
                  
                  <div className="absolute inset-x-0 bottom-1 px-3 flex justify-between text-[9px] font-bold text-slate-400">
                    {activeMember.metrics.map((m, idx) => <span key={idx}>{m.month}</span>)}
                  </div>
                  <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-550 bg-white/70 dark:bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-200/40">
                    Weight: {weightData[weightData.length - 1]}kg | Sleep: {sleepData[sleepData.length - 1]}hr
                  </div>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Weight (Purple) exhibits progressive decay. Daily sleep hours (Orange) are optimized.
                </p>
              </div>

            </div>

            {/* Score & Disease Risk & Wearable Integration Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Health Score, Wearables Sync, Coach (cols-5) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* AI Health Risk Score Card */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Award className="h-5 w-5 text-teal-650" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Health Risk Score</h3>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Ring gauge */}
                    <div className="relative h-20 w-20 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="8" fill="transparent" className="dark:stroke-slate-800" />
                        <circle 
                          cx="40" cy="40" r="32" 
                          stroke="#0d9488" strokeWidth="8" fill="transparent" 
                          strokeDasharray={200}
                          strokeDashoffset={200 - (200 * activeMember.healthScore) / 100}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-slate-800 dark:text-white">
                        {activeMember.healthScore}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded">
                        {activeMember.healthScore >= 75 ? "Optimal Condition" : "Action Recommended"}
                      </span>
                      <p className="text-xs text-slate-650 dark:text-slate-350 mt-1 leading-relaxed">
                        Calculated from active BMI ({Math.round(activeMember.metrics[activeMember.metrics.length - 1].weight / 1.78**2)}), average sleep ({activeMember.metrics[activeMember.metrics.length - 1].sleep} hrs), blood pressure control, and non-smoking history.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wearable Sync Panel */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Watch className="h-5 w-5 text-teal-650" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Wearable Sync Hub</h3>
                    </div>
                    
                    <button
                      onClick={handleWearableSync}
                      disabled={syncing}
                      className="text-[10px] font-bold text-teal-650 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {syncing ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                      {syncing ? "Syncing..." : "Sync Now"}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Daily Steps", val: wearableSteps.toLocaleString(), sub: "Goal: 10k", icon: <Flame className="h-4.5 w-4.5 text-orange-500" /> },
                      { label: "Heart Rate", val: `${wearableHR} bpm`, sub: "Resting: 60", icon: <Heart className="h-4.5 w-4.5 text-red-500" /> },
                      { label: "SpO₂ Level", val: `${wearableSpO2}%`, sub: "Standard: 95+", icon: <ShieldCheck className="h-4.5 w-4.5 text-teal-550" /> }
                    ].map((w, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-center space-y-1">
                        <div className="mx-auto w-fit p-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded">{w.icon}</div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">{w.label}</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{w.val}</p>
                        <p className="text-[8px] text-slate-400 leading-none">{w.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Health Coach & Preventive Care */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Compass className="h-5 w-5 text-teal-650" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Health Coach & Screenings</h3>
                  </div>

                  <div className="space-y-3.5 text-xs leading-relaxed">
                    <div className="p-3 bg-teal-500/5 rounded-xl border border-teal-500/10">
                      <p className="font-bold text-teal-650 dark:text-teal-400">⚡ Coach Tip of the Week</p>
                      <p className="text-slate-650 dark:text-slate-350 mt-1">
                        Based on your daddy's Type 2 Diabetes history, maintaining an active 30-minute cardio protocol keeps insulin receptors sensitive and controls your borderline CMP panel.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preventative Screenings Recommendations</p>
                      {[
                        { test: "Glycated Hemoglobin (HbA1c)", freq: "Annually", why: "Due to pre-diabetes markers and paternal history." },
                        { test: "Lipid Profile Panel", freq: "Every 2 Years", why: "Assesses cardiac risk indices over 30." },
                        { test: "Annual Comprehensive Eye Exam", freq: "Annually", why: "Monitors microvascular retinal health." }
                      ].map((scr, idx) => (
                        <div key={idx} className="border-l-2 border-teal-500 pl-3 py-0.5 space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-white">{scr.test} ({scr.freq})</p>
                          <p className="text-[10px] text-slate-500">{scr.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT: Disease Risk Predictor Form & Health Journal Logs (cols-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Disease Risk Predictor Form */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-teal-650" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Disease Risk Predictor</h3>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded">
                      Estimation Only
                    </span>
                  </div>

                  <form onSubmit={handlePredictDisease} className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Age</label>
                      <input 
                        type="number" 
                        value={predAge} 
                        onChange={(e) => setPredAge(parseInt(e.target.value) || 30)}
                        className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Weight (kg)</label>
                      <input 
                        type="number" 
                        value={predWeight} 
                        onChange={(e) => setPredWeight(parseInt(e.target.value) || 75)}
                        className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Blood Pressure (mmHg)</label>
                      <input 
                        type="text" 
                        value={predBP} 
                        onChange={(e) => setPredBP(e.target.value)}
                        className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Blood Sugar (mg/dL)</label>
                      <input 
                        type="number" 
                        value={predSugar} 
                        onChange={(e) => setPredSugar(parseInt(e.target.value) || 100)}
                        className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Symptoms</label>
                      <input 
                        type="text" 
                        value={predSymptom} 
                        onChange={(e) => setPredSymptom(e.target.value)}
                        placeholder="e.g. constant fatigue, excessive thirst, joint soreness"
                        className="w-full rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={predRunning}
                      className="sm:col-span-2 rounded-xl bg-teal-650 hover:bg-teal-700 py-2.5 text-xs font-bold text-white transition-all shadow cursor-pointer disabled:opacity-50"
                    >
                      {predRunning ? "Analyzing Clinical Variables..." : "Run AI Risk Estimation"}
                    </button>
                  </form>

                  {/* Prediction Output Results */}
                  {predResult && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3.5 animate-fade-in">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calculated Risk Estimation</h4>
                      
                      <div className="space-y-2.5">
                        {[
                          { name: "Type 2 Diabetes", val: predResult.diabetes, color: "bg-teal-500" },
                          { name: "Heart Disease", val: predResult.heartDisease, color: "bg-red-500" },
                          { name: "Kidney Disease", val: predResult.kidneyDisease, color: "bg-orange-500" },
                          { name: "Thyroid Anomalies", val: predResult.thyroid, color: "bg-blue-500" },
                          { name: "Liver Condition", val: predResult.liverDisease, color: "bg-indigo-500" }
                        ].map((risk, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              <span>{risk.name}</span>
                              <span>{risk.val}% Risk</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div className={`h-full ${risk.color}`} style={{ width: `${risk.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Daily Health Journal Logs */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Clipboard className="h-5 w-5 text-teal-650" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Health Journal</h3>
                  </div>

                  <form onSubmit={handleJournalSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-slate-400">Mood</label>
                        <select
                          value={journalMood}
                          onChange={(e) => setJournalMood(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs focus:outline-none"
                        >
                          <option value="Excellent">😄 Great</option>
                          <option value="Good">🙂 Good</option>
                          <option value="Tired">😴 Tired</option>
                          <option value="Sore">🤕 Sore</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-slate-400">Sleep (hrs)</label>
                        <input 
                          type="number" 
                          min={2} max={16}
                          value={journalSleep}
                          onChange={(e) => setJournalSleep(parseInt(e.target.value) || 7)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-slate-400">Pain Scale (0-10)</label>
                        <input 
                          type="number" 
                          min={0} max={10}
                          value={journalPain}
                          onChange={(e) => setJournalPain(parseInt(e.target.value) || 0)}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Meals logged today</label>
                      <input 
                        type="text" 
                        value={journalMeal}
                        onChange={(e) => setJournalMeal(e.target.value)}
                        placeholder="e.g. oatmeal for breakfast, chicken rice lunch"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-950 py-2.5 text-xs font-bold transition-all cursor-pointer"
                    >
                      Save Journal Entry
                    </button>
                  </form>

                  {/* Display list of journal logs */}
                  {journalLogs.length > 0 && (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pt-2 border-t border-slate-105 dark:border-slate-800">
                      {journalLogs.map((log, lIdx) => (
                        <div key={lIdx} className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg text-[10px] leading-relaxed flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-750 dark:text-slate-300">Mood: {log.mood} | Sleep: {log.sleep}h | Pain: {log.pain}/10</p>
                            <p className="text-slate-400">{log.meal}</p>
                          </div>
                          <span className="text-[9px] font-semibold text-slate-400 shrink-0">{log.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================================== TAB 2: ORIGINAL REPORT HISTORY ================================== */}
        {dashboardTab === "library" && (
          <div className="space-y-6">
            
            {/* SEARCH & FILTER HUB */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-left">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search across reports, conditions, clinics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {[
                  { id: "all", name: "All Records" },
                  { id: "lab", name: "Hematology" },
                  { id: "cardiology", name: "Cardio Echo" },
                  { id: "mri", name: "Knee MRI" },
                  { id: "metabolic", name: "CMP Panel" }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors uppercase cursor-pointer ${
                      activeFilter === f.id
                        ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold"
                        : "text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* DOCUMENT LIST VIEW */}
            {filteredReports.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-12 text-center shadow-sm">
                <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">No matching records found</h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  We couldn't locate any documents fitting the search terms. Adjust keywords or upload a new scan.
                </p>
                <Link
                  href="/analyze"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-650 hover:bg-teal-700 text-white font-bold px-4 py-2.5 text-xs cursor-pointer shadow"
                >
                  Analyze Your First Report
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredReports.map((report) => (
                  <div 
                    key={report.id}
                    className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col text-left justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                            <FileText className="h-5 w-5 text-teal-605" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                              {report.title}
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {report.date}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-lg bg-teal-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                          {report.type}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <Building className="h-3 w-3" /> {report.clinic} • {report.doctor}
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 line-clamp-2">
                          {report.summary}
                        </p>
                      </div>

                      {/* Abnormal Markers alerts list */}
                      {report.abnormalValues.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {report.abnormalValues.map((ab, idx) => (
                            <span 
                              key={idx} 
                              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border ${
                                ab.status === "high" 
                                  ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/15" 
                                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/15"
                              }`}
                            >
                              <AlertTriangle className="h-2.5 w-2.5" />
                              {ab.marker}: {ab.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2.5 pt-4 mt-4 border-t border-slate-200/50 dark:border-slate-800/60 shrink-0">
                      <Link
                        href={`/report/${report.id}`}
                        className="flex-1 text-center rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 py-2.5 text-[11px] font-bold text-slate-700 dark:text-slate-250 border border-slate-200 dark:border-slate-850 transition-colors"
                      >
                        Interpret Report
                      </Link>
                      
                      <Link
                        href={`/chat?id=${report.id}`}
                        className="flex-1 text-center rounded-xl bg-teal-650 hover:bg-teal-700 py-2.5 text-[11px] font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-1"
                      >
                        Discuss <MessageSquare className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(report.id)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-red-550 hover:text-white dark:hover:bg-red-950/40 text-slate-400 hover:border-red-500 transition-colors cursor-pointer"
                        title="Delete Permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 animate-scale-in text-left">
            <div className="flex items-center gap-3 text-red-650 dark:text-red-400">
              <ShieldAlert className="h-6 w-6 shrink-0" />
              <h3 className="text-sm font-bold">Purge Document Vector?</h3>
            </div>
            
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              This action completely expunges the file's raw text and clinical summary from localStorage, indices, and active RAG prompts. This cannot be undone.
            </p>

            <div className="flex gap-3.5 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Delete & Purge
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
