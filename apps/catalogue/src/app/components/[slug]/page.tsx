"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Copy,
  Check,
  Terminal,
  Code2,
  Bot,
  Sliders,
  Layers,
  Info,
  ExternalLink,
} from "lucide-react";

// Import UI components from @tech-inject/ui for the live interactive preview!
import {
  Button,
  StatusBadge,
  MetricCard,
  DealsTable,
  FilterPill,
  ActionModal,
  InputField,
  UserAvatar,
  KPIChart,
} from "@tech-inject/ui";
import { CodeHighlighter } from "@/components/CodeHighlighter";

interface ComponentDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  version: string;
  accessLevel: "FREE" | "PREMIUM";
  status: "DRAFT" | "PUBLISHED";
  code: string | null;
  usageExample: string | null;
  agentPrompt: string | null;
  dependencies: string[];
  propsDoc: Record<string, { type: string; default?: string; description?: string }> | null;
  thumbnailUrl: string | null;
  isLocked: boolean;
  lockReason?: string;
}

export default function ComponentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, token } = useAuth();

  const [component, setComponent] = useState<ComponentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "cli" | "agent" | "props">("code");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Preview interactive state
  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPillOpen, setFilterPillOpen] = useState(false);
  const [kpiPeriod, setKpiPeriod] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`/api/components/${slug}`, { headers })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load component");
        }
        setComponent(json.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, token, user?.isPremium]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs text-neutral-400">
        Loading component specification...
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-block p-6 rounded-2xl border border-[#2B2B2B] bg-[#141414]">
          <h2 className="text-sm font-semibold text-white mb-2">Component Not Found</h2>
          <p className="text-xs text-neutral-400 mb-4">{error || "The requested component does not exist."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#16C89E] hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to catalogue</span>
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = component.isLocked;
  const cliCommand =
    component.accessLevel === "PREMIUM"
      ? `npx tech-inject-ui add ${component.slug} --token ${token || "<YOUR_AUTH_TOKEN>"}`
      : `npx tech-inject-ui add ${component.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to components</span>
      </Link>

      {/* Component Title & Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222222] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
              {component.category}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-[11px] font-mono text-neutral-400">v{component.version}</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>{component.name}</span>
            {component.accessLevel === "PREMIUM" ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#16C89E]/40 bg-[#16C89E]/10 px-2.5 py-0.5 text-xs font-semibold text-[#16C89E]">
                <Sparkles className="size-3" />
                PREMIUM
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/80 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
                FREE
              </span>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-2xl leading-relaxed">
            {component.description}
          </p>
        </div>

        {/* Quick NPX Install Badge */}
        {!isLocked && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => copyToClipboard(cliCommand, "header-cli")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#141414] border border-[#2B2B2B] px-3.5 py-2 text-xs font-mono text-neutral-300 hover:border-[#16C89E] transition-all crm-tactile"
            >
              <Terminal className="size-3.5 text-[#16C89E]" />
              <span className="truncate max-w-[200px]">{cliCommand}</span>
              {copiedKey === "header-cli" ? (
                <Check className="size-3 text-[#16C89E]" />
              ) : (
                <Copy className="size-3 text-neutral-500" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Interactive Live Preview Box / Locked Banner */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Sliders className="size-3.5 text-[#16C89E]" />
            <span>Interactive Preview</span>
          </span>
          <span className="text-[11px] text-neutral-500">Sales CRM Theme</span>
        </div>

        {isLocked ? (
          /* Locked State UI (per Section 5 of assignment PDF) */
          <div className="relative rounded-2xl border border-[#262626] bg-[#111111] p-8 sm:p-12 text-center overflow-hidden crm-tactile">
            {/* Background blur decorative element */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#16C89E]/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
              <div className="size-12 rounded-2xl bg-[#1C1C1C] border border-neutral-700 flex items-center justify-center mb-4 text-[#16C89E]">
                <Lock className="size-6" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                Premium Component Locked
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {component.lockReason ||
                  "This component is restricted to active premium customer accounts. Please sign in or contact your system administrator to grant premium access."}
              </p>

              {/* Static High-Fidelity Thumbnail Preview */}
              <div className="w-full rounded-xl border border-neutral-800 bg-[#161616] p-4 text-xs text-neutral-400 font-mono mb-6 text-left">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-2">
                  <span>Static Preview Snapshot</span>
                  <span className="text-neutral-600">Watermarked</span>
                </div>
                <div className="h-16 flex items-center justify-center border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-xs">
                  [Locked: {component.name} Production Preview]
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-left w-full text-[11px] text-neutral-400">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Info className="size-3 text-[#16C89E]" />
                  <span>How to obtain access:</span>
                </div>
                Admins manage customer tier permissions directly from the Admin Dashboard. Test reviewers can also click
                <strong className="text-white font-medium"> &quot;★ Premium User&quot;</strong> in the top navbar to instantly test the unlocked flow.
              </div>
            </div>
          </div>
        ) : (
          /* Unlocked Live Interactive Preview Canvas */
          <div className="rounded-2xl border border-[#262626] bg-[#0E0E0E] p-6 sm:p-10 crm-tactile">
            {component.slug === "button" && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="text-xs text-neutral-500 mb-2">Variants (Pill style):</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary Action</Button>
                    <Button variant="secondary">Secondary Action</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="danger">Danger Action</Button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-neutral-500 mb-2">Interactive States & Loading:</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="secondary"
                      loading={btnLoading}
                      onClick={() => {
                        setBtnLoading(true);
                        setTimeout(() => setBtnLoading(false), 1500);
                      }}
                    >
                      {btnLoading ? "Processing..." : "Click to Test Loading State"}
                    </Button>
                    <Button variant="secondary" disabled>
                      Disabled State
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {component.slug === "status-badge" && (
              <div className="flex flex-col gap-4">
                <div className="text-xs text-neutral-500">Sales CRM Pipeline Statuses:</div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status="won" />
                  <StatusBadge status="active" />
                  <StatusBadge status="lead" />
                  <StatusBadge status="negotiation" />
                  <StatusBadge status="lost" />
                </div>
              </div>
            )}

            {component.slug === "metric-card" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Total Pipeline Value" value="$842,500" trend={14.8} />
                <MetricCard title="Active Companies" value="241" trend={5.2} />
                <MetricCard title="Win Rate" value="42.6%" trend={-2.1} />
              </div>
            )}

            {component.slug === "deals-table" && (
              <DealsTable
                deals={[
                  { id: "1", company: "Acme Cloud Corp", stage: "negotiation", value: "$120,000", owner: "Jensen Ackles", closeDate: "Oct 15, 2026" },
                  { id: "2", company: "Starlight Networks", stage: "won", value: "$450,000", owner: "Sarah Connor", closeDate: "Sep 28, 2026" },
                  { id: "3", company: "Hyperion Labs", stage: "lead", value: "$75,000", owner: "Elena Fisher", closeDate: "Nov 02, 2026" },
                  { id: "4", company: "Omni Consumer Tech", stage: "lost", value: "$210,000", owner: "Alex Murphy", closeDate: "Aug 19, 2026" },
                ]}
              />
            )}

            {component.slug === "filter-pill" && (
              <div className="flex flex-col gap-4">
                <div className="text-xs text-neutral-500">Interactive Split Filter Pills:</div>
                <div className="flex flex-wrap gap-3">
                  <FilterPill
                    label="Sort by"
                    value="Pipeline Value"
                    isOpen={filterPillOpen}
                    onClick={() => setFilterPillOpen(!filterPillOpen)}
                  />
                  <FilterPill label="Filter" value="All Owners" />
                  <FilterPill label="Region" value="North America" />
                </div>
              </div>
            )}

            {component.slug === "action-modal" && (
              <div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Open CRM Action Modal
                </Button>
                <ActionModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Create Pipeline Deal"
                  description="Add new company opportunity to your enterprise pipeline."
                >
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-neutral-400 block mb-1">Company Name</label>
                      <input
                        placeholder="e.g. Acme Corp"
                        className="w-full h-8 px-3 rounded-lg bg-[#1C1C1C] border border-neutral-700 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                        Save Deal
                      </Button>
                    </div>
                  </div>
                </ActionModal>
              </div>
            )}

            {component.slug === "input-field" && (
              <div className="flex flex-col gap-4 max-w-md">
                <div className="text-xs text-neutral-500">Sales CRM Form Inputs:</div>
                <InputField label="Lead Name" placeholder="e.g. Acme Corporation" />
                <InputField
                  label="Deal Value"
                  placeholder="$50,000"
                  helperText="Estimated annualized contract value"
                />
              </div>
            )}

            {component.slug === "user-avatar" && (
              <div className="flex flex-col gap-6">
                <div className="text-xs text-neutral-500">
                  Sales CRM Avatars with Online Status Indicator:
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <UserAvatar
                    name="Sarah Jenkins"
                    status="online"
                    size="lg"
                    subtext="Online · VP Sales"
                  />
                  <UserAvatar
                    name="Alex Rivers"
                    status="away"
                    size="md"
                    subtext="Away · Account Exec"
                  />
                  <UserAvatar
                    name="Marcus Kane"
                    status="offline"
                    size="sm"
                    subtext="Offline · SDR"
                  />
                </div>
              </div>
            )}

            {component.slug === "kpi-chart" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    Sales CRM KPI Card with Sparkline & Progress:
                  </div>
                  <div className="flex gap-1.5 bg-[#181818] p-1 rounded-lg border border-neutral-800">
                    <button
                      onClick={() => setKpiPeriod("weekly")}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        kpiPeriod === "weekly"
                          ? "bg-[#16C89E] text-black font-semibold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setKpiPeriod("monthly")}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        kpiPeriod === "monthly"
                          ? "bg-[#16C89E] text-black font-semibold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <KPIChart
                    title={kpiPeriod === "weekly" ? "Weekly Revenue" : "Monthly Revenue"}
                    value={kpiPeriod === "weekly" ? "$124,592" : "$482,900"}
                    changePercent={kpiPeriod === "weekly" ? 18.4 : 32.1}
                    period={kpiPeriod === "weekly" ? "vs last week" : "vs last month"}
                    progressPercent={kpiPeriod === "weekly" ? 72 : 88}
                  />
                  <KPIChart
                    title="Pipeline Conversion"
                    value="48.2%"
                    changePercent={6.5}
                    period="Target: 50%"
                    progressPercent={65}
                  />
                </div>
              </div>
            )}

            {![
              "button",
              "status-badge",
              "metric-card",
              "deals-table",
              "filter-pill",
              "action-modal",
              "input-field",
              "user-avatar",
              "kpi-chart",
            ].includes(component.slug) && (
              <div className="flex flex-col gap-4">
                <div className="text-xs text-neutral-500">Custom Component Sandbox:</div>
                <div className="rounded-xl border border-dashed border-neutral-700 bg-[#141414] p-6 text-center">
                  <div className="inline-flex items-center justify-center size-10 rounded-xl bg-[#1E1E1E] text-[#16C89E] mb-3">
                    <Sparkles className="size-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{component.name}</h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4 leading-relaxed">
                    {component.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-neutral-800 text-neutral-300 border border-neutral-700">
                      Category: {component.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#16C89E]/10 text-[#16C89E] border border-[#16C89E]/20">
                      Version {component.version}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#9668FE]/10 text-[#9668FE] border border-[#9668FE]/20">
                      Access: {component.accessLevel}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Integration Options (Code / CLI / AI Prompt / Props Documentation) */}
      {!isLocked && (
        <div className="rounded-2xl border border-[#242424] bg-[#121212] overflow-hidden crm-tactile">
          {/* Tabs Navigation */}
          <div className="flex items-center justify-between border-b border-[#222222] bg-[#161616] px-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === "code"
                    ? "border-[#16C89E] text-white"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Code2 className="size-3.5" />
                <span>React Source</span>
              </button>

              <button
                onClick={() => setActiveTab("cli")}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === "cli"
                    ? "border-[#16C89E] text-white"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Terminal className="size-3.5" />
                <span>NPX Installer</span>
              </button>

              <button
                onClick={() => setActiveTab("agent")}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === "agent"
                    ? "border-[#16C89E] text-white"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Bot className="size-3.5" />
                <span>AI Agent Prompt</span>
              </button>

              <button
                onClick={() => setActiveTab("props")}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === "props"
                    ? "border-[#16C89E] text-white"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Layers className="size-3.5" />
                <span>Props API</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "code" && (
              <div>
                <CodeHighlighter
                  code={component.code || ""}
                  filename={`components/ui/${component.name}.tsx`}
                  language="TSX"
                  maxHeight="max-h-[560px]"
                />
              </div>
            )}

            {activeTab === "cli" && (
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Install with NPX
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Run this command in any React / Next.js project to automatically add {component.name} and its theme dependencies.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-[#0A0A0A] border border-[#222222] p-4 font-mono text-xs text-neutral-200">
                  <code className="text-[#16C89E]">{cliCommand}</code>
                  <button
                    onClick={() => copyToClipboard(cliCommand, "cli")}
                    className="flex items-center gap-1.5 bg-[#1E1E1E] hover:bg-[#282828] text-white px-3 py-1.5 rounded-lg border border-white/5 text-xs transition-colors ml-4"
                  >
                    {copiedKey === "cli" ? (
                      <>
                        <Check className="size-3 text-[#16C89E]" />
                        <span className="text-[#16C89E]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "agent" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-neutral-400">
                    Ready-to-paste prompt for AI coding agents (Claude, Cursor, Copilot, Antigravity):
                  </span>
                  <button
                    onClick={() => copyToClipboard(component.agentPrompt || "", "agent")}
                    className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-[#1E1E1E] hover:bg-[#2A2A2A] px-3 py-1.5 rounded-lg border border-white/5 transition-all"
                  >
                    {copiedKey === "agent" ? (
                      <>
                        <Check className="size-3.5 text-[#16C89E]" />
                        <span className="text-[#16C89E]">Copied Prompt</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy Agent Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl bg-[#0A0A0A] border border-[#222222] p-4 text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {component.agentPrompt}
                </div>
              </div>
            )}

            {activeTab === "props" && (
              <div className="overflow-x-auto">
                {component.propsDoc && Object.keys(component.propsDoc).length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 font-medium pb-2">
                        <th className="py-2.5 px-3">Prop</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Default</th>
                        <th className="py-2.5 px-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 font-mono text-neutral-300">
                      {Object.entries(component.propsDoc).map(([name, prop]: any) => (
                        <tr key={name}>
                          <td className="py-2.5 px-3 text-[#16C89E] font-semibold">{name}</td>
                          <td className="py-2.5 px-3 text-neutral-400">{prop.type || "string"}</td>
                          <td className="py-2.5 px-3 text-neutral-500">{prop.default || "—"}</td>
                          <td className="py-2.5 px-3 font-sans text-neutral-400">{prop.description || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-xs text-neutral-500 py-6 text-center">
                    Refer to TypeScript interface definitions in the component source.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
