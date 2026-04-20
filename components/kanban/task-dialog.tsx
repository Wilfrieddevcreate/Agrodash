"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Check,
  CircleCheck,
  ClipboardList,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn, relativeTime } from "@/lib/utils";
import {
  kanbanColumns,
  kanbanLabels,
  type KanbanAssignee,
  type KanbanCard,
  type KanbanColumnId,
  type KanbanPriority,
} from "@/lib/kanban-mock";

const priorityOptions: Array<{ label: string; value: KanbanPriority }> = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "edit" | "create";
  card?: KanbanCard;
  defaultColumnId?: KanbanColumnId;
  assigneePool: KanbanAssignee[];
  onSave: (card: KanbanCard) => void;
  onCreate?: (card: KanbanCard) => void;
  onDelete?: (cardId: string) => void;
}

function emptyDraft(
  columnId: KanbanColumnId,
  createdAtISO: string
): KanbanCard {
  return {
    id: "",
    title: "",
    description: "",
    columnId,
    priority: "medium",
    labels: [],
    assignees: [],
    dueDate: undefined,
    comments: 0,
    attachments: 0,
    subtasks: undefined,
    createdAt: createdAtISO,
  };
}

// Stable anchor for the demo "now"
const NOW_ISO = "2026-04-20T10:00:00.000Z";

