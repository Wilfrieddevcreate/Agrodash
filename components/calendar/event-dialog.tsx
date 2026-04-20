"use client";

import * as React from "react";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useLanguage, useT } from "@/components/providers/language-provider";
import type { CalendarEvent, CalendarEventKind } from "@/lib/calendar-mock";
import { eventKindColor } from "@/lib/calendar-mock";
import { formatDayLong, formatEventTimeRange } from "./date-utils";

interface EventDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDialog({ event, open, onOpenChange }: EventDialogProps) {
  const t = useT();
  const { locale } = useLanguage();
  const localeTag = locale === "fr" ? "fr-FR" : "en-US";

  const kindLabel: Record<CalendarEventKind, string> = {
    harvest: t.calendar.kinds.harvest,
    planting: t.calendar.kinds.planting,
    delivery: t.calendar.kinds.delivery,
    meeting: t.calendar.kinds.meeting,
    inspection: t.calendar.kinds.inspection,
    payment: t.calendar.kinds.payment,
    training: t.calendar.kinds.training,
  };

  if (!event) {
    // Dialog requires children, but when there is no event we also keep it closed,
    // so nothing ever renders. Render an empty fragment to satisfy the contract.
    return (
      <Dialog open={false} onOpenChange={onOpenChange}>
        <></>
      </Dialog>
    );
  }

  const start = new Date(event.start);
  const end = new Date(event.end);
  const color = event.color ?? eventKindColor[event.kind];

  function handleEdit() {
    toast(t.calendar.event.editStubTitle, {
      description: t.calendar.event.editStubDesc,
    });
    onOpenChange(false);
  }

  function handleDelete() {
    toast.success(t.calendar.toasts.deleted, {
      description: event
        ? `${t.calendar.toasts.deletedDescPrefix}${event.title}${t.calendar.toasts.deletedDescSuffix}`
        : undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent widthClass="max-w-lg" showClose>
        {/* Custom header with color bar */}
        <div className="relative shrink-0 border-b border-[color:var(--color-border)] px-5 py-4 pr-12 sm:px-6">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-1"
            style={{ backgroundColor: color }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="capitalize"
              style={{
                color,
                borderColor: `color-mix(in oklab, ${color} 35%, transparent)`,
                backgroundColor: `color-mix(in oklab, ${color} 10%, transparent)`,
              }}
            >
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {kindLabel[event.kind]}
            </Badge>
          </div>
          <h2 className="mt-2 text-base font-semibold leading-tight sm:text-lg">
            {event.title}
          </h2>
        </div>

        <DialogBody className="space-y-4">
          {event.description && (
            <p className="text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
              {event.description}
            </p>
          )}

          <div className="space-y-2.5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 p-3 text-sm">
            <DetailRow icon={<CalendarDays className="size-4" />}>
              <span className="font-medium">
                {formatDayLong(start, localeTag)}
              </span>
            </DetailRow>
            <DetailRow icon={<Clock className="size-4" />}>
              <span className="tabular-nums">
                {formatEventTimeRange(start, end, event.allDay, {
                  locale: localeTag,
                  allDayLabel: t.calendar.allDay,
                })}
              </span>
            </DetailRow>
            {event.location && (
              <DetailRow icon={<MapPin className="size-4" />}>
                <span>{event.location}</span>
              </DetailRow>
            )}
          </div>

          {event.attendees && event.attendees.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                <Users className="size-3.5" />
                {t.calendar.event.attendees} · {event.attendees.length}
              </div>
              <ul className="space-y-2">
                {event.attendees.map((a) => (
                  <li
                    key={a.email ?? a.name}
                    className="flex items-center gap-3 rounded-md px-1.5 py-1 text-sm"
                  >
                    <Avatar name={a.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{a.name}</div>
                      {a.email && (
                        <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                          {a.email}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            {t.calendar.event.delete}
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            {t.calendar.event.edit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)] ring-1 ring-inset ring-[color:var(--color-border)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[color:var(--color-foreground)]">
        {children}
      </span>
    </div>
  );
}
