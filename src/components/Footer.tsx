import React from "react";
import Link from "next/link";
import { ShieldAlert, Activity, Heart, Shield, Lock, FileCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="h-8 w-8 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight">
                MedQuery <span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Empowering individuals, caregivers, and medical students with advanced, context-grounded AI tools for clinical report reading and document summaries.
            </p>
            
            {/* Compliance badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[9px] font-semibold text-teal-400">
                <Shield className="h-2.5 w-2.5" /> HIPAA ALIGNED
              </div>
              <div className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[9px] font-semibold text-teal-400">
                <Lock className="h-2.5 w-2.5" /> AES-256 SECURED
              </div>
              <div className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[9px] font-semibold text-teal-400">
                <FileCheck className="h-2.5 w-2.5" /> SOC2 COMPLIANT
              </div>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Core Technology</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  Secure OCR Extraction
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors">
                  Retrieval-Augmented Chat (RAG)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Structured Patient Insights
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Custom AI Simplicity Level
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust Columns */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Privacy & Integrity</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  No Training on Health Data
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Zero Persistent Storage Purge
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  End-to-End SSL Ingestion
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Physician Collaboration Guide
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Trust Framework</h3>
            <p className="text-xs leading-relaxed mb-2">
              MedQuery AI is developed by the Clinivault Security Group. We design military-grade security infrastructure for personal healthcare records.
            </p>
            <span className="text-xs text-white font-medium hover:underline cursor-pointer">
              security@clinivault.ai
            </span>
          </div>

        </div>

        {/* Clinical Safety Disclaimer Box */}
        <div className="border-t border-b border-slate-800 py-6 mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 mb-1">
                INFORMATIVE MEDICAL DISCLAIMER
              </p>
              <p className="leading-relaxed">
                The content generated, structured, or compiled by MedQuery AI is purely for educational, explanatory, and informational guidance. 
                This tool is not a medical professional and does not provide clinical diagnostic opinions, treatment programs, pharmaceutical prescriptions, or professional guidance. 
                Always compare medical document extractions directly against official lab diagnostics, and consult with certified primary care physicians or specialists regarding critical values.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} MedQuery AI / Clinivault Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            Made with <Heart className="h-3 w-3 text-teal-400 fill-teal-400" /> for patient clarity & empowerment.
          </div>
        </div>

      </div>
    </footer>
  );
}
