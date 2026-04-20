import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
}

export function Progress({
  value,
  max = 100,
  indicatorClassName,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-muted)]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[color:var(--color-primary)]",
          "shadow-[inset_0_1px_0_0_oklch(1_0_0/0.25)]",
          "transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          indicatorClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
