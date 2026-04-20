"use client";

import * as React from "react";
import { LogoMark } from "@/components/layout/logo";
import { Avatar } from "@/components/ui/avatar";
import { useT } from "@/components/providers/language-provider";

/**
 * Right-side marketing panel shown on the auth layout at lg+ screens.
 * Pure composition with brand tokens and localized copy.
 */
export function MarketingPanel() {
  const t = useT();
  return (
    <aside
      aria-hidden="true"
      className="relative isolate hidden overflow-hidden lg:block"
      style={{
        background:
          "radial-gradient(120% 90% at 0% 0%, oklch(0.7 0.17 150) 0%, oklch(0.52 0.15 150) 38%, oklch(0.32 0.1 155) 100%)",
      }}
    >
      {/* Radial mesh accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 12%, oklch(0.95 0.08 140 / 0.18), transparent 42%), radial-gradient(circle at 15% 80%, oklch(0.98 0.05 95 / 0.12), transparent 38%)",
        }}
      />

      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0 / 0.5) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Oversized translucent LogoMark in the corner */}
      <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.22] blur-[0.5px]">
        <LogoMark className="!size-[260px] !rounded-[44px]" />
      </div>

      {/* Soft leaf silhouette */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -bottom-20 -left-16 size-[460px] text-white/10"
        fill="currentColor"
      >
        <path d="M200 30c90 40 150 110 150 190 0 90-70 160-160 160-40 0-70-12-90-32 28-6 62-26 92-62 40-48 58-104 58-164 0-32-20-64-50-92Z" />
        <path
          d="M180 80c-4 80-30 150-76 202 14-100 42-170 76-202Z"
          opacity="0.55"
        />
      </svg>

      {/* Content column */}
      <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
        {/* Top: brand eyebrow */}
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
          <span className="size-1.5 rounded-full bg-white/70" />
          {t.auth.marketing.eyebrow}
        </div>

        {/* Center: stat card */}
        <div className="flex flex-col gap-6">
          <h2 className="max-w-sm text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-white xl:text-[32px]">
            {t.auth.marketing.heading}
          </h2>

          <div className="grid max-w-md grid-cols-2 gap-3">
            <StatCard
              label={t.auth.marketing.stats.hectares}
              value="12,400+"
            />
            <StatCard
              label={t.auth.marketing.stats.farms}
              value="2,400+"
            />
            <StatCard
              label={t.auth.marketing.stats.harvest}
              value="$18M"
            />
            <StatCard
              label={t.auth.marketing.stats.deliveries}
              value="98%"
            />
          </div>
        </div>

        {/* Bottom: testimonial */}
        <figure className="relative max-w-md rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-md shadow-[0_12px_40px_-16px_oklch(0_0_0/0.5)]">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="absolute -top-3 left-5 size-7 text-white/90"
            fill="currentColor"
          >
            <path d="M7.2 5.4c-2.5 1.5-4 4-4 7.2v6h6v-6H6.6c.3-1.7 1.3-3 3-3.8l-2.4-3.4Zm9.6 0c-2.5 1.5-4 4-4 7.2v6h6v-6h-2.6c.3-1.7 1.3-3 3-3.8l-2.4-3.4Z" />
          </svg>
          <blockquote className="text-[13.5px] leading-relaxed text-white/90">
            {t.auth.marketing.testimonialQuote}
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <Avatar
              name="Mara Okafor"
              size="md"
              className="!bg-white/15 !text-white !ring-white/25"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">
                Mara Okafor
              </div>
              <div className="text-[11.5px] text-white/70">
                {t.auth.marketing.testimonialRole}
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </aside>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-sm">
      <div className="text-[20px] font-semibold leading-tight tracking-[-0.01em] text-white">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-white/70">
        {label}
      </div>
    </div>
  );
}
