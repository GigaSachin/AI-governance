import React from "react";
import { cn } from "../../lib/utils";

// ---------- Button ----------
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "md" | "lg" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-electric text-white hover:bg-electric/90 shadow-glow disabled:shadow-none disabled:bg-navy-light disabled:text-slate-soft",
  secondary:
    "bg-navy-light text-offwhite border border-navy-border hover:border-electric/60 disabled:opacity-40",
  outline:
    "bg-transparent text-offwhite border border-white/15 hover:border-cyan/60 hover:text-cyan disabled:opacity-40",
  ghost: "bg-transparent text-slate-soft hover:text-offwhite disabled:opacity-40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

// ---------- Card ----------
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-navy-border bg-navy/60 shadow-card backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

// ---------- Badge ----------
type BadgeTone = "neutral" | "electric" | "critical" | "high" | "medium" | "low";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-white/5 text-slate-soft border-white/10",
  electric: "bg-electric/10 text-electric border-electric/30",
  critical: "bg-priority-critical/10 text-priority-critical border-priority-critical/40",
  high: "bg-priority-high/10 text-priority-high border-priority-high/40",
  medium: "bg-priority-medium/10 text-priority-medium border-priority-medium/40",
  low: "bg-priority-low/10 text-priority-low border-priority-low/40",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        badgeTones[tone],
        className
      )}
      {...props}
    />
  );
}

export type PriorityTone = "critical" | "high" | "medium" | "low" | "neutral";

export function priorityTone(priority?: string): PriorityTone {
  switch ((priority ?? "").toLowerCase()) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "neutral";
  }
}
