"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { invoices as seedInvoices } from "@/lib/invoices-mock";
import { customers } from "@/lib/mock-data";
import type { Invoice, InvoiceStatus } from "@/lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const statusVariant: Record<
  InvoiceStatus,
  "success" | "info" | "secondary" | "destructive" | "outline"
> = {
  paid: "success",
  sent: "info",
  draft: "secondary",
  overdue: "destructive",
  void: "outline",
};

const statusLabel: Record<InvoiceStatus, string> = {
  paid: "Paid",
  sent: "Sent",
  draft: "Draft",
  overdue: "Overdue",
  void: "Void",
};

const PAGE_SIZE = 10;

/* ──────────────────────────────────────────────────────────
 * KPIs
 * ────────────────────────────────────────────────────────── */

const NOW = new Date("2026-04-20T10:00:00.000Z").getTime();
const DAY = 24 * 60 * 60 * 1000;

interface StatCardProps {
  label: string;
  value: string;
  helper?: string;
  delta: number;
  icon: React.ReactNode;
  series: Array<{ v: number }>;
  accentVar: string;
}

function StatCard({
  label,
  value,
  helper,
  delta,
  icon,
  series,
  accentVar,
}: StatCardProps) {
  const positive = delta >= 0;
  const uid = React.useId();
  const gradientId = `inv-grad-${uid.replace(/:/g, "")}`;

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-muted-foreground)]">
            <span
              className="grid size-7 place-items-center rounded-md ring-1 ring-inset [&_svg]:size-[15px]"
              style={{
                backgroundColor: `color-mix(in oklab, var(${accentVar}) 12%, transparent)`,
                color: `var(${accentVar})`,
                boxShadow: `inset 0 1px 0 0 color-mix(in oklab, var(${accentVar}) 30%, transparent)`,
              }}
            >
              {icon}
            </span>
            <span className="truncate">{label}</span>
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
              positive
                ? "bg-[color:var(--color-success)]/12 text-[color:var(--color-success)]"
                : "bg-[color:var(--color-destructive)]/12 text-[color:var(--color-destructive)]"
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        </div>
        <div className="mt-3 text-[22px] font-semibold leading-none tracking-[-0.02em] tabular-nums sm:text-[24px]">
          {value}
        </div>
        {helper && (
          <div className="mt-1 text-[11.5px] text-[color:var(--color-muted-foreground)]">
            {helper}
          </div>
        )}
      </div>
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={`var(${accentVar})`}
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor={`var(${accentVar})`}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={`var(${accentVar})`}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function computeStats(all: Invoice[]) {
  const outstanding = all
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + i.total, 0);

  const paidThisMonth = all
    .filter((i) => {
      if (i.status !== "paid" || !i.paidAt) return false;
      return NOW - new Date(i.paidAt).getTime() <= 30 * DAY;
    })
    .reduce((s, i) => s + i.total, 0);

  const overdueCount = all.filter((i) => i.status === "overdue").length;

  const paid = all.filter((i) => i.status === "paid" && i.paidAt);
  const avgDaysToPay = paid.length
    ? Math.round(
        paid.reduce((s, i) => {
          const d =
            (new Date(i.paidAt as string).getTime() -
              new Date(i.issueDate).getTime()) /
            DAY;
          return s + d;
        }, 0) / paid.length
      )
    : 0;

  return { outstanding, paidThisMonth, overdueCount, avgDaysToPay };
}

// Sparkline data (deterministic)
const outstandingSeries = [
  { v: 42 },
  { v: 58 },
  { v: 51 },
  { v: 68 },
  { v: 64 },
  { v: 79 },
  { v: 72 },
  { v: 88 },
];
const paidSeries = [
  { v: 22 },
  { v: 30 },
  { v: 28 },
  { v: 41 },
  { v: 48 },
  { v: 55 },
  { v: 63 },
  { v: 71 },
];
const overdueSeries = [
  { v: 9 },
  { v: 12 },
  { v: 11 },
  { v: 14 },
  { v: 10 },
  { v: 8 },
  { v: 7 },
  { v: 6 },
];
const daysToPaySeries = [
  { v: 18 },
  { v: 16 },
  { v: 15 },
  { v: 14 },
  { v: 13 },
  { v: 12 },
  { v: 11 },
  { v: 10 },
];

/* ──────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────── */

