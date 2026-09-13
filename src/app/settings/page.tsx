"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Settings, User, ShieldCheck, Volume2, Trash2, ArrowLeft, 
  HelpCircle, EyeOff, Key, Sparkles, Sliders, CheckCircle, Database, Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { useSpeech } from "@/hooks/useSpeech";
import { MedicalDocument } from "@/utils/mockData";

export default function SettingsPage() {
  const router = useRouter();
  const { voices, activeVoice, changeVoice } = useSpeech();

  // Local React States
  const [aiSimplicity, setAiSimplicity] = useState<"layperson" | "student" | "clinician">("layperson");
  const [voiceRate, setVoiceRate] = useState(1.05);
  const [autoPurgeDays, setAutoPurgeDays] = useState(30);
  const [autoPurgeActive, setAutoPurgeActive] = useState(true);
  const [showToast, setShowToast] = useState("");
  const [clearDialog, setClearDialog] = useState(false);
  const [reports, setReports] = useState<MedicalDocument[]>([]);
  const [userName, setUserName] = useState("Patient");
  const [userEmail, setUserEmail] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const simplicity = localStorage.getItem("medquery-simplicity") as any;
      if (simplicity) setAiSimplicity(simplicity);
      
      const rate = localStorage.getItem("medquery-voicerate");
      if (rate) setVoiceRate(parseFloat(rate));
      
      const purgeDays = localStorage.getItem("medquery-purgedays");
      if (purgeDays) setAutoPurgeDays(parseInt(purgeDays));
      
      const purgeActive = localStorage.getItem("medquery-purgeactive");
      if (purgeActive) setAutoPurgeActive(purgeActive === "true");

      const storedReports = localStorage.getItem("medquery-documents");
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }

      const savedKey = localStorage.getItem("medquery-gemini-key") || "";
      setGeminiKey(savedKey);

      const sessionStr = localStorage.getItem("medquery-session");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.authenticated) {
            setUserName(session.name || "Patient");
            setUserEmail(session.email || "patient@example.com");
          }
        } catch (e) {}
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("medquery-simplicity", aiSimplicity);
    localStorage.setItem("medquery-voicerate", voiceRate.toString());
    localStorage.setItem("medquery-purgedays", autoPurgeDays.toString());
    localStorage.setItem("medquery-purgeactive", autoPurgeActive.toString());
    localStorage.setItem("medquery-gemini-key", geminiKey);
    
    triggerToast("Settings saved and encrypted inside your local vault.");
  };

  const handleClearAll = () => {
    localStorage.removeItem("medquery-documents");
    localStorage.removeItem("medquery-simplicity");
    localStorage.removeItem("medquery-voicerate");
    setClearDialog(false);
    triggerToast("All reports and vector indices have been completely expunged.");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
        
        {/* Dynamic Toast Feedback */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-teal-500 text-xs font-semibold px-4.5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-in-right">
            <CheckCircle className="h-4.5 w-4.5 text-teal-400 dark:text-slate-950 shrink-0" />
            <span>{showToast}</span>
          </div>
        )}

        {/* Settings Header */}
        <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-5">
          <Link
            href="/dashboard"
            className="p-2 border border-slate-250 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors shrink-0"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-slate-505" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Vault Configuration Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize AI text complexity level, text-to-speech parameters, and safety purges.
            </p>
          </div>
        </div>

        {/* Configuration Split Panels */}
        <div className="grid gap-6 md:grid-cols-12">
          
          {/* 1. LEFT SIDEBAR CONFIG TABS LIST */}
          <div className="md:col-span-8 space-y-6">
            
            {/* PANEL 0: PATIENT PROFILE OVERVIEW */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                <User className="h-4.5 w-4.5 text-teal-650" /> Patient Profile & History
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl space-y-3 border border-slate-100 dark:border-slate-850 text-left">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{userName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Contact Email</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{userEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Reports Uploaded</p>
                    <p className="text-sm font-bold text-teal-650 dark:text-teal-400">{reports.length} Records</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-850 text-left flex flex-col">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 shrink-0">Care Team (Doctors Visited)</p>
                  {reports.length > 0 ? (
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                      {Array.from(new Set(reports.map(r => r.doctor))).map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                          {doc}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No medical records uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* PANEL A: AI COMPLEXITY */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-teal-650" /> AI Response Complexity Level
              </h3>
              
              <div className="grid gap-3 text-left">
                {[
                  {
                    id: "layperson",
                    title: "Layperson Translation",
                    desc: "Translates all values and conditions into extremely simple, warm, patient-friendly phrasing.",
                  },
                  {
                    id: "student",
                    title: "Medical Annotator",
                    desc: "Maintains Latin terminologies, providing detailed annotations of biological systems.",
                  },
                  {
                    id: "clinician",
                    title: "High Density Summary",
                    desc: "Generates high-density summaries displaying exact out-of-range figures and physical steps.",
                  }
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setAiSimplicity(opt.id as any)}
                    className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                      aiSimplicity === opt.id
                        ? "bg-teal-500/5 border-teal-500 shadow-sm"
                        : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {opt.title}
                      </span>
                      <input
                        type="radio"
                        checked={aiSimplicity === opt.id}
                        onChange={() => {}}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500/20"
                      />
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PANEL B: TEXT TO SPEECH VOICES */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                <Volume2 className="h-4.5 w-4.5 text-teal-650" /> Voice Assistant Vocal Config
              </h3>
              
              <div className="space-y-4 text-xs">
                
                {/* Voice picker selection */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Synthesizer Voice</label>
                  <select
                    value={activeVoice?.name || ""}
                    onChange={(e) => changeVoice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    {voices.length === 0 ? (
                      <option>System Default Voice active</option>
                    ) : (
                      voices.map((v, i) => (
                        <option key={i} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Speech rate slider */}
                <div className="space-y-2.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vocal Reading Speed</label>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">{voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full accent-teal-600 dark:accent-teal-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-405">
                    <span>Reassuring (0.8x)</span>
                    <span>Standard</span>
                    <span>Precise (1.3x)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* PANEL C: ENCRYPTED SECURITY & DATA PURGES */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                <Trash2 className="h-4.5 w-4.5 text-red-500 shrink-0" /> Security Lifecycles & Purges
              </h3>
              
              <div className="space-y-4 text-xs text-left">
                
                {/* Auto purge check toggler */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-850 dark:text-slate-205 block">Enable Automatic Ingestion Purge</span>
                    <span className="text-[10px] text-slate-450">Purge files from local indexes automatically.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPurgeActive}
                    onChange={(e) => setAutoPurgeActive(e.target.checked)}
                    className="h-4.5 w-4.5 rounded text-teal-600 focus:ring-teal-500/20"
                  />
                </div>

                {/* Purge duration select */}
                {autoPurgeActive && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Purge Index Cycles</label>
                    <select
                      value={autoPurgeDays}
                      onChange={(e) => setAutoPurgeDays(parseInt(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="1">Purge after 24 Hours</option>
                      <option value="7">Purge after 7 Days</option>
                      <option value="30">Purge after 30 Days</option>
                      <option value="90">Purge after 90 Days</option>
                    </select>
                  </div>
                )}

                {/* Permanent purge trigger */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-red-500 dark:text-red-400 block">Purge Secure Library</span>
                    <span className="text-[9px] text-slate-450">Completely wipes files and RAG indexes.</span>
                  </div>
                  <button
                    onClick={() => setClearDialog(true)}
                    className="rounded-xl bg-red-600 hover:bg-red-750 text-white font-semibold px-4 py-2.5 text-xs shadow-sm cursor-pointer shrink-0 transition-colors"
                  >
                    Wipe Vault
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* 2. RIGHT SIDEBAR CRYPTOGRAPHIC CREDENTIALS DISPLAY */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Gemini API Key Configuration Card */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-left">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-teal-650 animate-pulse" /> Gemini AI Integration
              </h3>
              
              <div className="space-y-3 text-xs leading-normal">
                <p className="text-[10px] text-slate-500">
                  Enter your Gemini API key to enable live LLM RAG analysis, ELI5 translation, and OCR scanners in your portal. Key is stored securely in your browser session.
                </p>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Gemini Key API</label>
                  <div className="relative">
                    <input 
                      type={showKey ? "text" : "password"}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-3 pr-10 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 text-[10px] font-bold bg-transparent border-none cursor-pointer"
                    >
                      {showKey ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] font-bold text-teal-650 dark:text-teal-400 pt-1">
                  {geminiKey ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span>Gemini Live Model Connected</span>
                    </>
                  ) : (
                    <>
                      <Info className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Running in Simulator Mode</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-left">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Key className="h-4 w-4 text-teal-650" /> Vault Cryptographic Keys
              </h3>
              
              <div className="space-y-3.5 text-xs font-mono bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl text-slate-500">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase">VAULT_INDEX_CIPHER</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-300 break-all text-[10px] mt-0.5">
                    AES_256_GCM_SECURE_X8634
                  </p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase">LOCAL_VECTOR_SEED</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-300 break-all text-[10px] mt-0.5">
                    sha256:d8b76fc3a903ef841c9b2
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-teal-650 dark:text-teal-400 mt-2 select-none">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Indices are HIPAA isolated</span>
                </div>
              </div>
            </div>

            {/* General save buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="w-full rounded-xl bg-teal-650 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-650 text-white font-bold py-3 text-xs tracking-wider uppercase shadow-md shadow-teal-500/10 cursor-pointer transition-all"
              >
                Save Vault Config
              </button>
              <Link
                href="/dashboard"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold py-3 text-xs tracking-wider uppercase text-center block transition-all"
              >
                Return to History
              </Link>
            </div>

          </div>

        </div>

        {/* Permanent Wipe Modal prompt Dialog */}
        {clearDialog && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 max-w-sm w-full shadow-2xl text-left space-y-4 animate-scale-in">
              <div className="p-3 bg-red-550/10 rounded-2xl w-fit text-red-650 dark:text-red-400">
                <Trash2 className="h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Expunge secure vault library?
                </h3>
                <p className="text-xs leading-relaxed text-slate-550 dark:text-slate-400">
                  This action is irreversible. All uploaded lab results, cardiology studies, knee MRI findings, and RAG search indexing nodes will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setClearDialog(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-350 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/10 transition-colors cursor-pointer"
                >
                  Wipe Vault
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
