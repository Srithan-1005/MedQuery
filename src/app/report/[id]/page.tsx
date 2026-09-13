"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, FileText, Printer, Download, Trash2, MessageSquare, 
  Activity, AlertTriangle, Calendar, User, Building, ShieldAlert, CheckCircle 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { MOCK_REPORTS, MedicalDocument } from "@/utils/mockData";
import { loadReportsFromStorage, saveReportsToStorage } from "@/utils/reportStorage";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;

  const [reports, setReports] = useState<MedicalDocument[]>([]);
  const [doc, setDoc] = useState<MedicalDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState(false);

  // Load from shared storage and fall back to mock data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const list = loadReportsFromStorage();
      setReports(list);

      const found = list.find((r: any) => r.id === docId);
      if (found) {
        setDoc(found);
      } else {
        router.push("/dashboard");
      }
    }
  }, [docId, router]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExportJSON = () => {
    if (!doc) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medquery_${doc.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDelete = () => {
    if (!doc) return;
    const updated = reports.filter(r => r.id !== doc.id);
    saveReportsToStorage(updated);
    router.push("/dashboard");
  };

  if (!doc) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 print:bg-white print:text-black">
      
      {/* Disclaimer hides on prints */}
      <div className="print:hidden">
        <MedicalDisclaimer variant="banner" />
        <Navbar />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
        
        {/* Detail navigation triggers - Hidden on print */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-350 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard History
          </Link>

          {/* Action triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Print / Export PDF
            </button>
            <button
              onClick={handleExportJSON}
              className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export Raw JSON
            </button>
            <Link
              href={`/chat?id=${doc.id}`}
              className="rounded-xl bg-teal-650 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-650 px-4.5 py-2.5 text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="h-4 w-4" /> Open Grounded Chat
            </Link>
          </div>
        </div>

        {/* PRINT SNAPSHOT CONTAINER */}
        <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          
          {/* Header Title block */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="rounded bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                Parsed study: {doc.type}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                {doc.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Processed via secure vector RAG reading systems.
              </p>
            </div>
            
            {/* Institution stamp */}
            <div className="text-[10px] text-slate-400 text-left sm:text-right font-medium">
              <p>MEDQUERY SECURE</p>
              <p>ID: {doc.id.toUpperCase()}</p>
              <p className="font-semibold text-teal-600 dark:text-teal-400">HIPAA Compliant Ingestion</p>
            </div>
          </div>

          {/* Patient Details strip */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-y-3 gap-x-8 text-xs text-slate-650 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block leading-none">Date Collected</span>
                <span className="font-semibold">{doc.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block leading-none">Patient Name</span>
                <span className="font-semibold">{doc.patientName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block leading-none">Attending Clinician</span>
                <span className="font-semibold">{doc.doctor}</span>
              </div>
            </div>
          </div>

          {/* 1. PLAIN LANGUAGE SUMMARY */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
              AI Plain-Language Summary
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-teal-500/5 dark:bg-teal-500/5 border-l-3 border-teal-500 p-4 rounded-r-xl font-medium">
              {doc.summary}
            </p>
          </div>

          {/* 2. KEY CLINICAL FINDINGS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
              Extracted Clinical Observations
            </h3>
            <div className="grid gap-3">
              {doc.findings.map((finding, idx) => (
                <div 
                  key={idx}
                  className="flex gap-3 text-xs leading-relaxed text-slate-650 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/30 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850"
                >
                  <span className="h-5.5 w-5.5 rounded-full bg-teal-500/10 text-teal-650 dark:text-teal-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. ABNORMAL MARKERS TABLE */}
          {doc.abnormalValues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" /> Concerns & Out-of-Bounds Markers
              </h3>
              
              <div className="grid gap-3">
                {doc.abnormalValues.map((item, idx) => (
                  <div 
                    key={idx}
                    className="rounded-xl border border-slate-200/80 dark:border-slate-850 p-4 text-xs text-left bg-white dark:bg-slate-900/60 shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                      <span className="font-bold text-slate-850 dark:text-slate-100">{item.marker}</span>
                      <span className={`rounded px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        item.status === "high" 
                          ? "bg-red-500/10 text-red-750 dark:text-red-400" 
                          : item.status === "warning"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                      <div>
                        <span>Observed Value:</span>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{item.value}</p>
                      </div>
                      <div>
                        <span>Reference Standard:</span>
                        <p className="font-semibold text-slate-700 dark:text-slate-350">{item.range}</p>
                      </div>
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                      <strong>Observation note:</strong> {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. DOCTOR DISCUSSION GUIDE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
              Physician Consultation Prep sheet
            </h3>
            
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4.5 text-xs leading-relaxed text-slate-650 dark:text-slate-300">
              <p className="mb-3.5 font-semibold text-slate-900 dark:text-white">
                Questions custom-generated based on anomalous indices:
              </p>
              
              <div className="space-y-3">
                {doc.suggestedQuestions.map((q, idx) => (
                  <div key={idx} className="flex gap-2 p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-850 font-medium">
                    <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0">?</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security purge trigger - Hidden on print */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden gap-4">
            <div className="flex items-center gap-1 text-[10px] text-slate-450 dark:text-slate-400">
              <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
              <span>Grounded. HIPAA protected.</span>
            </div>
            
            <button
              onClick={() => setDeleteTarget(true)}
              className="rounded-xl border border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500/5 px-4.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4 shrink-0" /> Purge Report
            </button>
          </div>

        </div>

        {/* Global safety disclaimer */}
        <div className="print:block hidden text-[9px] text-slate-500 leading-relaxed pt-12 border-t border-slate-300 text-center">
          MedQuery AI is an educational analysis platform. Insights are provided to facilitate, not substitute, the consultation with your certified doctor. Do not adjust treatment based on AI.
        </div>

        {/* Global warning card - Hidden on print */}
        <div className="print:hidden">
          <MedicalDisclaimer variant="card" />
        </div>

        {/* Deletion verification prompt modal - Hidden on print */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
            <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 max-w-sm w-full shadow-2xl text-left space-y-4 animate-scale-in">
              <div className="p-3 bg-red-550/10 rounded-2xl w-fit text-red-650 dark:text-red-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Permanently delete this report?
                </h3>
                <p className="text-xs leading-relaxed text-slate-550 dark:text-slate-400">
                  This action is irreversible. The parsed summaries, detected concerns, and vector nodes will be immediately wiped from the database.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteTarget(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-350 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/10 transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
