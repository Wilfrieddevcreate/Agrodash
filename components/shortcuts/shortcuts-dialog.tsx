"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogBody } from "@/components/ui/dialog";
import { Kbd, KbdChord } from "@/components/ui/kbd";
import { useT } from "@/components/providers/language-provider";

type GroupKey = "general" | "navigation" | "actions";

interface ShortcutDef {
  label: string;
  /** Either a single chord string "Ctrl K" or a sequence like "g d" */
  chord: string[];
  /** true → render as "g then d" for sequences */
  sequence?: boolean;
}

export function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();

  const groups: Array<{ key: GroupKey; items: ShortcutDef[] }> = [
    {
      key: "general",
      items: [
        { label: t.shortcuts.items.openPalette, chord: ["Ctrl", "K"] },
        { label: t.shortcuts.items.toggleSidebar, chord: ["Ctrl", "B"] },
        { label: t.shortcuts.items.showShortcuts, chord: ["?"] },
        { label: t.shortcuts.items.toggleTheme, chord: ["Ctrl", "T"] },
        { label: t.shortcuts.items.switchLanguage, chord: ["Ctrl", "L"] },
      ],
    },
    {
      key: "navigation",
      items: [
        { label: t.shortcuts.items.goDashboard, chord: ["g", "d"], sequence: true },
        { label: t.shortcuts.items.goProducts, chord: ["g", "p"], sequence: true },
        { label: t.shortcuts.items.goOrders, chord: ["g", "o"], sequence: true },
        { label: t.shortcuts.items.goCustomers, chord: ["g", "c"], sequence: true },
        { label: t.shortcuts.items.goInvoices, chord: ["g", "i"], sequence: true },
        { label: t.shortcuts.items.goCalendar, chord: ["g", "l"], sequence: true },
        { label: t.shortcuts.items.goKanban, chord: ["g", "k"], sequence: true },
        { label: t.shortcuts.items.goAnalytics, chord: ["g", "a"], sequence: true },
        { label: t.shortcuts.items.goSettings, chord: ["g", "s"], sequence: true },
      ],
    },
    {
      key: "actions",
      items: [
        { label: t.shortcuts.items.newOrder, chord: ["n", "o"], sequence: true },
        { label: t.shortcuts.items.newInvoice, chord: ["n", "i"], sequence: true },
        { label: t.shortcuts.items.newTask, chord: ["n", "t"], sequence: true },
        { label: t.shortcuts.items.newEvent, chord: ["n", "e"], sequence: true },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t.shortcuts.title}
        description={t.shortcuts.subtitle}
        widthClass="max-w-2xl"
      >
        <DialogBody>
          <div className="grid gap-8 sm:grid-cols-2">
            {groups.map((g) => (
              <section key={g.key} aria-labelledby={`sh-h-${g.key}`}>
                <h3
                  id={`sh-h-${g.key}`}
                  className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]"
                >
                  {t.shortcuts.groups[g.key]}
                </h3>
                <ul className="space-y-1.5">
                  {g.items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between gap-4 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-[color:var(--color-muted)]/60"
                    >
                      <span className="min-w-0 truncate text-[color:var(--color-foreground)]">
                        {item.label}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        {item.sequence ? (
                          <>
                            <Kbd size="md">{item.chord[0]}</Kbd>
                            <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                              {t.shortcuts.then}
                            </span>
                            <Kbd size="md">{item.chord[1]}</Kbd>
                          </>
                        ) : (
                          <KbdChord keys={item.chord} size="md" />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
