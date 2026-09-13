"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, Search, Plus, Trash2, Calendar, User, Building, 
  ShieldCheck, HelpCircle, Activity, CreditCard, Clock, MessageSquare,
  ShieldAlert, Bell, ToggleLeft, ToggleRight, Download, Eye, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import { ExtractedBillData, getBillsFromStorage, deleteBillFromStorage, formatFileSize } from "@/utils/billTypes";

interface TimelineEvent {
  id: string;
  type: "Prescription" | "Report" | "Vaccination" | "Surgery" | "Allergy";
  title: string;
  date: string;
  desc: string;
  provider: string;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    id: "e1",
    type: "Report",
    title: "Complete Blood Count Panel",
    date: "2026-06-15",
    desc: "Hemoglobin registered low at 9.0 g/dL. Iron deficiency indicated.",
    provider: "City Wellness Laboratory"
  },
  {
    id: "e2",
    type: "Prescription",
    title: "Cardiovascular Beta-Blocker Therapy",
    date: "2026-05-12",
    desc: "Amlodipine 5mg and Atorvastatin 20mg prescribed for cardiac stability.",
    provider: "Dr. Emily Vance, Cardiologist"
  },
  {
    id: "e3",
    type: "Vaccination",
    title: "COVID-19 Annual Booster",
    date: "2026-02-10",
    desc: "Spikevax booster dose administered. No immediate adverse effects.",
    provider: "Metro Pharmacy Services"
  },
  {
    id: "e4",
    type: "Surgery",
    title: "Laparoscopic Appendectomy",
    date: "2025-08-20",
    desc: "Routine acute appendicitis resolution. Scar healing successfully resolved.",
    provider: "Metro General Hospital"
  }
];

