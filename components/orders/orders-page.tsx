"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useT } from "@/components/providers/language-provider";
import { orders } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/types";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

const statusVariant: Record<
  OrderStatus,
  "success" | "warning" | "info" | "default" | "destructive"
> = {
  delivered: "success",
  pending: "warning",
  shipped: "info",
  processing: "default",
  cancelled: "destructive",
};

const PAGE_SIZE = 10;

export function OrdersPage() {
  const t = useT();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | OrderStatus>("all");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (
        q &&
        !o.reference.toLowerCase().includes(q) &&
        !o.customerName.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [search, status]);

  React.useEffect(() => setPage(1), [search, status]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusOptions = [
    { label: t.orders.allStatuses, value: "all" },
    { label: t.orders.status.pending, value: "pending" },
    { label: t.orders.status.processing, value: "processing" },
    { label: t.orders.status.shipped, value: "shipped" },
    { label: t.orders.status.delivered, value: "delivered" },
    { label: t.orders.status.cancelled, value: "cancelled" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.orders.eyebrow}
        title={t.orders.title}
        description={t.orders.subtitle}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.success(t.orders.toast.exportStarted, {
                description: t.orders.toast.exportStartedDesc,
              })
            }
          >
            <Download /> {t.orders.export}
          </Button>
        }
      />

      <Card variant="flat" className="bg-[color:var(--color-muted)]/30 shadow-none">
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.orders.searchPlaceholder}
              className="pl-9"
            />
          </div>
          <div className="sm:min-w-[180px]">
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as typeof status)}
              options={statusOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-hidden sm:mt-5">
        {/* Mobile cards */}
        <div className="divide-y divide-[color:var(--color-border)] md:hidden">
          {paged.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.015 }}
              className="p-4"
            >
              <Link href={`/orders/${o.id}`} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-primary)]/25 to-[color:var(--color-accent)]/30 text-[10px] font-semibold text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-border)]">
                  {initials(o.customerName)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mono text-[13px] font-semibold">
                        {o.reference}
                      </div>
                      <div className="truncate text-sm">{o.customerName}</div>
                    </div>
                    <Badge variant={statusVariant[o.status]}>
                      {t.orders.status[o.status]}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[color:var(--color-muted-foreground)]">
                    <span>
                      {o.items.length}{" "}
                      {o.items.length > 1
                        ? t.orders.itemsPlural
                        : t.orders.itemsSingular}
                      {" · "}
                      {formatDate(o.placedAt)}
                    </span>
                    <span className="font-mono text-sm font-semibold tabular-nums text-[color:var(--color-foreground)]">
                      {formatCurrency(o.total)}
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
              <TableHead>{t.orders.columns.reference}</TableHead>
              <TableHead>{t.orders.columns.customer}</TableHead>
              <TableHead>{t.orders.columns.items}</TableHead>
              <TableHead>{t.orders.columns.total}</TableHead>
              <TableHead>{t.orders.columns.status}</TableHead>
              <TableHead>{t.orders.columns.placed}</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((o, i) => (
              <motion.tr
                key={o.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.015 }}
                className="group cursor-pointer border-b border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-muted)]/40"
              >
                <TableCell className="font-mono text-sm font-semibold">
                  <Link
                    href={`/orders/${o.id}`}
                    className="hover:text-[color:var(--color-primary)]"
                  >
                    {o.reference}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-primary)]/25 to-[color:var(--color-accent)]/30 text-[10px] font-semibold text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-border)]">
                      {initials(o.customerName)}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {o.customerName}
                      </div>
                      <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                        {o.customerEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-[color:var(--color-muted-foreground)]">
                  {o.items.length}{" "}
                  {o.items.length > 1
                    ? t.orders.itemsPlural
                    : t.orders.itemsSingular}
                </TableCell>
                <TableCell className="font-mono font-semibold tabular-nums">
                  {formatCurrency(o.total)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[o.status]}>
                    {t.orders.status[o.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-[color:var(--color-muted-foreground)]">
                  {formatDate(o.placedAt)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/orders/${o.id}`}
                    aria-label="View"
                    className="inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-all hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] group-hover:translate-x-0.5"
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        </div>
      </Card>

      {filtered.length > 0 && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
          labels={{
            showing: t.common.pagination.showing,
            of: t.common.pagination.of,
            results: t.common.pagination.results,
            prev: t.common.pagination.prev,
            next: t.common.pagination.next,
          }}
          className="mt-5"
        />
      )}
    </>
  );
}
