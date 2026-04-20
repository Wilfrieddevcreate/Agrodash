"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type PlanKey = "starter" | "growth" | "enterprise";

type CompareValue = string | boolean;
type CompareRow = {
  labelKey: keyof ReturnType<typeof useT>["pricing"]["comparison"]["rows"];
  starter: CompareValue;
  growth: CompareValue;
  enterprise: CompareValue;
};

const ROWS: CompareRow[] = [
  { labelKey: "users", starter: "usersStarter", growth: "usersGrowth", enterprise: "usersEnterprise" },
  { labelKey: "farms", starter: "farmsStarter", growth: "farmsGrowth", enterprise: "farmsEnterprise" },
  { labelKey: "orders", starter: "ordersStarter", growth: "ordersGrowth", enterprise: "ordersEnterprise" },
  { labelKey: "invoices", starter: "invoicesStarter", growth: "invoicesGrowth", enterprise: "invoicesEnterprise" },
  {
    labelKey: "integrations",
    starter: "integrationsStarter",
    growth: "integrationsGrowth",
    enterprise: "integrationsEnterprise",
  },
  { labelKey: "support", starter: "supportStarter", growth: "supportGrowth", enterprise: "supportEnterprise" },
  { labelKey: "sso", starter: false, growth: false, enterprise: true },
  { labelKey: "audit", starter: false, growth: false, enterprise: true },
  { labelKey: "priority", starter: false, growth: true, enterprise: true },
  { labelKey: "csm", starter: false, growth: false, enterprise: true },
];

