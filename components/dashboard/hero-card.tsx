"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Leaf, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/providers/language-provider";

export function HeroCard({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  highlightValue,
  highlightLabel,
  className,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  highlightValue?: string;
  highlightLabel?: string;
  className?: string;
}) {
  const t = useT();
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-elev-md",
        "mesh-hero",
        className
      )}
    >
      {/* Decorative leaf bursts — anchored to the inline-end corner so
          the artwork follows the reading flow in both LTR and RTL. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -end-10 -top-10 grid size-48 place-items-center opacity-[0.07] [--mask:radial-gradient(circle_at_center,black,transparent_60%)] [mask-image:var(--mask)]"
      >
        <Leaf className="size-48 text-[color:var(--color-primary)]" strokeWidth={1.2} />
      </span>

      <div className="relative flex flex-col gap-6 p-6 sm:p-7 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-primary)]/20 bg-[color:var(--color-primary)]/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-primary)]">
            <Sparkles className="size-3" />
            {t.dashboard.overviewBadge}
          </div>
          <h2 className="mt-3 text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[26px] md:text-[28px]">
            {title}
          </h2>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-sm">
            {subtitle}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {primaryCta && (
                <button
                  onClick={primaryCta.onClick}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[color:var(--color-foreground)] px-4 text-sm font-semibold text-[color:var(--color-background)] shadow-elev-xs transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  {primaryCta.label}
                  <ArrowUpRight className="size-4 rtl:scale-x-[-1]" />
                </button>
              )}
              {secondaryCta && (
                <button
                  onClick={secondaryCta.onClick}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 text-sm font-semibold transition-colors hover:bg-[color:var(--color-muted)]"
                >
                  {secondaryCta.label}
                </button>
              )}
            </div>
          )}
        </div>

        {highlightValue && (
          <div className="relative shrink-0 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/80 p-4 shadow-elev-sm backdrop-blur-sm md:w-[220px]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-muted-foreground)]">
              {highlightLabel}
            </div>
            <div className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[color:var(--color-primary)]">
              {highlightValue}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[color:var(--color-muted-foreground)]">
              <span className="relative inline-flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--color-success)]/50" />
                <span className="relative inline-flex size-2 rounded-full bg-[color:var(--color-success)]" />
              </span>
              {t.dashboard.liveSynced}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
