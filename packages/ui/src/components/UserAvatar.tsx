import React from "react";

export interface UserAvatarProps {
  name: string;
  src?: string;
  status?: "online" | "away" | "offline";
  size?: "sm" | "md" | "lg";
  subtext?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  src,
  status = "online",
  size = "md",
  subtext,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeMap = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const statusColors = {
    online: "bg-[#16C89E]",
    away: "bg-[#FFDB4B]",
    offline: "bg-neutral-500",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex shrink-0">
        {src ? (
          <img
            src={src}
            alt={name}
            className={`rounded-full object-cover border border-white/10 ${sizeMap[size]}`}
          />
        ) : (
          <div
            className={`flex items-center justify-center rounded-full bg-[#202020] font-semibold text-neutral-200 border border-white/10 ${sizeMap[size]}`}
          >
            {initials}
          </div>
        )}
        {status && (
          <span
            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[#0A0A0A] ${statusColors[status]}`}
          />
        )}
      </div>
      {subtext !== undefined && (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white leading-tight">{name}</span>
          <span className="text-[11px] text-neutral-400 leading-tight mt-0.5">{subtext}</span>
        </div>
      )}
    </div>
  );
};
