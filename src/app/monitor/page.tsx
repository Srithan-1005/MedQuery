"use client";

import React, { useState, useEffect } from "react";
import { Activity, Heart, Droplets, Wind, Thermometer, RefreshCw, TrendingUp, TrendingDown, Minus, Clock, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

interface Vital {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  icon: React.ReactNode;
  color: string;
  history: { time: string; val: number }[];
}

function randomInRange(min: number, max: number) {
  return +(min + Math.random() * (max - min)).toFixed(1);
}

const makeHistory = (base: number, spread: number, count = 10) =>
  Array.from({ length: count }, (_, i) => ({
    time: `${(count - 1 - i) * 6}m ago`,
    val: +(base + (Math.random() - 0.5) * spread).toFixed(1),
  }));

const INITIAL_VITALS: Vital[] = [
  { id: "hr", label: "Heart Rate", value: 72, unit: "bpm", min: 40, max: 180, normalMin: 60, normalMax: 100, icon: <Heart className="h-5 w-5" />, color: "text-red-500", history: makeHistory(72, 8) },
  { id: "bp", label: "Systolic BP", value: 118, unit: "mmHg", min: 80, max: 200, normalMin: 90, normalMax: 120, icon: <Activity className="h-5 w-5" />, color: "text-blue-500", history: makeHistory(118, 10) },
  { id: "spo2", label: "Oxygen Saturation", value: 98, unit: "%", min: 85, max: 100, normalMin: 95, normalMax: 100, icon: <Wind className="h-5 w-5" />, color: "text-teal-500", history: makeHistory(98, 2) },
  { id: "glucose", label: "Blood Glucose", value: 96, unit: "mg/dL", min: 50, max: 250, normalMin: 70, normalMax: 99, icon: <Droplets className="h-5 w-5" />, color: "text-amber-500", history: makeHistory(96, 12) },
  { id: "temp", label: "Body Temperature", value: 98.6, unit: "°F", min: 95, max: 104, normalMin: 97, normalMax: 99, icon: <Thermometer className="h-5 w-5" />, color: "text-orange-500", history: makeHistory(98.6, 0.6) },
];

function GaugeArc({ value, min, max, normalMin, normalMax, color }: { value: number; min: number; max: number; normalMin: number; normalMax: number; color: string }) {
  const pct = (value - min) / (max - min);
  const angle = -135 + pct * 270;
  const normalPctMin = (normalMin - min) / (max - min);
  const normalPctMax = (normalMax - min) / (max - min);
  const toXY = (pct: number, r: number) => {
    const a = ((-135 + pct * 270) * Math.PI) / 180;
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  };
  const arcPath = (r: number, p1: number, p2: number) => {
    const s = toXY(p1, r), e = toXY(p2, r);
    const large = (p2 - p1) * 270 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const needle = toXY(pct, 30);
  const isNormal = value >= normalMin && value <= normalMax;
  return (
    <svg viewBox="0 0 100 70" className="w-full max-w-[140px] mx-auto">
      <path d={arcPath(40, 0, 1)} fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" className="dark:stroke-slate-700" />
      <path d={arcPath(40, normalPctMin, normalPctMax)} fill="none" stroke="#5eead4" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="50" x2={needle.x} y2={needle.y} stroke={isNormal ? "#0d9488" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" fill={isNormal ? "#0d9488" : "#ef4444"} />
    </svg>
  );
}

export default function MonitorPage() {
  const [vitals, setVitals] = useState(INITIAL_VITALS);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setVitals(prev => prev.map(v => {
        const newVal = +Math.max(v.min, Math.min(v.max, v.value + (Math.random() - 0.5) * (v.max - v.min) * 0.03)).toFixed(1);
        const newHistory = [...v.history.slice(1), { time: "now", val: newVal }];
        return { ...v, value: newVal, history: newHistory };
      }));
      setTick(t => t + 1);
      setLastUpdated("Just now");
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive]);

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
                <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Health Monitor</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`h-2 w-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-slate-300 dark:bg-slate-600"}`} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isLive ? `Live streaming — updated ${lastUpdated}` : "Paused — press Start to stream vitals"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                <Clock className="h-4 w-4" /> {new Date().toLocaleTimeString()}
              </div>
              <button
                onClick={() => setIsLive(l => !l)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition cursor-pointer ${
                  isLive
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
              >
                <Zap className="h-4 w-4" />
                {isLive ? "Stop Stream" : "Start Live Stream"}
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-2xl">
            Simulated real-time vital sign monitoring. In production, this connects to wearable devices or IoT health sensors for continuous tracking.
          </p>
        </div>

        {/* Vitals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {vitals.map(v => {
            const isNormal = v.value >= v.normalMin && v.value <= v.normalMax;
            const prev = v.history[v.history.length - 2]?.val || v.value;
            const trend = v.value > prev ? "up" : v.value < prev ? "down" : "stable";
            return (
              <div
                key={v.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 transition-all hover:shadow-md ${
                  isNormal
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${v.color}`}>
                    {v.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight">{v.label}</span>
                </div>

                <GaugeArc value={v.value} min={v.min} max={v.max} normalMin={v.normalMin} normalMax={v.normalMax} color={v.color} />

                <div className="text-center mt-2">
                  <span className={`text-2xl font-black ${isNormal ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                    {v.value}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">{v.unit}</span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isNormal ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  }`}>
                    {isNormal ? "Normal" : "Alert"}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-slate-400">
                    {trend === "up" ? <TrendingUp className="h-3.5 w-3.5 text-red-400" /> : trend === "down" ? <TrendingDown className="h-3.5 w-3.5 text-teal-400" /> : <Minus className="h-3.5 w-3.5" />}
                  </span>
                </div>

                {/* Mini bar history */}
                <div className="flex items-end gap-0.5 h-6 mt-3">
                  {v.history.map((h, i) => {
                    const pct = (h.val - v.min) / (v.max - v.min);
                    const ok = h.val >= v.normalMin && h.val <= v.normalMax;
                    return (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${Math.max(10, pct * 100)}%`, backgroundColor: ok ? "#0d9488" : "#ef4444", opacity: 0.6 + i * 0.04 }} />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 text-teal-600 ${isLive ? "animate-spin" : ""}`} />
            Vital History (last 10 readings)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-2 font-bold text-xs uppercase tracking-wider text-slate-400 pr-4">Vital</th>
                  {vitals[0].history.map((h, i) => (
                    <th key={i} className="pb-2 font-semibold text-[10px] text-slate-400 text-center px-1">{h.time}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vitals.map(v => (
                  <tr key={v.id}>
                    <td className="py-2.5 font-semibold text-slate-700 dark:text-slate-300 pr-4 whitespace-nowrap text-xs">{v.label}</td>
                    {v.history.map((h, i) => {
                      const ok = h.val >= v.normalMin && h.val <= v.normalMax;
                      return (
                        <td key={i} className={`py-2.5 text-center text-xs font-bold px-1 ${ok ? "text-slate-700 dark:text-slate-300" : "text-red-500 dark:text-red-400"}`}>
                          {h.val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
