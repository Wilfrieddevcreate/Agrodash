import { customers } from "./mock-data";

// -------------------- TYPES --------------------

export type KanbanPriority = "low" | "medium" | "high" | "urgent";

export type KanbanColumnId = "backlog" | "in_progress" | "review" | "done";

export interface KanbanLabel {
  id: string;
  name: string;
  color: string; // CSS var or hex (chart colours preferred)
}

export interface KanbanAssignee {
  id: string;
  name: string;
}

export interface KanbanSubtaskProgress {
  done: number;
  total: number;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: KanbanColumnId;
  priority: KanbanPriority;
  labels: string[]; // label IDs
  assignees: KanbanAssignee[];
  dueDate?: string; // ISO
  comments: number;
  attachments: number;
  subtasks?: KanbanSubtaskProgress;
  createdAt: string;
}

export interface KanbanColumnMeta {
  id: KanbanColumnId;
  title: string;
  accent: string;
}

// -------------------- ANCHOR --------------------

// Stable anchor so SSR + client produce identical dates — prevents hydration drift.
const NOW = new Date("2026-04-20T10:00:00.000Z").getTime();
const DAY = 24 * 60 * 60 * 1000;

function inDays(days: number): string {
  return new Date(NOW + days * DAY).toISOString();
}

function createdOn(daysAgo: number): string {
  return new Date(NOW - daysAgo * DAY).toISOString();
}

// -------------------- LABELS --------------------

export const kanbanLabels: KanbanLabel[] = [
  { id: "l1", name: "Harvest", color: "var(--color-chart-1)" },
  { id: "l2", name: "Logistics", color: "var(--color-chart-3)" },
  { id: "l3", name: "Compliance", color: "var(--color-chart-4)" },
  { id: "l4", name: "Contracts", color: "var(--color-chart-5)" },
  { id: "l5", name: "Training", color: "var(--color-warning)" },
  { id: "l6", name: "R&D", color: "var(--color-chart-6)" },
];

// -------------------- COLUMNS --------------------

export const kanbanColumns: KanbanColumnMeta[] = [
  { id: "backlog", title: "Backlog", accent: "var(--color-muted-foreground)" },
  { id: "in_progress", title: "In progress", accent: "var(--color-info)" },
  { id: "review", title: "In review", accent: "var(--color-warning)" },
  { id: "done", title: "Done", accent: "var(--color-success)" },
];

// -------------------- ASSIGNEE POOL --------------------

// Use customer names from the existing mock for realistic avatars & variety.
const pool: KanbanAssignee[] = customers.slice(0, 10).map((c) => ({
  id: c.id,
  name: c.name,
}));

// Internal staff for variety
const staff: KanbanAssignee[] = [
  { id: "u_ops_01", name: "Alex Diallo" },
  { id: "u_ops_02", name: "Nadia Owusu" },
  { id: "u_ops_03", name: "Samuel Kone" },
  { id: "u_ops_04", name: "Lina Traoré" },
];

const people: KanbanAssignee[] = [...staff, ...pool];

function pick(indexes: number[]): KanbanAssignee[] {
  return indexes.map((i) => people[i % people.length]);
}

// -------------------- CARDS --------------------

