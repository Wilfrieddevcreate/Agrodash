import type {
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
} from "@/lib/types";
import { customers, products } from "@/lib/mock-data";

// Stable anchor so SSR + client produce identical dates — prevents hydration drift.
const NOW = new Date("2026-04-20T10:00:00.000Z").getTime();
const DAY = 24 * 60 * 60 * 1000;
const TAX_RATE = 0.075;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type InvoiceSeed = {
  // Offset from NOW (positive = past, negative = future days)
  issueOffsetDays: number;
  dueInDays: number;
  status: InvoiceStatus;
  itemCount: number;
  notes?: string;
  paidOffsetFromIssue?: number; // days after issue when paid (if paid)
};

// Manually crafted status / date spread so the list demo always covers every
// state, including a couple of drafts and overdue items.
const seeds: InvoiceSeed[] = [
  { issueOffsetDays: 62, dueInDays: 30, status: "paid", itemCount: 3, paidOffsetFromIssue: 18, notes: "Thanks for the prompt order — crop lot reserved from the Q2 allocation." },
  { issueOffsetDays: 55, dueInDays: 30, status: "paid", itemCount: 2, paidOffsetFromIssue: 22 },
  { issueOffsetDays: 48, dueInDays: 30, status: "paid", itemCount: 4, paidOffsetFromIssue: 12 },
  { issueOffsetDays: 45, dueInDays: 30, status: "overdue", itemCount: 2, notes: "Follow up with accounts team — PO pending approval." },
  { issueOffsetDays: 42, dueInDays: 21, status: "paid", itemCount: 3, paidOffsetFromIssue: 19 },
  { issueOffsetDays: 40, dueInDays: 30, status: "overdue", itemCount: 5 },
  { issueOffsetDays: 36, dueInDays: 30, status: "paid", itemCount: 2, paidOffsetFromIssue: 8 },
  { issueOffsetDays: 33, dueInDays: 21, status: "overdue", itemCount: 3, notes: "Second reminder emailed — awaiting mobile money transfer." },
  { issueOffsetDays: 30, dueInDays: 30, status: "paid", itemCount: 4, paidOffsetFromIssue: 14 },
  { issueOffsetDays: 27, dueInDays: 30, status: "paid", itemCount: 1, paidOffsetFromIssue: 5 },
  { issueOffsetDays: 24, dueInDays: 21, status: "overdue", itemCount: 3 },
  { issueOffsetDays: 22, dueInDays: 30, status: "paid", itemCount: 2, paidOffsetFromIssue: 9 },
  { issueOffsetDays: 19, dueInDays: 30, status: "sent", itemCount: 5 },
  { issueOffsetDays: 17, dueInDays: 30, status: "paid", itemCount: 2, paidOffsetFromIssue: 6 },
  { issueOffsetDays: 14, dueInDays: 30, status: "sent", itemCount: 3, notes: "Awaiting delivery confirmation from the regional depot." },
  { issueOffsetDays: 12, dueInDays: 15, status: "sent", itemCount: 2 },
  { issueOffsetDays: 11, dueInDays: 30, status: "paid", itemCount: 4, paidOffsetFromIssue: 3 },
  { issueOffsetDays: 9, dueInDays: 30, status: "sent", itemCount: 3 },
  { issueOffsetDays: 8, dueInDays: 14, status: "sent", itemCount: 2 },
  { issueOffsetDays: 7, dueInDays: 30, status: "void", itemCount: 1, notes: "Cancelled per customer request — replacement invoice issued." },
  { issueOffsetDays: 6, dueInDays: 30, status: "sent", itemCount: 4 },
  { issueOffsetDays: 5, dueInDays: 21, status: "sent", itemCount: 3 },
  { issueOffsetDays: 4, dueInDays: 30, status: "sent", itemCount: 2 },
  { issueOffsetDays: 3, dueInDays: 30, status: "sent", itemCount: 5 },
  { issueOffsetDays: 2, dueInDays: 30, status: "paid", itemCount: 2, paidOffsetFromIssue: 1 },
  { issueOffsetDays: 1, dueInDays: 30, status: "sent", itemCount: 3 },
  { issueOffsetDays: 1, dueInDays: 14, status: "draft", itemCount: 2, notes: "Awaiting line-item approval from the sales lead." },
  { issueOffsetDays: 0, dueInDays: 30, status: "draft", itemCount: 3 },
];

function roundTo2(n: number) {
  return Math.round(n * 100) / 100;
}

function buildLineItems(count: number, rng: () => number): InvoiceLineItem[] {
  const picks = new Set<string>();
  const items: InvoiceLineItem[] = [];
  let safety = 0;
  while (items.length < count && safety < count * 6) {
    const p = products[Math.floor(rng() * products.length)];
    safety += 1;
    if (picks.has(p.id)) continue;
    picks.add(p.id);
    const qty = Math.floor(rng() * 8) + 1;
    items.push({
      productId: p.id,
      name: p.name,
      qty,
      unitPrice: p.price,
    });
  }
  return items;
}

export const invoices: Invoice[] = seeds.map((seed, i) => {
  const rng = seededRandom(i + 101);
  const customer = customers[i % customers.length];
  const issueDateMs = NOW - seed.issueOffsetDays * DAY;
  const dueDateMs = issueDateMs + seed.dueInDays * DAY;

  const items = buildLineItems(seed.itemCount, rng);
  const subtotal = roundTo2(
    items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0)
  );
  const tax = roundTo2(subtotal * TAX_RATE);
  const total = roundTo2(subtotal + tax);

  const paidAt =
    seed.status === "paid" && seed.paidOffsetFromIssue !== undefined
      ? new Date(issueDateMs + seed.paidOffsetFromIssue * DAY).toISOString()
      : undefined;

  return {
    id: `inv_${String(i + 1).padStart(4, "0")}`,
    number: `INV-2026-${String(i + 1).padStart(4, "0")}`,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerAddress: `${customer.location}, ${customer.country}`,
    status: seed.status,
    issueDate: new Date(issueDateMs).toISOString(),
    dueDate: new Date(dueDateMs).toISOString(),
    paidAt,
    items,
    subtotal,
    tax,
    total,
    notes: seed.notes,
    currency: "USD",
  };
});
