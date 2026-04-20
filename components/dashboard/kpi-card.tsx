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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-border)] to-transparent"
      />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--color-muted-foreground)]">
            <span
              className="grid size-8 place-items-center rounded-lg [&_svg]:size-4"
              style={{
                backgroundColor: `color-mix(in oklab, var(${accentVar}) 14%, transparent)`,
                color: `var(${accentVar})`,
              }}
            >
              {icon}
            </span>
            <span className="uppercase tracking-wider">{label}</span>
          </div>
          <div className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.025em] tabular-nums">
            {value}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
                positive
                  ? "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
                  : "bg-[color:var(--color-destructive)]/10 text-[color:var(--color-destructive)]"
              )}
            >
              {positive ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {Math.abs(delta).toFixed(1)}%
            </span>
            {helper && (
              <span className="text-[color:var(--color-muted-foreground)]">
                {helper}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 opacity-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <linearGradient
                id={`kpi-${label.replace(/\s+/g, "-")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={`var(${accentVar})`}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={`var(${accentVar})`}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={`var(${accentVar})`}
              strokeWidth={2}
              fill={`url(#kpi-${label.replace(/\s+/g, "-")})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