export default function VaultPage() {
  const [bills, setBills] = useState<ExtractedBillData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState("");
  const [vaultTab, setVaultTab] = useState<"timeline" | "bills">("timeline");

  // Reminders Notification channels simulation
  const [channelPush, setChannelPush] = useState(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState(false);
  const [channelSMS, setChannelSMS] = useState(false);

  // Timeline Event Management
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [filterType, setFilterType] = useState<"all" | "Prescription" | "Report" | "Vaccination" | "Surgery" | "Allergy">("all");
  
  // Custom event creator states
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventProvider, setNewEventProvider] = useState("");
  const [newEventType, setNewEventType] = useState<any>("Vaccination");

  // Load storage
  useEffect(() => {
    setBills(getBillsFromStorage());

    // Load timeline events
    if (typeof window !== "undefined") {
      const storedTimeline = localStorage.getItem("medquery-timeline-events");
      if (storedTimeline) {
        setTimelineEvents(JSON.parse(storedTimeline));
      } else {
        setTimelineEvents(DEFAULT_EVENTS);
        localStorage.setItem("medquery-timeline-events", JSON.stringify(DEFAULT_EVENTS));
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteBillFromStorage(id);
    setBills(updated);
    triggerToast("Record permanently deleted from vault.");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3500);
  };

  const handleAddTimelineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) {
      alert("Please fill in the title and date.");
      return;
    }

    const newEvent: TimelineEvent = {
      id: "event-" + Date.now(),
      type: newEventType,
      title: newEventTitle,
      date: newEventDate,
      desc: newEventDesc || "Logged into patient records tracker.",
      provider: newEventProvider || "Self Reported"
    };

    const updated = [newEvent, ...timelineEvents];
    setTimelineEvents(updated);
    localStorage.setItem("medquery-timeline-events", JSON.stringify(updated));
    
    // Clear inputs
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventDesc("");
    setNewEventProvider("");
    setShowAddEvent(false);
    triggerToast("New clinical history event logged to medical timeline!");
  };

  const filteredBills = bills.filter(doc => {
    const query = searchQuery.toLowerCase();
    return (
      doc.fileName.toLowerCase().includes(query) ||
      doc.patientName.toLowerCase().includes(query) ||
      doc.hospitalName.toLowerCase().includes(query) ||
      doc.doctorName.toLowerCase().includes(query) ||
      doc.diagnosis.toLowerCase().includes(query)
    );
  });

  const totalSpent = bills.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  // Filter timeline
  const filteredEvents = timelineEvents.filter(ev => {
    return filterType === "all" || ev.type === filterType;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 text-left">
        
        {/* Dynamic Toast Feedback */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-teal-500 text-xs font-semibold px-4.5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-in-right">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-400 dark:text-slate-950 shrink-0" />
            <span>{showToast}</span>
          </div>
        )}

        {/* Offline Mode Banner Indicator */}
        <div className="rounded-2xl border border-teal-500/25 bg-teal-500/5 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5.5 w-5.5 text-teal-605" />
            <div className="text-xs">
              <p className="font-bold text-slate-900 dark:text-white">Offline Vault Sync Activated</p>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Your parsed reports are cached in your local sandbox browser. Download copies for full portability.</p>
            </div>
          </div>
          <button 
            onClick={() => triggerToast("Offline report package downloaded (.ZIP format).")}
            className="rounded-xl border border-teal-200 dark:border-teal-850 px-3.5 py-2 text-[10px] font-bold text-teal-700 dark:text-teal-400 hover:bg-teal-500/10 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5" /> Download Cached Records
          </button>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Medical Timeline & Records Vault
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Securely tracks prescriptions, vaccination alerts, and surgical timeline logs.
            </p>
          </div>
          <Link
            href="/analyze"
            className="w-fit rounded-xl bg-teal-650 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-650 px-4.5 py-2.5 text-xs font-bold text-white shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4 shrink-0" /> Parse New Document
          </Link>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-slate-205 dark:bg-slate-900 rounded-xl w-fit mb-8">
          <button
            onClick={() => setVaultTab("timeline")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              vaultTab === "timeline" 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Chronological Timeline & Reminders
          </button>
          <button
            onClick={() => setVaultTab("bills")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              vaultTab === "bills" 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Extracted Bills & Spendings ({bills.length})
          </button>
        </div>

        {/* ================================== TAB 1: MEDICAL TIMELINE & REMINDERS ================================== */}
        {vaultTab === "timeline" && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Timeline Event Stream (cols-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Filter and Add Event actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl">
                <div className="flex flex-wrap gap-1">
                  {["all", "Prescription", "Report", "Vaccination", "Surgery"].map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        filterType === t 
                          ? "bg-teal-500/10 text-teal-700 dark:text-teal-400" 
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  className="rounded-xl bg-teal-650 hover:bg-teal-700 text-white font-bold px-3 py-1.5 text-[10px] cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Log Event
                </button>
              </div>

              {/* Add Custom Event Modal Form */}
              {showAddEvent && (
                <form onSubmit={handleAddTimelineEvent} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl space-y-4 animate-slide-up">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Log Custom Medical Record</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Event Title</label>
                      <input 
                        type="text" required
                        placeholder="e.g. Flu Vaccine booster"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Record Type</label>
                      <select
                        value={newEventType}
                        onChange={(e) => setNewEventType(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="Vaccination">Vaccination</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Report">Report Document</option>
                        <option value="Prescription">Prescription</option>
                        <option value="Allergy">Allergy</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Date</label>
                      <input 
                        type="date" required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-slate-400">Provider / Hospital</label>
                      <input 
                        type="text"
                        placeholder="e.g. Dr. Vance / City Pharmacy"
                        value={newEventProvider}
                        onChange={(e) => setNewEventProvider(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Event Description / Details</label>
                    <textarea 
                      placeholder="e.g. Prescribed daily amlodipine details. Standard checks."
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-teal-650 hover:bg-teal-700 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Commit Event Log
                  </button>
                </form>
              )}

              {/* Vertical timeline items */}
              <div className="relative border-l border-slate-200 dark:border-slate-850 ml-4.5 pl-6 space-y-8 text-left">
                {filteredEvents.map((ev) => (
                  <div key={ev.id} className="relative">
                    {/* Circle icon marker */}
                    <div className="absolute -left-10.5 top-1 h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center shadow-sm">
                      <Calendar className="h-4.5 w-4.5 text-teal-605" />
                    </div>
                    
                    <div className="space-y-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/5 px-2 py-0.5 rounded">
                          {ev.type}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {ev.date}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ev.desc}</p>
                      <p className="text-[9px] font-bold text-slate-400 pt-1">Provider: {ev.provider}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT: Medication reminders channel (cols-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Active Medication Reminders Calendar */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Bell className="h-5 w-5 text-teal-650 animate-bounce" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Medicine Reminders</h3>
                </div>

                <div className="space-y-3.5 text-xs text-left">
                  {[
                    { name: "Amlodipine 5mg", time: "8:00 AM (Morning)", status: "Active" },
                    { name: "Aspirin 81mg (Low Dose)", time: "1:30 PM (Afternoon)", status: "Active" },
                    { name: "Atorvastatin 20mg", time: "9:00 PM (Night)", status: "Active" }
                  ].map((rem, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                      <div>
                        <p className="font-bold text-slate-850 dark:text-white">{rem.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Clock className="h-3 w-3 text-teal-500" /> {rem.time}</p>
                      </div>
                      <span className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-lg shrink-0">
                        {rem.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Toggles Channel simulation */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 text-left">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                  Reminder Distribution Channels
                </h3>

                <div className="space-y-4">
                  {[
                    { label: "Push Notification Alerts", desc: "Simulate live browser banner reminders.", active: channelPush, set: setChannelPush },
                    { label: "WhatsApp Messaging Alerts", desc: "Forwards medication logs to your verified phone number.", active: channelWhatsApp, set: setChannelWhatsApp },
                    { label: "SMS Cell Carrier Alerts", desc: "Standard text message fallbacks.", active: channelSMS, set: setChannelSMS }
                  ].map((ch, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="text-xs leading-normal">
                        <p className="font-bold text-slate-800 dark:text-white">{ch.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{ch.desc}</p>
                      </div>
                      <button 
                        onClick={() => {
                          ch.set(!ch.active);
                          triggerToast(`${ch.label} channel ${!ch.active ? 'activated' : 'deactivated'}.`);
                        }}
                        className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
                      >
                        {ch.active ? <ToggleRight className="h-7 w-7 text-teal-650" /> : <ToggleLeft className="h-7 w-7" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================================== TAB 2: SPENDINGS & INVOICES VAULT ================================== */}
        {vaultTab === "bills" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: "Stored Records", value: bills.length, desc: "Processed invoices", icon: <FileText className="h-4.5 w-4.5 text-teal-600" /> },
                { title: "Healthcare Spend", value: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, desc: "Tracked from bills", icon: <CreditCard className="h-4.5 w-4.5 text-teal-600" /> },
                { title: "Unique Facilities", value: new Set(bills.map(b => b.hospitalName).filter(Boolean)).size, desc: "Clinics logged", icon: <Building className="h-4.5 w-4.5 text-teal-650" /> },
                { title: "Average Confidence", value: `${bills.length > 0 ? Math.round(bills.reduce((a,c) => a + c.extractionConfidence, 0)/bills.length) : 0}%`, desc: "Extraction accuracy", icon: <ShieldCheck className="h-4.5 w-4.5 text-teal-605" /> }
              ].map((m, i) => (
                <div key={i} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.title}</span>
                    <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl">{m.icon}</div>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{m.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl mb-6 shadow-sm flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stored bills, prescriptions, diagnoses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {filteredBills.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-12 text-center shadow-sm">
                <HelpCircle className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">No structured records logged</h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Upload prescription or bill files on Workspace to populate invoices.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredBills.map((bill) => (
                  <div key={bill.id} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">{bill.fileName}</h3>
                        <p className="text-[10px] text-slate-400">Processed: {bill.uploadDate}</p>
                      </div>
                      <span className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded">
                        {bill.totalAmount ? `$${bill.totalAmount.toFixed(2)}` : "N/A"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p><span className="font-semibold text-slate-500">Provider:</span> {bill.doctorName} ({bill.hospitalName})</p>
                      <p><span className="font-semibold text-slate-500">Diagnosis:</span> {bill.diagnosis}</p>
                      <p><span className="font-semibold text-slate-500">Advice:</span> {bill.advice}</p>
                    </div>

                    <div className="flex gap-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={() => handleDelete(bill.id)}
                        className="rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-500/10 text-red-650 px-3.5 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
