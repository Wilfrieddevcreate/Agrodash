"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/components/providers/language-provider";
import type { CalendarEventKind } from "@/lib/calendar-mock";
import { toDateInputValue, toTimeInputValue } from "./date-utils";

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled date (day) when the dialog opens. */
  initialDate?: Date;
}

const KIND_VALUES: CalendarEventKind[] = [
  "harvest",
  "planting",
  "delivery",
  "meeting",
  "inspection",
  "payment",
  "training",
];

export function NewEventDialog({
  open,
  onOpenChange,
  initialDate,
}: NewEventDialogProps) {
  const t = useT();
  const [title, setTitle] = React.useState("");
  const [kind, setKind] = React.useState<CalendarEventKind>("meeting");
  const [date, setDate] = React.useState<string>(
    toDateInputValue(initialDate ?? new Date())
  );
  const [startTime, setStartTime] = React.useState<string>("09:00");
  const [endTime, setEndTime] = React.useState<string>("10:00");
  const [allDay, setAllDay] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");

  const kindOptions = React.useMemo(
    () =>
      KIND_VALUES.map((k) => ({
        label: t.calendar.kinds[k],
        value: k,
      })),
    [t.calendar.kinds]
  );

  // Re-sync fields when dialog opens with a different day
  React.useEffect(() => {
    if (!open) return;
    const d = initialDate ?? new Date();
    setDate(toDateInputValue(d));
    // Default time slot: next hour
    const next = new Date(d);
    next.setMinutes(0, 0, 0);
    next.setHours(Math.min(17, next.getHours() === 0 ? 9 : next.getHours() + 1));
    const endD = new Date(next);
    endD.setHours(endD.getHours() + 1);
    setStartTime(toTimeInputValue(next));
    setEndTime(toTimeInputValue(endD));
    setTitle("");
    setKind("meeting");
    setAllDay(false);
    setLocation("");
    setDescription("");
  }, [open, initialDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(t.calendar.toasts.titleRequired);
      return;
    }
    toast.success(t.calendar.toasts.created, {
      description: `${t.calendar.toasts.createdDescPrefix}${title}${t.calendar.toasts.createdDescSuffix}`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t.calendar.form.addTitle}
        description={t.calendar.form.addDescription}
        widthClass="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="contents">
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ne-title">{t.calendar.form.eventTitle}</Label>
              <Input
                id="ne-title"
                placeholder={t.calendar.form.eventTitlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t.calendar.form.kind}</Label>
                <Select
                  value={kind}
                  onValueChange={(v) => setKind(v as CalendarEventKind)}
                  options={kindOptions}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ne-date">{t.calendar.form.date}</Label>
                <Input
                  id="ne-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="space-y-1.5">
                <Label htmlFor="ne-start">{t.calendar.form.startTime}</Label>
                <Input
                  id="ne-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={allDay}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ne-end">{t.calendar.form.endTime}</Label>
                <Input
                  id="ne-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={allDay}
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 px-3 py-2 sm:mb-0.5">
                <Switch
                  id="ne-allday"
                  checked={allDay}
                  onCheckedChange={setAllDay}
                />
                <Label htmlFor="ne-allday" className="cursor-pointer select-none">
                  {t.calendar.form.allDay}
                </Label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ne-location">{t.calendar.form.location}</Label>
              <Input
                id="ne-location"
                placeholder={t.calendar.form.locationPlaceholder}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ne-desc">{t.calendar.form.description}</Label>
              <Textarea
                id="ne-desc"
                placeholder={t.calendar.form.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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
              {t.calendar.form.cancel}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {t.calendar.form.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
