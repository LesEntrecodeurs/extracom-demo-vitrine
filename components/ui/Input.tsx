import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#1A1A2E] mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-md border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] placeholder:text-[#6B7280] transition-colors",
          "focus:border-[#295795] focus:outline-none focus:ring-2 focus:ring-[#295795]/20",
          error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
