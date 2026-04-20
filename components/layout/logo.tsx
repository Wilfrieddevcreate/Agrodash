import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * AgroDash brand mark — a stylised sprout inside a soft-rounded tile.
 * Two asymmetric curved leaves growing from a vertical stem, evoking
 * agriculture, growth, and a clean SaaS geometry (readable at 16 px).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative grid size-9 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br from-[color:oklch(0.7_0.17_150)] via-[color:var(--color-primary)] to-[color:oklch(0.44_0.16_150)] text-white shadow-[0_1px_0_0_rgb(255_255_255/0.18)_inset,0_6px_16px_-8px_oklch(0.44_0.16_150/0.6)] ring-1 ring-inset ring-white/15",
        className
      )}
    >
      {/* Subtle inner highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-0 right-0 h-1/2 rounded-b-full bg-white/15 blur-md"
      />
      <svg
        viewBox="0 0 32 32"
        className="relative size-[22px]"
        fill="none"
        aria-hidden="true"
      >
        {/* Stem */}
        <path
          d="M16 27V16"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Right leaf (front) */}
        <path
          d="M16 16C16 16 16 10.5 19.5 7.5C22 5.3 25 5.3 26 6.5C27 7.8 26.5 11 24 13.5C20.8 16.7 16 16 16 16Z"
          fill="currentColor"
        />
        {/* Left leaf (back, slightly lower, softer) */}
        <path
          d="M16 19C16 19 16 14 13 11.5C11 10 8.5 10.3 7.8 11.3C7.1 12.4 7.5 14.8 9.7 16.6C12.6 19 16 19 16 19Z"
          fill="currentColor"
          fillOpacity="0.72"
        />
        {/* Ground line */}
        <path
          d="M10.5 27H21.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
      </svg>
    </div>
  );
}

export function Logo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className="text-[16px] font-semibold tracking-[-0.025em] text-[color:var(--color-foreground)]">
            AgroDash
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-muted-foreground)]">
            Agribusiness
          </span>
        </div>
      )}
    </div>
  );
}
