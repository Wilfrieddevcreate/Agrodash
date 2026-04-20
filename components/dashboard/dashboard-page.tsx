"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  DollarSign,
  Package,
  Plus,
  ShoppingBag,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart, StockLevelsChart } from "@/components/dashboard/revenue-chart";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { ActivityList } from "@/components/dashboard/activity-list";
import { PageHeader } from "@/components/layout/page-header";
import { useT } from "@/components/providers/language-provider";
import { orders, products, stockLevels } from "@/lib/mock-data";
import { formatCompact, formatCurrency, relativeTime } from "@/lib/utils";

export function DashboardPage() {
  const t = useT();

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

  const recentOrders = React.useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
        )
        .slice(0, 5),
    []
  );

  return (
    <>
      <PageHeader
        title={t.dashboard.title}
        description={t.dashboard.subtitle}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Export started")}
            >
              <Download />
              {t.dashboard.export}
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast.success("New order drawer", {
                  description: "This would open the order wizard.",
                })
              }
            >
              <Plus />
              {t.dashboard.newOrder}
            </Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label={t.dashboard.kpi.revenue}
          value={formatCurrency(932840)}
          delta={12.8}
          helper="vs last month"
          icon={<DollarSign />}
          series={revenueSeries}
          accentVar="--color-chart-1"
          delay={0}
        />
        <KpiCard
          label={t.dashboard.kpi.orders}
          value={formatCompact(6842)}
          delta={8.4}
          helper="vs last month"
          icon={<ShoppingBag />}
          series={orderSeries}
          accentVar="--color-chart-2"
          delay={0.05}
        />
        <KpiCard
          label={t.dashboard.kpi.customers}
          value={formatCompact(1284)}
          delta={5.2}
          helper="active this month"
          icon={<Users />}
          series={customerSeries}
          accentVar="--color-chart-3"
          delay={0.1}
        />
        <KpiCard
          label={t.dashboard.kpi.products}
          value={formatCompact(products.length * 142)}
          delta={-2.1}
          helper="inventory units"
          icon={<Package />}
          series={productSeries}
          accentVar="--color-chart-4"
          delay={0.15}
        />
      </div>

      {/* Main grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-4 xl:grid-cols-3">
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

      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:gap-4 xl:grid-cols-3">
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

      {/* Recent orders strip */}
      <Card className="mt-5">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>Recent orders</CardTitle>
            <CardDescription className="hidden sm:block">
              Most recent orders across all regions
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0">
            <span className="hidden sm:inline">View all</span>
            <ArrowUpRight />
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-[color:var(--color-border)] py-0">
          {recentOrders.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-3 py-3 first:pt-2 last:pb-2"
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
                  {o.items.length} item{o.items.length > 1 ? "s" : ""} ·{" "}
                  {relativeTime(o.placedAt)}
                </div>
              </div>
              <div className="hidden text-right md:block">
                <div className="font-mono text-sm font-semibold tabular-nums">
                  {formatCurrency(o.total)}
                </div>
                <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                  {o.paymentMethod}
                </div>
              </div>
              <div className="text-right sm:hidden">
                <div className="font-mono text-[13px] font-semibold tabular-nums">
                  {formatCurrency(o.total)}
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
    </>
  );
}
