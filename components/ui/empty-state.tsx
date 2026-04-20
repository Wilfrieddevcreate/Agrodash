import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 p-10 text-center",
        className
      )}
    >
      {/* Subtle grid pattern backdrop */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 70%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {icon && (
        <div className="relative mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)] shadow-elev-sm ring-1 ring-[color:var(--color-border)] [&_svg]:size-6">
          {icon}
        </div>
      )}
      <h3 className="relative text-base font-semibold">{title}</h3>
      {description && (
        <p className="relative mt-1 max-w-sm text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
          {description}
        </p>
      )}
      {action && <div className="relative mt-5">{action}</div>}
    </div>
  );
}
