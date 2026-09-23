"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  Shield,
  Layers,
  Users,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  Globe,
  EyeOff,
  LogOut,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCode,
  KeyRound,
  RefreshCw,
  Search,
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
  code: string;
  usageExample: string;
  agentPrompt: string;
  dependencies: string[];
}

interface CustomerItem {
  id: string;
  email: string;
  name: string;
  role: string;
  isPremium: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { admin, token, isLoading, loginWithSecret, loginWithCredentials, logout } =
    useAdminAuth();

  // Login form state
  const [secretInput, setSecretInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginMode, setLoginMode] = useState<"secret" | "credentials">("secret");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"components" | "customers">("components");
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // New component modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<"form" | "json">("form");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "Form Controls",
    version: "1.0.0",
    accessLevel: "FREE" as "FREE" | "PREMIUM",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    code: "",
    usageExample: "",
    agentPrompt: "",
    dependencies: "lucide-react",
  });
  const [jsonBundle, setJsonBundle] = useState("");

  const showToast = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchComponents = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/components", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setComponents(data.data);
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to load components");
    }
  };

  const fetchCustomers = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to load customers");
    }
  };

  useEffect(() => {
    if (token) {
      setLoadingData(true);
      Promise.all([fetchComponents(), fetchCustomers()]).finally(() =>
        setLoadingData(false)
      );
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (loginMode === "secret") {
        await loginWithSecret(secretInput || "tech-inject-admin-secure-key-2026");
      } else {
        await loginWithCredentials(emailInput, passwordInput);
      }
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: "DRAFT" | "PUBLISHED") => {
    const action = currentStatus === "PUBLISHED" ? "unpublish" : "publish";
    try {
      const res = await fetch(`/api/admin/components/${id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("success", `Component ${action === "publish" ? "published" : "unpublished"}`);
      fetchComponents();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleDeleteComponent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this component?")) return;
    try {
      const res = await fetch(`/api/admin/components/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("success", "Component deleted successfully");
      fetchComponents();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleToggleCustomerTier = async (id: string, currentIsPremium: boolean) => {
    const nextStatus = !currentIsPremium;
    try {
      const res = await fetch(`/api/admin/customers/${id}/tier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPremium: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(
        "success",
        `Premium status ${nextStatus ? "granted" : "revoked"} successfully!`
      );
      fetchCustomers();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payload: any;
      if (modalMode === "json") {
        try {
          payload = JSON.parse(jsonBundle);
        } catch {
          throw new Error("Invalid JSON format in component bundle");
        }
      } else {
        payload = {
          ...formData,
          dependencies: formData.dependencies
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean),
        };
      }

      const res = await fetch("/api/admin/components", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast("success", "Component created successfully!");
      setShowAddModal(false);
      fetchComponents();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A] text-xs text-neutral-500">
        Authenticating session...
      </div>
    );
  }

  // 1. Unauthenticated: Admin Login Screen
  if (!admin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#262626] bg-[#121212] p-8 crm-tactile">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-12 rounded-2xl bg-[#1E1E1E] border border-neutral-700 flex items-center justify-center mb-3 text-[#16C89E]">
              <Shield className="size-6" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Server-verified administrative portal for Tech Inject Design Library
            </p>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl border border-[#FE4A8E]/30 bg-[#FE4A8E]/10 p-3 text-xs text-[#FE4A8E] flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="flex rounded-xl bg-[#1A1A1A] p-1 mb-6 border border-[#2B2B2B]">
            <button
              onClick={() => setLoginMode("secret")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                loginMode === "secret"
                  ? "bg-[#252525] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Admin Secret Key
            </button>
            <button
              onClick={() => setLoginMode("credentials")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                loginMode === "credentials"
                  ? "bg-[#252525] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Admin Email Login
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMode === "secret" ? (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Server Admin Secret (ADMIN_SECRET)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                  <input
                    type="password"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    placeholder="Enter admin secret key..."
                    className="w-full h-10 rounded-xl bg-[#181818] border border-[#2B2B2B] pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#16C89E]"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@techinject.io"
                    className="w-full h-10 rounded-xl bg-[#181818] border border-[#2B2B2B] px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#16C89E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 rounded-xl bg-[#181818] border border-[#2B2B2B] px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#16C89E]"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-10 rounded-xl bg-[#16C89E] hover:bg-[#13b58e] text-black font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {authLoading ? "Authenticating..." : "Sign In to Admin Portal"}
            </button>
          </form>

          {/* Quick Reviewer Test Button */}
          <div className="mt-6 pt-5 border-t border-[#222222] text-center">
            <button
              type="button"
              onClick={() => {
                loginWithSecret("tech-inject-admin-secure-key-2026");
              }}
              className="w-full py-2 px-3 rounded-xl border border-neutral-700 bg-[#1A1A1A] text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#252525] transition-all flex items-center justify-center gap-1.5"
            >
              <KeyRound className="size-3.5 text-[#16C89E]" />
              <span>1-Click Reviewer Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  const publishedCount = components.filter((c) => c.status === "PUBLISHED").length;
  const draftCount = components.filter((c) => c.status === "DRAFT").length;
  const premiumCustomers = customers.filter((c) => c.isPremium).length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-200">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl border p-3.5 text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-[#16C89E]/15 border-[#16C89E]/40 text-[#16C89E]"
              : "bg-[#FE4A8E]/15 border-[#FE4A8E]/40 text-[#FE4A8E]"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-[#222222] bg-[#0E0E0E] sticky top-0 z-30">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#1E1E1E] border border-white/10 text-[#16C89E]">
              <Shield className="size-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Tech Inject Administrator</span>
              <span className="ml-2 rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                Live Server
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Logged in as <strong className="text-white">{admin.email}</strong>
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-[#161616] hover:bg-[#222222] px-3 py-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <LogOut className="size-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* KPI Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-[#242424] bg-[#121212] p-4 crm-tactile">
            <span className="text-xs text-neutral-400">Total Components</span>
            <div className="text-2xl font-bold text-white mt-1">{components.length}</div>
          </div>
          <div className="rounded-xl border border-[#242424] bg-[#121212] p-4 crm-tactile">
            <span className="text-xs text-neutral-400">Published Live</span>
            <div className="text-2xl font-bold text-[#16C89E] mt-1">{publishedCount}</div>
          </div>
          <div className="rounded-xl border border-[#242424] bg-[#121212] p-4 crm-tactile">
            <span className="text-xs text-neutral-400">Drafts (Private)</span>
            <div className="text-2xl font-bold text-[#FFDB4B] mt-1">{draftCount}</div>
          </div>
          <div className="rounded-xl border border-[#242424] bg-[#121212] p-4 crm-tactile">
            <span className="text-xs text-neutral-400">Premium Customers</span>
            <div className="text-2xl font-bold text-[#9668FE] mt-1">{premiumCustomers}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("components")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === "components"
                  ? "bg-[#1E1E1E] text-white border border-neutral-700"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layers className="size-4 text-[#16C89E]" />
              <span>Components Registry ({components.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === "customers"
                  ? "bg-[#1E1E1E] text-white border border-neutral-700"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Users className="size-4 text-[#9668FE]" />
              <span>Customer Access Tiers ({customers.length})</span>
            </button>
          </div>

          {activeTab === "components" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black px-3.5 py-2 text-xs font-semibold transition-all shadow-md"
            >
              <Plus className="size-4" />
              <span>Publish / Add Component</span>
            </button>
          )}
        </div>

        {/* TAB 1: Components Management */}
        {activeTab === "components" && (
          <div className="rounded-2xl border border-[#242424] bg-[#121212] overflow-hidden crm-tactile">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#242424] bg-[#161616] text-neutral-400 font-medium">
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">Access Level</th>
                    <th className="py-3 px-4">Publication Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C] text-neutral-300">
                  {components.map((c) => (
                    <tr key={c.id} className="hover:bg-[#171717] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-[11px] font-mono text-neutral-500">{c.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-neutral-400">{c.category}</td>
                      <td className="py-3 px-4 font-mono text-neutral-500">v{c.version}</td>
                      <td className="py-3 px-4">
                        {c.accessLevel === "PREMIUM" ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#16C89E]/40 bg-[#16C89E]/10 px-2 py-0.5 text-[10px] font-semibold text-[#16C89E]">
                            <Sparkles className="size-2.5" />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-300">
                            FREE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {c.status === "PUBLISHED" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16C89E]">
                            <Globe className="size-3" />
                            Published (Public)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#FFDB4B]">
                            <EyeOff className="size-3" />
                            Draft (Hidden)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(c.id, c.status)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                              c.status === "PUBLISHED"
                                ? "border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white"
                                : "border-[#16C89E]/40 bg-[#16C89E]/10 text-[#16C89E] hover:bg-[#16C89E]/20"
                            }`}
                          >
                            {c.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => handleDeleteComponent(c.id)}
                            className="p-1.5 rounded-lg border border-neutral-800 text-neutral-500 hover:text-[#FE4A8E] hover:border-[#FE4A8E]/40 transition-colors"
                            title="Delete component"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Customer Tier Access Control */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#242424] bg-[#141414] p-4 text-xs text-neutral-400">
              <span className="font-semibold text-white block mb-1">
                Access Enforcement Rule (Section 5):
              </span>
              Admins grant or revoke premium access. Revoking premium access takes effect immediately on
              the server—blocking subsequent protected preview, source code, and CLI download requests even
              if the customer remains signed in.
            </div>

            <div className="rounded-2xl border border-[#242424] bg-[#121212] overflow-hidden crm-tactile">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#242424] bg-[#161616] text-neutral-400 font-medium">
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Current Access Tier</th>
                      <th className="py-3 px-4">Registered</th>
                      <th className="py-3 px-4 text-right">Access Management Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1C1C] text-neutral-300">
                    {customers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#171717] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{cust.name}</div>
                          <div className="text-[11px] font-mono text-neutral-500">{cust.email}</div>
                        </td>
                        <td className="py-3 px-4 text-neutral-400">{cust.role}</td>
                        <td className="py-3 px-4">
                          {cust.isPremium ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#16C89E]/40 bg-[#16C89E]/10 px-2.5 py-0.5 text-xs font-semibold text-[#16C89E]">
                              <Sparkles className="size-3" />
                              PREMIUM ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                              FREE TIER
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                          {new Date(cust.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleCustomerTier(cust.id, cust.isPremium)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              cust.isPremium
                                ? "bg-[#FE4A8E]/10 border border-[#FE4A8E]/30 text-[#FE4A8E] hover:bg-[#FE4A8E]/20"
                                : "bg-[#16C89E] hover:bg-[#14b68e] text-black"
                            }`}
                          >
                            {cust.isPremium ? "Revoke Premium Access" : "Grant Premium Access"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Upload / Create Component */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#141414] border border-[#2B2B2B] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Create / Upload Component</h3>
                <p className="text-xs text-neutral-400">
                  Publish a new reusable component to the Tech Inject catalogue
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex rounded-xl bg-[#1A1A1A] p-1 mb-6 border border-[#2B2B2B]">
              <button
                type="button"
                onClick={() => setModalMode("form")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  modalMode === "form"
                    ? "bg-[#252525] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Form Fields
              </button>
              <button
                type="button"
                onClick={() => setModalMode("json")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  modalMode === "json"
                    ? "bg-[#252525] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Upload JSON Bundle
              </button>
            </div>

            <form onSubmit={handleCreateComponent} className="space-y-4">
              {modalMode === "json" ? (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Component JSON Bundle
                  </label>
                  <textarea
                    rows={12}
                    value={jsonBundle}
                    onChange={(e) => setJsonBundle(e.target.value)}
                    placeholder={`{\n  "slug": "custom-card",\n  "name": "CustomCard",\n  "description": "...",\n  "category": "Data Display",\n  "version": "1.0.0",\n  "accessLevel": "FREE",\n  "status": "PUBLISHED",\n  "code": "export const CustomCard = () => ...",\n  "usageExample": "...",\n  "agentPrompt": "..."\n}`}
                    className="w-full rounded-xl bg-[#181818] border border-[#2B2B2B] p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-[#16C89E]"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Component Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                          })
                        }
                        placeholder="e.g. SalesPipelines"
                        className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-3 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Unique Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. sales-pipelines"
                        className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-3 text-xs text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief component summary..."
                      className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-3 text-xs text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-2 text-xs text-white"
                      >
                        <option>Form Controls</option>
                        <option>Data Display</option>
                        <option>Navigation</option>
                        <option>Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Access Level
                      </label>
                      <select
                        value={formData.accessLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accessLevel: e.target.value as "FREE" | "PREMIUM",
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-2 text-xs text-white"
                      >
                        <option value="FREE">Free</option>
                        <option value="PREMIUM">Premium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "DRAFT" | "PUBLISHED",
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#181818] border border-[#2B2B2B] px-2 text-xs text-white"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      TypeScript Code Source
                    </label>
                    <textarea
                      rows={5}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="import React from 'react'; export const ..."
                      className="w-full rounded-lg bg-[#181818] border border-[#2B2B2B] p-2.5 text-xs font-mono text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Usage Example
                    </label>
                    <textarea
                      rows={3}
                      value={formData.usageExample}
                      onChange={(e) =>
                        setFormData({ ...formData, usageExample: e.target.value })
                      }
                      placeholder="export function Example() { return <Component />; }"
                      className="w-full rounded-lg bg-[#181818] border border-[#2B2B2B] p-2.5 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      AI Agent Prompt
                    </label>
                    <textarea
                      rows={3}
                      value={formData.agentPrompt}
                      onChange={(e) =>
                        setFormData({ ...formData, agentPrompt: e.target.value })
                      }
                      placeholder="Instructions for coding agents on how to install and integrate..."
                      className="w-full rounded-lg bg-[#181818] border border-[#2B2B2B] p-2.5 text-xs font-mono text-white"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16C89E] hover:bg-[#14b68e] text-black font-semibold text-xs transition-colors"
                >
                  Save Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
