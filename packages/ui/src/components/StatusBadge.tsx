import React from "react";

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

  const sizeStyles =
    size === "sm"
      ? "text-[11px] py-[2px] pr-2.5 pl-2 gap-1.5"
      : "text-xs py-1 pr-3 pl-2.5 gap-2";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium leading-none border ${config.border} ${config.bg} text-neutral-200 ${sizeStyles} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot} shadow-[0_0_6px_currentColor]`} />
      <span>{displayText}</span>
    </span>
  );
};
