"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  delta: number;
  helper?: string;
  icon: React.ReactNode;
  series: Array<{ v: number }>;
  accentVar?: string;
  delay?: number;
}

export function KpiCard({
  label,
  value,
  delta,
  helper,
  icon,
  series,
  accentVar = "--color-primary",
  delay = 0,
}: KpiCardProps) {
  const positive = delta >= 0;
  const uniqueId = React.useId();
  const gradientId = `kpi-grad-${uniqueId.replace(/:/g, "")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]",
        "shadow-elev-sm transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:shadow-elev-md hover:border-[color:var(--color-primary)]/20"
      )}
    >
      {/* Top colored stripe that hints the accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, var(${accentVar}), transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[color:var(--color-muted-foreground)]"
          >
            <span
              className="grid size-8 place-items-center rounded-lg ring-1 ring-inset [&_svg]:size-[18px]"
              style={{
                backgroundColor: `color-mix(in oklab, var(${accentVar}) 12%, transparent)`,
                color: `var(${accentVar})`,
                boxShadow: `inset 0 1px 0 0 color-mix(in oklab, var(${accentVar}) 30%, transparent)`,
              }}
            >
              {icon}
            </span>
            <span className="truncate">{label}</span>
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
              positive
                ? "bg-[color:var(--color-success)]/12 text-[color:var(--color-success)]"
                : "bg-[color:var(--color-destructive)]/12 text-[color:var(--color-destructive)]"
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <div className="text-[30px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
            {value}
          </div>
        </div>
        {helper && (
          <div className="mt-1.5 text-[12px] text-[color:var(--color-muted-foreground)]">
            {helper}
          </div>
        )}
      </div>

      {/* Sparkline — stretches across the bottom */}
      <div className="relative h-14 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`var(${accentVar})`} stopOpacity={0.45} />
                <stop offset="100%" stopColor={`var(${accentVar})`} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={`var(${accentVar})`}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subtle hover glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 100% 0%, color-mix(in oklab, var(${accentVar}) 8%, transparent), transparent 55%)`,
        }}
      />
    </motion.div>
  );
}
