import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "xs" | "sm" | "md" | "lg";
}

const sizeMap = {
  xs: "size-3 border-[1.5px]",
  sm: "size-4 border-2",
  md: "size-5 border-2",
  lg: "size-6 border-[2.5px]",
};

/**
 * Minimal inline spinner — border-based, respects `currentColor`,
 * honours `prefers-reduced-motion` via globals.css.
 */
export function Spinner({
  size = "sm",
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizeMap[size],
        className
      )}
      {...props}
    />
  );
}
