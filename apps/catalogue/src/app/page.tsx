"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Sparkles,
  Lock,
  ArrowRight,
  Terminal,
  Code2,
  Copy,
  Check,
  PackageCheck,
  Shield,
  Palette,
  ChevronDown,
  Shuffle,
  Layers,
  Zap,
} from "lucide-react";

interface ComponentItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  version: string;
  accessLevel: "FREE" | "PREMIUM";
  status: "DRAFT" | "PUBLISHED";
  dependencies: string[];
}

const CRM_COLORS = [
  { name: "Won Mint", hex: "#16C89E" },
  { name: "Negotiation Purple", hex: "#9668FE" },
  { name: "Sky Cyan", hex: "#38BDF8" },
  { name: "Lead Gold", hex: "#FFDB4B" },
  { name: "Lost Coral", hex: "#FE4A8E" },
  { name: "Pure White", hex: "#FFFFFF" },
];

export default function HomePage() {
  const { user } = useAuth();
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAccess, setSelectedAccess] = useState<string>("All");
  const [copiedCli, setCopiedCli] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<number>(0);

  // Hover Random / Single Color Toggle for "Blink Compo"
  const [isColorActive, setIsColorActive] = useState<boolean>(false);
  const [headingColor, setHeadingColor] = useState<string>("#FFFFFF");

  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/components")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComponents(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleHeadingHover = () => {
    if (!isColorActive) {
      const vibrantColors = ["#16C89E", "#9668FE", "#38BDF8", "#FFDB4B", "#FE4A8E"];
      const random = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
      setHeadingColor(random);
      setIsColorActive(true);
    } else {
      setHeadingColor("#FFFFFF");
      setIsColorActive(false);
    }
  };

  const scrollToSection = (index: number) => {
    setActiveScreen(index);
    const sections = [section1Ref, section2Ref, section3Ref];
    sections[index]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const categories = [
    "All",
    "Form Controls",
    "Data Display",
    "Navigation",
    "Feedback",
  ];

  const filtered = components.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || c.category === selectedCategory;

    const matchesAccess =
      selectedAccess === "All" ||
      (selectedAccess === "Free" && c.accessLevel === "FREE") ||
      (selectedAccess === "Premium" && c.accessLevel === "PREMIUM");

    return matchesSearch && matchesCategory && matchesAccess;
  });

  const copyCliSample = () => {
    navigator.clipboard.writeText("npx tech-inject-ui add button");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="astryx-snap-container relative scroll-smooth selection:bg-[#16C89E]/20 selection:text-[#16C89E]"
    >
      {/* Floating Astryx Screen Indicators (Right Side) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3 font-fira text-[11px]">
        {[
          { label: "01 // Hero", index: 0 },
          { label: "02 // Components", index: 1 },
          { label: "03 // Tokens & Arch", index: 2 },
        ].map((item) => (
          <button
            key={item.index}
            onClick={() => scrollToSection(item.index)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
              activeScreen === item.index
                ? "bg-[#181818] border-[#16C89E] text-white shadow-lg shadow-[#16C89E]/10"
                : "bg-[#101010]/80 border-neutral-800 text-neutral-500 hover:text-neutral-300 backdrop-blur-md"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                activeScreen === item.index ? "bg-[#16C89E] animate-pulse" : "bg-neutral-600"
              }`}
            />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: Astryx Hero Screen with "Blink Compo" Heading & Fira Code Subhead */}
      {/* ========================================================================= */}
      <section
        id="hero"
        ref={section1Ref}
        className="astryx-snap-section relative px-4 sm:px-8 py-12 flex flex-col justify-center items-center text-center overflow-hidden"
      >
        {/* Decorative background radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-gradient-to-tr from-[#9668FE]/10 via-[#16C89E]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Main Heading: "Blink Compo" in Boldonse with Hover Random / Single Color Toggle */}
          <div
            className="relative group cursor-pointer"
            onMouseEnter={handleHeadingHover}
            onClick={handleHeadingHover}
          >
            <h1
              className="font-boldonse text-6xl sm:text-7xl md:text-8xl tracking-tight transition-all duration-300 select-none"
              style={{
                color: headingColor,
                textShadow: isColorActive ? `0 0 40px ${headingColor}88` : "none",
              }}
            >
              Blink Compo
            </h1>
          </div>

          {/* Subheading in Fira Code */}
          <div className="font-fira mt-5 max-w-2xl text-xs sm:text-sm text-neutral-400 leading-relaxed">
            <p className="text-neutral-300">
              Precision component library styled after the Sales CRM standard.
              Zero layout shifts, token-driven aesthetics, NPX CLI distribution &amp; real-time customer tier enforcement.
            </p>
          </div>

          {/* Quick CLI Hero Box */}
          <div
            id="cli"
            className="mt-8 w-full max-w-md rounded-2xl border border-[#262626] bg-[#121212] p-2 flex items-center justify-between text-xs text-neutral-300 crm-tactile shadow-2xl"
          >
            <div className="flex items-center gap-2 pl-3 overflow-hidden">
              <Terminal className="size-4 text-[#16C89E] shrink-0" />
              <code className="text-neutral-300 font-fira text-xs truncate">
                npx tech-inject-ui add button
              </code>
            </div>
            <button
              onClick={copyCliSample}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white transition-colors border border-white/5 font-fira text-[11px]"
              aria-label="Copy CLI command"
            >
              {copiedCli ? (
                <>
                  <Check className="size-3 text-[#16C89E]" />
                  <span className="text-[#16C89E]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3 text-neutral-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Scroll Prompt to Next Screen */}
          <button
            onClick={() => scrollToSection(1)}
            className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-[#111111] hover:border-neutral-700 text-xs font-fira text-neutral-400 hover:text-white transition-all crm-tactile group"
          >
            <span>Explore Component Directory</span>
            <ChevronDown className="size-3.5 text-[#16C89E] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCREEN 2: Astryx Component Directory (Full Viewport Snap Screen)           */}
      {/* ========================================================================= */}
      <section
        id="catalogue"
        ref={section2Ref}
        className="astryx-snap-section relative px-4 sm:px-8 py-10 flex flex-col justify-start"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#202020] mb-8">
            <div>
              <div className="font-fira text-xs text-[#16C89E] uppercase tracking-wider mb-1">
                // page 02 · interactive components
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Component Gallery
              </h2>
              <p className="font-fira text-xs text-neutral-400 mt-1">
                Select any component to inspect live previews, CLI command, TypeScript code, and AI prompts.
              </p>
            </div>

            {/* Access Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141414] border border-[#262626]">
              {["All", "Free", "Premium"].map((acc) => (
                <button
                  key={acc}
                  onClick={() => setSelectedAccess(acc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-fira transition-all ${
                    selectedAccess === acc
                      ? "bg-[#242424] text-white shadow-sm border border-neutral-700"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {acc === "Premium" ? "★ Premium" : acc}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Category Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search components..."
                className="w-full h-9 rounded-xl bg-[#141414] border border-[#262626] pl-10 pr-4 text-xs font-fira text-white placeholder-neutral-500 focus:outline-none focus:border-[#16C89E] transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-fira px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#1E1E1E] text-white font-medium border border-neutral-700"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Component Grid */}
          {loading ? (
            <div className="py-24 text-center font-fira text-xs text-neutral-500">
              Loading component library...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center font-fira text-sm text-neutral-500 rounded-2xl border border-dashed border-neutral-800 bg-[#101010]">
              No components match your search filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((comp) => {
                const isPremium = comp.accessLevel === "PREMIUM";
                const isLocked = isPremium && (!user || !user.isPremium);

                return (
                  <Link
                    key={comp.id}
                    href={`/components/${comp.slug}`}
                    className="group relative rounded-2xl border border-[#222222] bg-[#121212] p-5 hover:border-neutral-700 hover:bg-[#161616] transition-all crm-tactile flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="font-fira text-[10px] text-neutral-500 uppercase tracking-wider">
                            {comp.category}
                          </div>
                          <h3 className="text-base font-semibold text-white group-hover:text-[#16C89E] transition-colors mt-0.5">
                            {comp.name}
                          </h3>
                        </div>

                        {/* Tier Badge */}
                        {isPremium ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#16C89E]/40 bg-[#16C89E]/10 px-2 py-0.5 text-[11px] font-fira font-semibold text-[#16C89E]">
                            <Sparkles className="size-3" />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/80 px-2 py-0.5 text-[11px] font-fira font-medium text-neutral-300">
                            FREE
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                        {comp.description}
                      </p>
                    </div>

                    {/* Card Footer / Lock Indicator */}
                    <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-xs">
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 text-neutral-500 font-fira text-[11px]">
                          <Lock className="size-3 text-[#FFDB4B]" />
                          <span>Requires Premium Account</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-neutral-400 font-fira text-[11px]">
                          <Code2 className="size-3 text-[#16C89E]" />
                          <span>v{comp.version} · Ready</span>
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1 font-fira text-[11px] text-neutral-400 group-hover:text-white transition-colors">
                        <span>Inspect</span>
                        <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Next Section Indicator */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => scrollToSection(2)}
              className="inline-flex items-center gap-2 text-xs font-fira text-neutral-500 hover:text-white transition-colors"
            >
              <span>View Theme Tokens &amp; Clean Architecture</span>
              <ChevronDown className="size-3 text-[#16C89E]" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCREEN 3: Astryx Theme Tokens & Clean Architecture (Full Viewport Snap)    */}
      {/* ========================================================================= */}
      <section
        id="theme"
        ref={section3Ref}
        className="astryx-snap-section relative px-4 sm:px-8 py-10 flex flex-col justify-between"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="pb-6 border-b border-[#202020] mb-8">
            <div className="font-fira text-xs text-[#16C89E] uppercase tracking-wider mb-1">
              // page 03 · visual tokens &amp; clean architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Sales CRM Design Tokens
            </h2>
            <p className="font-fira text-xs text-neutral-400 mt-1">
              Deterministic color variables and clean layered contracts powering both the web apps and CLI installer.
            </p>
          </div>

          {/* Tokens Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-[#222222] bg-[#121212] p-4 crm-tactile">
              <div className="flex items-center justify-between mb-3">
                <span className="font-fira text-xs text-neutral-400">WON_STATUS</span>
                <span className="size-3 rounded-full bg-[#16C89E]" />
              </div>
              <div className="font-mono font-bold text-2xl text-[#16C89E]">#16C89E</div>
              <p className="text-xs text-neutral-400 mt-2">
                Mint emerald tone for won deals, positive indicators, and primary accents.
              </p>
            </div>

            <div className="rounded-2xl border border-[#222222] bg-[#121212] p-4 crm-tactile">
              <div className="flex items-center justify-between mb-3">
                <span className="font-fira text-xs text-neutral-400">NEGOTIATION</span>
                <span className="size-3 rounded-full bg-[#9668FE]" />
              </div>
              <div className="font-mono font-bold text-2xl text-[#9668FE]">#9668FE</div>
              <p className="text-xs text-neutral-400 mt-2">
                Electric violet for enterprise contract negotiations and active tiers.
              </p>
            </div>

            <div className="rounded-2xl border border-[#222222] bg-[#121212] p-4 crm-tactile">
              <div className="flex items-center justify-between mb-3">
                <span className="font-fira text-xs text-neutral-400">LEAD_STAGE</span>
                <span className="size-3 rounded-full bg-[#FFDB4B]" />
              </div>
              <div className="font-mono font-bold text-2xl text-[#FFDB4B]">#FFDB4B</div>
              <p className="text-xs text-neutral-400 mt-2">
                Warm amber tone for inbound prospects, notifications, and pending stages.
              </p>
            </div>

            <div className="rounded-2xl border border-[#222222] bg-[#121212] p-4 crm-tactile">
              <div className="flex items-center justify-between mb-3">
                <span className="font-fira text-xs text-neutral-400">LOST_STATUS</span>
                <span className="size-3 rounded-full bg-[#FE4A8E]" />
              </div>
              <div className="font-mono font-bold text-2xl text-[#FE4A8E]">#FE4A8E</div>
              <p className="text-xs text-neutral-400 mt-2">
                High-visibility magenta for lost deals, cancellations, and critical alerts.
              </p>
            </div>
          </div>

          {/* Clean Architecture Highlight Banner */}
          <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 crm-tactile flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="space-y-1">
              <div className="font-fira text-xs text-[#16C89E] flex items-center gap-1.5">
                <Layers className="size-3.5" />
                <span>Layered Clean Architecture Contract</span>
              </div>
              <h4 className="text-base font-semibold text-white">
                Decoupled Contracts &rarr; Implementations &rarr; Services
              </h4>
              <p className="text-xs text-neutral-400 max-w-xl">
                Repository pattern adhering to GrubPac architecture. The UI and CLI layers interact strictly through interface contracts (<code className="font-fira text-[#16C89E]">IComponentContract</code>, <code className="font-fira text-[#16C89E]">IUserContract</code>).
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/components/button"
                className="px-4 py-2 rounded-xl bg-[#1E1E1E] hover:bg-[#282828] text-xs font-fira text-white transition-colors border border-white/10"
              >
                Inspect Sample Component
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#1F1F1F] bg-[#0E0E0E] py-6 text-center text-xs text-neutral-500 w-full">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-fira">
            <div className="flex items-center gap-2">
              <div className="size-3.5 rounded bg-[#16C89E]" />
              <span className="font-medium text-neutral-300">Blink Compo · Tech Inject Design Library</span>
              <span>·</span>
              <span className="text-neutral-500">Astryx Standard</span>
            </div>
            <div>Full Screen Snap Showcase · Sales CRM Standard</div>
          </div>
        </footer>
      </section>
    </div>
  );
}
