"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users, Stethoscope, Heart, Eye, Brain, Activity, Pill, 
  ArrowRight, MessageSquare, Star, Clock, ChevronRight, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

const SPECIALISTS = [
  {
    id: "cardio",
    name: "Dr. Arjun Mehta",
    specialty: "Cardiologist",
    focus: "Heart & Cardiovascular",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-200/60 dark:border-red-900/30",
    experience: "22 years",
    rating: 4.9,
    consults: 1842,
    tags: ["ECG Analysis", "Heart Failure", "Hypertension", "Arrhythmia"],
    greeting: "Hello! I specialize in cardiovascular health. I can help you understand ECG results, blood pressure readings, and heart-related lab markers from your uploaded reports.",
  },
  {
    id: "endo",
    name: "Dr. Priya Sharma",
    specialty: "Endocrinologist",
    focus: "Diabetes & Hormones",
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-200/60 dark:border-amber-900/30",
    experience: "16 years",
    rating: 4.8,
    consults: 1203,
    tags: ["Diabetes Type 2", "Thyroid", "HbA1c", "Insulin Resistance"],
    greeting: "Hi there! I help interpret glucose, HbA1c, thyroid panels, and hormone-related lab work. Let me turn your lab numbers into a clear picture of your metabolic health.",
  },
  {
    id: "neuro",
    name: "Dr. Vikram Nair",
    specialty: "Neurologist",
    focus: "Brain & Nervous System",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-200/60 dark:border-purple-900/30",
    experience: "18 years",
    rating: 4.9,
    consults: 978,
    tags: ["MRI Interpretation", "Migraines", "Nerve Pain", "Seizures"],
    greeting: "Welcome! I specialize in interpreting neurological findings — from MRI reports to nerve conduction studies. I'll help you understand complex brain and nervous system findings in plain language.",
  },
  {
    id: "radio",
    name: "Dr. Ananya Roy",
    specialty: "Radiologist",
    focus: "Imaging & Scans",
    icon: Eye,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-200/60 dark:border-blue-900/30",
    experience: "14 years",
    rating: 4.7,
    consults: 2109,
    tags: ["X-Ray", "CT Scan", "MRI", "Ultrasound", "PET Scan"],
    greeting: "Hello! I decode imaging reports — X-rays, CT scans, MRIs, and ultrasounds. Upload your radiology report and I'll explain findings, measurements, and what to discuss with your referring doctor.",
  },
  {
    id: "pharma",
    name: "Dr. Kavya Iyer",
    specialty: "Clinical Pharmacist",
    focus: "Medications & Interactions",
    icon: Pill,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-200/60 dark:border-teal-900/30",
    experience: "12 years",
    rating: 4.8,
    consults: 1567,
    tags: ["Drug Interactions", "Side Effects", "Dosage Review", "Prescriptions"],
    greeting: "Hi! I'm here to help you understand your medications — dosage timing, possible interactions, what each drug does, and red flags to watch for. Share your prescription and let's review it together.",
  },
  {
    id: "gp",
    name: "Dr. Rahul Verma",
    specialty: "General Physician",
    focus: "Primary Health & Wellness",
    icon: Stethoscope,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-200/60 dark:border-green-900/30",
    experience: "20 years",
    rating: 4.9,
    consults: 3241,
    tags: ["General Health", "CBC Reports", "Fever", "Infections", "Preventive Care"],
    greeting: "Hello! As a general physician, I can help interpret a wide range of lab reports — CBC, metabolic panels, liver function, kidney function, and more. I'm your first stop for any health question.",
  },
];

interface Message { role: "user" | "agent"; text: string; }

export default function AgentsPage() {
  const [activeAgent, setActiveAgent] = useState(SPECIALISTS[0]);
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: SPECIALISTS[0].greeting }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSelectAgent = (agent: typeof SPECIALISTS[0]) => {
    setActiveAgent(agent);
    setMessages([{ role: "agent", text: agent.greeting }]);
    setInputText("");
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    const userMsg: Message = { role: "user", text };
    const agentReply: Message = {
      role: "agent",
      text: `Thank you for your question about "${text}". As a ${activeAgent.specialty}, I recommend uploading your relevant medical report on the Workspace page so I can provide grounded, document-based answers. In general: ${activeAgent.tags[0]} and ${activeAgent.tags[1]} are key areas I can help interpret from your lab data. Please consult your physician for definitive diagnosis.`
    };
    setMessages(prev => [...prev, userMsg, agentReply]);
    setInputText("");
  };

  const AgentIcon = activeAgent.icon;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Medical Team</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Consult specialist AI agents trained on medical knowledge. Each agent interprets findings from your uploaded reports with expert-level guidance. Not a substitute for professional medical advice.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Agent Roster */}
          <div className="lg:col-span-4 space-y-2">
            {SPECIALISTS.map(agent => {
              const Icon = agent.icon;
              const isActive = activeAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal-50 dark:bg-teal-900/20 border-teal-400 dark:border-teal-700"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl ${agent.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${agent.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? "text-teal-700 dark:text-teal-300" : "text-slate-900 dark:text-white"}`}>
                      {agent.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{agent.specialty}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 ml-auto shrink-0 ${isActive ? "text-teal-500" : "text-slate-300"}`} />
                </button>
              );
            })}
          </div>

          {/* RIGHT: Agent Chat Panel */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Agent Profile Card */}
            <div className={`rounded-2xl border ${activeAgent.border} bg-white dark:bg-slate-900 p-5`}>
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 rounded-2xl ${activeAgent.bg} flex items-center justify-center shrink-0`}>
                  <AgentIcon className={`h-7 w-7 ${activeAgent.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{activeAgent.name}</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activeAgent.bg} ${activeAgent.color}`}>
                      {activeAgent.specialty}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{activeAgent.focus}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{activeAgent.experience} exp.</span>
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400" />{activeAgent.rating} rating</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{activeAgent.consults.toLocaleString()} consults</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {activeAgent.tags.map(tag => (
                      <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col" style={{ minHeight: 380 }}>
              <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[380px]">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "agent" && (
                      <div className={`h-7 w-7 rounded-full ${activeAgent.bg} flex items-center justify-center mr-2 mt-1 shrink-0`}>
                        <AgentIcon className={`h-3.5 w-3.5 ${activeAgent.color}`} />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder={`Ask ${activeAgent.name.split(" ")[1]} a question...`}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                />
                <button
                  onClick={handleSend}
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  Send <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Link
              href="/analyze"
              className="flex items-center justify-center gap-2 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 py-3 text-sm font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/30 transition"
            >
              <Sparkles className="h-4 w-4" />
              Upload a report for grounded, document-specific answers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
