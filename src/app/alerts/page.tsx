"use client";

import React, { useState } from "react";
import { Bell, AlertTriangle, CheckCircle2, Info, Wind, Pill, Droplets, Activity, X, Plus, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

type AlertSeverity = "critical" | "warning" | "info" | "resolved";

interface HealthAlert {
  id: string;
  title: string;
  body: string;
  time: string;
  severity: AlertSeverity;
  category: "lab" | "air" | "medication" | "lifestyle";
  icon: React.ReactNode;
  dismissed: boolean;
}

const INITIAL_ALERTS: HealthAlert[] = [
  {
    id: "a1",
    title: "Low Hemoglobin Detected",
    body: "Your recent CBC report shows Hemoglobin at 9.0 g/dL — below the healthy range of 12–16 g/dL. Iron deficiency anemia is likely. Schedule a follow-up within 2 weeks.",
    time: "2 hours ago",
    severity: "critical",
    category: "lab",
    icon: <Droplets className="h-5 w-5" />,
    dismissed: false,
  },
  {
    id: "a2",
    title: "Air Quality: Moderate Risk",
    body: "Current AQI in your area is 145 (Unhealthy for Sensitive Groups). Individuals with respiratory conditions should limit outdoor activity between 12–4 PM today.",
    time: "4 hours ago",
    severity: "warning",
    category: "air",
    icon: <Wind className="h-5 w-5" />,
    dismissed: false,
  },
  {
    id: "a3",
    title: "Medication Reminder: Amlodipine",
    body: "You have not logged today's morning dose of Amlodipine 5mg. Consistent dosing is critical for blood pressure management. Take with water, preferably before 10 AM.",
    time: "6 hours ago",
    severity: "warning",
    category: "medication",
    icon: <Pill className="h-5 w-5" />,
    dismissed: false,
  },
  {
    id: "a4",
    title: "Elevated Fasting Glucose Trend",
    body: "Your fasting glucose values over the last 3 readings average 118 mg/dL — prediabetic range. Consider reducing refined carbohydrates and increasing fiber intake.",
    time: "Yesterday",
    severity: "warning",
    category: "lab",
    icon: <Activity className="h-5 w-5" />,
    dismissed: false,
  },
  {
    id: "a5",
    title: "Hydration Reminder",
    body: "You've logged less than 1.2L of water today. Adequate hydration supports kidney health, especially when iron supplements are active.",
    time: "Yesterday",
    severity: "info",
    category: "lifestyle",
    icon: <Info className="h-5 w-5" />,
    dismissed: false,
  },
  {
    id: "a6",
    title: "HbA1c Improved — Great Work!",
    body: "Your latest HbA1c is 5.8%, down from 6.4% three months ago. This is now within the normal range. Continue your current diet and exercise regimen.",
    time: "3 days ago",
    severity: "resolved",
    category: "lab",
    icon: <CheckCircle2 className="h-5 w-5" />,
    dismissed: false,
  },
];

const SEVERITY_STYLES: Record<AlertSeverity, { border: string; bg: string; badge: string; icon: string }> = {
  critical: {
    border: "border-red-200 dark:border-red-900/40",
    bg: "bg-red-50 dark:bg-red-950/20",
    badge: "bg-red-500/10 text-red-700 dark:text-red-400",
    icon: "text-red-500",
  },
  warning: {
    border: "border-amber-200 dark:border-amber-900/40",
    bg: "bg-amber-50/50 dark:bg-amber-950/10",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: "text-amber-500",
  },
  info: {
    border: "border-blue-200 dark:border-blue-900/40",
    bg: "bg-blue-50/50 dark:bg-blue-950/10",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    icon: "text-blue-500",
  },
  resolved: {
    border: "border-green-200 dark:border-green-900/40",
    bg: "bg-green-50/30 dark:bg-green-950/10",
    badge: "bg-green-500/10 text-green-700 dark:text-green-400",
    icon: "text-green-500",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  lab: "Lab Results",
  air: "Air Quality",
  medication: "Medication",
  lifestyle: "Lifestyle",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState<"all" | AlertSeverity | string>("all");

  const dismiss = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const visible = alerts.filter(a => {
    if (a.dismissed) return false;
    if (filter === "all") return true;
    if (["critical", "warning", "info", "resolved"].includes(filter)) return a.severity === filter;
    return a.category === filter;
  });

  const criticalCount = alerts.filter(a => !a.dismissed && a.severity === "critical").length;
  const warningCount = alerts.filter(a => !a.dismissed && a.severity === "warning").length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                {criticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                    {criticalCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Health Alerts</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {criticalCount > 0 && <span className="text-red-500 font-semibold">{criticalCount} critical • </span>}
                  {warningCount} warnings • {alerts.filter(a => !a.dismissed && a.severity === "resolved").length} resolved
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-xl border border-dashed border-teal-400 dark:border-teal-700 px-4 py-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition cursor-pointer">
              <Plus className="h-4 w-4" /> Add Custom Alert
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Critical", count: alerts.filter(a => !a.dismissed && a.severity === "critical").length, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20", icon: <AlertTriangle className="h-5 w-5 text-red-500" /> },
            { label: "Warnings", count: alerts.filter(a => !a.dismissed && a.severity === "warning").length, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20", icon: <Bell className="h-5 w-5 text-amber-500" /> },
            { label: "Info", count: alerts.filter(a => !a.dismissed && a.severity === "info").length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20", icon: <Info className="h-5 w-5 text-blue-500" /> },
            { label: "Resolved", count: alerts.filter(a => !a.dismissed && a.severity === "resolved").length, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20", icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border border-slate-200 dark:border-slate-800 ${s.bg} p-4 flex items-center gap-3`}>
              {s.icon}
              <div>
                <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "critical", "warning", "info", "resolved", "lab", "air", "medication", "lifestyle"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                filter === f
                  ? "bg-teal-600 text-white"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-teal-400"
              }`}
            >
              {f === "all" ? "All Alerts" : CATEGORY_LABELS[f] || f}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="space-y-3">
          {visible.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-600">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold">No alerts in this category</p>
            </div>
          ) : (
            visible.map(alert => {
              const s = SEVERITY_STYLES[alert.severity];
              return (
                <div key={alert.id} className={`rounded-2xl border ${s.border} ${s.bg} p-5 flex items-start gap-4 transition-all hover:shadow-sm`}>
                  <div className={`h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 ${s.icon}`}>
                    {alert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${s.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {CATEGORY_LABELS[alert.category]}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 ml-auto">
                        <Clock className="h-3 w-3" /> {alert.time}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{alert.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{alert.body}</p>
                  </div>
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition cursor-pointer shrink-0 mt-1"
                    title="Dismiss alert"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
