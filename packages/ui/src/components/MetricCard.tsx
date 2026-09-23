import React from "react";
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
      className={`p-4 rounded-xl bg-[#141414] border border-[#262626] text-neutral-100 flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:border-[#383838] transition-all ${className}`}
    >
      <div className="flex items-center justify-between text-neutral-400 mb-2">
        <span className="text-xs font-medium tracking-wide">{title}</span>
        {icon ? <div className="text-neutral-400">{icon}</div> : null}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-semibold tracking-tight text-white">{value}</span>
        {trend !== undefined ? (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full border ${
              isPositive
                ? "bg-[#16C89E]/10 text-[#16C89E] border-[#16C89E]/30"
                : "bg-[#FE4A8E]/10 text-[#FE4A8E] border-[#FE4A8E]/30"
            }`}
          >
            {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            <span>{isPositive ? `+${trend}%` : `${trend}%`}</span>
          </div>
        ) : null}
      </div>

      {trendLabel ? (
        <span className="text-[11px] text-neutral-500 mt-2 block">{trendLabel}</span>
      ) : null}
    </div>
  );
};
