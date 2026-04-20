"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { calendarEvents, type CalendarEvent } from "@/lib/calendar-mock";
import { MonthGrid } from "./month-grid";
import { UpcomingList } from "./upcoming-list";
import { EventDialog } from "./event-dialog";
import { NewEventDialog } from "./new-event-dialog";
import { addMonths, formatMonthYear, startOfMonth } from "./date-utils";
import { cn } from "@/lib/utils";

type ViewKey = "month" | "week" | "day";

export function CalendarPage() {
  // Anchor the initial month on the seeded "today" (April 2026) so the grid
  // renders the same on server and client — `today` below is client-only.
  const [cursor, setCursor] = React.useState<Date>(
    () => new Date(2026, 3, 1, 0, 0, 0, 0)
  );
  const [view, setView] = React.useState<ViewKey>("month");

  // today (real) — resolved only after mount so SSR output stays stable.
  const [today, setToday] = React.useState<Date | undefined>(undefined);
  React.useEffect(() => {
    setToday(new Date());
  }, []);

  // Dialog state
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(
    null
  );
  const [eventDialogOpen, setEventDialogOpen] = React.useState(false);
  const [newEventOpen, setNewEventOpen] = React.useState(false);
  const [newEventDate, setNewEventDate] = React.useState<Date | undefined>(
    undefined
  );

  function handleCellClick(d: Date) {
    setNewEventDate(d);
    setNewEventOpen(true);
  }

  function handleEventClick(e: CalendarEvent) {
    setSelectedEvent(e);
    setEventDialogOpen(true);
  }

  function goToToday() {
    setCursor(startOfMonth(today ?? new Date()));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <PageHeader
        eyebrow="Planning"
        title="Calendar"
        description="Track harvests, deliveries, inspections and payments across your operation."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter />
              Filters
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setNewEventDate(today ?? new Date());
                setNewEventOpen(true);
              }}
            >
              <Plus />
              New event
            </Button>
          </>
        }
      />

      {/* Toolbar */}
      <Tabs value={view} onValueChange={(v) => setView(v as ViewKey)}>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-0.5 shadow-elev-xs">
              <Button
                variant="ghost"
                size="iconSm"
                aria-label="Previous month"
                onClick={() => setCursor(addMonths(cursor, -1))}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={goToToday}
                className="px-3"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                aria-label="Next month"
                onClick={() => setCursor(addMonths(cursor, 1))}
              >
                <ChevronRight />
              </Button>
            </div>
            <h2 className="text-base font-semibold sm:text-lg">
              {formatMonthYear(cursor)}
            </h2>
          </div>

          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="month">
          <ResponsiveLayout
            grid={
              <Card className="overflow-hidden p-0 shadow-elev-sm" variant="flat">
                <MonthGrid
                  currentDate={cursor}
                  events={calendarEvents}
                  onCellClick={handleCellClick}
                  onEventClick={handleEventClick}
                  today={today}
                  className="rounded-none border-0"
                />
              </Card>
            }
            aside={
              <UpcomingCard
                events={calendarEvents}
                onEventClick={handleEventClick}
                today={today}
              />
            }
            mobileAgenda={
              <MobileAgenda
                events={calendarEvents}
                onEventClick={handleEventClick}
                today={today}
              />
            }
          />
        </TabsContent>

        <TabsContent value="week">
          <ViewPlaceholder
            label="Week"
            description="A week-long timeline view is on the way. For now, use the month grid or the agenda list."
          />
        </TabsContent>

        <TabsContent value="day">
          <ViewPlaceholder
            label="Day"
            description="A detailed day view is on the way. For now, tap any day in the month grid to add or inspect events."
          />
        </TabsContent>
      </Tabs>

      <EventDialog
        event={selectedEvent}
        open={eventDialogOpen}
        onOpenChange={(o) => {
          setEventDialogOpen(o);
          if (!o) setSelectedEvent(null);
        }}
      />
      <NewEventDialog
        open={newEventOpen}
        onOpenChange={setNewEventOpen}
        initialDate={newEventDate}
      />
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
 * Layout helpers
 * ────────────────────────────────────────────────────────── */

function ResponsiveLayout({
  grid,
  aside,
  mobileAgenda,
}: {
  grid: React.ReactNode;
  aside: React.ReactNode;
  mobileAgenda: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile: agenda list only */}
      <div className="md:hidden">{mobileAgenda}</div>
      {/* md+: grid + side column */}
      <div className="hidden gap-4 md:grid md:grid-cols-[1fr_320px]">
        <div className="min-w-0">{grid}</div>
        <div className="min-w-0">{aside}</div>
      </div>
    </>
  );
}

function UpcomingCard({
  events,
  onEventClick,
  today,
  className,
}: {
  events: CalendarEvent[];
  onEventClick: (e: CalendarEvent) => void;
  today?: Date;
  className?: string;
}) {
  return (
    <Card className={cn("sticky top-4", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Upcoming this week</CardTitle>
        <CardDescription>
          The next events on your calendar.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <UpcomingList
          events={events}
          from={today}
          limit={5}
          onEventClick={onEventClick}
        />
      </CardContent>
    </Card>
  );
}

function MobileAgenda({
  events,
  onEventClick,
  today,
}: {
  events: CalendarEvent[];
  onEventClick: (e: CalendarEvent) => void;
  today?: Date;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Agenda</CardTitle>
        <CardDescription>
          Your upcoming events, grouped by day.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <UpcomingList
          events={events}
          from={today}
          limit={12}
          onEventClick={onEventClick}
          grouped
        />
      </CardContent>
    </Card>
  );
}

function ViewPlaceholder({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <EmptyState
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x={3} y={4} width={18} height={18} rx={2} />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      }
      title={`${label} view — Coming soon`}
      description={description}
    />
  );
}
