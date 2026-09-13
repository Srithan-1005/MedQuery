import React from "react";
import { ShieldAlert, Info } from "lucide-react";

interface DisclaimerProps {
  className?: string;
  variant?: "banner" | "card";
}

export default function MedicalDisclaimer({ className = "", variant = "banner" }: DisclaimerProps) {
  if (variant === "banner") {
    return (
      <div className={`w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-300 dark:bg-amber-500/5 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap text-center">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium">AI-Assisted Interpretation Tool:</span>
          <span>MedQuery AI does not provide definitive medical diagnoses or therapy plans. Always discuss summaries with a licensed physician.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-teal-500/10 rounded-xl shrink-0">
          <Info className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Clinical Safety & Disclaimer Notice
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            MedQuery AI is an educational analysis system powered by retrieval-augmented clinical reading models. 
            All insights, identified ranges, and plain-language summaries are created to facilitate, not replace, 
            the conversation between patients and their doctors. 
            Do not alter any medication schedules or treatment vectors based on AI outputs. 
            <strong> In the event of an urgent health crisis, please contact your local emergency services (e.g., 911) immediately.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
