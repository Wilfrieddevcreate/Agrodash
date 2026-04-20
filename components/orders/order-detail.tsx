"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Printer,
  Truck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { useT } from "@/components/providers/language-provider";
import { orders } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/types";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";

const timelineOrder: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

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

export function OrderDetail({ id }: { id: string }) {
  const t = useT();
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();

  const subtotal = order.total;
  const tax = subtotal * 0.075;
  const grand = subtotal + tax;

  const currentIdx =
    order.status === "cancelled" ? -1 : timelineOrder.indexOf(order.status);

  return (
    <>
      <Link
        href="/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:text-[color:var(--color-foreground)]"
      >
        <ArrowLeft className="size-4" />
        {t.orders.detail.back}
      </Link>
      <PageHeader
        title={order.reference}
        description={`${t.orders.detail.summary} · ${formatDateTime(order.placedAt)}`}
        actions={
          <>
            <Badge variant={statusVariant[order.status]}>
              {t.orders.status[order.status]}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Invoice sent to printer")}
            >
              <Printer />
              Print
            </Button>
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <Button
                size="sm"
                onClick={() =>
                  toast.success("Status updated", {
                    description: "Moved to the next stage.",
                  })
                }
              >
                <CheckCircle2 />
                {t.orders.detail.advance}
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Timeline */}
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-1.5 sm:gap-4">
                {timelineOrder.map((s, i) => {
                  const done = currentIdx >= i && currentIdx >= 0;
                  const active = currentIdx === i;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-2 text-center">
                        <motion.span
                          initial={{ scale: 0.85 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.08 }}
                          className={cn(
                            "grid size-9 place-items-center rounded-full border-2 transition-all",
                            done
                              ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-sm"
                              : "border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)]",
                            active && !done && "border-[color:var(--color-primary)]"
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <span className="text-xs font-semibold">{i + 1}</span>
                          )}
                        </motion.span>
                        <span
                          className={cn(
                            "text-[10px] font-medium capitalize sm:text-xs",
                            done
                              ? "text-[color:var(--color-foreground)]"
                              : "text-[color:var(--color-muted-foreground)]"
                          )}
                        >
                          {t.orders.status[s]}
                        </span>
                      </div>
                      {i < timelineOrder.length - 1 && (
                        <span
                          className={cn(
                            "h-0.5 flex-1 transition-colors",
                            currentIdx > i
                              ? "bg-[color:var(--color-primary)]"
                              : "bg-[color:var(--color-border)]"
                          )}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>{t.orders.detail.items}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[color:var(--color-border)]">
                {order.items.map((it) => (
                  <div
                    key={it.productId}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-primary)]/12 to-[color:var(--color-accent)]/20 ring-1 ring-inset ring-[color:var(--color-border)]">
                      <span className="text-lg">🌾</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{it.name}</div>
                      <div className="text-xs text-[color:var(--color-muted-foreground)]">
                        {formatCurrency(it.price)} × {it.qty}
                      </div>
                    </div>
                    <div className="font-mono font-semibold tabular-nums">
                      {formatCurrency(it.price * it.qty)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[color:var(--color-border)] px-6 py-4">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[color:var(--color-muted-foreground)]">
                    <dt>{t.orders.detail.subtotal}</dt>
                    <dd className="font-mono tabular-nums">
                      {formatCurrency(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-[color:var(--color-muted-foreground)]">
                    <dt>{t.orders.detail.tax}</dt>
                    <dd className="font-mono tabular-nums">{formatCurrency(tax)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-semibold">
                    <dt>{t.orders.detail.total}</dt>
                    <dd className="font-mono tabular-nums">
                      {formatCurrency(grand)}
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t.orders.detail.notes}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[color:var(--color-muted-foreground)]">
                {order.notes}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-4 text-[color:var(--color-muted-foreground)]" />
                {t.orders.detail.customer}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar name={order.customerName} size="lg" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {order.customerName}
                </div>
                <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                  {order.customerEmail}
                </div>
                <Link
                  href={`/customers/${order.customerId}`}
                  className="mt-1 inline-flex text-xs font-medium text-[color:var(--color-primary)] hover:underline"
                >
                  View profile →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="size-4 text-[color:var(--color-muted-foreground)]" />
                {t.orders.detail.shipping}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[color:var(--color-muted-foreground)]" />
                <span>{order.deliveryAddress}</span>
              </div>
              <div className="text-[color:var(--color-muted-foreground)]">
                {order.shippingMethod}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-4 text-[color:var(--color-muted-foreground)]" />
                {t.orders.detail.payment}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--color-muted-foreground)]">
                  Method
                </span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[color:var(--color-muted-foreground)]">
                  Status
                </span>
                <Badge variant="success">Paid</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
