"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
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
import { customers } from "@/lib/mock-data";
import type { CustomerTier } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const tierVariant: Record<
  CustomerTier,
  "default" | "info" | "secondary" | "warning"
> = {
  farmer: "default",
  distributor: "info",
  retailer: "secondary",
  cooperative: "warning",
};

const PAGE_SIZE = 8;

export function CustomersPage() {
  const t = useT();
  const [search, setSearch] = React.useState("");
  const [tier, setTier] = React.useState<"all" | CustomerTier>("all");
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers.filter((c) => {
      if (tier !== "all" && c.tier !== tier) return false;
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.email.toLowerCase().includes(q) &&
        !c.location.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [search, tier]);

  React.useEffect(() => setPage(1), [search, tier]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tierOptions = [
    { label: t.customers.allTiers, value: "all" },
    { label: t.customers.tiers.farmer, value: "farmer" },
    { label: t.customers.tiers.distributor, value: "distributor" },
    { label: t.customers.tiers.retailer, value: "retailer" },
    { label: t.customers.tiers.cooperative, value: "cooperative" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Network"
        title={t.customers.title}
        description={t.customers.subtitle}
        actions={
          <Button size="sm">
            <Plus /> {t.customers.add}
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
              placeholder={t.customers.searchPlaceholder}
              className="pl-9"
            />
          </div>
          <div className="sm:min-w-[180px]">
            <Select
              value={tier}
              onValueChange={(v) => setTier(v as typeof tier)}
              options={tierOptions}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-hidden sm:mt-5">
        {/* Mobile cards */}
        <div className="divide-y divide-[color:var(--color-border)] md:hidden">
          {paged.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
            >
              <Link href={`/customers/${c.id}`} className="flex items-start gap-3 p-4">
                <Avatar name={c.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{c.name}</div>
                      <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                        {c.email}
                      </div>
                    </div>
                    <Badge variant={tierVariant[c.tier]} className="capitalize">
                      {t.customers.tiers[c.tier]}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[color:var(--color-muted-foreground)]">
                    <span className="truncate">
                      {c.location}, {c.country}
                    </span>
                    <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-[color:var(--color-foreground)]">
                      {formatCurrency(c.totalSpent)}
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
              <TableHead>{t.customers.columns.customer}</TableHead>
              <TableHead>{t.customers.columns.tier}</TableHead>
              <TableHead>{t.customers.columns.location}</TableHead>
              <TableHead>{t.customers.columns.orders}</TableHead>
              <TableHead>{t.customers.columns.spent}</TableHead>
              <TableHead>{t.customers.columns.joined}</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                className="group border-b border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-muted)]/40"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size="md" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        <Link
                          href={`/customers/${c.id}`}
                          className="hover:text-[color:var(--color-primary)]"
                        >
                          {c.name}
                        </Link>
                      </div>
                      <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                        {c.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={tierVariant[c.tier]} className="capitalize">
                    {t.customers.tiers[c.tier]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="font-medium">{c.location}</div>
                  <div className="text-xs text-[color:var(--color-muted-foreground)]">
                    {c.country}
                  </div>
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {c.totalOrders}
                </TableCell>
                <TableCell className="font-mono font-semibold tabular-nums">
                  {formatCurrency(c.totalSpent)}
                </TableCell>
                <TableCell className="text-sm text-[color:var(--color-muted-foreground)]">
                  {formatDate(c.joinedAt)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/customers/${c.id}`}
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
