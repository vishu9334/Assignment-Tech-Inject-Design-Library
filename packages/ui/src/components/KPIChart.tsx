import React from "react";
import { TrendingUp } from "lucide-react";

export interface KPIChartProps {
  title?: string;
  value?: string;
  changePercent?: number;
  period?: string;
  progressPercent?: number;
}

export const KPIChart: React.FC<KPIChartProps> = ({
  title = "Total Revenue",
  value = "$124,592",
  changePercent = 18.4,
  period = "vs last week",
  progressPercent = 74,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212] p-5 shadow-2xl backdrop-blur-xl max-w-sm w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
          {title}
        </span>
        <div className="flex items-center gap-1 rounded-full bg-[#16C89E]/10 px-2 py-0.5 text-xs font-semibold text-[#16C89E]">
          <TrendingUp className="h-3.5 w-3.5" />
          +{changePercent}%
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        <span className="text-xs text-neutral-500">{period}</span>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#9668FE] to-[#16C89E] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