export function InvoicesPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | InvoiceStatus>("all");
  const [customerId, setCustomerId] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [formOpen, setFormOpen] = React.useState(false);

  const stats = React.useMemo(() => computeStats(seedInvoices), []);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return seedInvoices.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      if (customerId !== "all" && i.customerId !== customerId) return false;
      if (
        q &&
        !i.number.toLowerCase().includes(q) &&
        !i.customerName.toLowerCase().includes(q) &&
        !i.customerEmail.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [search, status, customerId]);

  // Reset to page 1 whenever filters change — done during render with a tracked
  // key to avoid cascading effect renders (React 19 pattern).
  const filterKey = `${search}|${status}|${customerId}`;
  const [lastFilterKey, setLastFilterKey] = React.useState(filterKey);
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Sent", value: "sent" },
    { label: "Draft", value: "draft" },
    { label: "Overdue", value: "overdue" },
    { label: "Void", value: "void" },
  ];

  const customerOptions = [
    { label: "All customers", value: "all" },
    ...customers.map((c) => ({ label: c.name, value: c.id })),
  ];

  return (
    <>
      <PageHeader
        eyebrow="Billing"
        title="Invoices"
        description="Manage invoices, track payments, and reconcile with customers."
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.success("Export started", {
                  description: "CSV is being prepared…",
                })
              }
            >
              <Download /> Export CSV
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setFormOpen(true)}
            >
              <Plus /> New invoice
            </Button>
          </>
        }
      />

      {/* KPI strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
      >
        <StatCard
          label="Total outstanding"
          value={formatCurrency(stats.outstanding)}
          helper="Sent + overdue invoices"
          delta={8.4}
          icon={<CircleDollarSign />}
          series={outstandingSeries}
          accentVar="--color-primary"
        />
        <StatCard
          label="Paid this month"
          value={formatCurrency(stats.paidThisMonth)}
          helper="Last 30 days"
          delta={12.6}
          icon={<CircleDollarSign />}
          series={paidSeries}
          accentVar="--color-success"
        />
        <StatCard
          label="Overdue"
          value={String(stats.overdueCount)}
          helper="Invoices past due date"
          delta={-3.2}
          icon={<Clock />}
          series={overdueSeries}
          accentVar="--color-destructive"
        />
        <StatCard
          label="Avg. days to pay"
          value={`${stats.avgDaysToPay} d`}
          helper="Across paid invoices"
          delta={-5.1}
          icon={<CalendarClock />}
          series={daysToPaySeries}
          accentVar="--color-info"
        />
      </motion.div>

      {/* Filters */}
      <Card variant="flat" className="bg-[color:var(--color-muted)]/30 shadow-none">
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice number or customer…"
              className="pl-9"
            />
          </div>
          <div className="sm:min-w-[170px]">
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as typeof status)}
              options={statusOptions}
            />
          </div>
          <div className="sm:min-w-[210px]">
            <Select
              value={customerId}
              onValueChange={setCustomerId}
              options={customerOptions}
            />
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={<FileText />}
            title="No invoices found"
            description="Try changing your filters or create a new invoice to get started."
            action={
              <Button
                size="sm"
                variant="primary"
                onClick={() => setFormOpen(true)}
              >
                <Plus /> New invoice
              </Button>
            }
          />
        </div>
      ) : (
        <Card className="mt-4 overflow-hidden sm:mt-5">
          {/* Mobile cards */}
          <div className="divide-y divide-[color:var(--color-border)] md:hidden">
            {paged.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.015 }}
                className="p-4"
              >
                <Link
                  href={`/invoices/${inv.id}`}
                  className="flex items-start gap-3"
                >
                  <Avatar name={inv.customerName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-mono text-[13px] font-semibold">
                          {inv.number}
                        </div>
                        <div className="truncate text-sm">
                          {inv.customerName}
                        </div>
                      </div>
                      <Badge variant={statusVariant[inv.status]}>
                        {statusLabel[inv.status]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[color:var(--color-muted-foreground)]">
                      <span>Due {formatDate(inv.dueDate)}</span>
                      <span className="font-mono text-sm font-semibold tabular-nums text-[color:var(--color-foreground)]">
                        {formatCurrency(inv.total, inv.currency)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((inv, i) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.015 }}
                    className="group border-b border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-muted)]/40"
                  >
                    <TableCell className="font-mono text-sm font-semibold">
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="hover:text-[color:var(--color-primary)]"
                      >
                        {inv.number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={inv.customerName} size="sm" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {inv.customerName}
                          </div>
                          <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                            {inv.customerEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[color:var(--color-muted-foreground)]">
                      {formatDate(inv.issueDate)}
                    </TableCell>
                    <TableCell className="text-sm text-[color:var(--color-muted-foreground)]">
                      {formatDate(inv.dueDate)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold tabular-nums">
                      {formatCurrency(inv.total, inv.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[inv.status]}>
                        {statusLabel[inv.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dropdown
                        trigger={
                          <button
                            type="button"
                            aria-label="More actions"
                            className="inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        }
                      >
                        <DropdownItem
                          icon={<FileText className="size-4" />}
                          onClick={() => {
                            window.location.href = `/invoices/${inv.id}`;
                          }}
                        >
                          View details
                        </DropdownItem>
                        <DropdownItem
                          icon={<Download className="size-4" />}
                          onClick={() =>
                            toast.success("Download started", {
                              description: `${inv.number}.pdf is being generated…`,
                            })
                          }
                        >
                          Download PDF
                        </DropdownItem>
                        <DropdownItem
                          icon={<Send className="size-4" />}
                          onClick={() =>
                            toast.success("Reminder sent", {
                              description: `Email dispatched to ${inv.customerEmail}.`,
                            })
                          }
                        >
                          Send reminder
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem
                          variant="destructive"
                          icon={<Trash2 className="size-4" />}
                          onClick={() =>
                            toast.error("Invoice deleted", {
                              description: `${inv.number} moved to trash.`,
                            })
                          }
                        >
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {filtered.length > 0 && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
          className="mt-5"
        />
      )}

      <InvoiceForm open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
}
