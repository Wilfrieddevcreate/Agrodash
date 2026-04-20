"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CalendarX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar-mock";
import { eventKindColor, eventKindLabel } from "@/lib/calendar-mock";
import { formatEventTimeRange, formatMonthShort } from "./date-utils";

export interface UpcomingListProps {
  events: CalendarEvent[];
  /** Reference "now" — events after this are considered upcoming. Defaults to now. */
  from?: Date;
  limit?: number;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  /** Render as an agenda view (grouped by day). */
  grouped?: boolean;
}

export function UpcomingList({
  events,
  from,
  limit = 5,
  onEventClick,
  className,
  grouped = false,
}: UpcomingListProps) {
  const reference = from ?? new Date();

  const upcoming = React.useMemo(() => {
    return events
      .filter((e) => new Date(e.end).getTime() >= reference.getTime())
      .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))
      .slice(0, limit);
  }, [events, reference, limit]);

  if (upcoming.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-muted)]/20 px-6 py-10 text-center",
          className
        )}
      >
        <CalendarX className="size-5 text-[color:var(--color-muted-foreground)]" />
        <p className="text-sm font-medium">Nothing scheduled</p>
        <p className="text-xs text-[color:var(--color-muted-foreground)]">
          Your upcoming events will appear here.
        </p>
      </div>
    );
  }

  if (grouped) {
    // Group by local date
    const groups = new Map<string, { date: Date; items: CalendarEvent[] }>();
    for (const e of upcoming) {
      const d = new Date(e.start);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const bucket = groups.get(key);
      if (bucket) bucket.items.push(e);
      else groups.set(key, { date: d, items: [e] });
    }

    return (
      <ul className={cn("flex flex-col gap-4", className)}>
        {[...groups.values()].map((group, gi) => (
          <li key={gi}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-[22px] font-semibold leading-none tabular-nums">
                {group.date.getDate()}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                {formatMonthShort(group.date)} ·{" "}
                {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                  group.date
                )}
              </span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {group.items.map((e, i) => (
                <UpcomingRow
                  key={e.id}
                  event={e}
                  onClick={onEventClick}
                  delay={(gi * 0.05) + (i * 0.03)}
                />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-1.5", className)}>
      {upcoming.map((e, i) => (
        <UpcomingRow
          key={e.id}
          event={e}
          onClick={onEventClick}
          delay={i * 0.04}
        />
      ))}
    </ul>
  );
}

function UpcomingRow({
  event,
  onClick,
  delay = 0,
}: {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  delay?: number;
}) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const color = event.color ?? eventKindColor[event.kind];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={() => onClick?.(event)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg border border-transparent px-2 py-2 text-left transition-all",
          "hover:border-[color:var(--color-border)] hover:bg-[color:var(--color-muted)]/50 hover:shadow-elev-xs",
          "focus-visible:outline-none focus-visible:border-[color:var(--color-ring)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--color-ring)]/20"
        )}
      >
        {/* Date chip */}
        <div
          className="grid size-11 shrink-0 place-items-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-center shadow-elev-xs"
          aria-hidden
        >
          <div className="leading-none">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
              {formatMonthShort(start)}
            </div>
            <div className="mt-0.5 font-mono text-[15px] font-semibold tabular-nums">
              {start.getDate()}
            </div>
          </div>
        </div>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{event.title}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-[color:var(--color-muted-foreground)]">
            <span
              aria-hidden
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="truncate tabular-nums">
              {formatEventTimeRange(start, end, event.allDay)}
            </span>
            <span aria-hidden>·</span>
            <span className="shrink-0 capitalize">
              {eventKindLabel[event.kind]}
            </span>
          </div>
        </div>
      </button>
    </motion.li>
  );
}
