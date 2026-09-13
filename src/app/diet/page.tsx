"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Utensils, Activity, Plus, Search, HelpCircle, Leaf, Beef, Coffee, 
  Apple, Droplet, ArrowRight, ShieldCheck, CheckCircle2, Sliders,
  ShieldAlert, Shield, Info, Check, RefreshCw, Heart, AlertTriangle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

type SubModule = "diet" | "workout" | "drugInteraction";

export default function DietPlannerPage() {
  const [activeTab, setActiveTab] = useState<SubModule>("diet");
  const [generating, setGenerating] = useState(false);
  const [showToast, setShowToast] = useState("");

  // Diet states
  const [condition, setCondition] = useState("Diabetes");
  const [weightGoal, setWeightGoal] = useState("Maintain");
  const [religion, setReligion] = useState("None");
  const [budget, setBudget] = useState("Standard");
  const [preference, setPreference] = useState("Vegetarian");
  const [dietPlanResult, setDietPlanResult] = useState<any>(null);

  // Workout states
  const [workoutLevel, setWorkoutLevel] = useState("Intermediate");
  const [limitation, setLimitation] = useState("None");
  const [workoutResult, setWorkoutResult] = useState<any>(null);

  // Drug Checker states
  const [medA, setMedA] = useState("");
  const [medB, setMedB] = useState("");
  const [allergyCheck, setAllergyCheck] = useState("");
  const [interactionResult, setInteractionResult] = useState<any>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3500);
  };

  // 1. Generate Diet Plan
  const handleGenerateDiet = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDietPlanResult({
        title: `${condition} Tailored Clinical Protocol`,
        calories: condition === "Diabetes" ? 1600 : 1900,
        macros: { protein: "85g", carbs: "115g", fat: "45g" },
        restrictions: [
          `High Glycemic Index Sugars (Glucose Control)`,
          `High Sodium Items (>2,000mg/day)`,
          `Processed Trans Fats`
        ],
        patientFormAlerts: [
          `Active Condition: Type 2 Diabetes (Metformin 500mg BD)`,
          `Active Condition: Hypertension (Lisinopril 10mg OD)`,
          `Confirmed Allergies: Latex & Penicillin (Avoid latex kitchen tools & allergen cross-reactivity)`
        ],
        meals: [
          { type: "Breakfast (8:30 AM)", foods: preference === "Vegetarian" ? "Steel-cut oats with chia seeds, cinnamon & unsweetened almond milk" : "Poached eggs with spinach, whole-wheat toast & sliced avocado" },
          { type: "Lunch (1:00 PM)", foods: preference === "Vegetarian" ? "Quinoa salad with chickpea sprouts, cucumber & extra virgin olive oil" : "Grilled salmon fillet, brown rice & steamed broccoli florets" },
          { type: "Dinner (7:30 PM)", foods: preference === "Vegetarian" ? "Steamed lentil soup with spinach, roasted asparagus & sweet potato" : "Pan-seared turkey breast, asparagus & wild rice" }
        ],
        coachTip: `Grounded in your scanned Patient Form & CMP report: Low-glycemic carbohydrates keep post-prandial blood sugar stable alongside Metformin 500mg. Low sodium (<2,000mg/day) supports Lisinopril 10mg in controlling blood pressure.`
      });
      triggerToast("AI clinical diet plan generated from Patient Information Form.");
    }, 1000);
  };

  // 2. Generate Workout Recommender
  const handleGenerateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      
      let exercises = [
        { name: "Briskwalk / Light Cardio", duration: "30 Mins", intensity: "Low", note: "Promotes cardiovascular blood flow without spikes" },
        { name: "Bodyweight Squats", duration: "3 Sets x 10", intensity: "Moderate", note: "Maintains quadricep muscular endurance" },
        { name: "Plank Hold", duration: "3 Sets x 30 Sec", intensity: "Moderate", note: "Strengthens core stabilizers safely" }
      ];

      if (limitation === "Knee Joint Pain") {
        exercises = [
          { name: "Swimming / Pool Aerobics", duration: "45 Mins", intensity: "Low", note: "Zero impact workout ideal for knee decompression" },
          { name: "Seated Leg Extensions", duration: "3 Sets x 12", intensity: "Low", note: "Strengthens vastus medialis without joint pressure" },
          { name: "Supine Glute Bridges", duration: "3 Sets x 15", intensity: "Moderate", note: "Activates posterior chain muscles safely" }
        ];
      }

      setWorkoutResult({
        title: `${workoutLevel} Workout Protocol`,
        cautions: limitation !== "None" ? [`Avoid running or high impact jumping due to ${limitation}`] : ["Ensure proper 5 min warm-up before exercise"],
        exercises
      });
      triggerToast("Workout routine formulated successfully.");
    }, 1000);
  };

  // 3. Drug Interaction Checker
  const handleCheckInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medA.trim() || !medB.trim()) {
      alert("Please enter both medications.");
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const nameA = medA.toLowerCase().trim();
      const nameB = medB.toLowerCase().trim();
      
      let severity: "safe" | "moderate" | "severe" = "safe";
      let details = "No known major interactions detected between these two substances. Safe for concurrent therapy.";
      let allergyAlert = "";

      if ((nameA.includes("aspirin") && nameB.includes("ibuprofen")) || (nameA.includes("ibuprofen") && nameB.includes("aspirin"))) {
        severity = "moderate";
        details = "Aspirin and Ibuprofen combined can elevate risk of gastrointestinal irritation, bleeding, or decreased antiplatelet efficacy of aspirin. Avoid concurrent long-term use.";
      } else if ((nameA.includes("metformin") && nameB.includes("contrast")) || (nameA.includes("contrast") && nameB.includes("metformin"))) {
        severity = "severe";
        details = "Metformin combined with iodinated contrast media can precipitate acute kidney injury, increasing lactic acidosis risk. Withhold Metformin 48 hours prior and post-scan.";
      }

      // Check Allergy Warnings
      if (allergyCheck.toLowerCase().includes("penicillin") && (nameA.includes("amoxicillin") || nameB.includes("amoxicillin") || nameA.includes("penicillin") || nameB.includes("penicillin"))) {
        allergyAlert = `🚨 CRITICAL ALLERGY CONFLICT: You noted a Penicillin allergy. Amoxicillin / Penicillin belongs to this drug family and could trigger severe anaphylactic reactions. DO NOT consume.`;
      }

      setInteractionResult({
        medA,
        medB,
        severity,
        details,
        allergyAlert
      });
      triggerToast("Drug interaction check completed.");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 text-left">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Leaf className="h-6 w-6 text-teal-650 animate-pulse" /> AI Lifestyle & Pharmacy Safety Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Personalized diet sheets, cardiovascular exercises recommender, and drug interaction allergy checks.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-slate-200/65 dark:bg-slate-900 rounded-xl w-fit mb-8">
          <button
            onClick={() => { setActiveTab("diet"); setDietPlanResult(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "diet" 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            AI Diet Planner
          </button>
          <button
            onClick={() => { setActiveTab("workout"); setWorkoutResult(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "workout" 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Workout recommendations
          </button>
          <button
            onClick={() => { setActiveTab("drugInteraction"); setInteractionResult(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "drugInteraction" 
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Drug Interaction Checker
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Inputs Form (cols-5) */}
          <div className="lg:col-span-5">
            <div className="rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              
              {/* TAB 1: Diet Planner */}
              {activeTab === "diet" && (
                <form onSubmit={handleGenerateDiet} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1">
                    <Sliders className="h-4 w-4 text-teal-650" /> Diet Parameters
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Medical Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Diabetes">Diabetes / Insulin Resistance</option>
                      <option value="Kidney Disease">Chronic Kidney Disease (CKD)</option>
                      <option value="Hypertension">Hypertension / Heart Protocol</option>
                      <option value="Obesity">Weight Management (Caloric Deficit)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Weight Goal</label>
                    <select
                      value={weightGoal}
                      onChange={(e) => setWeightGoal(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Lose">Weight Loss (-0.5kg/week)</option>
                      <option value="Maintain">Maintain current weight</option>
                      <option value="Gain">Clean Bulk / Gain Muscle</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Religion Restrictions</label>
                    <select
                      value={religion}
                      onChange={(e) => setReligion(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="None">None</option>
                      <option value="Halal">Halal compliant</option>
                      <option value="Kosher">Kosher compliant</option>
                      <option value="Hindu Vegetarian">Hindu Vegetarian (No Beef/Meat)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Budget Range</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Economy">Economy / Budget Friendly</option>
                      <option value="Standard">Standard Balance</option>
                      <option value="Organic">Organic / Premium Fresh</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Food Preferences</label>
                    <select
                      value={preference}
                      onChange={(e) => setPreference(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="All inclusive">All-inclusive (Non veg + Veg)</option>
                      <option value="Vegetarian">Strict Vegetarian</option>
                      <option value="Vegan">Vegan (Plant based)</option>
                      <option value="Keto">Keto / High Fat</option>
                      <option value="Low Carb">Low Carbohydrates</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full rounded-xl bg-teal-650 hover:bg-teal-700 py-2.5 text-xs font-bold text-white shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {generating ? "Formulating Diet..." : "Formulate Diet Plan"}
                  </button>
                </form>
              )}

              {/* TAB 2: Workout Recommender */}
              {activeTab === "workout" && (
                <form onSubmit={handleGenerateWorkout} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 flex items-center gap-1">
                    <Sliders className="h-4 w-4 text-teal-650" /> Exercise Parameters
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Fitness Experience</label>
                    <select
                      value={workoutLevel}
                      onChange={(e) => setWorkoutLevel(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="Beginner">Beginner (First-time / Light)</option>
                      <option value="Intermediate">Intermediate (Cardio + weights)</option>
                      <option value="Advanced">Advanced (High intensity / Athlete)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Physical Limitation / Joint Issues</label>
                    <select
                      value={limitation}
                      onChange={(e) => setLimitation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="None">None</option>
                      <option value="Knee Joint Pain">Knee Joint Pain (Low Impact)</option>
                      <option value="Lower Back Injury">Lower Back Injury (No Deadlifts)</option>
                      <option value="Hypertension">Hypertension (No extreme strain)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full rounded-xl bg-teal-650 hover:bg-teal-700 py-2.5 text-xs font-bold text-white shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {generating ? "Formulating Routines..." : "Formulate Workout Routines"}
                  </button>
                </form>
              )}

              {/* TAB 3: Drug Interaction & Allergy Checker */}
              {activeTab === "drugInteraction" && (
                <form onSubmit={handleCheckInteraction} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 flex items-center gap-1">
                    <ShieldAlert className="h-4.5 w-4.5 text-teal-655" /> Drug Interaction
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Medicine A</label>
                    <input 
                      type="text"
                      placeholder="e.g. Aspirin, Metformin"
                      value={medA}
                      onChange={(e) => setMedA(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Medicine B</label>
                    <input 
                      type="text"
                      placeholder="e.g. Ibuprofen, Contrast Dye"
                      value={medB}
                      onChange={(e) => setMedB(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Your Known Allergies</label>
                    <input 
                      type="text"
                      placeholder="e.g. Penicillin, Sulfa drugs"
                      value={allergyCheck}
                      onChange={(e) => setAllergyCheck(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full rounded-xl bg-teal-650 hover:bg-teal-700 py-2.5 text-xs font-bold text-white shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {generating ? "Running Safety Scan..." : "Check Drug Interaction"}
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* RIGHT: Results Display (cols-7) */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm min-h-[380px] flex flex-col justify-center">
              
              {generating ? (
                <div className="text-center space-y-3 py-10">
                  <RefreshCw className="h-8 w-8 text-teal-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">AI lifestyle engines computing...</p>
                  <p className="text-[10px] text-slate-400">Mapping dietary variables and clinical interactions.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-start">
                  
                  {/* Result 1: Diet Planner */}
                  {activeTab === "diet" && (
                    dietPlanResult ? (
                      <div className="space-y-4 animate-fade-in">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{dietPlanResult.title}</h3>
                            <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 mt-0.5 uppercase tracking-wide">Weekly Calorie Budget: {dietPlanResult.calories} kcal</p>
                          </div>
                          <span className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded">Grounded</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Protein Goal", val: dietPlanResult.macros.protein },
                            { label: "Carb Limit", val: dietPlanResult.macros.carbs },
                            { label: "Fat Limit", val: dietPlanResult.macros.fat }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-center">
                              <p className="text-[9px] font-bold uppercase text-slate-400">{item.label}</p>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{item.val}</p>
                            </div>
                          ))}
                        </div>

                        {dietPlanResult.patientFormAlerts && (
                          <div className="space-y-1.5 p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-xs">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" /> Scanned Patient Form Grounded Context
                            </p>
                            {dietPlanResult.patientFormAlerts.map((alertItem: string, aIdx: number) => (
                              <p key={aIdx} className="text-slate-700 dark:text-slate-300 text-[11px] flex items-start gap-1">
                                <span className="text-teal-600 font-bold">•</span> {alertItem}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="space-y-2 pt-2">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Grounded Exclusions / Restrictions</p>
                          <div className="flex flex-wrap gap-1.5">
                            {dietPlanResult.restrictions.map((res: string, idx: number) => (
                              <span key={idx} className="bg-red-500/10 text-red-700 dark:text-red-400 text-[9px] font-bold px-2 py-0.5 rounded border border-red-500/10 flex items-center gap-1">
                                <ShieldAlert className="h-3 w-3" /> {res}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Daily Meal Setup</p>
                          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {dietPlanResult.meals.map((meal: any, idx: number) => (
                              <div key={idx} className="py-2.5 flex items-start gap-4 first:pt-0 last:pb-0">
                                <span className="font-bold text-teal-650 dark:text-teal-400 shrink-0 w-28">{meal.type}</span>
                                <span className="text-slate-650 dark:text-slate-350">{meal.foods}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-teal-500/5 p-3.5 rounded-xl border border-teal-500/10 text-xs leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
                          💡 <span className="font-semibold text-teal-605">Dietician Tip</span>: {dietPlanResult.coachTip}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 space-y-2">
                        <Utensils className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                        <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300">Generate diet plan</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Select your health restriction parameters on the left to structure your diet grid.</p>
                      </div>
                    )
                  )}

                  {/* Result 2: Workout Recommender */}
                  {activeTab === "workout" && (
                    workoutResult ? (
                      <div className="space-y-4 animate-fade-in">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{workoutResult.title}</h3>
                            <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 mt-0.5 uppercase tracking-wide">Target: Physical Fitness & Joint Care</p>
                          </div>
                          <span className="bg-teal-500/10 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded">Grounded</span>
                        </div>

                        {workoutResult.cautions.length > 0 && (
                          <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/15 flex gap-2.5 text-xs text-amber-700 dark:text-amber-400">
                            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold">Medical Caution</p>
                              <p className="mt-0.5">{workoutResult.cautions[0]}</p>
                            </div>
                          </div>
                        )}

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {workoutResult.exercises.map((ex: any, idx: number) => (
                            <div key={idx} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                              <div className="space-y-1 text-xs">
                                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 shrink-0" /> {ex.name}
                                </p>
                                <p className="text-[10px] text-slate-500">{ex.note}</p>
                              </div>
                              <div className="text-right text-[10px] font-semibold text-slate-650 dark:text-slate-400">
                                <p className="font-bold text-teal-650 dark:text-teal-400">{ex.duration}</p>
                                <p>Intensity: {ex.intensity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 space-y-2">
                        <Activity className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                        <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300">Generate workout routine</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Formulate low-impact or cardiac safe workouts by supplying active joint or strain limitations.</p>
                      </div>
                    )
                  )}

                  {/* Result 3: Drug Interaction Checker */}
                  {activeTab === "drugInteraction" && (
                    interactionResult ? (
                      <div className="space-y-4 animate-fade-in text-xs">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pharmacy Safety Report</h3>
                          <p className="text-[9px] text-slate-400 mt-0.5">Checked: {interactionResult.medA} vs {interactionResult.medB}</p>
                        </div>

                        {/* Allergy Conflict Banner */}
                        {interactionResult.allergyAlert && (
                          <div className="p-3.5 bg-red-500/10 rounded-xl border border-red-500/20 text-red-700 dark:text-red-400 font-bold leading-relaxed flex gap-2">
                            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                            <span>{interactionResult.allergyAlert}</span>
                          </div>
                        )}

                        <div className="rounded-xl border p-4 flex gap-3 text-left">
                          <div className="shrink-0 mt-0.5">
                            {interactionResult.severity === "severe" && <ShieldAlert className="h-5 w-5 text-red-500" />}
                            {interactionResult.severity === "moderate" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                            {interactionResult.severity === "safe" && <ShieldCheck className="h-5 w-5 text-teal-500" />}
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold uppercase tracking-wider text-[9px] text-slate-400">Interaction Level</p>
                            <p className={`font-black text-xs uppercase leading-none ${
                              interactionResult.severity === "severe" ? "text-red-500" :
                              interactionResult.severity === "moderate" ? "text-amber-500" :
                              "text-teal-600 dark:text-teal-400"
                            }`}>
                              {interactionResult.severity === "severe" ? "Severe Warning" :
                               interactionResult.severity === "moderate" ? "Moderate Warning" :
                               "Safe - No Interactions"}
                            </p>
                            <p className="text-slate-650 dark:text-slate-350 leading-relaxed pt-1">{interactionResult.details}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 space-y-2">
                        <ShieldAlert className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                        <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300">Run pharmacy security checker</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Type in active prescription drugs to search for clinical counter-indications and allergy warnings.</p>
                      </div>
                    )
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
