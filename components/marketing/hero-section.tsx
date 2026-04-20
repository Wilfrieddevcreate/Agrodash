"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, Leaf, Package, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniTrend } from "@/components/dashboard/revenue-chart";
import { useT } from "@/components/providers/language-provider";

const heroTrend = Array.from({ length: 14 }, (_, i) => ({
  v: 20 + Math.round(Math.sin(i / 2) * 14 + i * 2),
}));

export function HeroSection() {
  const t = useT();

  return (
    <section className="relative overflow-hidden">
      {/* Mesh backdrop */}
      <div className="pointer-events-none absolute inset-0 mesh-hero opacity-80" aria-hidden />
      {/* Grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-border) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 60%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:pb-28 lg:pt-24">
        {/* Left — copy */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20">
              <Sparkles className="size-3.5" />
              {t.marketing.hero.eyebrow}
            </span>

            <h1 className="mt-5 text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] text-[color:var(--color-foreground)] sm:text-[56px] lg:text-[64px]">
              {t.marketing.hero.title}
            </h1>

            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-lg">
              {t.marketing.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="contents">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  {t.marketing.hero.primaryCta}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/dashboard" className="contents">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t.marketing.hero.secondaryCta}
                  <ArrowUpRight className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-[color:var(--color-muted-foreground)]">
              <CheckCircle2 className="size-4 text-[color:var(--color-primary)]" />
              <span>{t.marketing.hero.trustLine}</span>
            </div>
          </motion.div>
        </div>

        {/* Right — mock dashboard */}
        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const t = useT();

  return (
    <div className="relative mt-14 lg:mt-0">
      {/* Soft glow behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[color:var(--color-primary)]/15 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="surface-premium relative rounded-2xl border border-[color:var(--color-border)] p-4 shadow-elev-xl"
      >
        {/* Fake window chrome */}
        <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[color:var(--color-destructive)]/50" />
            <span className="size-2.5 rounded-full bg-[color:var(--color-warning)]/60" />
            <span className="size-2.5 rounded-full bg-[color:var(--color-success)]/60" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-success)]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-success)]">
            <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--color-success)]" />
            {t.marketing.hero.badgeLive}
          </span>
        </div>

        {/* Row of two mini KPI cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <MiniKpi
            label={t.dashboard.kpi.revenue}
            value="$128.4k"
            delta="+12.4%"
            accent="--color-primary"
          />
          <MiniKpi
            label={t.dashboard.kpi.orders}
            value="1,284"
            delta="+8.1%"
            accent="--color-chart-2"
          />
        </div>

        {/* Chart-like card */}
        <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                {t.dashboard.charts.revenueTitle}
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums tracking-tight">
                $46,212
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-success)]/12 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)]">
              <TrendingUp className="size-3" />
              18.2%
            </span>
          </div>
          <div className="mt-3 h-24">
            <MiniTrend data={heroTrend} height={96} />
          </div>
        </div>

        {/* Row of fake list items */}
        <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
          {[
            { name: "Maize — lot A24", status: "Shipped", value: "$4,220" },
            { name: "NPK Fertilizer · 50kg", status: "Packed", value: "$1,890" },
            { name: "Rice Paddy · Kigali", status: "In transit", value: "$3,450" },
          ].map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-xs [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[color:var(--color-border)]/60"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
                  <Package className="size-3.5" />
                </span>
                <span className="truncate font-medium">{row.name}</span>
              </div>
              <span className="hidden text-[color:var(--color-muted-foreground)] sm:inline">
                {row.status}
              </span>
              <span className="font-mono tabular-nums text-[color:var(--color-foreground)]">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Peripheral: order notification (top-left) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="absolute -left-3 -top-4 hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3 shadow-elev-lg sm:left-0 sm:block lg:-left-10"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[color:var(--color-success)]/14 text-[color:var(--color-success)]">
            <Leaf className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold">
              {t.marketing.hero.peripheralOrder}
            </div>
            <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
              {t.marketing.hero.peripheralOrderMeta}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Peripheral: harvest pill (bottom-right) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.7 },
          y: { duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
        }}
        className="absolute -bottom-4 -right-3 hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-2.5 shadow-elev-lg sm:-right-4 sm:block lg:-right-8"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[color:var(--color-primary)]/14 text-[color:var(--color-primary)]">
            <TrendingUp className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold">
              {t.marketing.hero.peripheralHarvest}
            </div>
            <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
              {t.marketing.hero.peripheralHarvestMeta}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MiniKpi({
  label,
  value,
  delta,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3.5">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: `var(${accent})` }}
        />
        {label}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-xl font-semibold tabular-nums tracking-tight">
          {value}
        </span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            backgroundColor: `color-mix(in oklab, var(${accent}) 14%, transparent)`,
            color: `var(${accent})`,
          }}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}
