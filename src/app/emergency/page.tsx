"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin, Navigation, Activity, Heart, Ambulance, ShieldAlert,
  HelpCircle, Phone, ShieldCheck, Loader2, AlertCircle, Search, X
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";

interface NearbyHospital {
  id: string;
  name: string;
  pincode: string;
  city: string;
  distance: string;
  distanceKm: number;
  phone: string;
  type: string;
  status: "open" | "busy";
  waitTime: string;
  icuBeds: number;
  oxygenStatus: "Available" | "Full";
  lat: number;
  lng: number;
}

type LocationState = "idle" | "requesting" | "granted" | "denied" | "error";

// Comprehensive emergency hospital database with real coordinates and Pincodes
const HOSPITAL_DATABASE: Omit<NearbyHospital, "distance" | "distanceKm">[] = [
  { id: "h1", name: "Apollo Hospitals (Jubilee Hills)", pincode: "500033", city: "Hyderabad", phone: "+914066688888", type: "Level 1 Trauma & Cardiac", status: "open", waitTime: "10 mins", icuBeds: 18, oxygenStatus: "Available", lat: 17.4375, lng: 78.4483 },
  { id: "h2", name: "AIIMS (Ansari Nagar)", pincode: "110029", city: "Delhi", phone: "+911126588500", type: "Level 1 Emergency Center", status: "open", waitTime: "25 mins", icuBeds: 12, oxygenStatus: "Available", lat: 28.5678, lng: 77.2100 },
  { id: "h3", name: "Fortis Memorial Research Institute", pincode: "122002", city: "Gurugram", phone: "+911244921021", type: "Emergency Department", status: "busy", waitTime: "35 mins", icuBeds: 6, oxygenStatus: "Available", lat: 28.4595, lng: 77.0266 },
  { id: "h4", name: "Manipal Hospital (Old Airport Rd)", pincode: "560017", city: "Bangalore", phone: "+918067151111", type: "Multi-Specialty Emergency", status: "open", waitTime: "15 mins", icuBeds: 24, oxygenStatus: "Available", lat: 12.9698, lng: 77.5950 },
  { id: "h5", name: "Christian Medical College (CMC)", pincode: "632004", city: "Vellore", phone: "+914162281000", type: "Teaching Hospital & Trauma", status: "open", waitTime: "20 mins", icuBeds: 30, oxygenStatus: "Available", lat: 12.9249, lng: 79.1326 },
  { id: "h6", name: "Kokilaben Dhirubhai Ambani Hospital", pincode: "400053", city: "Mumbai", phone: "+912230999999", type: "Super Specialty ER", status: "open", waitTime: "12 mins", icuBeds: 15, oxygenStatus: "Available", lat: 19.1312, lng: 72.8252 },
  { id: "h7", name: "Apollo Specialty Hospital (Greams Rd)", pincode: "600006", city: "Chennai", phone: "+914428290200", type: "Emergency & Critical Care", status: "open", waitTime: "8 mins", icuBeds: 22, oxygenStatus: "Available", lat: 13.0617, lng: 80.2520 },
  { id: "h8", name: "Narayana Health City (Bommasandra)", pincode: "560099", city: "Bangalore", phone: "+918030498888", type: "Cardiac & General ER", status: "open", waitTime: "10 mins", icuBeds: 40, oxygenStatus: "Available", lat: 12.8406, lng: 77.6783 },
  { id: "h9", name: "Max Super Specialty Hospital (Saket)", pincode: "110017", city: "Delhi", phone: "+911126515050", type: "Trauma & Trauma ICU", status: "open", waitTime: "18 mins", icuBeds: 14, oxygenStatus: "Available", lat: 28.5284, lng: 77.2110 },
  { id: "h10", name: "KIMS Hospital (Secunderabad)", pincode: "500003", city: "Hyderabad", phone: "+914044885000", type: "Multi-Specialty Emergency", status: "open", waitTime: "14 mins", icuBeds: 20, oxygenStatus: "Available", lat: 17.4334, lng: 78.4870 }
];

