"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Package,
  ShoppingCart,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { activities } from "@/lib/mock-data";
import type { Activity } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { useT } from "@/components/providers/language-provider";

const kindMeta: Record<
  Activity["kind"],
  { icon: React.ElementType; color: string }
> = {
  order: { icon: ShoppingCart, color: "var(--color-chart-1)" },
  stock: { icon: AlertCircle, color: "var(--color-warning)" },
  customer: { icon: UserPlus, color: "var(--color-chart-3)" },
  product: { icon: Package, color: "var(--color-chart-5)" },
  system: { icon: Sparkles, color: "var(--color-muted-foreground)" },
};

export function ActivityList() {
  const t = useT();
  const actionLabels = t.dashboard.activity.actions;
  return (
    <ul className="relative">
      <span
        aria-hidden
        className="absolute left-[18px] top-4 bottom-4 w-px bg-[color:var(--color-border)]"
      />
      {activities.map((a, i) => {
        const meta = kindMeta[a.kind];
        const Icon = meta.icon;
        return (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="relative flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              className="relative z-10 grid size-9 place-items-center rounded-full bg-[color:var(--color-card)] ring-2 ring-[color:var(--color-background)] [&_svg]:size-4"
              style={{
                color: meta.color,
                backgroundColor: `color-mix(in oklab, ${meta.color} 12%, var(--color-card))`,
              }}
            >
              <Icon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-5">
                <span className="font-semibold">{a.actor}</span>
                <span className="text-[color:var(--color-muted-foreground)]">
                  {" "}
                  {actionLabels[a.actionKey]}{" "}
                </span>
                <span className="font-medium">{a.target}</span>
              </p>
              <p
                suppressHydrationWarning
                className="mt-0.5 text-xs text-[color:var(--color-muted-foreground)]"
              >
                {relativeTime(a.timestamp)}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
