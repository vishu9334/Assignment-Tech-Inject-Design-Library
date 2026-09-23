import React from "react";
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
    <div
      className={`w-full overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#121212] shadow-md ${className}`}
    >
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
                      <span className={`size-1.5 rounded-full ${badge.dot}`} />
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
};
