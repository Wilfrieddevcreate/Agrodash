"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  RevenueChart,
  StockLevelsChart,
} from "@/components/dashboard/revenue-chart";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { ActivityList } from "@/components/dashboard/activity-list";
import { useT } from "@/components/providers/language-provider";
import { useCurrency } from "@/components/providers/currency-provider";
import { orders, products, stockLevels } from "@/lib/mock-data";
import { formatCompact, relativeTime } from "@/lib/utils";

/* Dense, screenshot-first snapshot of the product surface.
 * Strips the hero + page chrome so a single 1440×900 capture
 * frames the whole dashboard story cleanly. */
export function ShowcasePage() {
  const t = useT();
  const { format: formatCurrency } = useCurrency();

  const revenueSeries = React.useMemo(
    () => [18, 22, 28, 27, 34, 38, 36, 44, 48, 55, 62, 72].map((v) => ({ v })),
    []
  );
  const orderSeries = React.useMemo(
    () => [12, 14, 19, 22, 21, 27, 30, 33, 38, 41, 44, 52].map((v) => ({ v })),
    []
  );
  const customerSeries = React.useMemo(
    () => [8, 10, 9, 11, 14, 16, 18, 19, 21, 24, 26, 28].map((v) => ({ v })),
    []
  );
  const productSeries = React.useMemo(
    () => [40, 42, 45, 44, 48, 52, 51, 55, 58, 60, 62, 66].map((v) => ({ v })),
    []
  );

  const topOrders = React.useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
        )
        .slice(0, 4),
    []
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Eyebrow strip — replaces the hero so more surface fits above the fold */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-primary)]/20 bg-[color:var(--color-primary)]/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            · Live overview
          </div>
          <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[30px]">
            {t.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--color-success)]" />
            9 regions · {formatCurrency(932840)}
          </Badge>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label={t.dashboard.kpi.revenue}
          value={formatCurrency(932840)}
          delta={12.8}
          helper={t.dashboard.vsLastMonth}
          icon={<DollarSign />}
          series={revenueSeries}
          accentVar="--color-chart-1"
        />
        <KpiCard
          label={t.dashboard.kpi.orders}
          value={formatCompact(6842)}
          delta={8.4}
          helper={t.dashboard.vsLastMonth}
          icon={<ShoppingBag />}
          series={orderSeries}
          accentVar="--color-chart-2"
          delay={0.05}
        />
        <KpiCard
          label={t.dashboard.kpi.customers}
          value={formatCompact(1284)}
          delta={5.2}
          helper={t.dashboard.activeThisMonth}
          icon={<Users />}
          series={customerSeries}
          accentVar="--color-chart-3"
          delay={0.1}
        />
        <KpiCard
          label={t.dashboard.kpi.products}
          value={formatCompact(products.length * 142)}
          delta={-2.1}
          helper={t.dashboard.inventoryUnits}
          icon={<Package />}
          series={productSeries}
          accentVar="--color-chart-4"
          delay={0.15}
        />
      </div>

      {/* Revenue + Category */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{t.dashboard.charts.revenueTitle}</CardTitle>
              <CardDescription>
                {t.dashboard.charts.revenueSubtitle}
              </CardDescription>
            </div>
            <Badge variant="success">
              <ArrowUpRight className="size-3" /> 18.2%
            </Badge>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.charts.categoryTitle}</CardTitle>
            <CardDescription>
              {t.dashboard.charts.categorySubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryDonut />
          </CardContent>
        </Card>
      </div>

      {/* Stock + Activity + Recent orders */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>{t.dashboard.charts.stockTitle}</CardTitle>
            <CardDescription>
              {t.dashboard.charts.stockSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StockLevelsChart data={stockLevels} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.activity.title}</CardTitle>
            <CardDescription>{t.dashboard.activity.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityList />
          </CardContent>
        </Card>
      </div>

      {/* Recent orders strip — condensed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>{t.dashboard.recentOrdersTitle}</CardTitle>
            <CardDescription className="hidden sm:block">
              {t.dashboard.recentOrdersSubtitle}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-[color:var(--color-border)] py-0">
          {topOrders.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-3 py-2.5 first:pt-2 last:pb-2"
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[color:var(--color-muted)] font-mono text-[11px] font-semibold">
                {o.reference.split("-")[1]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                  {o.customerName}
                </div>
                <div
                  suppressHydrationWarning
                  className="truncate text-xs text-[color:var(--color-muted-foreground)]"
                >
                  {o.items.length}{" "}
                  {o.items.length > 1
                    ? t.dashboard.itemsPlural
                    : t.dashboard.itemsSingular}
                  {" · "}
                  {relativeTime(o.placedAt)}
                </div>
              </div>
              <div className="hidden text-right md:block">
                <div className="font-mono text-sm font-semibold tabular-nums">
                  {formatCurrency(o.total)}
                </div>
                <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                  {t.orders.paymentMethods[o.paymentMethod]}
                </div>
              </div>
              <Badge
                variant={
                  o.status === "delivered"
                    ? "success"
                    : o.status === "cancelled"
                    ? "destructive"
                    : o.status === "shipped"
                    ? "info"
                    : o.status === "processing"
                    ? "default"
                    : "warning"
                }
                className="hidden capitalize sm:inline-flex"
              >
                {t.orders.status[o.status]}
              </Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
