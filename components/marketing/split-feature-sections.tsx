"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, MapPin, Receipt } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { useT } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
 * Shared pieces
 * ────────────────────────────────────────────────────────── */

function SplitRow({
  eyebrow,
  title,
  desc,
  bullets,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        reverse && "lg:[&>*:first-child]:order-2"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20">
          {eyebrow}
        </span>
        <h3 className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] sm:text-[32px] lg:text-[38px]">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-base">
          {desc}
        </p>
        <ul className="mt-6 space-y-2.5">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2.5 text-sm text-[color:var(--color-foreground)]/90"
            >
              <CheckCircle2 className="mt-0.5 size-[18px] shrink-0 text-[color:var(--color-primary)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="relative"
      >
        {visual}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Supply-chain visual (real RevenueChart)
 * ────────────────────────────────────────────────────────── */

function SupplyChainVisual() {
  const t = useT();
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[color:var(--color-primary)]/10 blur-3xl"
      />
      <div className="surface-premium rounded-2xl border border-[color:var(--color-border)] p-4 shadow-elev-lg sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
              {t.dashboard.charts.revenueTitle}
            </div>
            <div className="mt-0.5 text-sm text-[color:var(--color-muted-foreground)]">
              {t.dashboard.charts.revenueSubtitle}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-success)]/12 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)]">
            <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--color-success)]" />
            Live
          </span>
        </div>
        <div className="rounded-xl bg-[color:var(--color-card)] p-1">
          <RevenueChart />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Invoice mock visual
 * ────────────────────────────────────────────────────────── */

