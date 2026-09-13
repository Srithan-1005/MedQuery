"use client";

import React, { useState } from "react";
import {
  RefreshCw, Plus, Calendar, ChevronDown, ChevronUp, CheckCircle2,
  Circle, AlertCircle, Smile, Meh, Frown, Save, X, TrendingUp, Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

interface JournalEntry {
  id: string;
  date: string;
  painLevel: number;
  energy: number;
  mood: "good" | "neutral" | "bad";
  symptoms: string[];
  notes: string;
  tasks: { label: string; done: boolean }[];
}

const DEFAULT_ENTRIES: JournalEntry[] = [
  {
    id: "j1", date: "Jul 26, 2026", painLevel: 3, energy: 6, mood: "neutral",
    symptoms: ["Mild fatigue", "Slight soreness at incision site"],
    notes: "Walked 15 minutes in the morning. Took Amlodipine on time.",
    tasks: [
      { label: "Morning walk (15 min)", done: true },
      { label: "Take morning medication", done: true },
      { label: "Ice pack on incision site", done: false },
      { label: "Physiotherapy exercises (10 reps)", done: false },
    ],
  },
  {
    id: "j2", date: "Jul 25, 2026", painLevel: 4, energy: 5, mood: "bad",
    symptoms: ["Fatigue", "Swelling around knee", "Low appetite"],
    notes: "Difficult day. Swelling was worse in the afternoon. Rested more than planned.",
    tasks: [
      { label: "Morning walk (15 min)", done: false },
      { label: "Take morning medication", done: true },
      { label: "Ice pack on incision site", done: true },
      { label: "Physiotherapy exercises (10 reps)", done: false },
    ],
  },
  {
    id: "j3", date: "Jul 24, 2026", painLevel: 5, energy: 4, mood: "bad",
    symptoms: ["High pain levels", "Nausea", "Difficulty sleeping"],
    notes: "First day home post-surgery. Pain was significant. Doctor advised it is normal — take prescribed analgesics.",
    tasks: [
      { label: "Morning walk (15 min)", done: false },
      { label: "Take morning medication", done: true },
      { label: "Ice pack on incision site", done: true },
      { label: "Physiotherapy exercises (10 reps)", done: false },
    ],
  },
];

function MoodIcon({ mood, size = 5 }: { mood: string; size?: number }) {
  if (mood === "good") return <Smile className={`h-${size} w-${size} text-green-500`} />;
  if (mood === "bad") return <Frown className={`h-${size} w-${size} text-red-500`} />;
  return <Meh className={`h-${size} w-${size} text-amber-500`} />;
}

export default function RecoveryPage() {
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [expandedId, setExpandedId] = useState<string | null>("j1");
  const [showAdd, setShowAdd] = useState(false);

  // New entry form state
  const [newPain, setNewPain] = useState(3);
  const [newEnergy, setNewEnergy] = useState(5);
  const [newMood, setNewMood] = useState<"good" | "neutral" | "bad">("neutral");
  const [newSymptoms, setNewSymptoms] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const toggleTask = (entryId: string, taskIdx: number) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== entryId) return e;
      const tasks = e.tasks.map((t, i) => i === taskIdx ? { ...t, done: !t.done } : t);
      return { ...e, tasks };
    }));
  };

  const addEntry = () => {
    const newEntry: JournalEntry = {
      id: "j" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      painLevel: newPain,
      energy: newEnergy,
      mood: newMood,
      symptoms: newSymptoms.split(",").map(s => s.trim()).filter(Boolean),
      notes: newNotes,
      tasks: [
        { label: "Morning walk (15 min)", done: false },
        { label: "Take morning medication", done: false },
        { label: "Ice pack on incision site", done: false },
        { label: "Physiotherapy exercises (10 reps)", done: false },
      ],
    };
    setEntries(prev => [newEntry, ...prev]);
    setShowAdd(false);
    setNewNotes(""); setNewSymptoms("");
  };

  const avgPain = (entries.reduce((s, e) => s + e.painLevel, 0) / entries.length).toFixed(1);
  const avgEnergy = (entries.reduce((s, e) => s + e.energy, 0) / entries.length).toFixed(1);
  const goodDays = entries.filter(e => e.mood === "good").length;

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
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recovery Tracker</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Post-Knee Surgery • Day {entries.length}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(s => !s)}
              className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Log Today
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Track your daily recovery progress, symptoms, task completion, and energy levels. Log each day to build a complete recovery picture for your doctor.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Avg Pain Level", value: `${avgPain}/10`, icon: <AlertCircle className="h-5 w-5 text-red-400" />, note: "Lower is better" },
            { label: "Avg Energy", value: `${avgEnergy}/10`, icon: <TrendingUp className="h-5 w-5 text-teal-500" />, note: "Higher is better" },
            { label: "Good Days", value: `${goodDays}/${entries.length}`, icon: <Smile className="h-5 w-5 text-green-500" />, note: "Mood tracked" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-[10px] text-slate-400">{s.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* New entry form */}
        {showAdd && (
          <div className="mb-6 bg-white dark:bg-slate-900 rounded-2xl border border-teal-300 dark:border-teal-700 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" /> Log Today's Recovery
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pain Level: {newPain}/10</label>
                <input type="range" min={0} max={10} value={newPain} onChange={e => setNewPain(+e.target.value)} className="w-full mt-2 accent-red-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Energy: {newEnergy}/10</label>
                <input type="range" min={0} max={10} value={newEnergy} onChange={e => setNewEnergy(+e.target.value)} className="w-full mt-2 accent-teal-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Mood</label>
                <div className="flex gap-2">
                  {(["good", "neutral", "bad"] as const).map(m => (
                    <button key={m} onClick={() => setNewMood(m)} className={`flex-1 py-2 rounded-xl border text-xs font-bold cursor-pointer transition ${newMood === m ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400" : "border-slate-200 dark:border-slate-700 text-slate-500"}`}>
                      <MoodIcon mood={m} size={4} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Symptoms (comma-separated)</label>
              <input type="text" value={newSymptoms} onChange={e => setNewSymptoms(e.target.value)} placeholder="e.g. Fatigue, Soreness, Swelling..." className="w-full mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notes</label>
              <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} rows={3} placeholder="How did today feel overall? Any notable events?" className="w-full mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 transition resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={addEntry} className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition cursor-pointer">
                <Save className="h-4 w-4" /> Save Entry
              </button>
              <button onClick={() => setShowAdd(false)} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          {entries.map(entry => {
            const isExpanded = expandedId === entry.id;
            const completedTasks = entry.tasks.filter(t => t.done).length;
            return (
              <div key={entry.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Entry header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <MoodIcon mood={entry.mood} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{entry.date}</span>
                      <span className="text-xs text-red-500 font-semibold">Pain: {entry.painLevel}/10</span>
                      <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">Energy: {entry.energy}/10</span>
                      <span className="text-xs text-slate-400">Tasks: {completedTasks}/{entry.tasks.length}</span>
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{entry.notes}</p>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Tasks */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Daily Tasks</h4>
                        <div className="space-y-2">
                          {entry.tasks.map((task, ti) => (
                            <button
                              key={ti}
                              onClick={() => toggleTask(entry.id, ti)}
                              className="w-full flex items-center gap-3 text-sm text-left cursor-pointer group"
                            >
                              {task.done
                                ? <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                                : <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
                              }
                              <span className={task.done ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}>
                                {task.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Symptoms + Notes */}
                      <div className="space-y-3">
                        {entry.symptoms.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Symptoms</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {entry.symptoms.map(s => (
                                <span key={s} className="text-xs bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/30 px-2.5 py-0.5 rounded-full font-medium">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Journal Note</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{entry.notes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