export const kanbanCards: KanbanCard[] = [
  // ───────── BACKLOG ─────────
  {
    id: "k_001",
    title: "Inspect Cassava lot CS-22 before shipment",
    description:
      "Quality check on moisture, foreign matter, and sack labelling at Kumasi depot.",
    columnId: "backlog",
    priority: "high",
    labels: ["l1", "l3"],
    assignees: pick([0, 4]),
    dueDate: inDays(2),
    comments: 3,
    attachments: 1,
    subtasks: { done: 1, total: 5 },
    createdAt: createdOn(4),
  },
  {
    id: "k_002",
    title: "Renew IFOAM organic certification",
    description:
      "Prepare audit dossier for the 12-farm cluster in Sikasso. Deadline is end of quarter.",
    columnId: "backlog",
    priority: "urgent",
    labels: ["l3", "l4"],
    assignees: pick([1, 8]),
    dueDate: inDays(-1),
    comments: 7,
    attachments: 4,
    subtasks: { done: 2, total: 9 },
    createdAt: createdOn(12),
  },
  {
    id: "k_003",
    title: "Backfill maize seed inventory to 8 tons",
    description:
      "Coordinate with AgriGen Co. on bulk delivery — trigger PO before Friday stocktake.",
    columnId: "backlog",
    priority: "medium",
    labels: ["l2"],
    assignees: pick([2]),
    dueDate: inDays(5),
    comments: 1,
    attachments: 0,
    createdAt: createdOn(2),
  },
  {
    id: "k_004",
    title: "Scope pilot for satellite yield monitoring",
    description:
      "Shortlist two vendors and draft MOU terms for the Q3 pilot on 4 cooperatives.",
    columnId: "backlog",
    priority: "low",
    labels: ["l6"],
    assignees: pick([3, 9]),
    dueDate: inDays(21),
    comments: 0,
    attachments: 2,
    subtasks: { done: 0, total: 4 },
    createdAt: createdOn(1),
  },
  {
    id: "k_005",
    title: "Update fertilizer blend recommendation sheet",
    description:
      "Align NPK ratios with the new soil survey results from the Ashanti region.",
    columnId: "backlog",
    priority: "low",
    labels: ["l6", "l5"],
    assignees: pick([0]),
    comments: 2,
    attachments: 0,
    createdAt: createdOn(8),
  },

  // ───────── IN PROGRESS ─────────
  {
    id: "k_006",
    title: "Negotiate Q3 rice export contract",
    description:
      "Finalise FOB pricing and lay-time clauses with Dakar cooperative — target signature this week.",
    columnId: "in_progress",
    priority: "urgent",
    labels: ["l4", "l2"],
    assignees: pick([1, 6]),
    dueDate: inDays(3),
    comments: 12,
    attachments: 6,
    subtasks: { done: 4, total: 7 },
    createdAt: createdOn(9),
  },
  {
    id: "k_007",
    title: "Train 12 farmers on drip irrigation kit",
    description:
      "Two-day on-site workshop in Bobo-Dioulasso. Book translator + arrange kit demo.",
    columnId: "in_progress",
    priority: "high",
    labels: ["l5"],
    assignees: pick([2, 7]),
    dueDate: inDays(2),
    comments: 5,
    attachments: 2,
    subtasks: { done: 3, total: 6 },
    createdAt: createdOn(6),
  },
  {
    id: "k_008",
    title: "Investigate low germination on maize AX-500",
    description:
      "Lab testing the last three batches — suspect cold-chain gap during distribution.",
    columnId: "in_progress",
    priority: "high",
    labels: ["l6", "l1"],
    assignees: pick([3]),
    dueDate: inDays(1),
    comments: 8,
    attachments: 3,
    subtasks: { done: 2, total: 3 },
    createdAt: createdOn(5),
  },
  {
    id: "k_009",
    title: "Consolidate weekly depot stock counts",
    description:
      "Reconcile Kumasi, Kigali and Nairobi counts before Friday operations review.",
    columnId: "in_progress",
    priority: "medium",
    labels: ["l2"],
    assignees: pick([0, 5]),
    dueDate: inDays(4),
    comments: 4,
    attachments: 1,
    createdAt: createdOn(3),
  },
  {
    id: "k_010",
    title: "Onboard 3 new distributors in East Africa",
    description:
      "KYC, MSA, and price list alignment. Schedule the 60-minute onboarding call per account.",
    columnId: "in_progress",
    priority: "medium",
    labels: ["l4", "l5"],
    assignees: pick([4, 9]),
    dueDate: inDays(7),
    comments: 6,
    attachments: 3,
    subtasks: { done: 5, total: 9 },
    createdAt: createdOn(11),
  },

  // ───────── REVIEW ─────────
  {
    id: "k_011",
    title: "Approve cocoa grade-A export samples",
    description:
      "Confirm moisture and bean count reports from the lab. Customer needs greenlight by EOD.",
    columnId: "review",
    priority: "urgent",
    labels: ["l3", "l1"],
    assignees: pick([1]),
    dueDate: inDays(0),
    comments: 9,
    attachments: 5,
    subtasks: { done: 5, total: 5 },
    createdAt: createdOn(7),
  },
  {
    id: "k_012",
    title: "Review Q2 sustainability report draft",
    description:
      "Cross-check carbon and water metrics against field audits before board sign-off.",
    columnId: "review",
    priority: "medium",
    labels: ["l3", "l6"],
    assignees: pick([2, 8]),
    dueDate: inDays(4),
    comments: 2,
    attachments: 2,
    subtasks: { done: 3, total: 4 },
    createdAt: createdOn(14),
  },
  {
    id: "k_013",
    title: "Sign-off redesigned packaging for shea nuts",
    description:
      "Print proofs landed — validate the FSC mark placement and nutrition label copy.",
    columnId: "review",
    priority: "low",
    labels: ["l4"],
    assignees: pick([3]),
    dueDate: inDays(6),
    comments: 3,
    attachments: 4,
    createdAt: createdOn(4),
  },
  {
    id: "k_014",
    title: "Audit warehouse safety checklist v3",
    description:
      "Walk-through with the Kigali team. Flag any gaps for the compliance officer.",
    columnId: "review",
    priority: "high",
    labels: ["l3", "l5"],
    assignees: pick([5, 0]),
    dueDate: inDays(2),
    comments: 4,
    attachments: 1,
    subtasks: { done: 4, total: 6 },
    createdAt: createdOn(10),
  },

  // ───────── DONE ─────────
  {
    id: "k_015",
    title: "Publish March farmer newsletter",
    description:
      "15,200 recipients, 42% open-rate. Good signal — schedule a follow-up survey.",
    columnId: "done",
    priority: "low",
    labels: ["l5"],
    assignees: pick([4]),
    dueDate: inDays(-3),
    comments: 1,
    attachments: 0,
    subtasks: { done: 3, total: 3 },
    createdAt: createdOn(18),
  },
  {
    id: "k_016",
    title: "Close sorghum procurement for Savana coop",
    description:
      "Final invoices paid, delivery confirmed at Bobo-Dioulasso depot.",
    columnId: "done",
    priority: "medium",
    labels: ["l2", "l4"],
    assignees: pick([6, 1]),
    dueDate: inDays(-1),
    comments: 5,
    attachments: 3,
    createdAt: createdOn(15),
  },
  {
    id: "k_017",
    title: "Deploy soil moisture sensors pilot batch",
    description:
      "10 kits installed on two farms in Mali. Data feed is streaming correctly.",
    columnId: "done",
    priority: "high",
    labels: ["l6"],
    assignees: pick([0, 2]),
    dueDate: inDays(-5),
    comments: 7,
    attachments: 2,
    subtasks: { done: 4, total: 4 },
    createdAt: createdOn(22),
  },
  {
    id: "k_018",
    title: "Resolve delayed shipment to Harvest Hub Retail",
    description:
      "Rerouted via Arusha depot. Customer credited for the inconvenience.",
    columnId: "done",
    priority: "urgent",
    labels: ["l2"],
    assignees: pick([3, 7]),
    dueDate: inDays(-2),
    comments: 11,
    attachments: 1,
    createdAt: createdOn(9),
  },
  {
    id: "k_019",
    title: "Archive 2025 compliance audit records",
    description:
      "Digitised and filed on the secure drive. Retention policy: 7 years.",
    columnId: "done",
    priority: "low",
    labels: ["l3"],
    assignees: pick([8]),
    dueDate: inDays(-8),
    comments: 0,
    attachments: 0,
    subtasks: { done: 2, total: 2 },
    createdAt: createdOn(30),
  },
];
