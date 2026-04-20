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
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 p-10 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)] ring-1 ring-[color:var(--color-border)] [&_svg]:size-5">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[color:var(--color-muted-foreground)]">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
