import React from "react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  id,
  className = "",
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label ? (
        <label htmlFor={inputId} className="text-xs font-medium text-neutral-300">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        disabled={disabled}
        className={`w-full h-9 px-3 rounded-lg bg-[#161616] border text-xs text-white placeholder-neutral-500 outline-none transition-all duration-150 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-[#FE4A8E] focus:border-[#FE4A8E] focus:ring-[#FE4A8E]" : "border-[#2A2A2A]"
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-[11px] text-[#FE4A8E]">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-neutral-500">{helperText}</span>
      ) : null}
    </div>
  );
};
