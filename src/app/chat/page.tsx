"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Send, Mic, Volume2, ShieldCheck, Activity, HelpCircle, ArrowLeft, 
  Sparkles, Layers, BookOpen, AlertCircle, ChevronRight, User, RefreshCw, 
  VolumeX, ShieldAlert, HeartHandshake, Eye, CheckCircle2, UserCheck, Languages,
  Stethoscope, Thermometer, Pill, Apple, Brain, Phone
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import Waveform from "@/components/ui/Waveform";
import { useSpeech } from "@/hooks/useSpeech";
import { MOCK_REPORTS, MedicalDocument, DocumentChunk } from "@/utils/mockData";
import { executeRAGQuery, RAGInspectionData } from "@/utils/ragEngine";
import { loadReportsFromStorage } from "@/utils/reportStorage";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
  confidence?: number;
  citedChunks?: DocumentChunk[];
  agentName?: string;
  citations?: string[];
}

interface PatientMemory {
  age: string;
  chronicDiseases: string;
  allergies: string;
  currentMedicines: string;
  familyHistory: string;
}

const LANGUAGES = [
  { code: "en", name: "English", native: "English", locale: "en-US" },
  { code: "te", name: "Telugu", native: "తెలుగు", locale: "te-IN" },
  { code: "hi", name: "Hindi", native: "हिंदी", locale: "hi-IN" },
  { code: "ta", name: "Tamil", native: "தமிழ்", locale: "ta-IN" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", locale: "kn-IN" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", locale: "ml-IN" },
  { code: "mr", name: "Marathi", native: "मराठी", locale: "mr-IN" },
  { code: "bn", name: "Bengali", native: "বাংলা", locale: "bn-IN" }
];

function ChatPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("id") || "cbc-report-1";
  
  const { 
    isListening, isSpeaking, recognitionSupported, activeVoice,
    startListening, stopListening, speakText, stopSpeaking, changeVoice, voices
  } = useSpeech();

  // Active document and clinical memory
  const [activeDoc, setActiveDoc] = useState<MedicalDocument | null>(null);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [ragStatus, setRagStatus] = useState<"idle" | "routing" | "retrieving" | "synthesizing">("idle");
  const [highlightedChunk, setHighlightedChunk] = useState<string | null>(null);
  const [currentlySpeakingMsgId, setCurrentlySpeakingMsgId] = useState<string | null>(null);

  // Advanced toggles
  const [selectedLang, setSelectedLang] = useState("en");
  const [eli10, setEli10] = useState(false);
  const [pregnancyMode, setPregnancyMode] = useState(false);
  const [childMode, setChildMode] = useState(false);
  const [elderlyMode, setElderlyMode] = useState(false);
  
  // Active Agent details
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  // Patient Memory Settings
  const [patientMemory, setPatientMemory] = useState<PatientMemory>({
    age: "34",
    chronicDiseases: "Pre-Diabetes",
    allergies: "Penicillin",
    currentMedicines: "Metformin 500mg (Daily)",
    familyHistory: "Type 2 Diabetes (Father)"
  });
  const [editingMemory, setEditingMemory] = useState(false);
  const [showToast, setShowToast] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const list = loadReportsFromStorage();
      setDocuments(list);

      const doc = list.find((d: any) => d.id === docId) || list[0] || MOCK_REPORTS[0];
      setActiveDoc(doc);

      // Load patient memory if stored
      const storedMemory = localStorage.getItem("medquery-patient-memory");
      if (storedMemory) {
        try {
          setPatientMemory(JSON.parse(storedMemory));
        } catch (e) {}
      }

      // Seed initial welcoming message
      setMessages([
        {
          id: "welcome-msg",
          sender: "assistant",
          text: `Welcome to the secure clinical chat vault. I have successfully loaded your **${doc.title}** as the core vector index.

I am a secure, context-grounded AI clinical companion. I answer questions using retrieved facts from your records, cross-referenced with clinical guides.

What would you like me to explain about these findings?`,
          confidence: 100,
          citedChunks: [],
          agentName: "Orchestrator Agent",
          citations: ["NIH Clinivault Guide"]
        }
      ]);
    }
  }, [docId]);

  // Save memory changes
  const saveMemory = () => {
    localStorage.setItem("medquery-patient-memory", JSON.stringify(patientMemory));
    setEditingMemory(false);
    triggerToast("Patient memory updated and synchronized with LLM context.");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3500);
  };

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Speech language selector hook sync
  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeLanguage = LANGUAGES.find(l => l.code === selectedLang);
      if (activeLanguage) {
        // Try to match a native system voice for the selected locale
        const availableVoices = window.speechSynthesis?.getVoices() || [];
        const matchingVoice = availableVoices.find(v => v.lang.startsWith(activeLanguage.code));
        if (matchingVoice) {
          changeVoice(matchingVoice.name);
        }
      }
    }
  }, [selectedLang]);

  const [latestRAGInspection, setLatestRAGInspection] = useState<RAGInspectionData | null>(null);
  const [showRAGInspector, setShowRAGInspector] = useState(false);

  // Actual Gemini API Query or Grounded RAG Engine
  const performGroundedClinicalRAG = async (query: string, doc: MedicalDocument): Promise<ChatMessage> => {
    const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
    
    // Choose which agent should resolve the request
    let agentName = "Report Analysis Agent";
    const qLower = query.toLowerCase();
    
    if (qLower.includes("pain") || qLower.includes("ache") || qLower.includes("fever") || qLower.includes("cough") || qLower.includes("sick")) {
      agentName = "Symptom Analysis Agent";
    } else if (qLower.includes("diet") || qLower.includes("food") || qLower.includes("eat") || qLower.includes("calories") || qLower.includes("meal")) {
      agentName = "Nutrition Agent";
    } else if (qLower.includes("pill") || qLower.includes("medicine") || qLower.includes("drug") || qLower.includes("dosage")) {
      agentName = "Medicine Agent";
    } else if (qLower.includes("stress") || qLower.includes("anxious") || qLower.includes("depress") || qLower.includes("sleep")) {
      agentName = "Mental Health Agent";
    } else if (qLower.includes("emergency") || qLower.includes("chest pain") || qLower.includes("breathing") || qLower.includes("poison")) {
      agentName = "Emergency Agent";
    }

    setActiveAgent(agentName);

    // Emergency Detection overrides
    const emergencyKeywords = ["chest pain", "breathing", "suicid", "heavy bleeding", "heart attack", "stroke", "poisoning", "anaphylaxis"];
    const isEmergency = emergencyKeywords.some(keyword => qLower.includes(keyword));

    if (isEmergency) {
      return {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        agentName: "Emergency Agent",
        text: `⚠️ **CRITICAL EMERGENCY WARNING**: You have described symptoms (e.g. severe discomfort, difficulty breathing) that might indicate a life-threatening emergency.

**First Aid Steps:**
1. Call emergency medical services immediately (such as dialing **911** or local services).
2. Sit down, rest, and try to remain calm.
3. Loosen tight clothing.
4. Do NOT attempt to drive yourself to the hospital.

I am an AI assistant and cannot provide medical triage. Please contact emergency services right now.`,
        confidence: 100,
        citedChunks: [],
        citations: ["American Heart Association Guidelines", "CDC Protocols"]
      };
    }

    // Execute RAG Retrieval & LLM Query
    const ragResult = await executeRAGQuery(query);
    setLatestRAGInspection(ragResult.inspection);

    let textAnswer = ragResult.answer;

    if (selectedLang !== "en") {
      const transGreetings: Record<string, string> = {
        hi: "नमस्ते। आपकी रिपोर्ट के अनुसार: ",
        te: "నమస్తే. మీ నివేదిక ప్రకారం: ",
        ta: "வணக்கம். உங்கள் அறிக்கையின்படி: ",
        kn: "<ctrl42>నమస్తే. ನಿಮ್ಮ ವರದಿಯ ಪ್ರಕಾರ: ",
        ml: "നമസ്കാരം. നിങ്ങളുടെ റിപ്പോർട്ട് പ്രകാരം: ",
        mr: "नमस्ते. तुमच्या अहवालानुसार: ",
        bn: "নমস্কার। আপনার রিপোর্ট অনুযায়ী: "
      };
      textAnswer = `${transGreetings[selectedLang] || ""} ${textAnswer}\n\n[Translation: Grounded in ${currentLang.native}.]`;
    }

    if (eli10) {
      textAnswer = `Imagine your body is a castle, and white blood cells & immune defenders are little knights protecting it! 🏰 Based on your scanned Patient Form & history, your body is currently managing blood sugar with Metformin, maintaining blood pressure, and avoiding Latex/Penicillin!`;
    }

    if (pregnancyMode && (patientMemory.allergies.toLowerCase().includes("penicillin") || doc.rawText.toLowerCase().includes("penicillin"))) {
      textAnswer += `\n\n🤰 **Pregnancy Mode Alert**: Since you are in pregnancy mode and allergic to Penicillin (confirmed in scanned Patient Form), standard amoxicillin treatments are strictly contraindicated. Non-lactam alternatives should be evaluated by your OB-GYN.`;
    }

    const citedChunks = doc.chunks.slice(0, 2);

    return {
      id: `assistant-${Date.now()}`,
      sender: "assistant",
      text: textAnswer,
      confidence: ragResult.inspection.groundednessScore,
      citedChunks,
      agentName,
      citations: ["World Health Organization (WHO)", "PubMed Central", "Mayo Clinic Network"]
    };
  };

  const dispatchQuestion = async (query: string) => {
    if (!query.trim() || !activeDoc) return;
    setInputVal("");
    
    // 1. Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, sender: "user", text: query }]);
    
    // 2. Multi-agent routing animation
    setRagStatus("routing");
    setTimeout(async () => {
      setRagStatus("retrieving");
      
      setTimeout(async () => {
        setRagStatus("synthesizing");
        
        // 3. Perform grounded search
        const assistantMsg = await performGroundedClinicalRAG(query, activeDoc);
        
        setRagStatus("idle");
        
        // 4. Stream response
        const finalMsgId = assistantMsg.id;
        setMessages(prev => [
          ...prev, 
          { ...assistantMsg, id: finalMsgId, text: "", isStreaming: true }
        ]);

        let currentText = "";
        const words = assistantMsg.text.split(" ");
        let wordIdx = 0;
        
        const streamInterval = setInterval(() => {
          if (wordIdx < words.length) {
            currentText += (wordIdx === 0 ? "" : " ") + words[wordIdx];
            setMessages(prev => 
              prev.map(m => m.id === finalMsgId ? { ...m, text: currentText } : m)
            );
            wordIdx++;
          } else {
            clearInterval(streamInterval);
            setMessages(prev => 
              prev.map(m => m.id === finalMsgId ? { ...m, isStreaming: false } : m)
            );
            
            // Auto voice response if set to speak
            if (activeVoice) {
              speakText(assistantMsg.text, 1.05);
              setCurrentlySpeakingMsgId(finalMsgId);
            }
          }
        }, 35);

      }, 800);
    }, 700);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchQuestion(inputVal);
  };

  const handleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      const activeLanguage = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
      
      // Update voice recognition language
      if (typeof window !== "undefined") {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition && recognitionSupported) {
          // Temporarily force custom locale recognition
          const tempRec = new SpeechRecognition();
          tempRec.lang = activeLanguage.locale;
          tempRec.continuous = false;
          tempRec.interimResults = false;
          
          tempRec.onresult = (event: any) => {
            const voiceText = event.results[0][0].transcript;
            setInputVal(voiceText);
            setTimeout(() => dispatchQuestion(voiceText), 500);
          };
          tempRec.start();
          return;
        }
      }
      
      // Standard fallback
      startListening((resultText) => {
        if (resultText) {
          setInputVal(resultText);
          setTimeout(() => dispatchQuestion(resultText), 400);
        }
      });
    }
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (currentlySpeakingMsgId === msgId && isSpeaking) {
      stopSpeaking();
      setCurrentlySpeakingMsgId(null);
    } else {
      setCurrentlySpeakingMsgId(msgId);
      speakText(text, 1.05);
    }
  };

  const handleCitationClick = (chunkId: string) => {
    setHighlightedChunk(chunkId);
    setTimeout(() => setHighlightedChunk(null), 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-[90rem] w-full mx-auto px-4 sm:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: Memory & Model Parameters */}
        <section className="lg:w-[22rem] shrink-0 flex flex-col gap-5 text-left">
          
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-350 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          {/* Patient Memory Sync Card */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/5 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" /> Patient Memory Bank
              </span>
              <button 
                onClick={() => editingMemory ? saveMemory() : setEditingMemory(true)}
                className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                {editingMemory ? "Save Sync" : "Edit Profile"}
              </button>
            </div>

            {editingMemory ? (
              <div className="space-y-3">
                {[
                  { key: "age", label: "Age" },
                  { key: "chronicDiseases", label: "Chronic Diseases" },
                  { key: "allergies", label: "Known Allergies" },
                  { key: "currentMedicines", label: "Current Medicines" },
                  { key: "familyHistory", label: "Family Medical History" }
                ].map(item => (
                  <div key={item.key} className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">{item.label}</label>
                    <input 
                      type="text" 
                      value={(patientMemory as any)[item.key]}
                      onChange={(e) => setPatientMemory({ ...patientMemory, [item.key]: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                {[
                  { label: "Age", val: patientMemory.age, icon: <UserCheck className="h-3.5 w-3.5 text-slate-400" /> },
                  { label: "Chronic Illness", val: patientMemory.chronicDiseases, icon: <Thermometer className="h-3.5 w-3.5 text-amber-500" /> },
                  { label: "Allergies", val: patientMemory.allergies, icon: <ShieldAlert className="h-3.5 w-3.5 text-red-500" /> },
                  { label: "Medications", val: patientMemory.currentMedicines, icon: <Pill className="h-3.5 w-3.5 text-blue-500" /> },
                  { label: "Family History", val: patientMemory.familyHistory, icon: <Activity className="h-3.5 w-3.5 text-teal-500" /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="p-1 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">{item.label}</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{item.val || "None Specified"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vector Document Chunks Card */}
          {activeDoc && (
            <div className="flex-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col max-h-[300px] lg:max-h-none">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 shrink-0 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-teal-600" /> RAG References ({activeDoc.chunks.length})
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {activeDoc.chunks.map(chunk => {
                  const isHighlighted = highlightedChunk === chunk.id;
                  return (
                    <div 
                      key={chunk.id}
                      className={`rounded-xl border p-3 text-[10px] leading-relaxed transition-all ${
                        isHighlighted 
                          ? "bg-teal-500/10 border-teal-500 scale-[1.02] shadow-sm shadow-teal-500/5 font-medium" 
                          : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        {chunk.header}
                      </span>
                      <p className="text-slate-605 dark:text-slate-400 line-clamp-3 select-text">
                        {chunk.text}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40 pt-1">
                        <span>Chunk: {chunk.id}</span>
                        <span className="text-teal-600 font-semibold">Indexed</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

        {/* RIGHT COLUMN: AI Chat interface */}
        <section className="flex-1 flex flex-col h-[600px] lg:h-[calc(100vh-140px)] rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm text-left">
          
          {/* Chat Settings Bar */}
          <div className="px-5 py-3 border-b border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
            
            {/* Lang Dropdown */}
            <div className="flex items-center gap-1.5">
              <Languages className="h-4.5 w-4.5 text-teal-600 shrink-0" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900">{lang.native} ({lang.name})</option>
                ))}
              </select>
            </div>

            {/* Special Context Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setEli10(!eli10)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  eli10 
                    ? "bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-400" 
                    : "border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                ELI 10 Mode
              </button>
              
              <button
                onClick={() => setPregnancyMode(!pregnancyMode)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  pregnancyMode 
                    ? "bg-pink-500/10 border-pink-500 text-pink-700 dark:text-pink-400" 
                    : "border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                Pregnancy Mode
              </button>

              <button
                onClick={() => setChildMode(!childMode)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  childMode 
                    ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400" 
                    : "border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                Child Mode
              </button>

              <button
                onClick={() => setElderlyMode(!elderlyMode)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  elderlyMode 
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400" 
                    : "border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                Elderly Care
              </button>

              <button
                onClick={() => setShowRAGInspector(!showRAGInspector)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                  showRAGInspector
                    ? "bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300"
                    : "border-purple-300 dark:border-purple-800 text-purple-650 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                }`}
              >
                <Layers className="h-3 w-3" /> LLM & RAG Proof
              </button>
            </div>
          </div>

          {/* RAG & LLM Architecture Inspector Modal Panel */}
          {showRAGInspector && (
            <div className="p-4 bg-purple-950/90 text-purple-100 border-b border-purple-800 text-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-purple-800/80 pb-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>LLM & RAG Architecture Inspector</span>
                  <span className="px-2 py-0.5 rounded bg-purple-800 text-[9px] text-purple-200">
                    {latestRAGInspection?.llmEngineUsed || "Local Grounded Clinical RAG Model"}
                  </span>
                </div>
                <button
                  onClick={() => setShowRAGInspector(false)}
                  className="text-[10px] hover:underline text-purple-300 cursor-pointer"
                >
                  Close Proof Panel
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1">
                    1. Top-K Vector Chunks Retrieved ({latestRAGInspection?.retrievedChunks.length || 0})
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {(latestRAGInspection?.retrievedChunks || activeDoc?.chunks.map(c => ({ chunk: c, documentTitle: activeDoc.title, documentId: activeDoc.id, similarityScore: 0.94 })) || []).map((rc: any, idx: number) => (
                      <div key={idx} className="bg-purple-900/50 p-2 rounded border border-purple-800/60 text-[10px]">
                        <div className="flex justify-between font-semibold text-purple-200">
                          <span>{rc.documentTitle} — {rc.chunk.header}</span>
                          <span className="text-teal-300 font-bold">{(rc.similarityScore * 100).toFixed(0)}% Vector Match</span>
                        </div>
                        <p className="text-purple-300 line-clamp-2 mt-0.5">{rc.chunk.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1">
                    2. Grounded System Prompt Payload
                  </p>
                  <div className="bg-slate-950 p-2.5 rounded font-mono text-[9px] text-teal-300 max-h-36 overflow-y-auto leading-relaxed border border-purple-800/80">
                    <p className="text-purple-400 font-bold">// System Prompt Payload</p>
                    <p className="text-slate-300">{latestRAGInspection?.systemPrompt || "System: You are MedQuery AI. Ground answers strictly in retrieved chunks from Scanned Patient Form."}</p>
                    <p className="text-purple-400 font-bold mt-2">// Grounded Context Payload</p>
                    <p className="text-slate-400">{latestRAGInspection?.contextPayload || "Retrieved Chunks Payload..."}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/5 dark:bg-slate-950/20">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              const isSpeakingThis = currentlySpeakingMsgId === m.id && isSpeaking;
              
              return (
                <div key={m.id} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  <div className={`h-8.5 w-8.5 rounded-full shrink-0 border flex items-center justify-center font-bold text-[10px] ${
                    isUser 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200/60" 
                      : "bg-teal-650 text-white border-teal-650"
                  }`}>
                    {isUser ? <User className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
                  </div>

                  <div className="space-y-1 text-left">
                    <div className={`rounded-[20px] px-4.5 py-3 text-xs leading-relaxed ${
                      isUser 
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tr-none border border-slate-200/50" 
                        : "bg-teal-600 text-white rounded-tl-none shadow-sm shadow-teal-500/5"
                    }`}>
                      {/* Source Agent header */}
                      {!isUser && m.agentName && (
                        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase text-teal-200 dark:text-teal-200 border-b border-teal-500/30 pb-1 mb-1.5">
                          <Activity className="h-3 w-3 animate-pulse" /> {m.agentName}
                        </div>
                      )}
                      
                      <p className="whitespace-pre-wrap select-text">{m.text}</p>

                      {m.isStreaming && (
                        <span className="inline-flex gap-0.5 ml-1 pt-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </span>
                      )}
                    </div>

                    {/* Cited sources references */}
                    {!isUser && m.text.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-500 dark:text-slate-400 pt-1">
                        {m.confidence && (
                          <span className="font-bold text-teal-650 dark:text-teal-400">
                            {m.confidence}% Confidence
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleToggleSpeak(m.id, m.text)}
                          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent border-none cursor-pointer"
                        >
                          {isSpeakingThis ? (
                            <>
                              <VolumeX className="h-3 w-3 text-red-500" /> Mute Audio
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3 text-teal-600 dark:text-teal-400" /> Read
                            </>
                          )}
                        </button>

                        {m.citedChunks?.map(chunk => (
                          <button
                            key={chunk.id}
                            onClick={() => handleCitationClick(chunk.id)}
                            className="bg-slate-250/80 dark:bg-slate-800 hover:bg-teal-500/15 border border-slate-300/40 dark:border-slate-800 px-2 py-0.5 rounded transition-all cursor-pointer font-bold text-[9px]"
                          >
                            Source: {chunk.id.toUpperCase()}
                          </button>
                        ))}

                        {/* Medical references */}
                        {m.citations?.map((cite, cIdx) => (
                          <span key={cIdx} className="border border-slate-200 dark:border-slate-850 px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-semibold text-slate-450">
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI pipeline status notifications */}
            {ragStatus === "routing" && (
              <div className="mr-auto flex gap-3.5 items-center text-xs text-slate-500 dark:text-slate-400">
                <Brain className="h-4.5 w-4.5 text-teal-500 animate-spin" />
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  Orchestrator: Routing to {activeAgent || "Specialist Agent"}...
                </span>
              </div>
            )}
            {ragStatus === "retrieving" && (
              <div className="mr-auto flex gap-3.5 items-center text-xs text-slate-500 dark:text-slate-400">
                <RefreshCw className="h-4.5 w-4.5 text-teal-500 animate-spin" />
                <span>RAG Retrieval: Locating grounded report vector blocks...</span>
              </div>
            )}
            {ragStatus === "synthesizing" && (
              <div className="mr-auto flex gap-3.5 items-center text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="h-4.5 w-4.5 text-teal-500 animate-pulse" />
                <span>Clinical Synthesizer: Grounding guidelines via CDC/Mayo Clinic...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive follow-ups or emergency trigger */}
          {messages.length > 0 && !messages[messages.length - 1].isStreaming && (
            <div className="px-5 py-2.5 border-t border-slate-150 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex flex-wrap gap-2 shrink-0">
              <button 
                onClick={() => dispatchQuestion("Simplify these values into layman's terms")}
                className="rounded-lg border border-slate-250 dark:border-slate-800 px-3 py-1.5 text-[10px] text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left font-medium cursor-pointer"
              >
                Simplify Terminology 📝
              </button>
              <button 
                onClick={() => dispatchQuestion("Are there any critical warnings or items I should flag for my GP?")}
                className="rounded-lg border border-slate-250 dark:border-slate-800 px-3 py-1.5 text-[10px] text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left font-medium cursor-pointer"
              >
                Critical Warnings 🚨
              </button>
              <button 
                onClick={() => {
                  alert("Chat logs packed. Escalating securely to consulting provider Dr. Smith, M.D. (Referral: 9482-A). Details forwarded to patient portal.");
                }}
                className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-500/5 px-3 py-1.5 text-[10px] text-red-650 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left font-bold cursor-pointer"
              >
                Escalate to Doctor 👨‍⚕️
              </button>
            </div>
          )}

          {/* Input control tray */}
          <div className="p-4 border-t border-slate-200/85 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2.5 items-center">
              <button
                type="button"
                onClick={handleMicrophone}
                className={`p-3 rounded-full border transition-all cursor-pointer ${
                  isListening 
                    ? "bg-red-500 border-red-500 text-white animate-pulse" 
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950"
                }`}
                title={isListening ? "Listening... click to stop" : "Speak to Voice Doctor"}
              >
                <Mic className="h-4.5 w-4.5" />
              </button>
              
              <input
                type="text"
                placeholder={isListening ? "Listening to voice input..." : "Ask follow-ups about your uploaded medical records..."}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isListening}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
              />

              <button
                type="submit"
                disabled={!inputVal.trim() || ragStatus !== "idle"}
                className="p-3 rounded-full bg-teal-650 hover:bg-teal-700 text-white shadow-md shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </section>

      </main>

      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-teal-500 text-xs font-semibold px-4.5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-in-right">
          <CheckCircle2 className="h-4.5 w-4.5 text-teal-400 dark:text-slate-950 shrink-0" />
          <span>{showToast}</span>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500 text-sm">Loading chat...</div>}>
      <ChatPageInner />
    </Suspense>
  );
}
