"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Mail,
  Phone,
  Printer,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Logo } from "@/components/layout/logo";
import { invoices } from "@/lib/invoices-mock";
import { customers } from "@/lib/mock-data";
import type { InvoiceStatus } from "@/lib/types";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

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

interface TimelineEvent {
  label: string;
  description?: string;
  date: string;
  tone: "done" | "pending" | "muted";
  icon: React.ReactNode;
}

function buildTimeline(
  status: InvoiceStatus,
  issueDate: string,
  dueDate: string,
  paidAt: string | undefined
): TimelineEvent[] {
  const MS_HOUR = 60 * 60 * 1000;
  const issueMs = new Date(issueDate).getTime();
  const sentMs = new Date(issueMs + 2 * MS_HOUR).toISOString();
  const reminderMs = new Date(issueMs + 10 * 24 * 60 * 60 * 1000).toISOString();

  const events: TimelineEvent[] = [
    {
      label: "Invoice issued",
      description: "Drafted and saved to the ledger.",
      date: issueDate,
      tone: "done",
      icon: <FileText className="size-3.5" />,
    },
  ];

  if (status !== "draft") {
    events.push({
      label: "Sent to customer",
      description: "Delivered by email with payment link.",
      date: sentMs,
      tone: "done",
      icon: <Send className="size-3.5" />,
    });
  }

  if (status === "overdue") {
    events.push({
      label: "Reminder sent",
      description: "Automatic follow-up emailed.",
      date: reminderMs,
      tone: "done",
      icon: <Send className="size-3.5" />,
    });
    events.push({
      label: "Payment overdue",
      description: `Past due since ${formatDate(dueDate)}`,
      date: dueDate,
      tone: "pending",
      icon: <CheckCircle2 className="size-3.5" />,
    });
  } else if (status === "paid" && paidAt) {
    events.push({
      label: "Payment received",
      description: "Marked as paid in full.",
      date: paidAt,
      tone: "done",
      icon: <BadgeCheck className="size-3.5" />,
    });
  } else if (status === "sent") {
    events.push({
      label: "Awaiting payment",
      description: `Due on ${formatDate(dueDate)}`,
      date: dueDate,
      tone: "muted",
      icon: <CheckCircle2 className="size-3.5" />,
    });
  } else if (status === "void") {
    events.push({
      label: "Invoice voided",
      description: "Cancelled and removed from receivables.",
      date: sentMs,
      tone: "pending",
      icon: <CheckCircle2 className="size-3.5" />,
    });
  } else {
    events.push({
      label: "Pending send-out",
      description: "Draft is awaiting review.",
      date: issueDate,
      tone: "muted",
      icon: <CheckCircle2 className="size-3.5" />,
    });
  }

  return events;
}

