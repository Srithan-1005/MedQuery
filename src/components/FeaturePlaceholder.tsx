"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

interface FeaturePlaceholderProps {
  title: string;
  subtitle: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function FeaturePlaceholder({
  title,
  subtitle,
  description,
  actionLabel = "Return to dashboard",
  actionHref = "/dashboard",
}: FeaturePlaceholderProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/5 p-10 md:p-14">
          <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-500/10">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-700 dark:text-teal-300">Coming soon</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
            </div>
          </div>

          <p className="text-base leading-8 text-slate-600 dark:text-slate-300 max-w-3xl">{description}</p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current status</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">This experience is being integrated into MedQuery AI. While the page is not yet fully available, the service remains stable and secure.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Why this helps</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Future versions will provide an advanced AI assistant, predictive simulations, and monitoring insights directly from your medical reports.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{subtitle}</p>
            </div>
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {actionLabel}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