function InvoiceVisual() {
  const t = useT();
  const lines = [
    { name: "Maize (lot A24)", qty: 12, price: 185 },
    { name: "NPK Fertilizer 20-10-10", qty: 40, price: 42.5 },
    { name: "Logistics · Lagos depot", qty: 1, price: 150 },
  ];
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[color:var(--color-chart-2)]/15 blur-3xl"
      />
      <div className="surface-premium relative rounded-2xl border border-[color:var(--color-border)] p-5 shadow-elev-lg sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-success)]/12 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)]">
              <Receipt className="size-3" />
              {t.invoices.status.paid}
            </span>
            <div className="mt-3 text-[22px] font-semibold tracking-tight">
              {t.invoices.detail.eyebrow} · INV-2057
            </div>
            <div className="text-xs text-[color:var(--color-muted-foreground)]">
              {t.invoices.detail.issuedPrefix} 12 Feb 2026 {t.invoices.detail.dueSeparator} 12 Mar 2026
            </div>
          </div>
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-2 text-xs font-semibold text-[color:var(--color-foreground)] shadow-elev-xs transition-colors hover:bg-[color:var(--color-muted)] sm:inline-flex"
          >
            <Download className="size-3.5" />
            PDF
          </button>
        </div>

        {/* Line items */}
        <div className="mt-5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[color:var(--color-border)] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
            <span>{t.invoices.detail.item}</span>
            <span>{t.invoices.detail.qty}</span>
            <span>{t.invoices.detail.lineTotal}</span>
          </div>
          {lines.map((l) => (
            <div
              key={l.name}
              className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[color:var(--color-border)]/60 px-4 py-2.5 text-sm last:border-0"
            >
              <span className="truncate">{l.name}</span>
              <span className="tabular-nums text-[color:var(--color-muted-foreground)]">
                {l.qty}
              </span>
              <span className="font-mono tabular-nums">
                ${(l.qty * l.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-muted-foreground)]">
              {t.invoices.detail.subtotal}
            </span>
            <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-muted-foreground)]">
              {t.invoices.detail.tax}
            </span>
            <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[color:var(--color-border)] pt-2.5 text-base font-semibold">
            <span>{t.invoices.detail.totalDue}</span>
            <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Regions map visual
 * ────────────────────────────────────────────────────────── */

type Dot = { x: number; y: number; name: string };

// Dot coords are tuned to the continent path below (viewBox 0 0 640 640).
const DOTS: Dot[] = [
  { x: 215, y: 118, name: "Morocco" },
  { x: 190, y: 245, name: "Senegal" },
  { x: 238, y: 278, name: "Côte d'Ivoire" },
  { x: 268, y: 286, name: "Ghana" },
  { x: 310, y: 288, name: "Nigeria" },
  { x: 452, y: 268, name: "Ethiopia" },
  { x: 452, y: 340, name: "Kenya" },
  { x: 430, y: 360, name: "Rwanda" },
  { x: 370, y: 510, name: "South Africa" },
];

function RegionsVisual() {
  const t = useT();
  const countries = t.marketing.splits.regions.countries;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[color:var(--color-chart-3)]/12 blur-3xl"
      />
      <div className="surface-premium rounded-2xl border border-[color:var(--color-border)] p-5 shadow-elev-lg sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)]">
            <MapPin className="size-4" />
          </span>
          <div>
            <div className="text-sm font-semibold">Active regions</div>
            <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
              Live across {countries.length} countries
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
          {/* Stylised Africa */}
          <div className="relative aspect-square rounded-xl bg-[color:var(--color-muted)]/40 p-3 sm:aspect-[4/5]">
            <svg
              viewBox="0 0 640 640"
              className="h-full w-full"
              role="img"
              aria-label="Stylised map of Africa"
            >
              {/* Stylised continent outline — recognisable Africa silhouette */}
              <path
                d="M188 108
                   C 208 98, 238 94, 268 96
                   L 318 96
                   C 358 96, 398 100, 432 112
                   C 460 122, 478 138, 482 158
                   C 484 178, 476 196, 472 214
                   C 470 230, 478 244, 488 252
                   C 502 262, 512 276, 510 294
                   C 506 314, 494 330, 480 344
                   C 472 354, 470 366, 474 380
                   C 478 400, 478 420, 468 440
                   C 456 462, 442 482, 426 502
                   C 410 522, 394 540, 372 548
                   C 350 554, 328 548, 310 536
                   C 292 522, 280 500, 272 478
                   C 262 452, 250 428, 234 408
                   C 218 390, 200 374, 186 354
                   C 172 332, 164 306, 164 278
                   C 162 252, 162 226, 158 202
                   C 154 180, 154 158, 162 138
                   C 168 124, 176 114, 188 108 Z"
                fill="color-mix(in oklab, var(--color-primary) 10%, transparent)"
                stroke="color-mix(in oklab, var(--color-primary) 45%, transparent)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Madagascar */}
              <path
                d="M508 418
                   C 518 424, 522 442, 520 462
                   C 518 482, 512 498, 504 502
                   C 498 504, 494 496, 494 484
                   C 494 464, 498 442, 502 428
                   C 504 422, 506 418, 508 418 Z"
                fill="color-mix(in oklab, var(--color-primary) 10%, transparent)"
                stroke="color-mix(in oklab, var(--color-primary) 45%, transparent)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Dots */}
              {DOTS.map((d) => (
                <g key={d.name}>
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r="9"
                    fill="var(--color-primary)"
                    opacity="0.18"
                  >
                    <animate
                      attributeName="r"
                      values="8;14;8"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.22;0.05;0.22"
                      dur="2.6s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={d.x}
                    cy={d.y}
                    r="4.5"
                    fill="var(--color-primary)"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Country list */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
              Countries
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-1.5">
              {countries.map((c: string) => (
                <li
                  key={c}
                  className="flex items-center gap-2 text-[13px] text-[color:var(--color-foreground)]/90"
                >
                  <span className="size-1.5 rounded-full bg-[color:var(--color-primary)]" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Composite — renders all 3 splits
 * ────────────────────────────────────────────────────────── */

export function SplitFeatureSections() {
  const t = useT();

  return (
    <section className="relative py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl space-y-24 px-4 sm:space-y-28 sm:px-6 lg:space-y-36 lg:px-8">
        <SplitRow
          eyebrow={t.marketing.splits.supplyChain.eyebrow}
          title={t.marketing.splits.supplyChain.title}
          desc={t.marketing.splits.supplyChain.desc}
          bullets={[
            t.marketing.splits.supplyChain.bullet1,
            t.marketing.splits.supplyChain.bullet2,
            t.marketing.splits.supplyChain.bullet3,
          ]}
          visual={<SupplyChainVisual />}
        />

        <SplitRow
          reverse
          eyebrow={t.marketing.splits.harvestInvoice.eyebrow}
          title={t.marketing.splits.harvestInvoice.title}
          desc={t.marketing.splits.harvestInvoice.desc}
          bullets={[
            t.marketing.splits.harvestInvoice.bullet1,
            t.marketing.splits.harvestInvoice.bullet2,
            t.marketing.splits.harvestInvoice.bullet3,
          ]}
          visual={<InvoiceVisual />}
        />

        <SplitRow
          eyebrow={t.marketing.splits.regions.eyebrow}
          title={t.marketing.splits.regions.title}
          desc={t.marketing.splits.regions.desc}
          bullets={[
            t.marketing.splits.regions.bullet1,
            t.marketing.splits.regions.bullet2,
            t.marketing.splits.regions.bullet3,
          ]}
          visual={<RegionsVisual />}
        />
      </div>
    </section>
  );
}
