import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "secondary" | "success" | "danger" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#295795] text-white",
  secondary: "bg-[#00ADEF] text-white",
  success: "bg-[#10B981] text-white",
  danger: "bg-[#EF4444] text-white",
  outline: "border border-[#E5E7EB] text-[#6B7280] bg-white",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
