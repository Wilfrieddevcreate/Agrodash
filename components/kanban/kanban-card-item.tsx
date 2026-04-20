"use client";

import * as React from "react";
import { CalendarClock, Flame, MessageSquare, Paperclip } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { useLanguage, useT } from "@/components/providers/language-provider";
import type { Dictionary } from "@/lib/i18n";
import { cn, formatDate } from "@/lib/utils";
import type {
  KanbanCard,
  KanbanLabel,
  KanbanPriority,
} from "@/lib/kanban-mock";

// Stable anchor so SSR + client produce identical relative date chips.
const NOW_MS = new Date("2026-04-20T10:00:00.000Z").getTime();

const priorityAccent: Record<KanbanPriority, string> = {
  low: "var(--color-chart-3)",
  medium: "var(--color-info)",
  high: "var(--color-warning)",
  urgent: "var(--color-destructive)",
};

const LABEL_KEY_MAP: Record<string, keyof Dictionary["kanban"]["labels"]> = {
  Harvest: "harvest",
  Logistics: "logistics",
  Compliance: "compliance",
  Contracts: "contracts",
  Training: "training",
  "R&D": "rnd",
};

type DueInfo =
  | { kind: "overdue"; label: string }
  | { kind: "soon"; label: string }
  | { kind: "future"; label: string };

function describeDue(
  iso: string,
  t: Dictionary,
  localeTag: string
): DueInfo {
  const then = new Date(iso).getTime();
  const diffDays = Math.round((then - NOW_MS) / (24 * 60 * 60 * 1000));

  if (diffDays < 0) {
    const n = Math.abs(diffDays);
    return {
      kind: "overdue",
      label:
        n === 1
          ? t.kanban.card.dayOverdue
          : `${n} ${t.kanban.card.daysOverdueSuffix}`,
    };
  }
  if (diffDays === 0) return { kind: "soon", label: t.kanban.card.dueTodayLabel };
  if (diffDays === 1)
    return { kind: "soon", label: t.kanban.card.dueTomorrowLabel };
  if (diffDays <= 3)
    return {
      kind: "soon",
      label: `${t.kanban.card.inDaysPrefix} ${diffDays} ${t.kanban.card.inDaysSuffix}`,
    };
  return { kind: "future", label: formatDate(iso, localeTag) };
}

export interface KanbanCardItemProps {
  card: KanbanCard;
  labels: KanbanLabel[];
  isDragging?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function KanbanCardItem({
  card,
  labels,
  isDragging,
  onClick,
  onDragStart,
  onDragEnd,
}: KanbanCardItemProps) {
  const t = useT();
  const { locale } = useLanguage();
  const localeTag = locale === "fr" ? "fr-FR" : "en-US";

  const priorityLabel: Record<KanbanPriority, string> = {
    low: t.kanban.priority.low,
    medium: t.kanban.priority.medium,
    high: t.kanban.priority.high,
    urgent: t.kanban.priority.urgent,
  };

  function localizeLabel(name: string): string {
    const key = LABEL_KEY_MAP[name];
    return key ? t.kanban.labels[key] : name;
  }

  const cardLabels = card.labels
    .map((id) => labels.find((l) => l.id === id))
    .filter((l): l is KanbanLabel => Boolean(l));

  const visibleLabels = cardLabels.slice(0, 3);
  const overflowLabels = cardLabels.length - visibleLabels.length;

  const visibleAssignees = card.assignees.slice(0, 3);
  const overflowAssignees = card.assignees.length - visibleAssignees.length;

  const due = card.dueDate ? describeDue(card.dueDate, t, localeTag) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      aria-label={card.title}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative flex cursor-grab select-none flex-col gap-2.5 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3.5 text-left shadow-elev-xs",
        "transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:border-[color:var(--color-ring)]/40 hover:shadow-elev-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]",
        "active:cursor-grabbing",
        isDragging && "pointer-events-none opacity-50"
      )}
    >
      {/* Priority accent bar */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: priorityAccent[card.priority] }}
      />

      {/* Labels row */}
      {(visibleLabels.length > 0 || card.priority === "urgent") && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {visibleLabels.map((label) => (
            <span
              key={label.id}
              className="inline-flex max-w-[120px] items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-muted-foreground)]"
            >
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              <span className="truncate">{localizeLabel(label.name)}</span>
            </span>
          ))}
          {overflowLabels > 0 && (
            <span className="rounded-full bg-[color:var(--color-muted)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-muted-foreground)]">
              +{overflowLabels}
            </span>
          )}
          {card.priority === "urgent" && (
            <Tooltip content={t.kanban.card.urgentTooltip}>
              <span className="ml-auto inline-flex size-5 items-center justify-center rounded-full bg-[color:var(--color-destructive)]/12 text-[color:var(--color-destructive)] ring-1 ring-inset ring-[color:var(--color-destructive)]/25">
                <Flame className="size-3" />
              </span>
            </Tooltip>
          )}
          {card.priority !== "urgent" && (
            <Tooltip
              content={`${t.kanban.priority.tooltipPrefix} ${priorityLabel[card.priority]}`}
            >
              <span
                className="ml-auto size-2 rounded-full"
                style={{ backgroundColor: priorityAccent[card.priority] }}
              />
            </Tooltip>
          )}
        </div>
      )}

      {/* Title */}
      <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-[color:var(--color-foreground)]">
        {card.title}
      </h4>

      {/* Description */}
      {card.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-[color:var(--color-muted-foreground)]">
          {card.description}
        </p>
      )}

      {/* Subtasks progress */}
      {card.subtasks && card.subtasks.total > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-[color:var(--color-muted-foreground)]">
            <span>{t.kanban.card.subtasks}</span>
            <span>
              {card.subtasks.done}/{card.subtasks.total}
            </span>
          </div>
          <Progress
            value={card.subtasks.done}
            max={card.subtasks.total}
            className="h-1.5"
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {due ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                due.kind === "overdue" &&
                  "bg-[color:var(--color-destructive)]/10 text-[color:var(--color-destructive)] ring-[color:var(--color-destructive)]/25",
                due.kind === "soon" &&
                  "bg-[color:var(--color-warning)]/15 text-[color:oklch(0.4_0.1_75)] ring-[color:var(--color-warning)]/25 dark:text-[color:var(--color-warning)]",
                due.kind === "future" &&
                  "bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)] ring-[color:var(--color-border)]"
              )}
            >
              <CalendarClock className="size-3" />
              <span className="truncate">{due.label}</span>
            </span>
          ) : (
            <span className="text-[10px] font-medium text-[color:var(--color-muted-foreground)]">
              {t.kanban.card.noDueDate}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {card.comments > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[color:var(--color-muted-foreground)]">
              <MessageSquare className="size-3.5" />
              {card.comments}
            </span>
          )}
          {card.attachments > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[color:var(--color-muted-foreground)]">
              <Paperclip className="size-3.5" />
              {card.attachments}
            </span>
          )}
          <div className="flex -space-x-1.5">
            {visibleAssignees.map((a) => (
              <Tooltip key={a.id} content={a.name}>
                <Avatar
                  name={a.name}
                  size="sm"
                  className="size-6 text-[10px] ring-2 ring-[color:var(--color-card)]"
                />
              </Tooltip>
            ))}
            {overflowAssignees > 0 && (
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-[color:var(--color-muted)] text-[10px] font-semibold text-[color:var(--color-muted-foreground)] ring-2 ring-[color:var(--color-card)]">
                +{overflowAssignees}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
