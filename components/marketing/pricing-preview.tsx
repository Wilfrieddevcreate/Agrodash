"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type PlanKey = "starter" | "growth" | "enterprise";

const HIGHLIGHTS: Record<PlanKey, string[]> = {
  starter: ["1 workspace", "Up to 3 users", "Email support"],
  growth: ["Unlimited workspaces", "Up to 20 users", "Priority email support"],
  enterprise: ["SSO & SAML", "Audit logs", "Dedicated CSM"],
};

export function PricingPreview() {
  const t = useT();
  const keys: PlanKey[] = ["starter", "growth", "enterprise"];

  return (
    <section className="relative py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20"
          >
            {t.marketing.pricingPreview.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-4 text-[28px] font-semibold tracking-[-0.025em] sm:text-[34px] lg:text-[40px]"
          >
            {t.marketing.pricingPreview.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-base"
          >
            {t.marketing.pricingPreview.subtitle}
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {keys.map((k, i) => {
            const plan = t.marketing.pricingPreview.plans[k];
            const isFeatured = k === "growth";
            const hrefCta =
              k === "enterprise" ? "/help" : k === "starter" ? "/register" : "/register";

            return (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-[color:var(--color-card)] p-6 shadow-elev-sm transition-[transform,box-shadow,border-color] duration-300",
                  isFeatured
                    ? "border-[color:var(--color-primary)]/50 ring-1 ring-[color:var(--color-primary)]/30 shadow-elev-md sm:scale-[1.02]"
                    : "border-[color:var(--color-border)] hover:-translate-y-0.5 hover:shadow-elev-md"
                )}
              >
                {isFeatured && (
                  <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-[color:var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-primary-foreground)] shadow-elev-sm">
                    <Sparkles className="size-3" />
                    {t.marketing.pricingPreview.mostPopular}
                  </span>
                )}

                <div className="text-sm font-semibold text-[color:var(--color-foreground)]">
                  {plan.name}
                </div>
                <div className="mt-1 text-[13px] text-[color:var(--color-muted-foreground)]">
                  {plan.desc}
                </div>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-mono text-[40px] font-semibold tracking-[-0.035em] tabular-nums">
                    {plan.price}
                  </span>
                  {k !== "enterprise" && (
                    <span className="text-sm text-[color:var(--color-muted-foreground)]">
                      {t.marketing.pricingPreview.monthSuffix}
                    </span>
                  )}
                </div>

                <ul className="mt-6 space-y-2.5">
                  {HIGHLIGHTS[k].map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm text-[color:var(--color-foreground)]/90"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--color-primary)]" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
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

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:underline"
          >
            {t.marketing.pricingPreview.seeAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
