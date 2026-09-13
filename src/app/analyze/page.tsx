"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Upload, Sparkles, FileText, ChevronRight, Activity, AlertTriangle, 
  HelpCircle, Eye, RefreshCw, FileCheck, CheckCircle2, Lock, ArrowRight, 
  ShieldAlert, Calendar, Clock, Smile, Scale, Heart, Plus, TrendingUp, Info
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import SparklesAnim from "@/components/ui/Sparkles";
import { MOCK_REPORTS, MedicalDocument } from "@/utils/mockData";
import { saveBillToStorage, ExtractedBillData } from "@/utils/billTypes";
import { buildSuggestedQuestions, upsertReportToStorage } from "@/utils/reportStorage";

type ActiveTool = "report" | "prescription" | "dermatology" | "ophthalmology" | "dental" | "nutrition" | "comparison";

export default function AnalyzePage() {
  const [reportsList, setReportsList] = useState<MedicalDocument[]>([]);
  const [activeTool, setActiveTool] = useState<ActiveTool>("report");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Result displays
  const [reportResult, setReportResult] = useState<MedicalDocument | null>(null);
  const [prescResult, setPrescResult] = useState<any>(null);
  const [dermResult, setDermResult] = useState<any>(null);
  const [eyeResult, setEyeResult] = useState<any>(null);
  const [dentalResult, setDentalResult] = useState<any>(null);
  const [nutritionResult, setNutritionResult] = useState<any>(null);

  // Comparison inputs
  const [compReportIdA, setCompReportIdA] = useState("");
  const [compReportIdB, setCompReportIdB] = useState("");
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("medquery-documents");
      if (stored) {
        setReportsList(JSON.parse(stored));
      } else {
        setReportsList(MOCK_REPORTS);
        localStorage.setItem("medquery-documents", JSON.stringify(MOCK_REPORTS));
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3500);
  };

  // Generic processing simulator
  const runDiagnosticsSimulation = (toolType: ActiveTool, callback: () => void) => {
    setProcessing(true);
    setProgress(15);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setProcessing(false);
            callback();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // 1. Report Upload Handler
  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`Unsupported file type: "${file.name}". Please upload a PDF, PNG, or JPG file.`);
      e.target.value = "";
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 50 MB.`);
      e.target.value = "";
      return;
    }

    try {
    runDiagnosticsSimulation("report", () => {
      // Create custom report mock document
      const newDoc: MedicalDocument = {
        id: "custom-" + Date.now(),
        title: file.name,
        type: "lab",
        date: new Date().toLocaleDateString(),
        doctor: "Dr. Alexander Ross, MD",
        clinic: "City Wellness Laboratory",
        patientName: "Active Patient Profile",
        rawText: `Complete Blood Count (CBC) analysis. Hemoglobin level recorded at 9.0 g/dL. Reference interval is 12.0 - 16.0 g/dL. Out of bounds. Red Blood Cell Count is 3.8 x10^6/uL. Highly suggestive of mild iron deficiency anemia. Follow-up is advised.`,
        summary: `The uploaded report "${file.name}" has been successfully parsed. It shows an out-of-range low Hemoglobin level (9.0 g/dL), indicating moderate microcytic anemia.`,
        findings: [
          "Low Hemoglobin level (9.0 g/dL) - Standard healthy range is 12-16 g/dL.",
          "Low Red Blood Cell Count (3.8 x10^6/uL).",
          "Suggests active iron-deficiency or vitamin deficiency anemia."
        ],
        abnormalValues: [
          { marker: "Hemoglobin", value: "9.0", range: "12.0 - 16.0", status: "low", notes: "Depleted oxygen transport capacity" }
        ],
        suggestedQuestions: [
          "What foods can help improve my low hemoglobin levels?",
          "Are there specific vitamins I should take for microcytic anemia?",
          "Should I schedule a follow-up blood check in three months?"
        ],
        chunks: [
          { id: "cb-chunk-1", header: "Hematology Panel", text: "Hemoglobin 9.0 g/dL (Low), Hematocrit 28% (Low), RBC 3.8 (Low). Suggestive of iron deficiency." }
        ]
      };

      setReportResult(newDoc);
      // Save report in library
      const updated = [newDoc, ...reportsList];
      setReportsList(updated);
      upsertReportToStorage(newDoc);
      
      // Save metadata bill details to vault
      const newBill: ExtractedBillData = {
        id: "bill-" + Date.now(),
        fileName: file.name,
        uploadDate: new Date().toLocaleDateString(),
        fileSize: "1.2 MB",
        fileType: "pdf",
        rawText: newDoc.rawText,
        patientName: newDoc.patientName,
        hospitalName: newDoc.clinic,
        doctorName: newDoc.doctor,
        date: newDoc.date,
        medicines: ["Iron Supplements 325mg"],
        tests: ["Complete Blood Count (CBC)"],
        totalAmount: 185.00,
        diagnosis: "Iron Deficiency Anemia",
        advice: "Prescribed daily oral iron therapy, schedule full blood follow-up in 90 days.",
        extractionConfidence: 95,
        status: "processed"
      };
      saveBillToStorage(newBill);
      triggerToast("Report processed and stored securely in Vault.");
    });
    } catch (err) {
      setUploadError("An unexpected error occurred while processing your report. Please try again.");
      setProcessing(false);
    }
  };

  // 2. Prescription Scanner Upload
  const handlePrescriptionUpload = () => {
    runDiagnosticsSimulation("prescription", () => {
      const schedule = {
        doctor: "Dr. Emily Vance, Cardiologist",
        clinic: "St. Jude Heart Institute",
        date: new Date().toLocaleDateString(),
        medications: [
          { name: "Amlodipine 5mg", dosage: "1 Tablet", timing: "Morning", duration: "30 Days", purpose: "Blood Pressure control" },
          { name: "Atorvastatin 20mg", dosage: "1 Tablet", timing: "Night", duration: "90 Days", purpose: "Cholesterol management" },
          { name: "Aspirin 81mg (Low Dose)", dosage: "1 Tablet", timing: "Afternoon", duration: "Continuous", purpose: "Cardiovascular defense" }
        ]
      };

      // Save schedule to local storage reminders
      localStorage.setItem("medquery-active-schedule", JSON.stringify(schedule));
      
      // Also register this as a timeline vaccine or medication record
      const storedTimeline = localStorage.getItem("medquery-timeline-events") || "[]";
      try {
        const events = JSON.parse(storedTimeline);
        const newEvents = [
          { id: "timeline-" + Date.now(), type: "Prescription", title: "Amlodipine & Atorvastatin therapy", date: new Date().toLocaleDateString(), desc: "Cardiovascular treatment plan logged from prescription scan.", provider: "Dr. Emily Vance" },
          ...events
        ];
        localStorage.setItem("medquery-timeline-events", JSON.stringify(newEvents));
      } catch (e) {}

      setPrescResult(schedule);
      triggerToast("Prescription loaded: automated medicine reminder schedule activated!");
    });
  };

  // 3. Dermatology
  const handleDermatologyUpload = () => {
    runDiagnosticsSimulation("dermatology", () => {
      setDermResult({
        condition: "Eczema (Atopic Dermatitis)",
        confidence: 86,
        summary: "Visual indicators suggest localized dry patches, light scaling, and erythematous borders. Consistent with moderate atopic eczema.",
        recommendations: [
          "Apply non-scented emollients or colloidal oatmeal lotion twice daily.",
          "Avoid hot showers and harsh chemical body soaps.",
          "Consult a dermatologist if inflammation spreads or leaks fluid."
        ],
        specialist: "Dermatologist (Skin Specialist)"
      });
      triggerToast("Skin analysis diagnostic complete.");
    });
  };

  // 4. Ophthalmology
  const handleOphthalmologyUpload = () => {
    runDiagnosticsSimulation("ophthalmology", () => {
      setEyeResult({
        condition: "Allergic Conjunctivitis",
        confidence: 91,
        summary: "Visual scans indicate scleral redness, vascular congestion, and watery tear film. No indications of cataracts or deep lens clouding.",
        recommendations: [
          "Use lubricating saline eye drops or antihistamine eye drops.",
          "Apply cool compresses over closed eyes for 10 minutes.",
          "Do not rub eyes, as this triggers further histamine release."
        ],
        specialist: "Ophthalmologist / Eye Surgeon"
      });
      triggerToast("Ophthalmic analysis diagnostic complete.");
    });
  };

  // 5. Dental
  const handleDentalUpload = () => {
    runDiagnosticsSimulation("dental", () => {
      setDentalResult({
        condition: "Plaque Accumulation / Mild Gingivitis",
        confidence: 88,
        summary: "Visual indicators show moderate yellowish plaque build-up along the lower molar gumline with light marginal swelling.",
        recommendations: [
          "Schedule a professional dental scaling / cleaning.",
          "Improve flossing frequency and use antiseptic mouthwash.",
          "Brush twice daily using soft-bristled toothbrushes."
        ],
        specialist: "General Dentist / Periodontist"
      });
      triggerToast("Dental analysis diagnostic complete.");
    });
  };

  // 6. Nutrition
  const handleNutritionUpload = () => {
    runDiagnosticsSimulation("nutrition", () => {
      setNutritionResult({
        item: "Greek Salad with Grilled Chicken",
        calories: 380,
        macros: {
          protein: "35g",
          carbs: "12g",
          fat: "20g",
          sugar: "4g"
        },
        healthCheck: "Excellent low-glycemic meal choice. Highly recommended for pre-diabetes and muscle synthesis.",
        nutritionCoachTip: "Add a squeeze of lemon juice instead of extra oil dressing to reduce caloric density."
      });
      triggerToast("Nutrition analysis diagnostic complete.");
    });
  };

  // 7. Report Comparison
  const handleCompareReports = () => {
    if (!compReportIdA || !compReportIdB) {
      alert("Please select two reports to compare.");
      return;
    }

    runDiagnosticsSimulation("comparison", () => {
      const repA = reportsList.find(r => r.id === compReportIdA);
      const repB = reportsList.find(r => r.id === compReportIdB);

      setComparisonResult({
        titleA: repA?.title || "Report 1",
        titleB: repB?.title || "Report 2",
        dateA: repA?.date || "Jan 2026",
        dateB: repB?.date || "Jun 2026",
        metrics: [
          { marker: "Fasting Blood Sugar", valA: "180 mg/dL", valB: "120 mg/dL", change: "-33% (Improved)", status: "better" },
          { marker: "LDL Cholesterol", valA: "165 mg/dL", valB: "140 mg/dL", change: "-15% (Improved)", status: "better" },
          { marker: "Hemoglobin", valA: "11.2 g/dL", valB: "13.4 g/dL", change: "+19.6% (Improved)", status: "better" }
        ],
        synthesis: "Your blood panel values show significant positive progress! The blood glucose level has decreased by 33% due to active metformin therapy and diet tracking. LDL cholesterol has also decreased by 15%, bringing you close to target cardiac safety intervals."
      });
      triggerToast("Chronological trend comparison successfully parsed!");
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 text-left">
        
        {/* Page Header */}
        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-teal-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Diagnostics & Vision AI Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyze blood sheets, translate prescriptions into calendars, check skin anomalies, and compare medical timelines.
          </p>
        </div>

        {/* Diagnostics Workspace Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Diagnostic Tool Switchers (cols-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Diagnostic AI Suites
              </h2>

              <div className="flex flex-col gap-1.5">
                {[
                  { id: "report", label: "Report OCR & Ingestion", desc: "Upload blood/lab reports to parse markers" },
                  { id: "prescription", label: "Prescription Scheduler", desc: "Convert prescription scans into timetables" },
                  { id: "dermatology", label: "Dermatology AI", desc: "Scan skin rash photos for diagnostic risks" },
                  { id: "ophthalmology", label: "Ophthalmology AI", desc: "Scan eye photos for redness and cataract" },
                  { id: "dental", label: "Dental Analyzer", desc: "Check teeth photos for cavities & plaque" },
                  { id: "nutrition", label: "Nutrition & Food AI", desc: "Analyze meal photos for calorie/macro values" },
                  { id: "comparison", label: "Report Trend Comparison", desc: "Compare two reports chronologically" }
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id as ActiveTool);
                      setProcessing(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeTool === tool.id
                        ? "bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-400 font-semibold"
                        : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950"
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{tool.label}</p>
                    <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 leading-tight">{tool.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Shield warning compliance banner */}
            <div className="rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-500/5 p-4 flex gap-3 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Clinical Advisory</span>: Vision analyses, risk percentages, and nutrition scans represent estimations only. Standard dermatologist/dentist consults are advised for full diagnostics.
              </div>
            </div>
          </div>

          {/* RIGHT: Active Tool Ingest & Results Panel (cols-8) */}
          <div className="lg:col-span-8">
            <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm min-h-[480px] flex flex-col">
              
              {/* If processing, display high-fidelity animation loading */}
              {processing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="relative h-16 w-16 mb-4">
                    <RefreshCw className="h-16 w-16 text-teal-600 animate-spin absolute" />
                    <Sparkles className="h-8 w-8 text-teal-400 absolute top-4 left-4 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Diagnostic Scan In Progress</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Executing multi-agent routing engines and OCR models. Extracting features and structuring variables...
                  </p>
                  
                  {/* Progress meter */}
                  <div className="mt-6 h-2 w-full max-w-xs rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  
                  {/* TOOL 1: Report OCR & Ingestion */}
                  {activeTool === "report" && (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-500/5 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500 transition-all relative overflow-hidden group">
                        <input 
                          type="file" 
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleReportUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">Upload Medical Lab Report</h3>
                        <p className="text-xs text-slate-400 mt-1">PDF, JPG, or PNG up to 50MB</p>
                      </div>

                      {uploadError && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                      )}

                      {/* Display processed report summary if present */}
                      {reportResult ? (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{reportResult.title}</h3>
                              <p className="text-[10px] text-slate-400">{reportResult.clinic} • {reportResult.doctor}</p>
                            </div>
                            <span className="bg-red-500/10 text-red-700 dark:text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              Concerning Markers Detected
                            </span>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Clinical Summary</h4>
                            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">{reportResult.summary}</p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Observations</h4>
                            <div className="space-y-1.5">
                              {reportResult.findings.map((f, fIdx) => (
                                <div key={fIdx} className="flex gap-2 text-xs text-slate-650 dark:text-slate-350">
                                  <span className="text-teal-500">✓</span>
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="flex gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <Link 
                              href={`/chat?id=${reportResult.id}`}
                              className="rounded-xl bg-teal-650 hover:bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow transition-all flex items-center gap-1.5"
                            >
                              Open Clinical Chat <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                              href="/dashboard"
                              className="rounded-xl border border-slate-200 dark:border-slate-850 px-4 py-2 text-xs font-bold text-slate-750 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                            >
                              Go to Dashboard Library
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-slate-100 dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                          <FileText className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                          <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300 mt-2">No active report analyzed</h4>
                          <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                            Upload a report file to test the extraction and immediately unlock secure chat vectors.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TOOL 2: Prescription Scheduler */}
                  {activeTool === "prescription" && (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div 
                        onClick={handlePrescriptionUpload}
                        className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-500/5 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500 transition-all group"
                      >
                        <Upload className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">Upload Doctor's Prescription Image</h3>
                        <p className="text-xs text-slate-400 mt-1">Select simulated prescription to build calendar schedule</p>
                      </div>

                      {prescResult && (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Medication Schedule</h3>
                              <p className="text-[10px] text-slate-400">{prescResult.clinic} • {prescResult.doctor}</p>
                            </div>
                            <span className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> 3 Medicines Registered
                            </span>
                          </div>

                          <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {prescResult.medications.map((med: any, idx: number) => (
                              <div key={idx} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <Activity className="h-3.5 w-3.5 text-teal-600" /> {med.name}
                                  </p>
                                  <p className="text-[10px] text-slate-500">Purpose: {med.purpose}</p>
                                </div>
                                <div className="text-right text-[10px] font-semibold text-slate-650 dark:text-slate-400 space-y-1">
                                  <p className="flex items-center gap-1 justify-end"><Clock className="h-3 w-3 text-teal-550" /> {med.timing} ({med.dosage})</p>
                                  <p>Duration: {med.duration}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TOOL 3: Dermatology AI */}
                  {activeTool === "dermatology" && (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div 
                        onClick={handleDermatologyUpload}
                        className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-500/5 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500 transition-all group"
                      >
                        <Upload className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">Upload Skin Disease Photo</h3>
                        <p className="text-xs text-slate-400 mt-1">Predicts Eczema, Psoriasis, Ringworm risks</p>
                      </div>

                      {dermResult && (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dermatology Skin Report</h3>
                            <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              Confidence: {dermResult.confidence}%
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Indicated Condition: {dermResult.condition}</p>
                            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-355">{dermResult.summary}</p>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-[10px] font-bold uppercase text-slate-400">Suggested Action Plan</p>
                            {dermResult.recommendations.map((rec: string, idx: number) => (
                              <div key={idx} className="flex gap-2 text-xs text-slate-650 dark:text-slate-350">
                                <span className="text-amber-500">•</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TOOL 4: Ophthalmology AI */}
                  {activeTool === "ophthalmology" && (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div 
                        onClick={handleOphthalmologyUpload}
                        className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-500/5 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500 transition-all group"
                      >
                        <Upload className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">Upload Eye Scan Photo</h3>
                        <p className="text-xs text-slate-400 mt-1">Check for cataracts, dry redness, or corneal infection</p>
                      </div>

                      {eyeResult && (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ophthalmological Eye Scan</h3>
                            <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              Confidence: {eyeResult.confidence}%
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Indicated Condition: {eyeResult.condition}</p>
                            <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350">{eyeResult.summary}</p>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-[10px] font-bold uppercase text-slate-400">Clinical Advice</p>
                            {eyeResult.recommendations.map((rec: string, idx: number) => (
                              <div key={idx} className="flex gap-2 text-xs text-slate-650 dark:text-slate-350">
                                <span className="text-teal-500">•</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TOOL 5: Dental Analyzer */}
                  {activeTool === "dental" && (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div 
                        onClick={handleDentalUpload}
                        className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-500/5 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500 transition-all group"
                      >
                        <Upload className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">Upload Teeth/Mouth Photo</h3>
                        <p className="text-xs text-slate-400 mt-1">Detect cavities, plaque buildup, or gum recession</p>
                      </div>

                      {dentalResult && (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dental Cavity & Plaque Scan</h3>
                            <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              Confidence: {dentalResult.confidence}%
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Suggested Finding: {dentalResult.condition}</p>
                            <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-350">{dentalResult.summary}</p>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-[10px] font-bold uppercase text-slate-400">Oral Health Care Routine</p>
                            {dentalResult.recommendations.map((rec: string, idx: number) => (
                              <div key={idx} className="flex gap-2 text-xs text-slate-650 dark:text-slate-350">
                                <span className="text-teal-500">•</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TOOL 6: Nutrition & Food AI */}
                  {activeTool === "nutrition" && (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div 
                        onClick={handleNutritionUpload}
                        className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-500/5 rounded-2xl p-8 text-center cursor-pointer hover:border-teal-500 transition-all group"
                      >
                        <Upload className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4">Upload Meal Image</h3>
                        <p className="text-xs text-slate-400 mt-1">Extracts calories, protein, carbs, and fat metrics</p>
                      </div>

                      {nutritionResult && (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Vision Nutrition Intake Card</h3>
                            <span className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                              Detected: {nutritionResult.item}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-3">
                            {[
                              { label: "Calories", val: `${nutritionResult.calories} kcal`, icon: <Activity className="h-4 w-4 text-orange-500" /> },
                              { label: "Protein", val: nutritionResult.macros.protein, icon: <Scale className="h-4 w-4 text-blue-500" /> },
                              { label: "Carbs", val: nutritionResult.macros.carbs, icon: <Smile className="h-4 w-4 text-amber-500" /> },
                              { label: "Fat", val: nutritionResult.macros.fat, icon: <Heart className="h-4 w-4 text-red-500" /> }
                            ].map((macro, mIdx) => (
                              <div key={mIdx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl text-center space-y-1">
                                <div className="mx-auto w-fit p-1 bg-slate-50 dark:bg-slate-950 rounded">{macro.icon}</div>
                                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">{macro.label}</p>
                                <p className="text-xs font-bold text-slate-850 dark:text-slate-100">{macro.val}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                            <p className="text-[9px] font-bold uppercase text-slate-400">Dietary Compatibility</p>
                            <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{nutritionResult.healthCheck}</p>
                            <p className="text-teal-650 dark:text-teal-400 font-semibold mt-1">💡 Coach Tip: {nutritionResult.nutritionCoachTip}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TOOL 7: Report Trend Comparison */}
                  {activeTool === "comparison" && (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Chronological Panels</h3>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">Earlier Report A (Baseline)</label>
                            <select
                              value={compReportIdA}
                              onChange={(e) => setCompReportIdA(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                            >
                              <option value="">-- Choose Report A --</option>
                              {reportsList.map(rep => (
                                <option key={rep.id} value={rep.id}>{rep.title} ({rep.date})</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase text-slate-400">Later Report B (Current)</label>
                            <select
                              value={compReportIdB}
                              onChange={(e) => setCompReportIdB(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                            >
                              <option value="">-- Choose Report B --</option>
                              {reportsList.map(rep => (
                                <option key={rep.id} value={rep.id}>{rep.title} ({rep.date})</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={handleCompareReports}
                          className="w-full rounded-xl bg-teal-650 hover:bg-teal-700 py-2.5 text-xs font-bold text-white transition-all shadow cursor-pointer"
                        >
                          Compare Chronological Trends
                        </button>
                      </div>

                      {comparisonResult && (
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4 animate-fade-in">
                          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Grounded Chronological Comparison</h3>
                            <p className="text-[10px] text-slate-405 mt-0.5">{comparisonResult.titleA} ({comparisonResult.dateA}) vs {comparisonResult.titleB} ({comparisonResult.dateB})</p>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                                  <th className="py-2">Metric</th>
                                  <th className="py-2">Baseline (A)</th>
                                  <th className="py-2">Current (B)</th>
                                  <th className="py-2 text-right">Trend Change</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                {comparisonResult.metrics.map((m: any, idx: number) => (
                                  <tr key={idx}>
                                    <td className="py-2.5 font-semibold">{m.marker}</td>
                                    <td className="py-2.5">{m.valA}</td>
                                    <td className="py-2.5 font-bold">{m.valB}</td>
                                    <td className="py-2.5 text-right font-bold text-teal-600 dark:text-teal-400 flex items-center justify-end gap-1">
                                      <TrendingUp className="h-3.5 w-3.5" /> {m.change}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 bg-teal-500/5 p-3.5 rounded-xl">
                            <p className="text-[9px] font-bold uppercase text-teal-650 tracking-wider flex items-center gap-1">
                              <Info className="h-3.5 w-3.5" /> Trend Insights Summary
                            </p>
                            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-350">{comparisonResult.synthesis}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Toast popup */}
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
