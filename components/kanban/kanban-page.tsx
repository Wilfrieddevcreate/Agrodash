"use client";

import * as React from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import {
  Filter,
  LayoutGrid,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import {
  kanbanCards as initialCards,
  kanbanColumns,
  kanbanLabels,
  type KanbanAssignee,
  type KanbanCard,
  type KanbanColumnId,
  type KanbanColumnMeta,
  type KanbanPriority,
} from "@/lib/kanban-mock";
import { KanbanCardItem } from "./kanban-card-item";
import { TaskDialog } from "./task-dialog";

type PriorityFilter = "all" | KanbanPriority;
type AssigneeFilter = string; // "all" or assignee id

const priorityFilterOptions: Array<{ label: string; value: PriorityFilter }> = [
  { label: "All priorities", value: "all" },
  { label: "Urgent", value: "urgent" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export function KanbanPage() {
  const [cards, setCards] = React.useState<KanbanCard[]>(initialCards);
  const [search, setSearch] = React.useState("");
  const [priority, setPriority] = React.useState<PriorityFilter>("all");
  const [activeLabels, setActiveLabels] = React.useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] =
    React.useState<AssigneeFilter>("all");

  // Drag state
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<KanbanColumnId | null>(
    null
  );

  // Dialogs
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createColumnId, setCreateColumnId] =
    React.useState<KanbanColumnId>("backlog");

  // Unique assignees, for the filter select
  const assigneePool = React.useMemo<KanbanAssignee[]>(() => {
    const map = new Map<string, KanbanAssignee>();
    for (const c of cards) {
      for (const a of c.assignees) {
        if (!map.has(a.id)) map.set(a.id, a);
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [cards]);

  const assigneeOptions = React.useMemo(
    () => [
      { label: "All assignees", value: "all" },
      ...assigneePool.map((a) => ({ label: a.name, value: a.id })),
    ],
    [assigneePool]
  );

  // Filtered cards
  const filteredCards = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return cards.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q)) return false;
      if (priority !== "all" && c.priority !== priority) return false;
      if (
        activeLabels.length > 0 &&
        !activeLabels.every((lid) => c.labels.includes(lid))
      ) {
        return false;
      }
      if (
        assigneeFilter !== "all" &&
        !c.assignees.some((a) => a.id === assigneeFilter)
      ) {
        return false;
      }
      return true;
    });
  }, [cards, search, priority, activeLabels, assigneeFilter]);

  // Cards per column (filtered view)
  const cardsByColumn = React.useMemo(() => {
    const map: Record<KanbanColumnId, KanbanCard[]> = {
      backlog: [],
      in_progress: [],
      review: [],
      done: [],
    };
    for (const c of filteredCards) {
      map[c.columnId].push(c);
    }
    return map;
  }, [filteredCards]);

  // Unfiltered counts (badge on column header)
  const totalByColumn = React.useMemo(() => {
    const map: Record<KanbanColumnId, number> = {
      backlog: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    };
    for (const c of cards) map[c.columnId] += 1;
    return map;
  }, [cards]);

  function toggleLabelFilter(labelId: string) {
    setActiveLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((l) => l !== labelId)
        : [...prev, labelId]
    );
  }

  function clearFilters() {
    setSearch("");
    setPriority("all");
    setActiveLabels([]);
    setAssigneeFilter("all");
  }

  const filtersActive =
    Boolean(search) ||
    priority !== "all" ||
    activeLabels.length > 0 ||
    assigneeFilter !== "all";

  /* ─────────────── Drag handlers ─────────────── */

  function handleDragStart(cardId: string, e: React.DragEvent<HTMLDivElement>) {
    setDraggingId(cardId);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", cardId);
    } catch {
      /* some browsers restrict setData — ignore */
    }
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDropTarget(null);
  }

  function handleColumnDragOver(
    columnId: KanbanColumnId,
    e: React.DragEvent<HTMLDivElement>
  ) {
    if (!draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTarget !== columnId) setDropTarget(columnId);
  }

  function handleColumnDragLeave(
    columnId: KanbanColumnId,
    e: React.DragEvent<HTMLDivElement>
  ) {
    // Only clear when truly leaving (not when entering a child)
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    if (dropTarget === columnId) setDropTarget(null);
  }

  function handleColumnDrop(
    columnId: KanbanColumnId,
    e: React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    if (!draggingId) return;
    const card = cards.find((c) => c.id === draggingId);
    if (!card || card.columnId === columnId) {
      setDraggingId(null);
      setDropTarget(null);
      return;
    }
    setCards((prev) =>
      prev.map((c) => (c.id === draggingId ? { ...c, columnId } : c))
    );
    const target = kanbanColumns.find((c) => c.id === columnId);
    if (target) {
      toast.success(`Task moved to ${target.title}`);
    }
    setDraggingId(null);
    setDropTarget(null);
  }

  /* ─────────────── Intra-column reorder ─────────────── */

  function handleReorder(columnId: KanbanColumnId, nextIds: string[]) {
    setCards((prev) => {
      const inColumn: KanbanCard[] = [];
      const outside: KanbanCard[] = [];
      for (const c of prev) {
        if (c.columnId === columnId) inColumn.push(c);
        else outside.push(c);
      }
      const byId = new Map(inColumn.map((c) => [c.id, c]));
      const reordered = nextIds
        .map((id) => byId.get(id))
        .filter((c): c is KanbanCard => Boolean(c));
      // Preserve column order in the overall list:
      // keep `outside` order untouched, splice the column back in the same
      // relative position as the first column card previously held.
      const firstIdx = prev.findIndex((c) => c.columnId === columnId);
      if (firstIdx === -1) return prev;
      const merged = [...outside];
      // Insert at the mapped "firstIdx" after excluding inColumn items
      let insertAt = 0;
      let seen = 0;
      for (let i = 0; i < prev.length && i < firstIdx; i++) {
        if (prev[i].columnId !== columnId) seen += 1;
      }
      insertAt = seen;
      merged.splice(insertAt, 0, ...reordered);
      return merged;
    });
  }

  /* ─────────────── Dialog handlers ─────────────── */

  function openDetail(cardId: string) {
    setActiveCardId(cardId);
    setDetailOpen(true);
  }

  function openCreate(columnId: KanbanColumnId) {
    setCreateColumnId(columnId);
    setCreateOpen(true);
  }

  function handleSave(updated: KanbanCard) {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  function handleCreate(created: KanbanCard) {
    setCards((prev) => [...prev, created]);
  }

  function handleDelete(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }

  const activeCard = cards.find((c) => c.id === activeCardId);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Board"
        description="Coordinate fieldwork, logistics and compliance across your teams."
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.message("Filters", {
                  description: "Advanced filtering coming soon.",
                })
              }
            >
              <Filter /> Filters
            </Button>
            <Tooltip content="Share board">
              <Button
                size="iconSm"
                variant="outline"
                aria-label="Share board"
                onClick={() =>
                  toast.success("Link copied", {
                    description: "Board link is on your clipboard.",
                  })
                }
              >
                <Share2 />
              </Button>
            </Tooltip>
            <Button
              size="sm"
              variant="primary"
              onClick={() => openCreate("backlog")}
            >
              <Plus /> New task
            </Button>
          </>
        }
      />

      {/* Filters toolbar */}
      <Card
        variant="flat"
        className="bg-[color:var(--color-muted)]/30 shadow-none"
      >
        <CardContent className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-[170px]">
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as PriorityFilter)}
                options={priorityFilterOptions}
              />
            </div>
            <div className="min-w-[180px]">
              <Select
                value={assigneeFilter}
                onValueChange={(v) => setAssigneeFilter(v)}
                options={assigneeOptions}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto">
            {kanbanLabels.map((label) => {
              const active = activeLabels.includes(label.id);
              return (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabelFilter(label.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold transition-all",
                    active
                      ? "border-transparent text-[color:var(--color-foreground)] shadow-elev-xs"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: `color-mix(in oklab, ${label.color} 18%, transparent)`,
                        }
                      : undefined
                  }
                >
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.name}
                </button>
              );
            })}
            {filtersActive && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={clearFilters}
              >
                <SlidersHorizontal /> Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Board */}
      <div className="mt-4 sm:mt-5">
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="grid auto-cols-[minmax(280px,1fr)] grid-flow-col gap-4 lg:auto-cols-fr lg:grid-cols-4 lg:grid-flow-row">
            {kanbanColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={cardsByColumn[column.id]}
                totalCount={totalByColumn[column.id]}
                filtersActive={filtersActive}
                isDropTarget={dropTarget === column.id}
                draggingId={draggingId}
                onDragOver={(e) => handleColumnDragOver(column.id, e)}
                onDragLeave={(e) => handleColumnDragLeave(column.id, e)}
                onDrop={(e) => handleColumnDrop(column.id, e)}
                onDragStartCard={handleDragStart}
                onDragEndCard={handleDragEnd}
                onReorder={(ids) => handleReorder(column.id, ids)}
                onCardClick={openDetail}
                onAddCard={() => openCreate(column.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <TaskDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        mode="edit"
        card={activeCard}
        assigneePool={assigneePool}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <TaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        defaultColumnId={createColumnId}
        assigneePool={assigneePool}
        onSave={handleSave}
        onCreate={handleCreate}
      />
    </>
  );
}

/* ─────────────── Column ─────────────── */

interface KanbanColumnProps {
  column: KanbanColumnMeta;
  cards: KanbanCard[];
  totalCount: number;
  filtersActive: boolean;
  isDropTarget: boolean;
  draggingId: string | null;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStartCard: (
    cardId: string,
    e: React.DragEvent<HTMLDivElement>
  ) => void;
  onDragEndCard: () => void;
  onReorder: (ids: string[]) => void;
  onCardClick: (cardId: string) => void;
  onAddCard: () => void;
}

function KanbanColumn({
  column,
  cards,
  totalCount,
  filtersActive,
  isDropTarget,
  draggingId,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStartCard,
  onDragEndCard,
  onReorder,
  onCardClick,
  onAddCard,
}: KanbanColumnProps) {
  const ids = cards.map((c) => c.id);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "group/column flex snap-start flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/40 transition-all",
        "min-h-[360px]",
        isDropTarget &&
          "border-[color:var(--color-primary)]/40 bg-[color:var(--color-primary)]/8 ring-2 ring-[color:var(--color-primary)]/25"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3.5 pt-3.5 pb-2">
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: column.accent }}
        />
        <h3 className="truncate text-[13px] font-semibold uppercase tracking-wider text-[color:var(--color-foreground)]">
          {column.title}
        </h3>
        <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-[color:var(--color-card)] px-1.5 py-0.5 text-[11px] font-semibold text-[color:var(--color-muted-foreground)] ring-1 ring-inset ring-[color:var(--color-border)]">
          {totalCount}
        </span>
        <Tooltip content={`Add to ${column.title}`}>
          <button
            type="button"
            onClick={onAddCard}
            aria-label={`Add task to ${column.title}`}
            className="ml-auto inline-flex size-7 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-card)] hover:text-[color:var(--color-foreground)]"
          >
            <Plus className="size-4" />
          </button>
        </Tooltip>
      </div>

      {/* Card list */}
      <div className="flex-1 px-2.5 pb-2.5">
        {cards.length === 0 ? (
          <ColumnEmpty filtersActive={filtersActive} />
        ) : (
          <Reorder.Group
            as="ul"
            axis="y"
            values={ids}
            onReorder={onReorder}
            className="flex flex-col gap-2.5"
          >
            <AnimatePresence initial={false}>
              {cards.map((card) => (
                <Reorder.Item
                  key={card.id}
                  value={card.id}
                  as="li"
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{
                    duration: 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="list-none"
                  dragListener={false}
                >
                  <KanbanCardItem
                    card={card}
                    labels={kanbanLabels}
                    isDragging={draggingId === card.id}
                    onClick={() => onCardClick(card.id)}
                    onDragStart={(e) => onDragStartCard(card.id, e)}
                    onDragEnd={onDragEndCard}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>

      {/* Add card button */}
      <div className="border-t border-[color:var(--color-border)]/60 p-2">
        <button
          type="button"
          onClick={onAddCard}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-[color:var(--color-muted-foreground)] transition-all hover:bg-[color:var(--color-card)] hover:text-[color:var(--color-foreground)]"
        >
          <Plus className="size-3.5" />
          Add card
        </button>
      </div>
    </div>
  );
}

/* ─────────────── Empty state ─────────────── */

function ColumnEmpty({ filtersActive }: { filtersActive: boolean }) {
  return (
    <div className="m-1.5 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--color-border)]/70 bg-[color:var(--color-card)]/40 px-3 py-8 text-center">
      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)] ring-1 ring-inset ring-[color:var(--color-border)]">
        <LayoutGrid className="size-4" />
      </span>
      <p className="text-xs font-semibold text-[color:var(--color-foreground)]">
        {filtersActive ? "No matches" : "No tasks yet"}
      </p>
      <p className="text-[11px] leading-relaxed text-[color:var(--color-muted-foreground)]">
        {filtersActive
          ? "Try adjusting your filters."
          : "Drag a card here or add one."}
      </p>
    </div>
  );
}

