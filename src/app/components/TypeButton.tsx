"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TypeButtonProps = {
  onClick: () => void;
  label: string;
  isActive: boolean;
};

export const TypeButton = ({ onClick, label, isActive }: TypeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
        isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {isActive && (
        <motion.span
          layoutId="activeTab"
          className="absolute inset-0 z-0 bg-violet-600 rounded-full shadow-md"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
};