export function PricingPageClient() {
  const t = useT();
  const [annual, setAnnual] = React.useState(false);
  const keys: PlanKey[] = ["starter", "growth", "enterprise"];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 mesh-hero opacity-80" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--color-border) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 60%, transparent) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-20 lg:px-8 lg:pt-24">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20"
          >
            {t.pricing.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mx-auto mt-5 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[52px] lg:text-[60px]"
          >
            {t.pricing.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-lg"
          >
            {t.pricing.subtitle}
          </motion.p>

          {/* Billing toggle */}
          <div className="mt-10 flex items-center justify-center">
            <BillingToggle annual={annual} onChange={setAnnual} />
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="relative pb-20 sm:pb-24 lg:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {keys.map((k, i) => {
              const plan = t.pricing.plans[k];
              const price = annual ? plan.priceAnnual : plan.priceMonthly;
              const isFeatured = k === "growth";
              const hrefCta =
                k === "enterprise"
                  ? "/help"
                  : k === "starter"
                    ? "/register"
                    : "/register";

              return (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "relative flex flex-col rounded-2xl border bg-[color:var(--color-card)] p-6 shadow-elev-sm transition-[transform,box-shadow,border-color] duration-300 sm:p-7",
                    isFeatured
                      ? "border-[color:var(--color-primary)]/50 ring-1 ring-[color:var(--color-primary)]/30 shadow-elev-md lg:scale-[1.03]"
                      : "border-[color:var(--color-border)] hover:-translate-y-0.5 hover:shadow-elev-md"
                  )}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[color:var(--color-primary)] px-3 py-1 text-[11px] font-semibold text-[color:var(--color-primary-foreground)] shadow-elev-sm">
                      <Sparkles className="size-3" />
                      {t.pricing.mostPopular}
                    </span>
                  )}

                  <div className="text-base font-semibold">{plan.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                    {plan.desc}
                  </div>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <motion.span
                      key={price}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="font-mono text-[46px] font-semibold tracking-[-0.035em] tabular-nums"
                    >
                      {price}
                    </motion.span>
                    {k !== "enterprise" && (
                      <span className="text-sm text-[color:var(--color-muted-foreground)]">
                        {t.pricing.perMonth}
                      </span>
                    )}
                  </div>
                  {annual && k === "growth" && (
                    <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">
                      {t.pricing.billedAnnually}
                    </div>
                  )}

                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f: string) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-[color:var(--color-foreground)]/90"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--color-primary)]" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Link href={hrefCta} className="contents">
                      <Button
                        variant={isFeatured ? "primary" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                        <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[30px] lg:text-[36px]">
              {t.pricing.comparison.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)]">
              {t.pricing.comparison.subtitle}
            </p>
          </div>

          {/* Desktop table */}
          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-elev-sm md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-left">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                    {t.pricing.comparison.feature}
                  </th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[color:var(--color-foreground)]">
                    {t.pricing.comparison.starterCol}
                  </th>
                  <th className="bg-[color:var(--color-primary)]/5 px-6 py-4 text-[12px] font-semibold text-[color:var(--color-primary)]">
                    {t.pricing.comparison.growthCol}
                  </th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-[color:var(--color-foreground)]">
                    {t.pricing.comparison.enterpriseCol}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.labelKey}
                    className={cn(
                      "border-b border-[color:var(--color-border)]/60 last:border-0",
                      i % 2 === 1 && "bg-[color:var(--color-muted)]/30"
                    )}
                  >
                    <td className="px-6 py-3.5 text-[13.5px] font-medium text-[color:var(--color-foreground)]/90">
                      {t.pricing.comparison.rows[row.labelKey]}
                    </td>
                    <CompareCell
                      value={row.starter}
                      labelForString={(key) =>
                        t.pricing.comparison.values[
                          key as keyof typeof t.pricing.comparison.values
                        ]
                      }
                    />
                    <CompareCell
                      value={row.growth}
                      highlighted
                      labelForString={(key) =>
                        t.pricing.comparison.values[
                          key as keyof typeof t.pricing.comparison.values
                        ]
                      }
                    />
                    <CompareCell
                      value={row.enterprise}
                      labelForString={(key) =>
                        t.pricing.comparison.values[
                          key as keyof typeof t.pricing.comparison.values
                        ]
                      }
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile — stacked per plan */}
          <div className="mt-8 space-y-4 md:hidden">
            {keys.map((k) => (
              <div
                key={k}
                className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-5 shadow-elev-sm"
              >
                <div className="text-sm font-semibold">
                  {t.pricing.plans[k].name}
                </div>
                <ul className="mt-3 space-y-2">
                  {ROWS.map((row) => {
                    const v = row[k];
                    return (
                      <li
                        key={row.labelKey}
                        className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border)]/50 py-1.5 text-sm last:border-0"
                      >
                        <span className="text-[color:var(--color-muted-foreground)]">
                          {t.pricing.comparison.rows[row.labelKey]}
                        </span>
                        <span className="text-right font-medium text-[color:var(--color-foreground)]">
                          {renderMobileValue(v, (key) =>
                            t.pricing.comparison.values[
                              key as keyof typeof t.pricing.comparison.values
                            ]
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[30px] lg:text-[36px]">
              {t.pricing.faqTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)]">
              {t.pricing.faqSubtitle}
            </p>
          </div>
          <div className="mt-10 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-elev-sm">
            {t.pricing.faq.map((item) => (
              <details
                key={item.q}
                className="group border-b border-[color:var(--color-border)]/70 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-5 text-left text-[15px] font-semibold text-[color:var(--color-foreground)] transition-colors hover:bg-[color:var(--color-muted)]/40 sm:px-6">
                  <span>{item.q}</span>
                  <ChevronDown
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-[color:var(--color-muted-foreground)] transition-transform duration-300 group-open:rotate-180 group-open:text-[color:var(--color-primary)]"
                  />
                </summary>
                <div className="px-5 pb-6 text-[14.5px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:px-6">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative pb-24 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="surface-premium relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] p-8 text-center shadow-elev-md sm:p-12">
            <div className="pointer-events-none absolute inset-0 mesh-hero opacity-100" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20">
                {t.pricing.finalCta.eyebrow}
              </span>
              <h2 className="mx-auto mt-4 max-w-2xl text-[26px] font-semibold tracking-[-0.025em] sm:text-[32px] lg:text-[40px]">
                {t.pricing.finalCta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)]">
                {t.pricing.finalCta.subtitle}
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <Link href="/register" className="contents">
                  <Button variant="primary" size="lg">
                    {t.pricing.finalCta.primary}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/help" className="contents">
                  <Button variant="outline" size="lg">
                    {t.pricing.finalCta.secondary}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────── */

function BillingToggle({
  annual,
  onChange,
}: {
  annual: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useT();
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-1 shadow-elev-xs">
        <button
          type="button"
          onClick={() => onChange(false)}
          aria-pressed={!annual}
          className={cn(
            "relative z-10 inline-flex h-8 items-center rounded-full px-4 text-[13px] font-semibold transition-colors",
            !annual
              ? "text-[color:var(--color-primary-foreground)]"
              : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
          )}
        >
          {t.pricing.monthly}
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          aria-pressed={annual}
          className={cn(
            "relative z-10 inline-flex h-8 items-center rounded-full px-4 text-[13px] font-semibold transition-colors",
            annual
              ? "text-[color:var(--color-primary-foreground)]"
              : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
          )}
        >
          {t.pricing.annual}
        </button>
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-[color:var(--color-primary)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            annual ? "translate-x-full" : "translate-x-0"
          )}
          style={{ left: "0.25rem" }}
        />
      </div>
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-[color:var(--color-success)]/14 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)] transition-opacity",
          annual ? "opacity-100" : "opacity-60"
        )}
      >
        {t.pricing.saveBadge}
      </span>
    </div>
  );
}

function CompareCell({
  value,
  highlighted = false,
  labelForString,
}: {
  value: CompareValue;
  highlighted?: boolean;
  labelForString: (key: string) => string;
}) {
  return (
    <td
      className={cn(
        "px-6 py-3.5 text-sm",
        highlighted && "bg-[color:var(--color-primary)]/5"
      )}
    >
      {typeof value === "boolean" ? (
        value ? (
          <Check className="size-4 text-[color:var(--color-primary)]" />
        ) : (
          <X className="size-4 text-[color:var(--color-muted-foreground)]/60" />
        )
      ) : (
        <span className="font-medium text-[color:var(--color-foreground)]">
          {labelForString(value)}
        </span>
      )}
    </td>
  );
}

function renderMobileValue(
  value: CompareValue,
  labelForString: (key: string) => string
) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="size-4 text-[color:var(--color-primary)]" />
    ) : (
      <X className="size-4 text-[color:var(--color-muted-foreground)]/60" />
    );
  }
  return labelForString(value);
}
