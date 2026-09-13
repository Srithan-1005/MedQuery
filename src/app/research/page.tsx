"use client";

import React, { useState } from "react";
import {
  BookOpen, Search, ExternalLink, Heart, Brain, Activity,
  Droplets, Shield, Wind, ArrowRight, BookMarked, Clock, Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

interface Article {
  id: string;
  title: string;
  source: string;
  date: string;
  category: string;
  summary: string;
  readTime: string;
  tags: string[];
  url: string;
}

const ARTICLES: Article[] = [
  {
    id: "1", title: "Understanding HbA1c: What Your Blood Sugar Levels Really Mean",
    source: "NEJM Patient Education", date: "Jul 2026", category: "Diabetes",
    summary: "HbA1c measures your average blood sugar over 3 months. Values between 5.7–6.4% indicate prediabetes, while ≥6.5% suggests Type 2 Diabetes. Learn how lifestyle changes can reverse prediabetic values.",
    readTime: "5 min", tags: ["Glucose", "HbA1c", "Diabetes", "Prevention"],
    url: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis/a1c-test",
  },
  {
    id: "2", title: "The FAST Protocol for Stroke: Every Minute Matters",
    source: "American Heart Association", date: "Jun 2026", category: "Neurology",
    summary: "Face drooping, Arm weakness, Speech difficulty, Time to call. Recognizing a stroke within the first 3–4.5 hours dramatically improves recovery outcomes. Learn to identify the 5 warning signs.",
    readTime: "4 min", tags: ["Stroke", "Emergency", "Brain", "First Aid"],
    url: "https://www.stroke.org/en/about-stroke/stroke-symptoms",
  },
  {
    id: "3", title: "Iron Deficiency Anemia: Causes, Symptoms & Treatment",
    source: "Mayo Clinic", date: "Jun 2026", category: "Hematology",
    summary: "Iron deficiency anemia causes fatigue, weakness, and pale skin. Hemoglobin below 12 g/dL (women) or 13 g/dL (men) confirms it. Diet changes plus iron supplements typically resolve it in 2–3 months.",
    readTime: "6 min", tags: ["Anemia", "Hemoglobin", "CBC", "Iron"],
    url: "https://www.mayoclinic.org/diseases-conditions/iron-deficiency-anemia/symptoms-causes/syc-20355034",
  },
  {
    id: "4", title: "Hypertension Explained: Readings, Stages & Management",
    source: "WHO Health Topics", date: "May 2026", category: "Cardiology",
    summary: "High blood pressure (>130/80 mmHg) increases risk of heart attack and stroke. Stage 1 (130–139/80–89) is managed through lifestyle. Stage 2 (≥140/90) usually requires medication.",
    readTime: "7 min", tags: ["Blood Pressure", "Heart", "Hypertension", "Medication"],
    url: "https://www.who.int/news-room/fact-sheets/detail/hypertension",
  },
  {
    id: "5", title: "Reading Your Complete Blood Count (CBC) Report",
    source: "Cleveland Clinic", date: "Apr 2026", category: "Lab Reports",
    summary: "A CBC measures RBC, WBC, hemoglobin, hematocrit, and platelets. Elevated WBC may signal infection. Low RBC and hemoglobin suggest anemia. This guide explains every value in plain language.",
    readTime: "8 min", tags: ["CBC", "Blood Test", "Lab", "WBC", "RBC"],
    url: "https://my.clevelandclinic.org/health/diagnostics/4053-complete-blood-count",
  },
  {
    id: "6", title: "Air Quality Index (AQI) and Your Lung Health",
    source: "EPA Health Guide", date: "Jul 2026", category: "Respiratory",
    summary: "AQI above 100 is unhealthy for sensitive groups. AQI above 150 harms everyone. Particulate matter (PM2.5) penetrates deep into lungs — learn which days to stay indoors and how to reduce exposure.",
    readTime: "5 min", tags: ["AQI", "Asthma", "Pollution", "Lungs"],
    url: "https://www.airnow.gov/aqi/aqi-basics/",
  },
];

const CATEGORIES = ["All", "Diabetes", "Neurology", "Hematology", "Cardiology", "Lab Reports", "Respiratory"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Diabetes: <Droplets className="h-4 w-4" />,
  Neurology: <Brain className="h-4 w-4" />,
  Hematology: <Activity className="h-4 w-4" />,
  Cardiology: <Heart className="h-4 w-4" />,
  "Lab Reports": <BookOpen className="h-4 w-4" />,
  Respiratory: <Wind className="h-4 w-4" />,
  "All": <Shield className="h-4 w-4" />,
};

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Research Hub</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Trusted medical education articles from leading health organizations. Understand your conditions, lab values, and treatment options in plain language.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search topics: glucose, anemia, CBC, stroke..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeCategory === cat
                  ? "bg-teal-600 text-white"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-teal-400"
              }`}
            >
              {CATEGORY_ICONS[cat]}
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Curated Articles", value: ARTICLES.length, icon: <BookMarked className="h-5 w-5 text-teal-500" /> },
            { label: "Expert Sources", value: "6+", icon: <Shield className="h-5 w-5 text-blue-500" /> },
            { label: "Avg Read Time", value: "5 min", icon: <Clock className="h-5 w-5 text-amber-500" /> },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Articles Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No articles found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(article => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400">
                    {article.category}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition shrink-0" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">
                  {article.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {article.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{article.source}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime} read</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-teal-600 to-slate-800 p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Have questions about your specific reports?</h3>
          <p className="text-sm text-teal-100 mb-5 max-w-lg mx-auto">
            Upload your medical reports to get AI-powered explanations grounded in your actual data — not generic information.
          </p>
          <a href="/analyze" className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-6 py-3 rounded-full hover:bg-teal-50 transition text-sm">
            Analyze My Reports <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
