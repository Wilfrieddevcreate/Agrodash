"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { categoryBreakdown } from "@/lib/mock-data";
import { useT } from "@/components/providers/language-provider";

const palette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
];

export function CategoryDonut() {
  const t = useT();
  const total = categoryBreakdown.reduce((s, c) => s + c.value, 0);
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdown}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={86}
              paddingAngle={2}
              strokeWidth={0}
            >
              {categoryBreakdown.map((_, idx) => (
                <Cell key={idx} fill={palette[idx % palette.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                fontSize: 12,
                padding: "10px 14px",
                boxShadow:
                  "0 10px 32px -12px oklch(0.2 0.02 155 / 0.18), 0 4px 8px -4px oklch(0.2 0.02 155 / 0.08)",
              }}
              formatter={(value) => [`${Number(value)}%`, t.dashboard.charts.shareLabel]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
            {t.dashboard.charts.totalLabel}
          </span>
          <span className="font-mono text-lg font-semibold tabular-nums">
            {total}%
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-sm sm:grid-cols-1">
        {categoryBreakdown.map((c, i) => (
          <div
            key={c.name}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-[color:var(--color-muted)]/50"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: palette[i % palette.length] }}
              />
              <span className="truncate text-[13px]">
                {t.products.categories[c.category] ?? c.name}
              </span>
            </div>
            <span className="font-mono text-[13px] font-semibold tabular-nums text-[color:var(--color-foreground)]">
              {c.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
