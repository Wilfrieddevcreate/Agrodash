"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "@/lib/calendar-mock";
import { eventKindColor } from "@/lib/calendar-mock";
import { cn } from "@/lib/utils";
import { formatTime } from "./date-utils";

export interface EventPillProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  /** Compact variant used inside tight month cells. */
  compact?: boolean;
  className?: string;
}

export function EventPill({
  event,
  onClick,
  compact = true,
  className,
}: EventPillProps) {
  const color = event.color ?? eventKindColor[event.kind];
  const start = new Date(event.start);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    onClick?.(event);
  }

  return (
    <motion.button
      layout
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex w-full items-center gap-1.5 overflow-hidden rounded-md pl-2 pr-1.5 py-1 text-left",
        "bg-[color:var(--color-muted)]/40 hover:bg-[color:var(--color-muted)] hover:shadow-elev-xs",
        "text-[color:var(--color-foreground)] transition-[background-color,box-shadow]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40",
        compact ? "text-[11px] leading-4" : "text-xs leading-5",
        className
      )}
      title={event.title}
    >
      {/* Left color bar */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] rounded-l-md"
        style={{ backgroundColor: color }}
      />
      {!event.allDay && (
        <span className="shrink-0 font-mono tabular-nums text-[color:var(--color-muted-foreground)]">
          {formatTime(start)}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate font-medium">{event.title}</span>
    </motion.button>
  );
}
