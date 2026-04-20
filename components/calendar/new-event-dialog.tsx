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
import type { CalendarEventKind } from "@/lib/calendar-mock";
import { calendarKindOptions } from "@/lib/calendar-mock";
import { toDateInputValue, toTimeInputValue } from "./date-utils";

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled date (day) when the dialog opens. */
  initialDate?: Date;
}

export function NewEventDialog({
  open,
  onOpenChange,
  initialDate,
}: NewEventDialogProps) {
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
      toast.error("Title is required");
      return;
    }
    toast.success("Event created", {
      description: `“${title}” has been added to your calendar.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="New event"
        description="Add a harvest, delivery, meeting, inspection or payment to your calendar."
        widthClass="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="contents">
          <DialogBody className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ne-title">Title</Label>
              <Input
                id="ne-title"
                placeholder="e.g. Harvest rice field B"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Kind</Label>
                <Select
                  value={kind}
                  onValueChange={(v) => setKind(v as CalendarEventKind)}
                  options={calendarKindOptions}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ne-date">Date</Label>
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
                <Label htmlFor="ne-start">Start time</Label>
                <Input
                  id="ne-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={allDay}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ne-end">End time</Label>
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
                  All day
                </Label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ne-location">Location</Label>
              <Input
                id="ne-location"
                placeholder="e.g. Nairobi Depot"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ne-desc">Description</Label>
              <Textarea
                id="ne-desc"
                placeholder="Notes, agenda, links…"
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
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
