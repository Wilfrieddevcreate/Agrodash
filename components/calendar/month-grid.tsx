"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar-mock";
import { useT } from "@/components/providers/language-provider";
import {
  daysInMonthGrid,
  isSameDay,
  isSameMonth,
} from "./date-utils";
import { EventPill } from "./event-pill";

export interface MonthGridProps {
  /** Any date inside the month to render. */
  currentDate: Date;
  events: CalendarEvent[];
  /** Called when an empty area of a day cell is clicked. */
  onCellClick?: (date: Date) => void;
  /** Called when an event pill is clicked. */
  onEventClick?: (event: CalendarEvent) => void;
  /** The "today" anchor — resolved by parent (client-only) to avoid hydration issues. */
  today?: Date;
  className?: string;
}

const MAX_PILLS_PER_CELL = 3;

export function MonthGrid({
  currentDate,
  events,
  onCellClick,
  onEventClick,
  today,
  className,
}: MonthGridProps) {
  const t = useT();
  const weekdays = [
    t.calendar.weekdays.mon,
    t.calendar.weekdays.tue,
    t.calendar.weekdays.wed,
    t.calendar.weekdays.thu,
    t.calendar.weekdays.fri,
    t.calendar.weekdays.sat,
    t.calendar.weekdays.sun,
  ];
  const cells = React.useMemo(() => daysInMonthGrid(currentDate), [currentDate]);

  // Index events by local YYYY-MM-DD of their start date for fast lookup.
  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const d = new Date(e.start);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const bucket = map.get(key);
      if (bucket) bucket.push(e);
      else map.set(key, [e]);
    }
    // Sort each bucket by start time (all-day first, then chronological)
    for (const bucket of map.values()) {
      bucket.sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return a.start < b.start ? -1 : a.start > b.start ? 1 : 0;
      });
    }
    return map;
  }, [events]);

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]",
        className
      )}
    >
      {/* Weekday header */}
      <div
        role="row"
        className="grid grid-cols-7 border-b border-[color:var(--color-border)] bg-[color:var(--color-muted)]/40"
      >
        {weekdays.map((w) => (
          <div
            key={w}
            role="columnheader"
            className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]"
          >
            {w}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-7 grid-rows-6"
        >
          {cells.map((cell, i) => {
            const key = `${cell.getFullYear()}-${cell.getMonth()}-${cell.getDate()}`;
            const dayEvents = eventsByDay.get(key) ?? [];
            const visible = dayEvents.slice(0, MAX_PILLS_PER_CELL);
            const overflow = dayEvents.length - visible.length;
            const inMonth = isSameMonth(cell, currentDate);
            const isTodayCell = today ? isSameDay(cell, today) : false;
            const isWeekend = i % 7 >= 5;

            return (
              <button
                type="button"
                key={key + "-" + i}
                onClick={() => onCellClick?.(cell)}
                className={cn(
                  "group relative flex min-h-[112px] flex-col gap-1 border-b border-r border-[color:var(--color-border)] p-1.5 text-left",
                  "transition-colors hover:bg-[color:var(--color-muted)]/40",
                  "focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-ring)]/40",
                  // Remove right border on last column, bottom border on last row
                  (i + 1) % 7 === 0 && "border-r-0",
                  i >= 35 && "border-b-0",
                  !inMonth && "bg-[color:var(--color-muted)]/20",
                  isWeekend && inMonth && "bg-[color:var(--color-muted)]/10",
                  isTodayCell &&
                    "bg-[color:var(--color-primary)]/6 ring-1 ring-inset ring-[color:var(--color-primary)]/40"
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-end px-1 pt-0.5">
                  <span
                    className={cn(
                      "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[12px] font-semibold tabular-nums",
                      !inMonth && "text-[color:var(--color-muted-foreground)]/60",
                      inMonth &&
                        !isTodayCell &&
                        "text-[color:var(--color-foreground)]",
                      isTodayCell &&
                        "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-elev-xs"
                    )}
                  >
                    {cell.getDate()}
                  </span>
                </div>

                {/* Event pills */}
                <div className="flex flex-col gap-0.5">
                  {visible.map((e) => (
                    <EventPill
                      key={e.id}
                      event={e}
                      onClick={onEventClick}
                    />
                  ))}
                  {overflow > 0 && (
                    <span
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onCellClick?.(cell);
                      }}
                      className="ml-1 mt-0.5 text-[11px] font-medium text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                    >
                      +{overflow} {t.calendar.grid.more}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
