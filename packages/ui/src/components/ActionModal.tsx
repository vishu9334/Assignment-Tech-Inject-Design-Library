import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl bg-[#141414] border border-[#2B2B2B] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden ${className}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
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
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
