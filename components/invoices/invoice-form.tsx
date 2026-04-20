"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldHint, Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { customers, products } from "@/lib/mock-data";
import { invoices as seedInvoices } from "@/lib/invoices-mock";
import { formatCurrency, cn } from "@/lib/utils";

interface LineDraft {
  key: string;
  productId: string;
  qty: number;
  unitPrice: number;
}

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NOW = new Date("2026-04-20T10:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;

function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

function newLine(): LineDraft {
  return {
    key:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `ln_${Math.random().toString(36).slice(2, 9)}`,
    productId: "",
    qty: 1,
    unitPrice: 0,
  };
}

function nextInvoiceNumber() {
  // Seed-based projected next number. Presentation only.
  const lastNum = seedInvoices
    .map((i) => {
      const match = /INV-(\d{4})-(\d+)/.exec(i.number);
      return match ? parseInt(match[2], 10) : 0;
    })
    .reduce((a, b) => Math.max(a, b), 0);
  const next = (lastNum + 1).toString().padStart(4, "0");
  return `INV-2026-${next}`;
}

export function InvoiceForm({ open, onOpenChange }: InvoiceFormProps) {
  const [customerId, setCustomerId] = React.useState("");
  const [issueDate, setIssueDate] = React.useState(toDateInput(NOW));
  const [dueDate, setDueDate] = React.useState(
    toDateInput(new Date(NOW.getTime() + 30 * DAY))
  );
  const [notes, setNotes] = React.useState("");
  const [lines, setLines] = React.useState<LineDraft[]>(() => [newLine()]);

  // Reset form whenever dialog transitions from closed → open (render-time
  // reset per React 19 "store info from previous renders" pattern — avoids
  // the cascading render that a useEffect would trigger).
  const [lastOpen, setLastOpen] = React.useState(open);
  if (lastOpen !== open) {
    setLastOpen(open);
    if (open) {
      setCustomerId("");
      setIssueDate(toDateInput(NOW));
      setDueDate(toDateInput(new Date(NOW.getTime() + 30 * DAY)));
      setNotes("");
      setLines([newLine()]);
    }
  }

  const customerOptions = React.useMemo(
    () => [
      { label: "Select a customer…", value: "" },
      ...customers.map((c) => ({ label: c.name, value: c.id })),
    ],
    []
  );

  const productOptions = React.useMemo(
    () => [
      { label: "Select a product…", value: "" },
      ...products.map((p) => ({
        label: `${p.name} · ${formatCurrency(p.price)}/${p.unit}`,
        value: p.id,
      })),
    ],
    []
  );

  function updateLine(key: string, patch: Partial<LineDraft>) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );
  }

  function removeLine(key: string) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.key !== key)));
  }

  function addLine() {
    setLines((prev) => [...prev, newLine()]);
  }

  function onProductChange(key: string, productId: string) {
    const p = products.find((x) => x.id === productId);
    updateLine(key, {
      productId,
      unitPrice: p ? p.price : 0,
    });
  }

  const subtotal = lines.reduce(
    (s, l) => s + (Number.isFinite(l.qty) ? l.qty : 0) * (Number.isFinite(l.unitPrice) ? l.unitPrice : 0),
    0
  );
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  const validLines = lines.filter(
    (l) => l.productId && l.qty > 0 && l.unitPrice > 0
  );
  const isValid = customerId !== "" && validLines.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const number = nextInvoiceNumber();
    toast.success("Invoice created", {
      description: `${number} saved as draft`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="New invoice" description="Create a draft invoice for a customer." widthClass="max-w-2xl">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogBody className="space-y-5">
            {/* Customer */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-customer">Customer</Label>
              <Select
                value={customerId}
                onValueChange={setCustomerId}
                options={customerOptions}
                placeholder="Select a customer…"
              />
              <FieldHint>
                The invoice will be addressed to this customer&apos;s billing details.
              </FieldHint>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="inv-issue">Issue date</Label>
                <Input
                  id="inv-issue"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-due">Due date</Label>
                <Input
                  id="inv-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Line items</Label>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={addLine}
                >
                  <Plus /> Add item
                </Button>
              </div>
              <div className="space-y-2">
                {lines.map((line) => {
                  const rowTotal = line.qty * line.unitPrice;
                  return (
                    <div
                      key={line.key}
                      className={cn(
                        "rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3 shadow-elev-xs",
                        "grid grid-cols-12 gap-2"
                      )}
                    >
                      <div className="col-span-12 sm:col-span-6">
                        <Select
                          value={line.productId}
                          onValueChange={(v) => onProductChange(line.key, v)}
                          options={productOptions}
                          placeholder="Select a product…"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={line.qty}
                          onChange={(e) =>
                            updateLine(line.key, {
                              qty: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          placeholder="Qty"
                          aria-label="Quantity"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={line.unitPrice}
                          onChange={(e) =>
                            updateLine(line.key, {
                              unitPrice: Math.max(
                                0,
                                Number(e.target.value) || 0
                              ),
                            })
                          }
                          placeholder="Unit price"
                          aria-label="Unit price"
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-end px-2 font-mono text-sm font-semibold tabular-nums sm:col-span-2">
                        {formatCurrency(rowTotal)}
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        <button
                          type="button"
                          aria-label="Remove line"
                          disabled={lines.length <= 1}
                          onClick={() => removeLine(line.key)}
                          className="inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-destructive)]/10 hover:text-[color:var(--color-destructive)] disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/30 px-4 py-3">
              <div className="ml-auto w-full max-w-xs space-y-1 text-sm">
                <div className="flex justify-between text-[color:var(--color-muted-foreground)]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[color:var(--color-muted-foreground)]">
                  <span>Tax (7.5%)</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[color:var(--color-border)] pt-1.5 text-sm font-semibold">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="inv-notes">Notes</Label>
              <Textarea
                id="inv-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional — payment instructions, internal reference, etc."
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!isValid}
            >
              Create invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
