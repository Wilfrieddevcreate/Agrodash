import * as React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** Slightly larger variant for prominent display (shortcuts dialog) */
  size?: "sm" | "md";
}

/**
 * Tiny, consistent keyboard-chord pill used across the command palette
 * and shortcuts dialog. Renders a native <kbd> element for accessibility.
 */
export function Kbd({ children, size = "sm", className, ...rest }: KbdProps) {
  return (
    <kbd
      {...rest}
      className={cn(
        "inline-flex select-none items-center justify-center rounded border border-[color:var(--color-border)] bg-[color:var(--color-card)] font-mono font-medium text-[color:var(--color-muted-foreground)] shadow-elev-xs",
        size === "sm" && "min-w-6 px-1.5 py-px text-[10px]",
        size === "md" && "min-h-[22px] min-w-[22px] px-1.5 py-0.5 text-[11px]",
        className
      )}
    >
      {children}
    </kbd>
  );
}

/**
 * Render a sequence of keys as a chord e.g. "⌘K" or "g d".
 * Strings are split by spaces; each token becomes a <Kbd>.
 */
export function KbdChord({
  keys,
  size = "sm",
  className,
}: {
  keys: string | string[];
  size?: "sm" | "md";
  className?: string;
}) {
  const tokens = Array.isArray(keys) ? keys : keys.split(" ");
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {tokens.map((k, i) => (
        <Kbd key={i} size={size}>
          {k}
        </Kbd>
      ))}
    </span>
  );
}
