import React from "react";

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
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  const radii = pill ? "rounded-full" : "rounded-lg";

  const sizes = {
    sm: "h-7 px-3 text-xs gap-1.5",
    md: "h-[30px] px-3.5 text-xs gap-2 leading-none",
    lg: "h-9 px-4 text-sm gap-2",
  };

  const variants = {
    primary:
      "bg-white text-black hover:bg-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.4)] font-semibold active:scale-[0.98]",
    secondary:
      "bg-[#1E1E1E] text-neutral-200 hover:bg-[#2A2A2A] hover:text-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.5),inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.06)] active:scale-[0.98]",
    outline:
      "border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white bg-transparent active:scale-[0.98]",
    ghost:
      "bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-white/5 active:scale-[0.98]",
    danger:
      "bg-[#FE4A8E]/10 text-[#FE4A8E] border border-[#FE4A8E]/30 hover:bg-[#FE4A8E]/20 active:scale-[0.98]",
  };

  return (
    <button
      className={`${base} ${radii} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
};
