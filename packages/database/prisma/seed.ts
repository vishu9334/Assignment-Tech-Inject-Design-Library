import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed Accounts
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const freePassword = await bcrypt.hash("User@12345", 10);
  const premiumPassword = await bcrypt.hash("Premium@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@techinject.io" },
    update: {},
    create: {
      email: "admin@techinject.io",
      name: "TechInject Admin",
      password: adminPassword,
      role: "ADMIN",
      isPremium: true,
    },
  });

  const freeUser = await prisma.user.upsert({
    where: { email: "free@techinject.io" },
    update: {},
    create: {
      email: "free@techinject.io",
      name: "Free Developer",
      password: freePassword,
      role: "CUSTOMER",
      isPremium: false,
    },
  });

  const premiumUser = await prisma.user.upsert({
    where: { email: "premium@techinject.io" },
    update: {},
    create: {
      email: "premium@techinject.io",
      name: "Premium Enterprise Dev",
      password: premiumPassword,
      role: "CUSTOMER",
      isPremium: true,
    },
  });

  console.log("Users created:", {
    admin: admin.email,
    freeUser: freeUser.email,
    premiumUser: premiumUser.email,
  });

  // 2. Components derived from Sales CRM Reference
  const components = [
    {
      slug: "button",
      name: "Button",
      description: "Sales CRM tactile button with inner glass highlights, dark surface elevation, and multiple functional variants.",
      category: "Form Controls",
      version: "1.0.0",
      accessLevel: "FREE" as const,
      status: "PUBLISHED" as const,
      dependencies: ["lucide-react"],
      propsDoc: {
        variant: { type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'secondary'" },
        size: { type: "'sm' | 'md' | 'lg'", default: "'md'" },
        pill: { type: "boolean", default: "true" },
        loading: { type: "boolean", default: "false" },
        disabled: { type: "boolean", default: "false" },
      },
      code: `import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "secondary",
  size = "md",
  pill = true,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  const radii = pill ? "rounded-full" : "rounded-lg";

  const sizes = {
    sm: "h-7 px-3 text-xs gap-1.5",
    md: "h-[30px] px-3.5 text-xs gap-2 leading-none",
    lg: "h-9 px-4 text-sm gap-2",
  };

  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.4)] font-semibold",
    secondary: "bg-[#1E1E1E] text-neutral-200 hover:bg-[#2A2A2A] hover:text-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.06)]",
    outline: "border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white bg-transparent",
    ghost: "bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-white/5",
    danger: "bg-[#FE4A8E]/10 text-[#FE4A8E] border border-[#FE4A8E]/30 hover:bg-[#FE4A8E]/20",
  };

  return (
    <button
      className={\`\${base} \${radii} \${sizes[size]} \${variants[variant]} \${className}\`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};`,
      usageExample: `import { Button } from "./Button";
import { Plus } from "lucide-react";

export function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Create Deal</Button>
      <Button variant="secondary">
        <Plus className="size-3.5" />
        Add Billing
      </Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Delete Pipeline</Button>
    </div>
  );
}`,
      agentPrompt: `You are an AI coding assistant. Install and use the Sales CRM Button component.
1. Save the Button component file to 'components/ui/Button.tsx'.
2. Ensure Tailwind CSS is configured.
3. Import { Button } from '@/components/ui/Button'.
4. Replace existing buttons with <Button variant="secondary" pill>...</Button> to adhere to the Sales CRM aesthetic.`,
    },
    {
      slug: "status-badge",
      name: "StatusBadge",
      description: "Sales CRM pipeline state badges with glowing status indicator dots (Won, Lead, In Progress, Lost).",
      category: "Data Display",
      version: "1.0.0",
      accessLevel: "FREE" as const,
      status: "PUBLISHED" as const,
      dependencies: [],
      propsDoc: {
        status: { type: "'won' | 'lead' | 'negotiation' | 'lost' | 'active'", default: "'active'" },
        label: { type: "string", default: "Automatic from status" },
        size: { type: "'sm' | 'md'", default: "'sm'" },
      },
      code: `import React from "react";

export type CRMStatus = "won" | "lead" | "negotiation" | "lost" | "active";

export interface StatusBadgeProps {
  status: CRMStatus;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = "sm",
  className = "",
}) => {
  const configs: Record<CRMStatus, { text: string; dot: string; border: string; bg: string }> = {
    won: { text: "Won", dot: "bg-[#16C89E]", border: "border-[#16C89E]/30", bg: "bg-[#16C89E]/10" },
    active: { text: "Active", dot: "bg-[#16C89E]", border: "border-[#363636]", bg: "bg-[#1C1C1C]" },
    lead: { text: "Lead", dot: "bg-[#FFDB4B]", border: "border-[#FFDB4B]/30", bg: "bg-[#FFDB4B]/10" },
    negotiation: { text: "Negotiation", dot: "bg-[#9668FE]", border: "border-[#9668FE]/30", bg: "bg-[#9668FE]/10" },
    lost: { text: "Lost", dot: "bg-[#FE4A8E]", border: "border-[#FE4A8E]/30", bg: "bg-[#FE4A8E]/10" },
  };

  const config = configs[status] || configs.active;
  const displayText = label || config.text;

  const sizeStyles = size === "sm" ? "text-[11px] py-[2px] pr-2.5 pl-2 gap-1.5" : "text-xs py-1 pr-3 pl-2.5 gap-2";

  return (
    <span
      className={\`inline-flex items-center rounded-full font-medium leading-none border \${config.border} \${config.bg} text-neutral-200 \${sizeStyles} \${className}\`}
    >
      <span className={\`size-1.5 rounded-full \${config.dot} shadow-[0_0_6px_currentColor]\`} />
      <span>{displayText}</span>
    </span>
  );
};`,
      usageExample: `import { StatusBadge } from "./StatusBadge";

export function Example() {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status="won" />
      <StatusBadge status="active" />
      <StatusBadge status="negotiation" />
      <StatusBadge status="lead" />
      <StatusBadge status="lost" />
    </div>
  );
}`,
      agentPrompt: `Integrate the Sales CRM StatusBadge component into the consumer app.
1. Place 'StatusBadge.tsx' into 'components/ui/'.
2. Use <StatusBadge status="won" /> for closed deals, and <StatusBadge status="negotiation" /> for deals in flight.`,
    },
    {
      slug: "metric-card",
      name: "MetricCard",
      description: "KPI stat card featuring trend indicator pills, icon slots, and CRM dark border treatments.",
      category: "Data Display",
      version: "1.0.0",
      accessLevel: "FREE" as const,
      status: "PUBLISHED" as const,
      dependencies: ["lucide-react"],
      propsDoc: {
        title: { type: "string", required: true },
        value: { type: "string | number", required: true },
        trend: { type: "number", description: "Positive or negative percentage" },
        trendLabel: { type: "string", default: "'vs last month'" },
        icon: { type: "React.ReactNode" },
      },
      code: `import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendLabel = "vs last month",
  icon,
  className = "",
}) => {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div
      className={\`p-4 rounded-xl bg-[#141414] border border-[#262626] text-neutral-100 flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:border-[#383838] transition-all \${className}\`}
    >
      <div className="flex items-center justify-between text-neutral-400 mb-2">
        <span className="text-xs font-medium tracking-wide">{title}</span>
        {icon ? <div className="text-neutral-400">{icon}</div> : null}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-semibold tracking-tight text-white">{value}</span>
        {trend !== undefined ? (
          <div
            className={\`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full border \${
              isPositive
                ? "bg-[#16C89E]/10 text-[#16C89E] border-[#16C89E]/30"
                : "bg-[#FE4A8E]/10 text-[#FE4A8E] border-[#FE4A8E]/30"
            }\`}
          >
            {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            <span>{isPositive ? \`+\${trend}%\` : \`\${trend}%\`}</span>
          </div>
        ) : null}
      </div>

      {trendLabel ? (
        <span className="text-[11px] text-neutral-500 mt-2 block">{trendLabel}</span>
      ) : null}
    </div>
  );
};`,
      usageExample: `import { MetricCard } from "./MetricCard";
import { DollarSign, Users, Briefcase } from "lucide-react";

export function Example() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Total Pipeline Value"
        value="$842,500"
        trend={14.8}
        icon={<DollarSign className="size-4" />}
      />
      <MetricCard
        title="Active Companies"
        value="241"
        trend={5.2}
        icon={<Briefcase className="size-4" />}
      />
      <MetricCard
        title="Win Rate"
        value="42.6%"
        trend={-2.1}
        icon={<Users className="size-4" />}
      />
    </div>
  );
}`,
      agentPrompt: `Use MetricCard to display dashboard summary indicators in a CRM layout.
Provide realistic values and trend percentages.`,
    },
    {
      slug: "deals-table",
      name: "DealsTable",
      description: "Full-fidelity Sales CRM data grid featuring sortable deal stages, owner avatars, deal value metrics, and row actions.",
      category: "Data Display",
      version: "1.0.0",
      accessLevel: "PREMIUM" as const,
      status: "PUBLISHED" as const,
      dependencies: ["lucide-react"],
      propsDoc: {
        deals: { type: "Deal[]", required: true },
        onRowClick: { type: "(deal: Deal) => void" },
      },
      code: `import React from "react";
import { MoreHorizontal } from "lucide-react";

export interface Deal {
  id: string;
  company: string;
  stage: "won" | "lead" | "negotiation" | "lost" | "active";
  value: string;
  owner: string;
  closeDate: string;
}

export interface DealsTableProps {
  deals: Deal[];
  onRowClick?: (deal: Deal) => void;
  className?: string;
}

export const DealsTable: React.FC<DealsTableProps> = ({
  deals,
  onRowClick,
  className = "",
}) => {
  const stageBadges: Record<string, { dot: string; label: string }> = {
    won: { dot: "bg-[#16C89E]", label: "Won" },
    active: { dot: "bg-[#16C89E]", label: "Active" },
    lead: { dot: "bg-[#FFDB4B]", label: "Lead" },
    negotiation: { dot: "bg-[#9668FE]", label: "Negotiation" },
    lost: { dot: "bg-[#FE4A8E]", label: "Lost" },
  };

  return (
    <div className={\`w-full overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#121212] shadow-md \${className}\`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#262626] bg-[#171717] text-neutral-400 font-medium">
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4">Pipeline Value</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Expected Close</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F] text-neutral-200">
            {deals.map((deal) => {
              const badge = stageBadges[deal.stage] || stageBadges.active;
              return (
                <tr
                  key={deal.id}
                  onClick={() => onRowClick?.(deal)}
                  className="hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-medium text-white">{deal.company}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-neutral-700 bg-neutral-900 text-[11px]">
                      <span className={\`size-1.5 rounded-full \${badge.dot}\`} />
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{deal.value}</td>
                  <td className="py-3 px-4 text-neutral-300">{deal.owner}</td>
                  <td className="py-3 px-4 text-neutral-400">{deal.closeDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
                      aria-label="Actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};`,
      usageExample: `import { DealsTable, Deal } from "./DealsTable";

const mockDeals: Deal[] = [
  { id: "1", company: "Acme Cloud Corp", stage: "negotiation", value: "$120,000", owner: "Jensen Ackles", closeDate: "Oct 15, 2026" },
  { id: "2", company: "Starlight Networks", stage: "won", value: "$450,000", owner: "Sarah Connor", closeDate: "Sep 28, 2026" },
  { id: "3", company: "Hyperion Labs", stage: "lead", value: "$75,000", owner: "Elena Fisher", closeDate: "Nov 02, 2026" },
];

export function Example() {
  return <DealsTable deals={mockDeals} onRowClick={(d) => console.log(d)} />;
}`,
      agentPrompt: `You are integrating the premium DealsTable component into the application.
1. Place the component in 'components/ui/DealsTable.tsx'.
2. Feed your pipeline deals array conforming to the Deal interface.
3. Ensure dark styling tokens match the Sales CRM reference.`,
    },
    {
      slug: "filter-pill",
      name: "FilterPill",
      description: "Sales CRM signature dual-segment pill button with embedded divider, chevron micro-animations, and dropdown trigger states.",
      category: "Navigation",
      version: "1.0.0",
      accessLevel: "PREMIUM" as const,
      status: "PUBLISHED" as const,
      dependencies: ["lucide-react"],
      propsDoc: {
        label: { type: "string", required: true },
        value: { type: "string", required: true },
        isOpen: { type: "boolean", default: "false" },
        onClick: { type: "() => void" },
      },
      code: `import React from "react";
import { ChevronDown } from "lucide-react";

export interface FilterPillProps {
  label: string;
  value: string;
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  value,
  isOpen = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={\`inline-flex items-center h-[30px] rounded-full overflow-hidden text-xs bg-[#1E1E1E] text-neutral-200 border border-[#2E2E2E] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.4),inset_0px_1px_0px_0px_rgba(255,255,255,0.08)] hover:bg-[#282828] transition-all cursor-pointer \${className}\`}
    >
      <span className="px-2.5 text-neutral-400 font-normal">{label}</span>
      <span className="h-full w-px bg-white/10" aria-hidden="true" />
      <span className="flex items-center gap-1.5 px-2.5 font-medium text-white">
        {value}
        <ChevronDown
          className={\`size-3 text-neutral-400 transition-transform duration-200 \${
            isOpen ? "rotate-180" : ""
          }\`}
        />
      </span>
    </button>
  );
};`,
      usageExample: `import { FilterPill } from "./FilterPill";
import { useState } from "react";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2">
      <FilterPill label="Sort by" value="Pipeline Value" isOpen={open} onClick={() => setOpen(!open)} />
      <FilterPill label="Filter" value="All Owners" />
      <FilterPill label="Region" value="North America" />
    </div>
  );
}`,
      agentPrompt: `Add the premium FilterPill component into your toolbar controls.
Enables Sales CRM style split pill buttons for sorting and filtering.`,
    },
    {
      slug: "action-modal",
      name: "ActionModal",
      description: "Accessible dark modal dialog with backdrop blur, keyboard ESC dismissal, and Sales CRM glass header.",
      category: "Feedback",
      version: "1.0.0",
      accessLevel: "PREMIUM" as const,
      status: "PUBLISHED" as const,
      dependencies: ["lucide-react"],
      propsDoc: {
        isOpen: { type: "boolean", required: true },
        onClose: { type: "() => void", required: true },
        title: { type: "string", required: true },
        description: { type: "string" },
      },
      code: `import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-lg rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#242424] bg-[#1A1A1A]/50">
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {description ? <p className="text-xs text-neutral-400 mt-0.5">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};`,
      usageExample: `import { ActionModal } from "./ActionModal";
import { useState } from "react";

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-white text-black rounded-lg">
        Open Dialog
      </button>
      <ActionModal isOpen={open} onClose={() => setOpen(false)} title="Add Deal">
        <p className="text-sm text-neutral-300">Enter details to add a new deal to the pipeline.</p>
      </ActionModal>
    </div>
  );
}`,
      agentPrompt: `Integrate ActionModal into the application.
Ensure ESC keyboard event support and accessible ARIA attributes.`,
    },
    {
      slug: "revenue-chart",
      name: "RevenueChart",
      description: "Sales pipeline revenue analytics chart with monthly breakdowns (DRAFT state demonstration).",
      category: "Analytics",
      version: "0.9.0",
      accessLevel: "FREE" as const,
      status: "DRAFT" as const,
      dependencies: [],
      code: `// Draft component - should never be publicly visible until published`,
      usageExample: `// Draft example`,
      agentPrompt: `// Draft prompt`,
    },
  ];

  for (const comp of components) {
    await prisma.component.upsert({
      where: { slug: comp.slug },
      update: comp,
      create: comp,
    });
    console.log(`Component seeded: ${comp.name} (${comp.accessLevel} - ${comp.status})`);
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
