"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sun, Moon, Menu, X, Activity, ChevronDown,
  Brain, Monitor, Bell, Dna, RefreshCw, BookOpen, Users, Shield
} from "lucide-react";

const MORE_LINKS = [
  { name: "AI Digital Twin", href: "/twin", icon: Dna, desc: "Personal health model" },
  { name: "Disease Simulator", href: "/twin/simulator", icon: RefreshCw, desc: "What-if projections" },
  { name: "AI Medical Team", href: "/agents", icon: Users, desc: "Specialist agent hub" },
  { name: "Live Monitor", href: "/monitor", icon: Monitor, desc: "Real-time vitals" },
  { name: "Health Alerts", href: "/alerts", icon: Bell, desc: "Disease & air quality" },
  { name: "Recovery Tracker", href: "/recovery", icon: RefreshCw, desc: "Post-surgery journal" },
  { name: "Research Hub", href: "/research", icon: BookOpen, desc: "Studies & education" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Initialize theme from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("medquery-theme") as "light" | "dark" | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      const activeTheme = savedTheme || (prefersDark ? "dark" : "light");
      setTheme(activeTheme);
      
      if (activeTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      const session = localStorage.getItem("medquery-session");
      if (session) setIsLoggedIn(true);
    }
  }, [pathname]);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("medquery-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Emergency removed — handled by the SOS button on the right
  const navLinks = [
    { name: "Workspace", href: "/analyze" },
    { name: "Bills Vault", href: "/vault" },
    { name: "Diet Planner", href: "/diet" },
    { name: "Clinical Chat", href: "/chat" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const isMoreActive = MORE_LINKS.some(l => pathname === l.href || pathname.startsWith(l.href));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="h-8 w-8 rounded-xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="h-4.5 w-4.5 animate-pulse-slow" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50">
              MedQuery <span className="text-teal-600 dark:text-teal-400">AI</span>
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
              Clinivault
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium flex-1 justify-center">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm ${
                  isActive
                    ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* "More" Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm cursor-pointer ${
                isMoreActive
                  ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-900/50"
              }`}
            >
              More
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-68 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 p-2 z-50 animate-fade-in">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1 pb-1.5">
                  Next-Gen Features
                </p>
                {MORE_LINKS.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/20 group ${
                        isActive ? "bg-teal-50 dark:bg-teal-900/20" : ""
                      }`}
                    >
                      <div className="h-8 w-8 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-800 dark:text-slate-200"}`}>
                          {link.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{link.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Action Controls ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <>
              <Link
                href="/settings"
                className="hidden md:inline-flex text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("medquery-session");
                  setIsLoggedIn(false);
                  window.location.href = "/";
                }}
                className="hidden md:inline-flex text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="hidden md:inline-flex text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* SOS Button — links to /emergency */}
          <Link
            href="/emergency"
            className="hidden md:inline-flex rounded-full bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-bold text-white shadow-md shadow-red-600/20 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 items-center gap-1.5"
          >
            <Shield className="h-3.5 w-3.5" /> SOS
          </Link>

          {/* Analyze CTA */}
          <Link
            href="/analyze"
            className="rounded-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-600/10 hover:shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Analyze Report
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1 animate-fade-in shadow-xl max-h-[80vh] overflow-y-auto">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-4 pb-1">
            Next-Gen Features
          </p>
          {MORE_LINKS.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.name}
              </Link>
            );
          })}

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
          <div className="flex flex-col gap-2 px-2 pt-1">
            <Link
              href="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors text-sm"
            >
              <Shield className="h-4 w-4" /> Emergency SOS
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-semibold py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/30 dark:hover:text-teal-400 transition-colors w-full block"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("medquery-session");
                    setIsLoggedIn(false);
                    window.location.href = "/";
                  }}
                  className="text-sm text-center font-semibold py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors w-full cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-semibold py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
