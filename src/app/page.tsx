"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Upload, Sparkles, MessageSquare, Mic, Volume2, ShieldCheck, 
  Activity, ArrowRight, Eye, ShieldAlert, CheckCircle, Database, 
  Search, FileText, ChevronRight, Lock, BrainCircuit, HeartHandshake, Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import Waveform from "@/components/ui/Waveform";
import { useSpeech } from "@/hooks/useSpeech";

export default function LandingPage() {
  const { isListening, isSpeaking, startListening, speakText, stopSpeaking } = useSpeech();
  const [activeTab, setActiveTab] = useState<"summary" | "findings" | "abnormal">("summary");
  const [typedMessage, setTypedMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "user", text: "What do my blood results indicate about my high white blood cell count?" },
    { sender: "assistant", text: "Based on Page 1, Section 2 of your report, your White Blood Cell (WBC) count is elevated at 12.4 x10^3/uL. This is flagged high compared to the normal range of 4.5 - 11.0. This indicates an active immune defense response, commonly suggesting a bacterial infection or localized inflammation.", cited: true }
  ]);

  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [uploadActive, setUploadActive] = useState(false);

  // Auto-run a simulated progress bar for the upload dropzone mockup
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (uploadActive) {
      interval = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev >= 100) {
            setUploadActive(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    } else {
      setSimulatedProgress(0);
    }
    return () => clearInterval(interval);
  }, [uploadActive]);

  const handleTestUpload = () => {
    setSimulatedProgress(0);
    setUploadActive(true);
  };

  const handleSpeechDemo = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(chatMessages[1].text);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global medical warning header */}
      <MedicalDisclaimer variant="banner" />
      
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 md:py-24 transition-colors duration-300">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-12 lg:grid-cols-2 items-center relative z-10">
            {/* Left Col: Headings & Hooks */}
            <div className="flex flex-col space-y-6 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200 dark:border-teal-800/80 bg-teal-50 dark:bg-teal-950/40 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
                <BrainCircuit className="h-3.5 w-3.5" />
                Context-Grounded Healthcare AI
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Upload reports.<br />
                <span className="text-teal-600 dark:text-teal-400">Understand results.</span><br />
                Ask better questions.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Empower your health journey. Instantly extract technical medical readings into simple explanations, flag abnormal markers, and chat with a secure voice-enabled assistant grounded 100% in your uploaded documents.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/analyze"
                  className="rounded-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  Upload Your Report <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-full border border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-850 px-7 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  View Sample Reports
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  PDF & Image Scanning (OCR)
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  100% Private Processing
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Voice-Enabled Synthesis
                </div>
              </div>
            </div>

            {/* Right Col: High Fidelity Dashboard Mockup */}
            <div className="relative w-full max-w-xl mx-auto lg:ml-auto">
              <div className="absolute inset-0 bg-teal-500/10 dark:bg-teal-400/5 blur-3xl rounded-full scale-95 pointer-events-none" />
              
              <div className="relative rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Drag zone mockup */}
                <div 
                  onClick={handleTestUpload}
                  className="rounded-2xl border-2 border-dashed border-teal-300 dark:border-teal-800/80 bg-teal-500/5 dark:bg-teal-500/5 p-5 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-600 transition-colors group relative overflow-hidden"
                >
                  <Upload className="h-8 w-8 text-teal-600 dark:text-teal-400 mx-auto group-hover:scale-110 transition-transform duration-200" />
                  <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {uploadActive ? "Analyzing Clinical File..." : "Mock Upload (Click to test)"}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    PDF, JPG, or PNG up to 10MB
                  </p>
                  
                  {/* Progress Line */}
                  <div className="mt-3.5 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 dark:bg-teal-400 transition-all duration-300"
                      style={{ width: `${uploadActive ? simulatedProgress : 60}%` }}
                    />
                  </div>
                </div>

                {/* AI Summary card preview */}
                <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> AI Clinical Synthesis
                    </span>
                    <span className="text-[10px] text-slate-400">Grounded: 98%</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    Report indicates moderate white blood cell count elevation (leukocytosis), suggesting a localized inflammatory response. Other red blood cells are stable. Recommend correlating with active fever symptoms.
                  </p>
                </div>

                {/* Grounded chat bubble preview */}
                <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-850 p-4 bg-white dark:bg-slate-900/60">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2 mb-2.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Clinical Assistant</span>
                    <span className="inline-flex items-center gap-1 rounded bg-teal-500/10 px-2 py-0.5 text-[9px] font-semibold text-teal-700 dark:text-teal-400">
                      <Volume2 className="h-2.5 w-2.5 animate-pulse-slow" /> Voice Ready
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="max-w-[80%] rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-[10px] text-slate-700 dark:text-slate-350">
                      What does elevated WBC mean?
                    </div>
                    <div className="ml-auto max-w-[85%] rounded-2xl bg-teal-600 text-white px-3 py-1.5 text-[10px] leading-relaxed">
                      It points to active defense responders (neutrophils) swarm-fighting a bacterial trigger.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. TRUST BARS */}
        <section className="border-y border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors py-5 select-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-teal-600 dark:text-teal-500 shrink-0" />
              <span>AES-256 Encrypted Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-500 shrink-0" />
              <span>100% HIPAA Aligned Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-teal-600 dark:text-teal-500 shrink-0" />
              <span>Full Data Anonymization</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-teal-600 dark:text-teal-500 shrink-0" />
              <span>No Medical LLM Training</span>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS SECTION */}
        <section id="workflow" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-850 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal-600 dark:text-teal-400 mb-3">
              Technical RAG Orchestration
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              How MedQuery AI Works
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Our advanced workflow combines secure optical character recognition (OCR) and semantic chunk indexing to grounding answers.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
              {[
                {
                  step: "01",
                  title: "Secure Upload & Ingestion",
                  desc: "Drop your PDF, JPG, or PNG report. Our engine secures the transport channel and isolates the file environment immediately."
                },
                {
                  step: "02",
                  title: "OCR Text Extraction",
                  desc: "Optical character scanners map structure, isolate medical variables, and extract digital logs from physical scans."
                },
                {
                  step: "03",
                  title: "Semantic Vector Chunking",
                  desc: "Your data is divided into technical chunks (Test panels, Recommendations) and vectorized into similarity matrices."
                },
                {
                  step: "04",
                  title: "Context-Grounded Q&A",
                  desc: "Our chat reads only the retrieved vector blocks to synthesize answers, preventing hallucinatory advice."
                }
              ].map((x, i) => (
                <div 
                  key={i} 
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="text-2xl font-black text-teal-500/20 dark:text-teal-400/10 mb-3 group-hover:text-teal-600/20 transition-colors">
                    {x.step}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {x.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {x.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PRODUCT PREVIEW SECTION */}
        <section id="demo" className="py-20 bg-white dark:bg-slate-950 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Left explanation */}
              <div className="space-y-6 text-left">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal-600 dark:text-teal-400">
                  Feature Spotlight
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Intelligent interpretation at a single glance.
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  MedQuery AI formats complex medical readouts into three digestible channels: Plain-language summary summaries, isolated key observations, and custom safety concerns.
                </p>

                {/* Tabs selection button */}
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
                  {(["summary", "findings", "abnormal"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                        activeTab === tab 
                          ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm"
                          : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Active explanation detail */}
                <div className="min-h-[140px] rounded-2xl border border-slate-100 dark:border-slate-850 p-5 bg-slate-50/50 dark:bg-slate-900/20 leading-relaxed">
                  {activeTab === "summary" && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Layperson Plain-Language Summary</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-350">
                        Translates clinical jargon like "normocytic leukocytosis" or "mitral valve regurgitation" into comfortable phrasing (e.g., "slow heart muscle relaxation" or "active bacterial defense"). Highly useful for patients and caregivers alike.
                      </p>
                    </div>
                  )}
                  {activeTab === "findings" && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Clinical Observation Highlights</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-350">
                        An isolated timeline of crucial metrics, surgical conclusions, or laboratory anomalies extracted directly from scanned tables. Speeds up document scanning for caregivers and medical students.
                      </p>
                    </div>
                  )}
                  {activeTab === "abnormal" && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Abnormal Test Reference Markers</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-350">
                        Instantly cross-references your lab values against baseline healthy reference values, flagging elevated or depleted items in high-contrast clinical coral red or amber with explanations.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Mockup Visualization */}
              <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-855 bg-slate-50 dark:bg-slate-900/30 p-4 sm:p-6 text-left">
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Complete Metabolic Panel (CMP)</h3>
                      <p className="text-[10px] text-slate-400">Analyzed on: May 14, 2026</p>
                    </div>
                    <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400">
                      Metabolic
                    </span>
                  </div>

                  {activeTab === "summary" && (
                    <div className="space-y-3 animate-fade-in">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-teal-500/5 border-l-2 border-teal-500 p-3 rounded-r-xl">
                        "Your panel shows slightly elevated fasting sugar (prediabetic glucose level at 118 mg/dL) and borderline low potassium (3.4 mEq/L) which can induce light muscle cramps."
                      </p>
                    </div>
                  )}

                  {activeTab === "findings" && (
                    <div className="space-y-2 animate-fade-in text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex gap-2">
                        <span className="text-teal-500">✓</span>
                        <span>Fasting blood glucose indicates impaired glucose levels (118 mg/dL).</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-teal-500">✓</span>
                        <span>Potassium levels are borderline low at 3.4 mEq/L (standard range starts at 3.5).</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-teal-500">✓</span>
                        <span>Kidney filtration (Creatinine, BUN) and other electrolyte channels are perfectly healthy.</span>
                      </div>
                    </div>
                  )}

                  {activeTab === "abnormal" && (
                    <div className="space-y-2 animate-fade-in">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="py-2">Marker</th>
                            <th className="py-2">Value</th>
                            <th className="py-2">Reference</th>
                            <th className="py-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          <tr>
                            <td className="py-2.5 font-medium">Glucose (Fasting)</td>
                            <td className="py-2.5 text-red-650 dark:text-red-400 font-semibold">118 mg/dL</td>
                            <td className="py-2.5">70 - 99 mg/dL</td>
                            <td className="py-2.5 text-right"><span className="rounded bg-red-100 dark:bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-450 uppercase">High</span></td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-medium">Serum Potassium</td>
                            <td className="py-2.5 text-amber-600 dark:text-amber-400 font-semibold">3.4 mEq/L</td>
                            <td className="py-2.5">3.5 - 5.2 mEq/L</td>
                            <td className="py-2.5 text-right"><span className="rounded bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-450 uppercase">Low</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE VOICE & CHAT ASSISTANT PREVIEW (DARK MODE IMPACT THEME) */}
        <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-12 lg:grid-cols-2 items-center relative z-10">
            {/* Left Description */}
            <div className="space-y-6 text-left">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal-400">
                Voice Assistant Integration
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Speak naturally. Receive clinical precision.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                Type or speak your queries directly. MedQuery AI responds with voice playbacks, streaming text answers, and active citation links pointing to exact report positions.
              </p>
              
              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Real-time voice playbacks with rate and rate control</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Interactive source citations linking directly to raw text</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Grounded confidence scoring (excludes clinical fabrications)</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Sandbox Widget */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">Live Voice Sandbox</span>
                </div>
                {/* Visual waves active when speaking */}
                <Waveform active={isSpeaking || isListening} color="bg-teal-400" />
              </div>

              {/* Chat flow bubble */}
              <div className="space-y-4 min-h-[180px] text-xs">
                <div className="max-w-[85%] rounded-2xl bg-white/10 px-4 py-2.5 text-slate-200">
                  {chatMessages[0].text}
                </div>
                <div className="ml-auto max-w-[90%] rounded-2xl bg-teal-600 px-4 py-3 text-white leading-relaxed relative">
                  {chatMessages[1].text}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-teal-200 border-t border-teal-500/40 pt-2">
                    <span>96% Grounded Confidence</span>
                    <span>Source: CBC Panel [1]</span>
                  </div>
                </div>
              </div>

              {/* Interactive buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeechDemo}
                    className={`rounded-full px-4.5 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                      isSpeaking
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-600"
                        : "bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-500/20"
                    }`}
                  >
                    <Volume2 className="h-4 w-4 shrink-0" />
                    {isSpeaking ? "Pause Voice Playback" : "Listen to Explanation"}
                  </button>
                  
                  {/* Microphone activator demo */}
                  <button
                    onClick={() => startListening((res) => {
                      if (res) {
                        setChatMessages(prev => [
                          ...prev,
                          { sender: "user", text: res },
                          { sender: "assistant", text: `I heard you ask: "${res}". On our secure analyze workspace, this command will query the database, find the relative chunks, and formulate an immediate answers.`, cited: false }
                        ]);
                      }
                    })}
                    className={`rounded-full p-2 border border-white/20 hover:bg-white/10 transition-colors ${
                      isListening ? "bg-red-500/20 text-red-400 border-red-500/45 animate-pulse" : "text-white"
                    }`}
                    title="Test speech-to-text input"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

                <Link
                  href="/chat"
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1"
                >
                  Enter Chat Workspace <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ADVANCED FEATURE BENTO GRID */}
        <section id="features" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal-600 dark:text-teal-400 mb-3">
              Full Spectrum Platform
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Healthcare-grade features. Seamless UX.
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Designed as a premium, highly secure clinical assistant. Beautiful interfaces matching advanced data structures.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
              {[
                {
                  icon: <Upload className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
                  title: "OCR Scanner & Digits Parser",
                  desc: "Extracts clinical raw text from blurred phone images, scans, and standard multi-page medical PDFs."
                },
                {
                  icon: <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
                  title: "Abnormal Ranges Highlighting",
                  desc: "Flags markers exceeding healthy thresholds with clear alerts and doctor discussion guides."
                },
                {
                  icon: <BrainCircuit className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
                  title: "Grounded Chatbot Interface",
                  desc: "Queries strictly within the file chunks. No general guessing. No diagnostic fabrications."
                },
                {
                  icon: <Mic className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
                  title: "Speech Recognition Input",
                  desc: "Type questions simply by talking, making health summaries accessible for senior patients."
                },
                {
                  icon: <Volume2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
                  title: "TTS Reassurance Voice",
                  desc: "Listen to patient explanations spoken out loud with rate control and adjustable clinical profiles."
                },
                {
                  icon: <Search className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
                  title: "History Library Search",
                  desc: "Quickly catalog and search past uploads, prescriptions, and radiology logs from a single panel."
                }
              ].map((f, i) => (
                <div 
                  key={i} 
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-3 bg-teal-500/10 dark:bg-teal-400/5 rounded-xl w-fit mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-normal">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. SECURE PRIVACY & DISCLAIMERS CARDS */}
        <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal-600 dark:text-teal-400 mb-3">
              Clinivault Secure
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Privacy you can fully audit.
            </h2>
            
            <div className="mt-14 grid gap-6 md:grid-cols-3 text-left">
              {[
                {
                  icon: <ShieldCheck className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
                  title: "Secure Ingestion",
                  desc: "Files are processed in isolated transient environments and immediately encrypted. No commercial health models can use your data."
                },
                {
                  icon: <Lock className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
                  title: "Complete Purge Freedom",
                  desc: "We provide an instant 'Delete and Purge' button on every report, completely deleting data from our vectors and backups."
                },
                {
                  icon: <HeartHandshake className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
                  title: "Cooperative Healthcare",
                  desc: "MedQuery is structured to build better doctor-patient bridges, providing clean cheat-sheets of questions to ask at visits."
                }
              ].map((p, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-100 dark:border-slate-850">
                  <div className="mb-4 shrink-0">{p.icon}</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{p.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Global card warning disclaimer */}
            <div className="mt-10 max-w-3xl mx-auto">
              <MedicalDisclaimer variant="card" />
            </div>
          </div>
        </section>

        {/* 8. FINAL CALL TO ACTION (GLASSMORPHISM EFFECT) */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-teal-800 to-slate-900 dark:from-teal-950 dark:to-slate-900 text-white p-8 sm:p-12 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.15),transparent)] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-semibold sm:text-4xl leading-tight">
                Bring clarity to every medical report.
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed max-w-lg mx-auto">
                No more frantic web searching or confusing medical abbreviations. Start analyzing files securely and discussing details productively with your doctor.
              </p>
              
              <div className="pt-2">
                <Link
                  href="/analyze"
                  className="inline-flex rounded-full bg-white hover:bg-slate-50 text-slate-900 font-bold px-8 py-4 text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Upload Your First Report
                </Link>
              </div>
              <p className="text-[10px] text-slate-400">
                100% private processing. PDF, JPG, PNG compatible. Purge reports at any time.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
