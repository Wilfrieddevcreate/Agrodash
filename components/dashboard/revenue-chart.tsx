"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { salesSeries } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";
import { useT } from "@/components/providers/language-provider";
import { useCurrency } from "@/components/providers/currency-provider";

export function RevenueChart() {
  const t = useT();
  const { format: formatCurrency } = useCurrency();
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={salesSeries}
        margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${formatCompact(v)}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(v)}
        />
        <Tooltip
          cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            fontSize: 12,
            padding: "10px 14px",
            boxShadow:
              "0 10px 32px -12px oklch(0.2 0.02 155 / 0.18), 0 4px 8px -4px oklch(0.2 0.02 155 / 0.08)",
          }}
          labelStyle={{ color: "var(--color-muted-foreground)", fontWeight: 500 }}
          formatter={(value, name) => {
            const n = Number(value);
            return name === "revenue"
              ? [formatCurrency(n), t.dashboard.charts.revenueSeries]
              : [n.toLocaleString(), t.dashboard.charts.ordersSeries];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
          formatter={(v) => (
            <span style={{ color: "var(--color-muted-foreground)" }}>{v}</span>
          )}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-chart-1)"
          fill="url(#revenue-grad)"
          strokeWidth={2.5}
          name={t.dashboard.charts.revenueSeries}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="orders"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name={t.dashboard.charts.ordersSeries}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function StockLevelsChart({
  data,
}: {
  data: Array<{ name: string; current: number; target: number }>;
}) {
  const t = useT();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 10, bottom: 0 }}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          stroke="var(--color-muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatCompact(v)}
        />
        <YAxis
          dataKey="name"
          type="category"
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={88}
        />
        <Tooltip
          cursor={{ fill: "var(--color-muted)", opacity: 0.35 }}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            fontSize: 12,
            padding: "10px 14px",
            boxShadow:
              "0 10px 32px -12px oklch(0.2 0.02 155 / 0.18), 0 4px 8px -4px oklch(0.2 0.02 155 / 0.08)",
          }}
        />
        <Bar
          dataKey="target"
          fill="var(--color-muted)"
          radius={[0, 6, 6, 0]}
          name={t.dashboard.charts.targetSeries}
        />
        <Bar
          dataKey="current"
          fill="var(--color-chart-1)"
          radius={[0, 6, 6, 0]}
          name={t.dashboard.charts.currentSeries}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniTrend({
  data,
  stroke = "var(--color-chart-1)",
  height = 40,
}: {
  data: Array<{ v: number }>;
  stroke?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="mini-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={stroke}
          strokeWidth={2}
          fill="url(#mini-grad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
