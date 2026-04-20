"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  KanbanSquare,
  Package,
  Receipt,
  Truck,
} from "lucide-react";
import { useT } from "@/components/providers/language-provider";

type Item = {
  key: "stock" | "orders" | "invoicing" | "calendar" | "kanban" | "analytics";
  icon: React.ElementType;
  accent: string;
};

const ITEMS: Item[] = [
  { key: "stock", icon: Package, accent: "--color-chart-1" },
  { key: "orders", icon: Truck, accent: "--color-chart-2" },
  { key: "invoicing", icon: Receipt, accent: "--color-chart-3" },
  { key: "calendar", icon: CalendarDays, accent: "--color-chart-4" },
  { key: "kanban", icon: KanbanSquare, accent: "--color-chart-5" },
  { key: "analytics", icon: BarChart3, accent: "--color-chart-6" },
];

export function FeaturesSection() {
  const t = useT();

  return (
    <section
      id="features"
      className="relative scroll-mt-24 py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20"
          >
            {t.marketing.features.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-4 text-[28px] font-semibold tracking-[-0.025em] sm:text-[34px] lg:text-[40px]"
          >
            {t.marketing.features.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-base"
          >
            {t.marketing.features.subtitle}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            const content = t.marketing.features.items[item.key];
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 shadow-elev-sm transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/25 hover:shadow-elev-md"
              >
                {/* Accent glow on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 100% 0%, color-mix(in oklab, var(${item.accent}) 10%, transparent), transparent 60%)`,
                  }}
                />

                <div
                  className="relative grid size-10 place-items-center rounded-xl ring-1 ring-inset"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(${item.accent}) 12%, transparent)`,
                    color: `var(${item.accent})`,
                    boxShadow: `inset 0 1px 0 0 color-mix(in oklab, var(${item.accent}) 30%, transparent)`,
                  }}
                >
                  <Icon className="size-[20px]" />
                </div>

                <h3 className="relative mt-5 text-[17px] font-semibold tracking-[-0.015em]">
                  {content.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
                  {content.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