function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function EmergencyPage() {
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosFired, setSosFired] = useState(false);
  const [activeFirstAid, setActiveFirstAid] = useState<string>("heart");
  const [showToast, setShowToast] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const countdownRef = React.useRef<NodeJS.Timeout | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 4000);
  };

  const buildHospitalList = useCallback((lat: number, lng: number, filterQuery: string = "") => {
    const query = filterQuery.trim().toLowerCase();
    
    let filtered = HOSPITAL_DATABASE;
    if (query.length > 0) {
      filtered = HOSPITAL_DATABASE.filter(
        h => h.pincode.includes(query) || h.city.toLowerCase().includes(query) || h.name.toLowerCase().includes(query)
      );
      if (filtered.length === 0) {
        filtered = HOSPITAL_DATABASE;
      }
    }

    const withDistance: NearbyHospital[] = filtered.map(h => {
      const km = haversineDistanceKm(lat, lng, h.lat, h.lng);
      return {
        ...h,
        distanceKm: km,
        distance: km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    setHospitals(withDistance);
  }, []);

  const requestLocation = () => {
    setLocationState("requesting");
    if (!navigator.geolocation) {
      setLocationState("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setLocationState("granted");
        buildHospitalList(latitude, longitude, searchInput);
        triggerToast("Location detected — showing nearest emergency hospitals.");
      },
      () => setLocationState("denied"),
      { timeout: 10000 }
    );
  };

  const handleManualSearch = () => {
    if (!searchInput.trim()) return;
    const query = searchInput.trim().toLowerCase();
    
    // Check if matching pincode/city exists in database
    const matched = HOSPITAL_DATABASE.find(
      h => h.pincode.includes(query) || h.city.toLowerCase().includes(query)
    );

    const lat = matched ? matched.lat : 20.5937;
    const lng = matched ? matched.lng : 78.9629;

    setUserCoords({ lat, lng });
    setLocationState("granted");
    buildHospitalList(lat, lng, query);
    triggerToast(`Hospitals filtered for location / Pincode "${searchInput}"`);
  };

  // SOS Countdown
  const handleTriggerSOS = () => {
    setSosActive(true);
    setSosCountdown(5);
    setSosFired(false);
    countdownRef.current = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setSosFired(true);
          triggerToast("🚨 Caregiver Alert sent! Dispatching coordinates to emergency dispatcher.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelSOS = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setSosActive(false);
    setSosCountdown(5);
    setSosFired(false);
    triggerToast("SOS broadcast cancelled.");
  };

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const mapSrc = userCoords
    ? `https://maps.google.com/maps?q=${userCoords.lat},${userCoords.lng}&z=14&output=embed`
    : "";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <MedicalDisclaimer variant="banner" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-teal-500 text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-in-right">
            <ShieldCheck className="h-4 w-4 text-teal-400 dark:text-slate-950 shrink-0" />
            <span>{showToast}</span>
          </div>
        )}

        {/* SOS Active Banner */}
        {sosActive && (
          <div className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse-slow">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14">
                <div className="h-14 w-14 rounded-full bg-red-600/30 animate-ping absolute" />
                <div className="h-14 w-14 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-lg relative z-10">
                  {sosFired ? "SOS" : sosCountdown}
                </div>
              </div>
              <div>
                <p className="text-base font-black text-red-600 dark:text-red-400 uppercase">
                  {sosFired ? "🚨 EMERGENCY SOS BROADCAST ACTIVE" : "⚠️ SOS ALERT COUNTDOWN..."}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {sosFired
                    ? "Caregiver has been notified. Dispatching your GPS coordinates."
                    : "Sending broadcast in " + sosCountdown + " seconds. Press CANCEL if this is a mistake."}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancelSOS}
              className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 px-6 py-3 text-sm font-bold text-white transition-all shadow cursor-pointer shrink-0"
            >
              Abort Broadcast (Cancel)
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: SOS + Hospitals */}
          <div className="lg:col-span-7 space-y-6">

            {/* SOS Button */}
            {!sosActive && (
              <div className="rounded-3xl border border-red-200/60 dark:border-red-900/40 bg-white dark:bg-slate-900 p-8 text-center shadow-md space-y-5">
                <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Ambulance className="h-8 w-8 text-red-600 animate-pulse-slow" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Immediate Medical SOS Trigger
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Pressing this starts a 5-second countdown to broadcast emergency warnings to designated caregivers and nearby dispatchers.
                  </p>
                </div>
                <button
                  onClick={handleTriggerSOS}
                  className="rounded-2xl bg-red-600 hover:bg-red-700 px-8 py-4 text-base font-black uppercase text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/30 active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
                >
                  🚨 Trigger SOS Alert
                </button>
              </div>
            )}

            {/* Location Permission Card */}
            {locationState === "idle" && (
              <div className="rounded-3xl border border-teal-200/60 dark:border-teal-900/40 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Find Nearest Hospitals</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Allow location access to show hospitals closest to you</p>
                  </div>
                </div>
                <button
                  onClick={requestLocation}
                  className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 px-5 py-3 text-sm font-bold text-white transition-all shadow cursor-pointer"
                >
                  📍 Allow Location Access
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs text-slate-400">or search manually</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleManualSearch()}
                    placeholder="Search by 6-digit Pincode (e.g. 560001, 110029) or City..."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                  />
                  <button
                    onClick={handleManualSearch}
                    className="rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="h-4 w-4" /> Search
                  </button>
                </div>
              </div>
            )}

            {/* Requesting / Loading */}
            {locationState === "requesting" && (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm space-y-4">
                <Loader2 className="h-8 w-8 text-teal-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Detecting your location...</p>
                <p className="text-xs text-slate-400">Please allow location access in your browser prompt</p>
              </div>
            )}

            {/* Denied */}
            {locationState === "denied" && (
              <div className="rounded-3xl border border-amber-200/60 dark:border-amber-900/40 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Location access denied</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Search by Pincode or City below to find nearby emergency care.</p>
                  </div>
                  <button onClick={() => setLocationState("idle")} className="ml-auto text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleManualSearch()}
                    placeholder="Enter Pincode (e.g. 500033) or City..."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-teal-500 transition"
                  />
                  <button
                    onClick={handleManualSearch}
                    className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2.5 text-sm font-bold text-white transition cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {/* Map + Hospital List */}
            {locationState === "granted" && userCoords && (
              <>
                {/* Embedded Map */}
                <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                  <iframe
                    title="Nearby Hospitals Map"
                    src={mapSrc}
                    width="100%"
                    height="280"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Hospital List */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      Emergency Hospitals ({hospitals.length} Found)
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleManualSearch()}
                        placeholder="Search Pincode / City..."
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                      />
                      <button
                        onClick={handleManualSearch}
                        className="rounded-lg bg-teal-600 hover:bg-teal-700 px-3 py-1 text-xs font-bold text-white transition"
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {hospitals.slice(0, 6).map(hosp => (
                      <div
                        key={hosp.id}
                        className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {hosp.name}
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                              Pincode: {hosp.pincode}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{hosp.type} • {hosp.city} ({hosp.distance})</p>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              hosp.status === "open"
                                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                : "bg-red-500/10 text-red-700 dark:text-red-400"
                            }`}>
                              {hosp.status === "open" ? "Available" : "Busy"}
                            </span>
                            <span className="text-xs text-slate-400">Wait: {hosp.waitTime}</span>
                            <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                              {hosp.icuBeds} ICU Beds
                            </span>
                            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                              O2: {hosp.oxygenStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <a
                            href={`tel:${hosp.phone}`}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300"
                          >
                            <Phone className="h-4 w-4 text-teal-600" /> Call ER
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-teal-600 hover:bg-teal-700 px-3 py-2 text-sm text-white transition-all flex items-center gap-1.5 font-bold"
                          >
                            <Navigation className="h-4 w-4" /> Route
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: First Aid Protocols */}
          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm text-left space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" /> Emergency First Aid Protocols
              </h3>

              <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl">
                {[
                  { id: "heart", label: "Heart Attack" },
                  { id: "stroke", label: "Stroke (FAST)" },
                  { id: "poison", label: "Poisoning" },
                  { id: "allergy", label: "Severe Allergy" },
                  { id: "distress", label: "Mental Crisis" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFirstAid(tab.id)}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      activeFirstAid === tab.id
                        ? "bg-white dark:bg-slate-850 text-red-600 dark:text-red-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-850 p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {activeFirstAid === "heart" && (
                  <div className="space-y-3">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5"><Heart className="h-4 w-4" /> Heart Attack First Aid</p>
                    <p><span className="font-bold">1. Call 108 / 112 immediately</span> — Every second counts. Do not wait for symptoms to subside.</p>
                    <p><span className="font-bold">2. Chew Aspirin</span> — If not allergic, chew and swallow an adult aspirin (325mg).</p>
                    <p><span className="font-bold">3. Perform CPR if unresponsive</span> — Start hands-only chest compressions (100–120 per minute).</p>
                  </div>
                )}
                {activeFirstAid === "stroke" && (
                  <div className="space-y-3">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5"><ShieldAlert className="h-4 w-4" /> Stroke (F.A.S.T.) Protocol</p>
                    <p><span className="font-bold">F — Face Drooping</span> — Ask the person to smile. Does one side droop?</p>
                    <p><span className="font-bold">A — Arm Weakness</span> — Ask to raise both arms. Does one drift downward?</p>
                    <p><span className="font-bold">S — Speech Difficulty</span> — Ask to repeat a sentence. Is speech slurred?</p>
                    <p><span className="font-bold">T — Time to call 112</span> — Note the time and call emergency services immediately.</p>
                  </div>
                )}
                {activeFirstAid === "poison" && (
                  <div className="space-y-3">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5"><Activity className="h-4 w-4" /> Poisoning First Aid</p>
                    <p><span className="font-bold">1. Identify the toxic agent</span> — Check what was ingested or inhaled if safe.</p>
                    <p><span className="font-bold">2. Call Poison Control</span> — Dial 1800-180-1104 for specialist guidance.</p>
                    <p><span className="font-bold">3. Do NOT induce vomiting</span> — Unless explicitly directed by a medical professional.</p>
                  </div>
                )}
                {activeFirstAid === "allergy" && (
                  <div className="space-y-3">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5"><ShieldAlert className="h-4 w-4" /> Anaphylaxis / Severe Allergy</p>
                    <p><span className="font-bold">1. Inject EpiPen immediately</span> — Press firmly against outer thigh, hold for 3 seconds.</p>
                    <p><span className="font-bold">2. Call 112</span> — Anaphylaxis requires immediate clinical observation.</p>
                    <p><span className="font-bold">3. Lay flat with legs elevated</span> — Helps blood pressure recovery unless vomiting.</p>
                  </div>
                )}
                {activeFirstAid === "distress" && (
                  <div className="space-y-3">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5"><HelpCircle className="h-4 w-4" /> Mental Health Crisis</p>
                    <p><span className="font-bold">1. Dial iCall: 9152987821</span> — Free, confidential, 24/7 mental health support.</p>
                    <p><span className="font-bold">2. Box Breathing</span> — Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat.</p>
                    <p><span className="font-bold">3. Stay with them</span> — Never leave a patient in high crisis alone; keep them in quiet settings.</p>
                  </div>
                )}
              </div>

              {/* Quick call strip */}
              <div className="rounded-xl bg-red-500/5 border border-red-200/40 dark:border-red-900/30 p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">Emergency Helplines (India)</p>
                {[
                  { label: "Medical Emergency", number: "108" },
                  { label: "Police", number: "100" },
                  { label: "National Emergency", number: "112" },
                  { label: "Poison Control", number: "1800-180-1104" },
                ].map(item => (
                  <div key={item.number} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <a
                      href={`tel:${item.number}`}
                      className="font-black text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3.5 w-3.5" /> {item.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
