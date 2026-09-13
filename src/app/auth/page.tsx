"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Activity, KeyRound, Mail, ArrowRight, ShieldAlert, Check } from "lucide-react";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all standard credentials.");
      return;
    }

    if (mode === "signup" && !consentChecked) {
      setErrorMsg("You must accept the Clinical Consent Agreement to establish an account.");
      return;
    }

    setLoading(true);
    
    // Simulate a secure login / account creation
    setTimeout(() => {
      setLoading(false);
      
      const derivedName = mode === "signup"
        ? (fullName || "Guest Patient")
        : (email.split("@")[0]?.replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "John Doe");

      if (typeof window !== "undefined") {
        localStorage.setItem("medquery-session", JSON.stringify({
          email,
          name: derivedName,
          authenticated: true,
          provider: "clinivault"
        }));
      }
      
      router.push("/dashboard");
    }, 1200);
  };

  const handleQuickDemo = () => {
    setEmail("patient.demo@clinivault.ai");
    setPassword("securesandbox123");
    setConsentChecked(true);
    setMode("login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />

      {/* Main split-pane content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Pane - Medical Integrity & Brand (Large Screen only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-850 to-slate-900 dark:from-teal-950 dark:to-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent)] pointer-events-none" />
          
          {/* Top Brand logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="h-9 w-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              MedQuery <span className="text-teal-400">AI</span>
            </span>
          </Link>

          {/* Core Trust Text slide */}
          <div className="space-y-6 max-w-md relative z-10">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
              Clinical security, built from the vector layer up.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We process medical document uploads in transient sandbox instances. Your details are vectorized securely for localized chat RAG operations, ensuring your private data never enters public models.
            </p>
            
            <div className="space-y-3.5 text-xs text-slate-200">
              {[
                "AES-256 secure encryption protocols at rest",
                "Full anonymization of patient and clinic identifiers",
                "Instant audit delete button to purge files permanently",
                "HIPAA-compliant hosting standards"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="p-1 bg-teal-500/20 text-teal-400 rounded-full shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer of the panel */}
          <div className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} MedQuery AI / Clinivault Inc. Security and Compliance Division.
          </div>
        </div>

        {/* Right Pane - Dynamic Interactive Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="w-full max-w-md space-y-6">
            
            {/* Form Container */}
            <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl relative transition-all duration-300">
              
              {/* Header */}
              <div className="text-center space-y-1 mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {mode === "login" ? "Access Secure Library" : "Create Clinical Vault"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {mode === "login" 
                    ? "Enter your secure credentials to check report history." 
                    : "Create a private encryption vault to analyze documents."
                  }
                </p>
              </div>

              {/* Quick demo sign-in trigger */}
              {mode === "login" && (
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full mb-4 py-2 border border-dashed border-teal-300 dark:border-teal-800 rounded-xl bg-teal-500/5 hover:bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  Quick Demo Auto-Fill (Recommended)
                </button>
              )}

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-650 dark:text-red-400 text-xs animate-fade-in">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {mode === "signup" && (
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secure Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="patient@securemail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vault Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Consent checkbox for signups */}
                {mode === "signup" && (
                  <div className="flex items-start gap-2.5 pt-2 text-left">
                    <input
                      type="checkbox"
                      id="consent-box"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="h-4 w-4 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20"
                    />
                    <label htmlFor="consent-box" className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                      I agree to have my medical reports scanned by MedQuery's OCR engine to compile summaries. I understand that all summaries are educational interpretations and must be reviewed with my doctor.
                    </label>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold py-3 text-xs tracking-wider uppercase transition-all shadow-md shadow-teal-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="h-4.5 w-4.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Open Vault Account" : "Initiate Secure Vault"}{" "}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mode Switcher */}
              <div className="mt-5 text-center text-xs">
                <span className="text-slate-500">
                  {mode === "login" ? "First time using MedQuery?" : "Already have a vault?"}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer bg-transparent border-none"
                >
                  {mode === "login" ? "Establish Account" : "Sign In"}
                </button>
              </div>

            </div>

            {/* Safety note */}
            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              HIPAA compliant pipeline. AES-256 local database nodes.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
