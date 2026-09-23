import React from "react";
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
      className={`inline-flex items-center h-[30px] rounded-full overflow-hidden text-xs bg-[#1E1E1E] text-neutral-200 border border-[#2E2E2E] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.4),inset_0px_1px_0px_0px_rgba(255,255,255,0.08)] hover:bg-[#282828] transition-all cursor-pointer active:scale-[0.98] ${className}`}
    >
      <span className="px-2.5 text-neutral-400 font-normal">{label}</span>
      <span className="h-full w-px bg-white/10" aria-hidden="true" />
      <span className="flex items-center gap-1.5 px-2.5 font-medium text-white">
        {value}
        <ChevronDown
          className={`size-3 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </span>
    </button>
  );
};
