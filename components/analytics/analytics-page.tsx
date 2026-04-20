"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange, type DateRangeValue } from "@/components/ui/date-range";
import { PageHeader } from "@/components/layout/page-header";
import { useT } from "@/components/providers/language-provider";
import {
  categoryBreakdown,
  regionPerformance,
  salesSeries,
  weeklyOperations,
} from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";
import { useCurrency } from "@/components/providers/currency-provider";

const palette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
];

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  padding: "10px 14px",
  boxShadow:
    "0 10px 32px -12px oklch(0.2 0.02 155 / 0.18), 0 4px 8px -4px oklch(0.2 0.02 155 / 0.08)",
};

export function AnalyticsPage() {
  const t = useT();
  const { format: formatCurrency } = useCurrency();
  const [range, setRange] = React.useState<DateRangeValue>({
    from: null,
    to: null,
  });

  return (
    <>
      <PageHeader
        eyebrow={t.analytics.eyebrow}
        title={t.analytics.title}
        description={t.analytics.subtitle}
        actions={<DateRange value={range} onChange={setRange} />}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatMini label={t.analytics.stats.revenue} value="$1.04M" delta={18.2} />
        <StatMini label={t.analytics.stats.orders} value="6,842" delta={8.4} />
        <StatMini label={t.analytics.stats.aov} value="$152" delta={3.1} />
        <StatMini
          label={t.analytics.stats.returning}
          value="43%"
          delta={5.8}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t.analytics.revenueTitle}</CardTitle>
            <CardDescription>{t.analytics.revenueSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260} minHeight={220}>
              <LineChart
                data={salesSeries}
                margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
              >
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
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    const n = Number(value);
                    return name === "revenue"
                      ? [formatCurrency(n), t.analytics.series.revenue]
                      : [n.toLocaleString(), t.analytics.series.orders];
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ color: "var(--color-muted-foreground)" }}>
                      {v}
                    </span>
                  )}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-chart-1)" }}
                  activeDot={{ r: 5 }}
                  name={t.analytics.series.revenue}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-chart-3)" }}
                  activeDot={{ r: 5 }}
                  name={t.analytics.series.orders}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.mixTitle}</CardTitle>
            <CardDescription>{t.analytics.mixSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {categoryBreakdown.map((_, idx) => (
                    <Cell key={idx} fill={palette[idx % palette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${Number(value)}%`, t.analytics.series.share]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
              {categoryBreakdown.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: palette[i % palette.length] }}
                  />
                  <span className="flex-1 truncate">
                    {t.products.categories[c.category] ?? c.name}
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    {c.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t.analytics.opsTitle}</CardTitle>
            <CardDescription>{t.analytics.opsSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={weeklyOperations}
                margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
                barGap={6}
                barCategoryGap="22%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)", opacity: 0.35 }}
                  contentStyle={tooltipStyle}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ color: "var(--color-muted-foreground)" }}>
                      {v}
                    </span>
                  )}
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-chart-1)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="deliveries"
                  fill="var(--color-chart-3)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="returns"
                  fill="var(--color-chart-4)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.regionTitle}</CardTitle>
            <CardDescription>{t.analytics.regionSubtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {regionPerformance.map((r) => {
              const max = Math.max(...regionPerformance.map((x) => x.revenue));
              const pct = (r.revenue / max) * 100;
              return (
                <div key={r.region}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{r.region}</span>
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      {formatCurrency(r.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-muted)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-chart-1)] to-[color:var(--color-chart-2)] transition-[width] duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <Badge variant="success" className="shrink-0">
                      +{r.growth}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatMini({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: number;
}) {
  const positive = delta >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
          {label}
        </div>
        <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">
          {value}
        </div>
        <div
          className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${
            positive
              ? "text-[color:var(--color-success)]"
              : "text-[color:var(--color-destructive)]"
          }`}
        >
          <ArrowUpRight
            className={`size-3 ${positive ? "" : "rotate-180"}`}
          />
          {Math.abs(delta).toFixed(1)}%
        </div>
      </CardContent>
    </Card>
  );
}
