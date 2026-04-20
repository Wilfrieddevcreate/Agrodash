"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sprout,
  Wheat,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { customers, orders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export function CustomerDetail({ id }: { id: string }) {
  const t = useT();
  const customer = customers.find((c) => c.id === id);
  if (!customer) notFound();

  const custOrders = orders
    .filter((o) => o.customerId === customer.id)
    .slice(0, 6);

  return (
    <>
      <Link
        href="/customers"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:text-[color:var(--color-foreground)]"
      >
        <ArrowLeft className="size-4" />
        {t.customers.detail.back}
      </Link>

      <PageHeader
        title={customer.name}
        description={customer.email}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Message opened")}
          >
            <MessageSquare />
            {t.customers.detail.sendMessage}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar name={customer.name} size="xl" className="size-20 text-xl" />
              <h3 className="mt-3 text-base font-semibold">{customer.name}</h3>
              <Badge variant="default" className="mt-1.5 capitalize">
                {t.customers.tiers[customer.tier]}
              </Badge>
            </div>
            <div className="mt-5 space-y-2.5 text-sm">
              <Row icon={<Mail />}>{customer.email}</Row>
              <Row icon={<Phone />}>{customer.phone}</Row>
              <Row icon={<MapPin />}>
                {customer.location}, {customer.country}
              </Row>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat label={t.customers.columns.orders} value={String(customer.totalOrders)} />
              <Stat
                label={t.customers.detail.total}
                value={formatCurrency(customer.totalSpent)}
                accent
              />
            </div>
            <div className="mt-4 text-center text-xs text-[color:var(--color-muted-foreground)]">
              {t.customers.detail.member} {formatDate(customer.joinedAt)}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:col-span-2">
          {(customer.farmSize || customer.primaryCrop) && (
            <Card>
              <CardHeader>
                <CardTitle>{t.customers.detail.farm}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {customer.farmSize && (
                  <FarmStat
                    icon={<Sprout />}
                    label={t.customers.detail.farmSize}
                    value={customer.farmSize}
                  />
                )}
                {customer.primaryCrop && (
                  <FarmStat
                    icon={<Wheat />}
                    label={t.customers.detail.primaryCrop}
                    value={customer.primaryCrop}
                  />
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t.customers.detail.recentOrders}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {custOrders.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-[color:var(--color-muted-foreground)]">
                  No orders yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>{t.orders.columns.reference}</TableHead>
                      <TableHead>{t.orders.columns.items}</TableHead>
                      <TableHead>{t.orders.columns.total}</TableHead>
                      <TableHead>{t.orders.columns.status}</TableHead>
                      <TableHead>{t.orders.columns.placed}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {custOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono font-semibold">
                          <Link
                            href={`/orders/${o.id}`}
                            className="hover:text-[color:var(--color-primary)]"
                          >
                            {o.reference}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-[color:var(--color-muted-foreground)]">
                          {o.items.length}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                          {formatCurrency(o.total)}
                        </TableCell>
                        <TableCell>
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
                          >
                            {t.orders.status[o.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[color:var(--color-muted-foreground)]">
                          {formatDate(o.placedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[color:var(--color-muted-foreground)]">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)] [&_svg]:size-4">
        {icon}
      </span>
      <span className="truncate text-[color:var(--color-foreground)]">{children}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/40 p-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
        {label}
      </div>
      <div
        className={`mt-0.5 font-mono text-lg font-semibold tabular-nums ${
          accent ? "text-[color:var(--color-primary)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function FarmStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] p-4">
      <span className="grid size-11 place-items-center rounded-lg bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] [&_svg]:size-5">
        {icon}
      </span>
      <div>
        <div className="text-xs text-[color:var(--color-muted-foreground)]">
          {label}
        </div>
        <div className="text-base font-semibold">{value}</div>
      </div>
    </div>
  );
}
