import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-5 transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20",
        secondary:
          "bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)] ring-1 ring-inset ring-[color:var(--color-border)]",
        success:
          "bg-[color:var(--color-success)]/12 text-[color:var(--color-success)] ring-1 ring-inset ring-[color:var(--color-success)]/25",
        warning:
          "bg-[color:var(--color-warning)]/15 text-[color:oklch(0.4_0.1_75)] ring-1 ring-inset ring-[color:var(--color-warning)]/25 dark:text-[color:var(--color-warning)]",
        destructive:
          "bg-[color:var(--color-destructive)]/12 text-[color:var(--color-destructive)] ring-1 ring-inset ring-[color:var(--color-destructive)]/25",
        info:
          "bg-[color:var(--color-info)]/12 text-[color:var(--color-info)] ring-1 ring-inset ring-[color:var(--color-info)]/25",
        outline:
          "border border-[color:var(--color-border)] text-[color:var(--color-foreground)]",
        dot:
          "bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] ring-1 ring-inset ring-[color:var(--color-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
