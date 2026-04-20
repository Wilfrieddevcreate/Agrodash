"use client";

import * as React from "react";
import {
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Plug,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { useT } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
 * Static config — icons & chart color keys for the category
 * tiles. Text comes from i18n.
 * ────────────────────────────────────────────────────────── */

type CategoryKey =
  | "gettingStarted"
  | "dashboard"
  | "orders"
  | "invoices"
  | "integrations"
  | "security";

const CATEGORIES: Array<{
  key: CategoryKey;
  icon: React.ElementType;
  /** CSS color expression — used for the icon tile background */
  tone: string;
}> = [
  { key: "gettingStarted", icon: BookOpen, tone: "var(--color-chart-1)" },
  { key: "dashboard", icon: LayoutDashboard, tone: "var(--color-chart-2)" },
  { key: "orders", icon: Truck, tone: "var(--color-chart-3)" },
  { key: "invoices", icon: Receipt, tone: "var(--color-chart-4)" },
  { key: "integrations", icon: Plug, tone: "var(--color-chart-5)" },
  { key: "security", icon: ShieldCheck, tone: "var(--color-chart-6)" },
];

/* ──────────────────────────────────────────────────────────
 * Main page
 * ────────────────────────────────────────────────────────── */

export function HelpPage() {
  const t = useT();
  const [query, setQuery] = React.useState("");
  const [ticketOpen, setTicketOpen] = React.useState(false);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast(t.help.toasts.noResults);
  }

  return (
    <>
      <PageHeader
        eyebrow={t.help.eyebrow}
        title={t.help.title}
        description={t.help.subtitle}
      />

      {/* A. Hero search + popular terms */}
      <Card variant="flat" className="mb-5 border-0 bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-4 px-0 pt-0">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-2xl"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.help.searchPlaceholder}
              className="h-12 rounded-xl pl-11 pr-3 text-[15px] shadow-elev-sm"
            />
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
              {t.help.popular}
            </span>
            {t.help.popularTerms.map((term) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer rounded-full px-2.5 py-1 text-[12px] transition-colors hover:bg-[color:var(--color-muted)]/70"
                onClick={() => {
                  setQuery(term);
                  toast(t.help.toasts.noResults);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setQuery(term);
                    toast(t.help.toasts.noResults);
                  }
                }}
              >
                {term}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* B. Category grid */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const copy = t.help.categories[cat.key];
          return (
            <Card
              key={cat.key}
              variant="elevated"
              className="group cursor-pointer"
              onClick={() => toast(t.help.toasts.noResults)}
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div
                  className="grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-black/5"
                  style={{
                    background: `color-mix(in oklch, ${cat.tone} 18%, transparent)`,
                    color: cat.tone,
                  }}
                >
                  <Icon className="size-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[15px] font-semibold tracking-tight text-[color:var(--color-foreground)]">
                      {copy.title}
                    </h3>
                    <span className="shrink-0 text-[11px] text-[color:var(--color-muted-foreground)]">
                      · {copy.articles}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--color-muted-foreground)]">
                    {copy.desc}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[color:var(--color-primary)] transition-transform duration-200 group-hover:translate-x-0.5">
                    {t.help.browse}
                    <ChevronRight className="size-3.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* C. Popular articles */}
      <Card className="mb-5 sm:mb-6">
        <CardHeader>
          <CardTitle>{t.help.popularArticlesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <ul className="divide-y divide-[color:var(--color-border)]">
            {t.help.articles.map((a, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toast(t.help.toasts.noResults)}
                  className="group relative flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[color:var(--color-muted)]/40"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-[color:var(--color-primary)]/40 transition-colors group-hover:bg-[color:var(--color-primary)]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[color:var(--color-foreground)]">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-[color:var(--color-muted-foreground)]">
                      {a.readTime}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-[color:var(--color-muted-foreground)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--color-foreground)]" />
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* D. FAQ */}
      <Card className="mb-5 sm:mb-6">
        <CardHeader>
          <CardTitle>{t.help.faqTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <ul className="divide-y divide-[color:var(--color-border)]">
            {t.help.faq.map((item, i) => (
              <li key={i}>
                <details className="group">
                  <summary
                    className="flex cursor-pointer list-none items-center gap-3 px-6 py-4 transition-colors hover:bg-[color:var(--color-muted)]/40 [&::-webkit-details-marker]:hidden"
                  >
                    <span className="flex-1 text-sm font-medium text-[color:var(--color-foreground)]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className="grid size-6 place-items-center rounded-full bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-45"
                    >
                      <Plus className="size-3.5" />
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
                    {item.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* E. Contact / feedback */}
      <Card variant="elevated" className="overflow-hidden">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
          <div>
            <div className="mb-2 inline-flex size-9 items-center justify-center rounded-xl bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)]">
              <MessageCircle className="size-4" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-[color:var(--color-foreground)]">
              {t.help.contact.title}
            </h3>
            <p className="mt-1 max-w-md text-[13px] leading-relaxed text-[color:var(--color-muted-foreground)]">
              {t.help.contact.desc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="mailto:support@agrodash.io">
                <Button variant="primary" size="sm">
                  <Mail className="size-3.5" />
                  {t.help.contact.email}
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTicketOpen(true)}
              >
                {t.help.contact.ticketCta}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 rounded-xl bg-[color:var(--color-muted)]/40 p-4 sm:grid-cols-3 lg:grid-cols-1">
            <StatLine label={t.help.stats.responseTime} tone="primary" />
            <StatLine label={t.help.stats.satisfaction} tone="success" />
            <StatLine label={t.help.stats.languages} tone="info" />
          </div>
        </CardContent>
      </Card>

      <TicketDialog open={ticketOpen} onOpenChange={setTicketOpen} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Stat strip item
 * ────────────────────────────────────────────────────────── */

function StatLine({
  label,
  tone,
}: {
  label: string;
  tone: "primary" | "success" | "info";
}) {
  const toneClass = {
    primary: "bg-[color:var(--color-primary)]",
    success: "bg-[color:var(--color-success)]",
    info: "bg-[color:var(--color-info)]",
  }[tone];
  return (
    <div className="flex items-center gap-2.5 px-1 py-1.5 text-[13px] font-medium text-[color:var(--color-foreground)]">
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", toneClass)} />
      <span className="truncate">{label}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Support ticket dialog
 * ────────────────────────────────────────────────────────── */

function TicketDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useT();
  const copy = t.help.contact.ticketDialog;

  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState<string>(copy.categories[0]);
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">(
    "medium"
  );
  const [description, setDescription] = React.useState("");

  // Reset on reopen
  React.useEffect(() => {
    if (open) {
      setSubject("");
      setCategory(copy.categories[0]);
      setPriority("medium");
      setDescription("");
    }
  }, [open, copy.categories]);

  const categoryOptions = React.useMemo(
    () => copy.categories.map((c) => ({ label: c, value: c })),
    [copy.categories]
  );

  const priorityOptions = React.useMemo(
    () => [
      { label: copy.priorities.low, value: "low" },
      { label: copy.priorities.medium, value: "medium" },
      { label: copy.priorities.high, value: "high" },
    ],
    [copy.priorities]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success(copy.toastSuccess, { description: copy.toastSuccessDesc });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={copy.title} widthClass="max-w-xl">
        <form onSubmit={handleSubmit} className="contents">
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ticket-subject">{copy.subjectLabel}</Label>
              <Input
                id="ticket-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{copy.categoryLabel}</Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  options={categoryOptions}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{copy.priorityLabel}</Label>
                <Select
                  value={priority}
                  onValueChange={(v) =>
                    setPriority(v as "low" | "medium" | "high")
                  }
                  options={priorityOptions}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-desc">{copy.descLabel}</Label>
              <Textarea
                id="ticket-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {copy.cancel}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {copy.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
