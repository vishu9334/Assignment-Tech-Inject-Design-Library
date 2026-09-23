"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, quickLogin, login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleScrollTo = (e: React.MouseEvent, targetId: string) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${targetId}`);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#222222] bg-[#0E0E0E]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#1E1E1E] border border-white/10 group-hover:border-[#16C89E]/50 transition-colors">
                <Layers className="size-4 text-[#16C89E]" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">
                Tech Inject <span className="text-xs font-normal text-neutral-400">/ UI Library</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-neutral-400">
              <Link
                href="/#catalogue"
                onClick={(e) => handleScrollTo(e, "catalogue")}
                className="hover:text-white transition-colors"
              >
                Catalogue
              </Link>
              <Link
                href="/#theme"
                onClick={(e) => handleScrollTo(e, "theme")}
                className="hover:text-white transition-colors"
              >
                CRM Theme Tokens
              </Link>
              <Link
                href="/#cli"
                onClick={(e) => handleScrollTo(e, "cli")}
                className="hover:text-white transition-colors"
              >
                NPX Installer
              </Link>
              <a
                href="https://sales-crm-kargulstudio.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors text-neutral-500"
              >
                <span>Sales CRM Source</span>
                <ExternalLink className="size-3" />
              </a>
            </nav>
          </div>

          {/* Account & Status Header */}
          <div className="flex items-center gap-3">
            {/* Live Status Badge */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
                    user.isPremium
                      ? "bg-[#16C89E]/10 border-[#16C89E]/40 text-[#16C89E]"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300"
                  }`}
                >
                  {user.isPremium ? (
                    <>
                      <Sparkles className="size-3 text-[#16C89E]" />
                      <span>Premium Active</span>
                    </>
                  ) : (
                    <>
                      <User className="size-3 text-neutral-400" />
                      <span>Free Account</span>
                    </>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs text-neutral-500">
                  Viewing as Guest
                </span>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1E1E1E] hover:bg-[#282828] text-white border border-[#333333] px-3 py-1 text-xs font-medium transition-all shadow-[0px_0px_0px_1px_rgba(0,0,0,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.06)]"
                >
                  <LogIn className="size-3" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Quick Test Account Switcher */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-neutral-800">
              <span className="text-[11px] text-neutral-500 mr-1">Reviewer Quick-Switch:</span>
              <button
                onClick={() => quickLogin("free")}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                  user && !user.isPremium
                    ? "bg-white text-black border-white font-semibold"
                    : "bg-[#181818] text-neutral-400 border-neutral-800 hover:text-white"
                }`}
              >
                Free User
              </button>
              <button
                onClick={() => quickLogin("premium")}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                  user && user.isPremium
                    ? "bg-[#16C89E] text-black border-[#16C89E] font-semibold"
                    : "bg-[#181818] text-neutral-400 border-neutral-800 hover:text-[#16C89E]"
                }`}
              >
                ★ Premium User
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sign In Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#141414] border border-[#2B2B2B] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-4">
              <h3 className="text-sm font-semibold text-white">Sign In to Tech Inject</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-[#FE4A8E]/10 border border-[#FE4A8E]/30 p-2.5 text-xs text-[#FE4A8E]">
                {error}
              </div>
            )}

            <form onSubmit={handleCustomLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#16C89E]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#16C89E]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-9 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#242424] text-center">
              <span className="text-[11px] text-neutral-400 block mb-2">Or use seeded test accounts:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    quickLogin("free");
                    setShowModal(false);
                  }}
                  className="py-1.5 px-2 rounded-lg bg-[#1C1C1C] border border-[#2B2B2B] text-[11px] text-neutral-300 hover:text-white"
                >
                  Free Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    quickLogin("premium");
                    setShowModal(false);
                  }}
                  className="py-1.5 px-2 rounded-lg bg-[#16C89E]/10 border border-[#16C89E]/30 text-[11px] text-[#16C89E] hover:bg-[#16C89E]/20"
                >
                  ★ Premium Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