export function TaskDialog({
  open,
  onOpenChange,
  mode,
  card,
  defaultColumnId = "backlog",
  assigneePool,
  onSave,
  onCreate,
  onDelete,
}: TaskDialogProps) {
  const [draft, setDraft] = React.useState<KanbanCard>(() =>
    card ?? emptyDraft(defaultColumnId, NOW_ISO)
  );
  const [newSubtask, setNewSubtask] = React.useState("");
  // Virtual checklist — rendered from the done/total counters
  const [subtaskItems, setSubtaskItems] = React.useState<
    Array<{ id: string; label: string; done: boolean }>
  >(() => buildSubtasks(card));

  // Re-seed state when the dialog opens for a different card
  React.useEffect(() => {
    if (!open) return;
    const next = card ?? emptyDraft(defaultColumnId, NOW_ISO);
    setDraft(next);
    setSubtaskItems(buildSubtasks(card));
    setNewSubtask("");
  }, [open, card, defaultColumnId]);

  function updateDraft<K extends keyof KanbanCard>(
    key: K,
    value: KanbanCard[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function toggleLabel(labelId: string) {
    setDraft((prev) => ({
      ...prev,
      labels: prev.labels.includes(labelId)
        ? prev.labels.filter((l) => l !== labelId)
        : [...prev.labels, labelId],
    }));
  }

  function toggleAssignee(assignee: KanbanAssignee) {
    setDraft((prev) => {
      const present = prev.assignees.some((a) => a.id === assignee.id);
      return {
        ...prev,
        assignees: present
          ? prev.assignees.filter((a) => a.id !== assignee.id)
          : [...prev.assignees, assignee],
      };
    });
  }

  function addSubtask() {
    const label = newSubtask.trim();
    if (!label) return;
    const next = [
      ...subtaskItems,
      { id: `st_${Date.now()}`, label, done: false },
    ];
    setSubtaskItems(next);
    setNewSubtask("");
  }

  function toggleSubtask(id: string) {
    setSubtaskItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  }

  function removeSubtask(id: string) {
    setSubtaskItems((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSave() {
    if (!draft.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const subtasks =
      subtaskItems.length > 0
        ? {
            done: subtaskItems.filter((s) => s.done).length,
            total: subtaskItems.length,
          }
        : undefined;

    if (mode === "create") {
      const created: KanbanCard = {
        ...draft,
        id: `k_${Date.now().toString(36)}`,
        subtasks,
      };
      onCreate?.(created);
      toast.success("Task created", { description: created.title });
    } else {
      const saved: KanbanCard = { ...draft, subtasks };
      onSave(saved);
      toast.success("Changes saved");
    }
    onOpenChange(false);
  }

  const columnOptions = kanbanColumns.map((c) => ({
    label: c.title,
    value: c.id,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        widthClass="max-w-3xl"
        title={mode === "create" ? "New task" : "Task details"}
        description={
          mode === "create"
            ? "Capture the task, assign owners, and drop it into a column."
            : "Update status, owners and details. Changes save optimistically."
        }
      >
        <DialogBody className="p-0">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,1fr)_280px]">
            {/* ───────── Main column ───────── */}
            <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={draft.title}
                  onChange={(e) => updateDraft("title", e.target.value)}
                  placeholder="e.g. Inspect Cassava lot CS-22 before shipment"
                  className="text-base font-semibold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="task-desc">Description</Label>
                <Textarea
                  id="task-desc"
                  value={draft.description ?? ""}
                  onChange={(e) => updateDraft("description", e.target.value)}
                  placeholder="Add context, links, or acceptance criteria..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Subtasks */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <Label>Subtasks</Label>
                  <span className="text-[11px] font-medium text-[color:var(--color-muted-foreground)]">
                    {subtaskItems.filter((s) => s.done).length}/
                    {subtaskItems.length || 0} complete
                  </span>
                </div>

                <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 p-2">
                  {subtaskItems.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-[color:var(--color-muted-foreground)]">
                      No subtasks yet. Break the work down below.
                    </p>
                  ) : (
                    <ul className="flex flex-col divide-y divide-[color:var(--color-border)]">
                      {subtaskItems.map((st) => (
                        <li
                          key={st.id}
                          className="group flex items-center gap-2 px-1.5 py-2"
                        >
                          <button
                            type="button"
                            onClick={() => toggleSubtask(st.id)}
                            aria-label={
                              st.done ? "Mark as incomplete" : "Mark as complete"
                            }
                            className={cn(
                              "inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                              st.done
                                ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]"
                                : "border-[color:var(--color-border)] bg-[color:var(--color-card)] hover:border-[color:var(--color-primary)]"
                            )}
                          >
                            {st.done && <Check className="size-3" />}
                          </button>
                          <span
                            className={cn(
                              "flex-1 text-sm",
                              st.done &&
                                "text-[color:var(--color-muted-foreground)] line-through"
                            )}
                          >
                            {st.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSubtask(st.id)}
                            aria-label="Remove subtask"
                            className="rounded-md p-1 text-[color:var(--color-muted-foreground)] opacity-0 transition-all hover:bg-[color:var(--color-muted)] group-hover:opacity-100"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-1 flex items-center gap-2 rounded-lg p-1">
                    <Input
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSubtask();
                        }
                      }}
                      placeholder="Add a subtask..."
                      className="h-9"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addSubtask}
                      disabled={!newSubtask.trim()}
                    >
                      <Plus className="size-4" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Activity (demo) */}
              {mode === "edit" && (
                <div className="flex flex-col gap-2">
                  <Label>Activity</Label>
                  <ul className="flex flex-col gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/20 p-3.5">
                    <ActivityRow
                      icon={<CircleCheck className="size-3.5" />}
                      actor="Alex Diallo"
                      action="moved this task to"
                      target={
                        kanbanColumns.find((c) => c.id === draft.columnId)
                          ?.title ?? "Backlog"
                      }
                      when={draft.createdAt}
                    />
                    <ActivityRow
                      icon={<MessageSquare className="size-3.5" />}
                      actor="Nadia Owusu"
                      action="commented"
                      target="Quality report looks clean — proceed with shipment."
                      when={draft.createdAt}
                    />
                    <ActivityRow
                      icon={<Paperclip className="size-3.5" />}
                      actor="Samuel Kone"
                      action="attached"
                      target="lab-report-cs22.pdf"
                      when={draft.createdAt}
                    />
                  </ul>
                </div>
              )}
            </div>

            {/* ───────── Right rail ───────── */}
            <aside className="flex flex-col gap-4 border-t border-[color:var(--color-border)] bg-[color:var(--color-muted)]/20 px-5 py-5 md:border-l md:border-t-0 md:px-5">
              <SidebarField label="Status">
                <Select
                  value={draft.columnId}
                  onValueChange={(v) =>
                    updateDraft("columnId", v as KanbanColumnId)
                  }
                  options={columnOptions}
                />
              </SidebarField>

              <SidebarField label="Priority">
                <Select
                  value={draft.priority}
                  onValueChange={(v) =>
                    updateDraft("priority", v as KanbanPriority)
                  }
                  options={priorityOptions}
                />
              </SidebarField>

              <SidebarField label="Due date">
                <Input
                  type="date"
                  value={toDateInputValue(draft.dueDate)}
                  onChange={(e) =>
                    updateDraft(
                      "dueDate",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined
                    )
                  }
                />
              </SidebarField>

              <SidebarField label="Labels">
                <div className="flex flex-wrap gap-1.5">
                  {kanbanLabels.map((label) => {
                    const active = draft.labels.includes(label.id);
                    return (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabel(label.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-all",
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
                </div>
              </SidebarField>

              <SidebarField label="Assignees">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {draft.assignees.length === 0 ? (
                      <span className="text-xs text-[color:var(--color-muted-foreground)]">
                        No one assigned yet.
                      </span>
                    ) : (
                      draft.assignees.map((a) => (
                        <span
                          key={a.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] py-0.5 pl-0.5 pr-2 text-[11px] font-medium"
                        >
                          <Avatar name={a.name} size="sm" className="size-5" />
                          <span className="truncate">{a.name}</span>
                        </span>
                      ))
                    )}
                  </div>
                  <details className="group rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] open:shadow-elev-xs">
                    <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]">
                      <UserPlus className="size-3.5" />
                      Manage assignees
                    </summary>
                    <ul className="max-h-48 overflow-y-auto border-t border-[color:var(--color-border)] p-1">
                      {assigneePool.map((a) => {
                        const picked = draft.assignees.some(
                          (x) => x.id === a.id
                        );
                        return (
                          <li key={a.id}>
                            <button
                              type="button"
                              onClick={() => toggleAssignee(a)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px]",
                                picked
                                  ? "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]"
                                  : "hover:bg-[color:var(--color-muted)]"
                              )}
                            >
                              <Avatar name={a.name} size="sm" className="size-6" />
                              <span className="flex-1 truncate">{a.name}</span>
                              {picked && <Check className="size-4" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </div>
              </SidebarField>

              <SidebarField label="Attachments">
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-4 text-[11px] text-[color:var(--color-muted-foreground)]">
                  <ClipboardList className="size-4" />
                  <span className="flex-1">Drop files or click to upload</span>
                </div>
              </SidebarField>
            </aside>
          </div>
        </DialogBody>
        <DialogFooter>
          {mode === "edit" && onDelete && draft.id && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mr-auto text-[color:var(--color-destructive)] hover:bg-[color:var(--color-destructive)]/10"
              onClick={() => {
                onDelete(draft.id);
                toast.success("Task deleted");
                onOpenChange(false);
              }}
            >
              <Trash2 /> Delete
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSave}>
            {mode === "create" ? "Create task" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────── helpers ──────────────── */

function SidebarField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
        {label}
      </span>
      {children}
    </div>
  );
}

function ActivityRow({
  icon,
  actor,
  action,
  target,
  when,
}: {
  icon: React.ReactNode;
  actor: string;
  action: string;
  target: string;
  when: string;
}) {
  return (
    <li className="flex items-start gap-2.5 text-xs leading-relaxed">
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-card)] text-[color:var(--color-muted-foreground)] ring-1 ring-inset ring-[color:var(--color-border)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[color:var(--color-foreground)]">
          <span className="font-semibold">{actor}</span>{" "}
          <span className="text-[color:var(--color-muted-foreground)]">
            {action}
          </span>{" "}
          <span className="font-medium">{target}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-[color:var(--color-muted-foreground)]">
          {relativeTime(when)}
        </p>
      </div>
    </li>
  );
}

function buildSubtasks(
  card: KanbanCard | undefined
): Array<{ id: string; label: string; done: boolean }> {
  if (!card?.subtasks) return [];
  const { done, total } = card.subtasks;
  return Array.from({ length: total }).map((_, i) => ({
    id: `st_${card.id}_${i}`,
    label: `Subtask ${i + 1}`,
    done: i < done,
  }));
}

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )}`;
}
