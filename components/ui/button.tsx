"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-[transform,box-shadow,background-color,color,border-color,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Inverted solid — premium high-contrast (like Stripe/Linear primary)
        default:
          "bg-[color:var(--color-foreground)] text-[color:var(--color-background)] shadow-elev-xs hover:shadow-elev-sm hover:-translate-y-px",
        // Brand primary (green)
        primary:
          "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-elev-xs hover:shadow-elev-sm hover:brightness-[1.05] hover:-translate-y-px",
        secondary:
          "bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-muted)]",
        outline:
          "border border-[color:var(--color-border)] bg-[color:var(--color-card)] hover:bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] shadow-elev-xs",
        ghost:
          "hover:bg-[color:var(--color-muted)] text-[color:var(--color-foreground)]",
        destructive:
          "bg-[color:var(--color-destructive)] text-[color:var(--color-destructive-foreground)] hover:brightness-[1.06] shadow-elev-xs hover:shadow-elev-sm hover:-translate-y-px",
        link: "text-[color:var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 [&_svg]:size-4",
        sm: "h-9 px-3.5 text-[13px] [&_svg]:size-3.5",
        xs: "h-8 px-3 text-xs [&_svg]:size-3.5",
        lg: "h-11 px-6 [&_svg]:size-4",
        icon: "size-10 [&_svg]:size-4",
        iconSm: "size-8 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