export function InvoiceDetail({ id }: { id: string }) {
  const invoice = invoices.find((i) => i.id === id);
  if (!invoice) notFound();

  const customer = customers.find((c) => c.id === invoice.customerId);
  const timeline = buildTimeline(
    invoice.status,
    invoice.issueDate,
    invoice.dueDate,
    invoice.paidAt
  );

  const canMarkPaid =
    invoice.status !== "paid" && invoice.status !== "void";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/invoices"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:text-[color:var(--color-foreground)]"
      >
        <ArrowLeft className="size-4" />
        Back to invoices
      </Link>

      <PageHeader
        eyebrow={`Invoice · ${statusLabel[invoice.status]}`}
        title={invoice.number}
        description={`Issued ${formatDate(invoice.issueDate)} · Due ${formatDate(
          invoice.dueDate
        )}`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Sending to printer", {
                  description: `${invoice.number} is queued for print.`,
                })
              }
            >
              <Printer />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Download started", {
                  description: `${invoice.number}.pdf is being generated…`,
                })
              }
            >
              <Download />
              Download PDF
            </Button>
            {canMarkPaid && (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  toast.success("Marked as paid", {
                    description: `${invoice.number} reconciled.`,
                  })
                }
              >
                <BadgeCheck />
                Mark as paid
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_1fr] lg:gap-6">
        {/* Left: main invoice */}
        <div className="space-y-4">
          <Card variant="elevated" className="overflow-hidden">
            {/* Brand header */}
            <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8 sm:py-7">
              <div>
                <Logo iconOnly={false} />
                <div className="mt-3 max-w-xs text-[11.5px] leading-relaxed text-[color:var(--color-muted-foreground)]">
                  AgroDash Inc. · 42 Harvest Lane, Dakar
                  <br />
                  invoice@agrodash.io · +221 33 820 0042
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-foreground)]">
                  Invoice
                </div>
                <div className="mt-1 font-mono text-[15px] font-semibold">
                  {invoice.number}
                </div>
                <div className="mt-2">
                  <Badge variant={statusVariant[invoice.status]}>
                    {statusLabel[invoice.status]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bill to + dates */}
            <CardContent className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-8">
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 p-5">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-foreground)]">
                  Bill to
                </div>
                <div className="mt-2 text-sm font-semibold">
                  {invoice.customerName}
                </div>
                <div className="mt-0.5 text-sm text-[color:var(--color-muted-foreground)]">
                  {invoice.customerEmail}
                </div>
                <div className="mt-0.5 text-sm text-[color:var(--color-muted-foreground)]">
                  {invoice.customerAddress}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-1 sm:gap-2">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-foreground)]">
                    Issue date
                  </div>
                  <div className="mt-1 font-medium">
                    {formatDate(invoice.issueDate)}
                  </div>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-foreground)]">
                    Due date
                  </div>
                  <div className="mt-1 font-medium">
                    {formatDate(invoice.dueDate)}
                  </div>
                </div>
                {invoice.paidAt && (
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-foreground)]">
                      Paid on
                    </div>
                    <div className="mt-1 font-medium text-[color:var(--color-success)]">
                      {formatDate(invoice.paidAt)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            {/* Line items */}
            <div className="border-t border-[color:var(--color-border)]">
              <div className="hidden grid-cols-12 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-muted-foreground)] sm:grid sm:px-8">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Unit price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <div className="divide-y divide-[color:var(--color-border)]">
                {invoice.items.map((it) => (
                  <div
                    key={it.productId}
                    className="grid grid-cols-12 items-center gap-3 px-5 py-4 sm:px-8"
                  >
                    <div className="col-span-12 flex items-center gap-3 sm:col-span-6">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-primary)]/12 to-[color:var(--color-accent)]/20 ring-1 ring-inset ring-[color:var(--color-border)]">
                        <span>🌾</span>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {it.name}
                        </div>
                        <div className="text-xs text-[color:var(--color-muted-foreground)] sm:hidden">
                          {it.qty} × {formatCurrency(it.unitPrice, invoice.currency)}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-4 hidden text-right font-mono tabular-nums sm:col-span-2 sm:block">
                      {it.qty}
                    </div>
                    <div className="col-span-4 hidden text-right font-mono tabular-nums sm:col-span-2 sm:block">
                      {formatCurrency(it.unitPrice, invoice.currency)}
                    </div>
                    <div className="col-span-12 text-right font-mono text-sm font-semibold tabular-nums sm:col-span-2">
                      {formatCurrency(it.qty * it.unitPrice, invoice.currency)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-muted)]/20 px-5 py-5 sm:px-8">
                <div className="ml-auto w-full max-w-sm space-y-1.5 text-sm">
                  <div className="flex justify-between text-[color:var(--color-muted-foreground)]">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums">
                      {formatCurrency(invoice.subtotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[color:var(--color-muted-foreground)]">
                    <span>Tax (7.5%)</span>
                    <span className="font-mono tabular-nums">
                      {formatCurrency(invoice.tax, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-[color:var(--color-border)] pt-2">
                    <span className="text-sm font-semibold">Total due</span>
                    <span className="font-mono text-lg font-semibold tabular-nums">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
                {invoice.notes}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: side cards */}
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-[color:var(--color-muted-foreground)]" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--color-muted-foreground)]">
                  Current
                </span>
                <Badge variant={statusVariant[invoice.status]}>
                  {statusLabel[invoice.status]}
                </Badge>
              </div>
              {invoice.paidAt ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[color:var(--color-muted-foreground)]">
                    Paid on
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(invoice.paidAt)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[color:var(--color-muted-foreground)]">
                    Due on
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--color-muted-foreground)]">
                  Amount
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-4 text-[color:var(--color-muted-foreground)]" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name={invoice.customerName} size="lg" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {invoice.customerName}
                  </div>
                  <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                    {invoice.customerEmail}
                  </div>
                </div>
              </div>
              {customer?.phone && (
                <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted-foreground)]">
                  <Phone className="size-3.5" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted-foreground)]">
                <Mail className="size-3.5" />
                <span className="truncate">{invoice.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted-foreground)]">
                <Building2 className="size-3.5" />
                <span className="truncate">{invoice.customerAddress}</span>
              </div>
              <Link
                href={`/customers/${invoice.customerId}`}
                className="inline-flex text-xs font-medium text-[color:var(--color-primary)] hover:underline"
              >
                View customer profile →
              </Link>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-4 text-[color:var(--color-muted-foreground)]" />
                Payment details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--color-muted-foreground)]">
                  Method
                </span>
                <span className="font-medium">Mobile Money · Wave</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--color-muted-foreground)]">
                  Reference
                </span>
                <span className="font-mono text-xs">
                  WAV-{invoice.id.toUpperCase().replace("INV_", "")}-
                  {invoice.number.slice(-4)}
                </span>
              </div>
              {invoice.paidAt ? (
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--color-muted-foreground)]">
                    Settled
                  </span>
                  <span className="text-xs text-[color:var(--color-success)]">
                    {formatDateTime(invoice.paidAt)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--color-muted-foreground)]">
                    Settled
                  </span>
                  <span className="text-xs text-[color:var(--color-muted-foreground)]">
                    Not yet
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-6">
              <ol className="relative space-y-4 border-l border-[color:var(--color-border)] pl-5">
                {timeline.map((event, idx) => (
                  <li key={idx} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[27px] top-0.5 grid size-5 place-items-center rounded-full border-2",
                        event.tone === "done"
                          ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]"
                          : event.tone === "pending"
                            ? "border-[color:var(--color-warning)] bg-[color:var(--color-card)] text-[color:var(--color-warning)]"
                            : "border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)]"
                      )}
                    >
                      {event.icon}
                    </span>
                    <div className="text-sm font-medium">{event.label}</div>
                    {event.description && (
                      <div className="mt-0.5 text-xs text-[color:var(--color-muted-foreground)]">
                        {event.description}
                      </div>
                    )}
                    <div className="mt-0.5 text-[11px] text-[color:var(--color-muted-foreground)]">
                      {formatDate(event.date)}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
