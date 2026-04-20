"use client";

import * as React from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";

/* ──────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────── */

export interface DateRangeValue {
  from: Date | null;
  to: Date | null;
}

export type DateRangePresetId =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "last12"
  | "custom";

export interface DateRangePreset {
  id: DateRangePresetId;
  label: string;
  /** Returns the range for this preset when applied. `null` means "don't auto-apply" (used for Custom). */
  range: (today: Date) => DateRangeValue | null;
}

export interface DateRangeLabels {
  pickRange: string;
  apply: string;
  reset: string;
  separator: string;
  monthsShort: string[];
  weekdaysShort: string[];
}

export interface DateRangeProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  /** Optional override — if not provided, uses the i18n defaults. */
  presets?: DateRangePreset[];
  /** Optional override — if not provided, uses the i18n defaults. */
  labels?: DateRangeLabels;
  className?: string;
  /** Optional locale for Intl formatting (e.g. "en-US", "fr-FR"). Defaults to the browser. */
  locale?: string;
  /** ARIA label for the trigger. */
  ariaLabel?: string;
}

/* ──────────────────────────────────────────────────────────
 * Date helpers — no external libraries
 * ────────────────────────────────────────────────────────── */

function startOfDay(d: Date): Date {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function endOfDay(d: Date): Date {
  const n = new Date(d);
  n.setHours(23, 59, 59, 999);
  return n;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addDays(d: Date, days: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
}

function addMonths(d: Date, months: number): Date {
  const n = new Date(d);
  const day = n.getDate();
  n.setDate(1);
  n.setMonth(n.getMonth() + months);
  // Clamp day to last day of the new month
  const last = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
  n.setDate(Math.min(day, last));
  return n;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(d: Date, from: Date, to: Date): boolean {
  const t = startOfDay(d).getTime();
  return t >= startOfDay(from).getTime() && t <= startOfDay(to).getTime();
}

function eachDayOfInterval(from: Date, to: Date): Date[] {
  const out: Date[] = [];
  let cur = startOfDay(from);
  const end = startOfDay(to);
  while (cur.getTime() <= end.getTime()) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

/** Returns a 6×7 grid of Dates for the given month, starting on Monday. */
function buildMonthGrid(month: Date): Date[] {
  const first = startOfMonth(month);
  // getDay(): 0 = Sunday, 1 = Monday, … Monday-first offset:
  const offset = (first.getDay() + 6) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

/* ──────────────────────────────────────────────────────────
 * Preset factory — uses a `today` param so SSR/initial render
 * is safe and deterministic against the caller's clock.
 * ────────────────────────────────────────────────────────── */

function defaultPresetsFactory(
  t: ReturnType<typeof useT>["dateRange"]["presets"]
): DateRangePreset[] {
  return [
    {
      id: "today",
      label: t.today,
      range: (today) => ({ from: startOfDay(today), to: endOfDay(today) }),
    },
    {
      id: "yesterday",
      label: t.yesterday,
      range: (today) => {
        const y = addDays(today, -1);
        return { from: startOfDay(y), to: endOfDay(y) };
      },
    },
    {
      id: "last7",
      label: t.last7,
      range: (today) => ({
        from: startOfDay(addDays(today, -6)),
        to: endOfDay(today),
      }),
    },
    {
      id: "last30",
      label: t.last30,
      range: (today) => ({
        from: startOfDay(addDays(today, -29)),
        to: endOfDay(today),
      }),
    },
    {
      id: "thisMonth",
      label: t.thisMonth,
      range: (today) => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
    },
    {
      id: "lastMonth",
      label: t.lastMonth,
      range: (today) => {
        const prev = addMonths(today, -1);
        return { from: startOfMonth(prev), to: endOfMonth(prev) };
      },
    },
    {
      id: "thisQuarter",
      label: t.thisQuarter,
      range: (today) => {
        const q = Math.floor(today.getMonth() / 3);
        const from = new Date(today.getFullYear(), q * 3, 1);
        const to = endOfMonth(new Date(today.getFullYear(), q * 3 + 2, 1));
        return { from, to };
      },
    },
    {
      id: "last12",
      label: t.last12,
      range: (today) => ({
        from: startOfDay(addMonths(today, -12)),
        to: endOfDay(today),
      }),
    },
    {
      id: "custom",
      label: t.custom,
      range: () => null,
    },
  ];
}

/* ──────────────────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────────────────── */

export function DateRange({
  value,
  onChange,
  presets,
  labels,
  className,
  locale,
  ariaLabel,
}: DateRangeProps) {
  const t = useT();
  const dr = t.dateRange;

  const resolvedLabels: DateRangeLabels = labels ?? {
    pickRange: dr.pickRange,
    apply: dr.apply,
    reset: dr.reset,
    separator: dr.separator,
    monthsShort: [...dr.monthsShort],
    weekdaysShort: [...dr.weekdaysShort],
  };

  const resolvedPresets = React.useMemo<DateRangePreset[]>(
    () => presets ?? defaultPresetsFactory(dr.presets),
    [presets, dr.presets]
  );

  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Draft range while the popover is open (committed on Apply/preset click)
  const [draft, setDraft] = React.useState<DateRangeValue>(value);

  // SSR-safe: only initialize "viewMonth" on the client.
  const [viewMonth, setViewMonth] = React.useState<Date | null>(null);
  const [isDesktop, setIsDesktop] = React.useState<boolean>(true);
  // Two-calendar view needs ~665px of room; collapse to one below that.
  const [showTwoMonths, setShowTwoMonths] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Defer Date-based initialization to the client.
    setViewMonth(value.from ?? startOfMonth(new Date()));
    const mq = window.matchMedia("(min-width: 640px)");
    const mqWide = window.matchMedia("(min-width: 900px)");
    setIsDesktop(mq.matches);
    setShowTwoMonths(mqWide.matches);
    const onChangeMq = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    const onChangeWide = (e: MediaQueryListEvent) => setShowTwoMonths(e.matches);
    mq.addEventListener("change", onChangeMq);
    mqWide.addEventListener("change", onChangeWide);
    return () => {
      mq.removeEventListener("change", onChangeMq);
      mqWide.removeEventListener("change", onChangeWide);
    };
  }, [value.from]);

  // Keep draft in sync when value changes from outside or popover reopens
  React.useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  // Click-outside + Escape
  React.useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [locale]
  );

  const triggerLabel = React.useMemo(() => {
    if (value.from && value.to) {
      const sameYear = value.from.getFullYear() === value.to.getFullYear();
      if (sameYear) {
        const shortFmt = new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "short",
        });
        return `${shortFmt.format(value.from)}${resolvedLabels.separator}${formatter.format(
          value.to
        )}`;
      }
      return `${formatter.format(value.from)}${resolvedLabels.separator}${formatter.format(
        value.to
      )}`;
    }
    return `— ${resolvedLabels.pickRange}`;
  }, [value.from, value.to, formatter, locale, resolvedLabels.pickRange, resolvedLabels.separator]);

  function applyPreset(p: DateRangePreset) {
    const range = p.range(new Date());
    if (range) {
      onChange(range);
      setDraft(range);
      setOpen(false);
      if (range.from) setViewMonth(startOfMonth(range.from));
    }
    // Custom preset just focuses the calendar — do nothing here
  }

  function handleDayClick(day: Date, shift: boolean) {
    const d = startOfDay(day);
    if (shift && draft.from && !draft.to) {
      // Shift-click → set end anchored to current start
      if (d.getTime() < draft.from.getTime()) {
        setDraft({ from: d, to: endOfDay(draft.from) });
      } else {
        setDraft({ from: draft.from, to: endOfDay(d) });
      }
      return;
    }

    if (!draft.from || (draft.from && draft.to)) {
      // Start new selection
      setDraft({ from: d, to: null });
      return;
    }

    // Have `from` but no `to` → finalize
    if (d.getTime() < draft.from.getTime()) {
      setDraft({ from: d, to: endOfDay(draft.from) });
    } else {
      setDraft({ from: draft.from, to: endOfDay(d) });
    }
  }

  function handleApply() {
    if (draft.from && !draft.to) {
      onChange({ from: draft.from, to: endOfDay(draft.from) });
    } else {
      onChange(draft);
    }
    setOpen(false);
  }

  function handleReset() {
    const empty: DateRangeValue = { from: null, to: null };
    setDraft(empty);
    onChange(empty);
  }

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      {/* Trigger — mirrors Button variant="outline" size="sm" */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel ?? resolvedLabels.pickRange}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3.5 text-[13px] font-medium shadow-elev-xs",
          "text-[color:var(--color-foreground)]",
          "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:bg-[color:var(--color-muted)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]",
          "data-[open=true]:border-[color:var(--color-ring)]"
        )}
        data-open={open}
      >
        <Calendar className="size-3.5 text-[color:var(--color-muted-foreground)]" />
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-[color:var(--color-muted-foreground)] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && viewMonth && (
        <div
          role="dialog"
          aria-label={resolvedLabels.pickRange}
          className={cn(
            // end-0 (logical) anchors to the inline-end edge of the trigger —
            // extends leftward in LTR, rightward in RTL — keeping the panel
            // inside the viewport when the trigger sits near the end of a toolbar.
            "animate-fade-in-up absolute end-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-popover)] shadow-elev-lg",
            // Mobile: full-ish width near trigger. Desktop: big 2-column.
            "w-[min(92vw,320px)] sm:w-auto"
          )}
          style={{
            // Soft clamp so popover doesn't escape viewport on narrow triggers
            maxWidth: "calc(100vw - 24px)",
          }}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Presets */}
            <PresetList
              presets={resolvedPresets}
              draft={draft}
              onApply={applyPreset}
              isDesktop={isDesktop}
            />

            {/* Calendar (desktop) */}
            {isDesktop && (
              <div className="flex flex-col border-t border-[color:var(--color-border)] sm:border-l sm:border-t-0">
                <div className="flex items-start gap-4 p-3">
                  <MonthCalendar
                    month={viewMonth}
                    draft={draft}
                    labels={resolvedLabels}
                    onDayClick={handleDayClick}
                    onPrev={() => setViewMonth(addMonths(viewMonth, -1))}
                    onNext={() => setViewMonth(addMonths(viewMonth, 1))}
                    showPrev
                    showNext={!showTwoMonths}
                  />
                  {showTwoMonths && (
                    <MonthCalendar
                      month={addMonths(viewMonth, 1)}
                      draft={draft}
                      labels={resolvedLabels}
                      onDayClick={handleDayClick}
                      onPrev={() => setViewMonth(addMonths(viewMonth, -1))}
                      onNext={() => setViewMonth(addMonths(viewMonth, 1))}
                      showPrev={false}
                      showNext
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-muted)]/40 px-3 py-2">
                  <div className="text-[11px] text-[color:var(--color-muted-foreground)]">
                    {draft.from && draft.to
                      ? `${formatter.format(draft.from)}${resolvedLabels.separator}${formatter.format(draft.to)}`
                      : draft.from
                        ? formatter.format(draft.from)
                        : resolvedLabels.pickRange}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={handleReset}
                    >
                      {resolvedLabels.reset}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="xs"
                      onClick={handleApply}
                      disabled={!draft.from}
                    >
                      {resolvedLabels.apply}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile action row (presets already include all ranges as chips) */}
          {!isDesktop && (
            <div className="flex items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-muted)]/40 px-3 py-2">
              <Button type="button" variant="ghost" size="xs" onClick={handleReset}>
                {resolvedLabels.reset}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Preset list — vertical on desktop, chip grid on mobile
 * ────────────────────────────────────────────────────────── */

function PresetList({
  presets,
  draft,
  onApply,
  isDesktop,
}: {
  presets: DateRangePreset[];
  draft: DateRangeValue;
  onApply: (p: DateRangePreset) => void;
  isDesktop: boolean;
}) {
  const today = React.useMemo(() => new Date(), []);

  function isPresetActive(p: DateRangePreset): boolean {
    if (p.id === "custom") return false;
    if (!draft.from || !draft.to) return false;
    const r = p.range(today);
    if (!r || !r.from || !r.to) return false;
    return sameDay(r.from, draft.from) && sameDay(r.to, draft.to);
  }

  if (!isDesktop) {
    // Chip grid on mobile
    return (
      <div className="grid grid-cols-2 gap-1.5 p-2">
        {presets.map((p) => {
          const active = isPresetActive(p);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onApply(p)}
              className={cn(
                "inline-flex h-8 items-center justify-center rounded-full px-3 text-[12px] font-medium transition-colors",
                active
                  ? "bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/25"
                  : "bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]/70 ring-1 ring-inset ring-[color:var(--color-border)]"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex w-40 shrink-0 flex-col gap-0.5 p-1.5">
      {presets.map((p) => {
        const active = isPresetActive(p);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onApply(p)}
            className={cn(
              "flex h-8 items-center rounded-md px-2.5 text-left text-[13px] transition-colors",
              active
                ? "bg-[color:var(--color-primary)]/10 font-semibold text-[color:var(--color-primary)]"
                : "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]"
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Month calendar
 * ────────────────────────────────────────────────────────── */

function MonthCalendar({
  month,
  draft,
  labels,
  onDayClick,
  onPrev,
  onNext,
  showPrev,
  showNext,
}: {
  month: Date;
  draft: DateRangeValue;
  labels: DateRangeLabels;
  onDayClick: (day: Date, shift: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  showPrev: boolean;
  showNext: boolean;
}) {
  const grid = React.useMemo(() => buildMonthGrid(month), [month]);
  const monthLabel = `${labels.monthsShort[month.getMonth()]} ${month.getFullYear()}`;

  return (
    <div className="w-[232px]">
      {/* Header */}
      <div className="mb-1.5 flex h-7 items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous month"
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
            !showPrev && "invisible"
          )}
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-[13px] font-semibold tracking-tight">
          {monthLabel}
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next month"
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
            !showNext && "invisible"
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {labels.weekdaysShort.map((w) => (
          <div
            key={w}
            className="flex h-6 items-center justify-center text-[10px] font-medium uppercase tracking-wider text-[color:var(--color-muted-foreground)]"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((day) => {
          const inMonth = day.getMonth() === month.getMonth();
          const isStart = draft.from && sameDay(day, draft.from);
          const isEnd = draft.to && sameDay(day, draft.to);
          const inRange =
            draft.from &&
            draft.to &&
            isInRange(day, draft.from, draft.to) &&
            !isStart &&
            !isEnd;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={(e) => onDayClick(day, e.shiftKey)}
              disabled={!inMonth}
              className={cn(
                "relative flex h-8 items-center justify-center rounded-md text-[12px] font-medium tabular-nums transition-colors",
                // Out-of-month days — still click-safe but visually muted
                !inMonth && "opacity-0 pointer-events-none",
                inMonth &&
                  !isStart &&
                  !isEnd &&
                  !inRange &&
                  "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]",
                inRange &&
                  "bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)]",
                (isStart || isEnd) &&
                  "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-elev-xs"
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
