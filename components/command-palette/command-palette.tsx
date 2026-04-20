"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  BarChart3,
  CalendarDays,
  FilePlus2,
  Globe,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Moon,
  Package,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Sun,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, useT } from "@/components/providers/language-provider";
import { Kbd } from "@/components/ui/kbd";

/* ──────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────── */

type CommandGroup = "navigation" | "quickActions" | "recent";

interface CommandItem {
  id: string;
  group: CommandGroup;
  label: string;
  description?: string;
  icon: LucideIcon;
  /** Small right-aligned kbd hint (e.g. "⌘D") — only for top nav items. */
  shortcut?: string[];
  /** Extra search terms not shown in the UI. */
  keywords?: string;
  onSelect: () => void;
}

/* ──────────────────────────────────────────────────────────
 * Command palette
 * ────────────────────────────────────────────────────────── */

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const router = useRouter();
  const { locale, setLocale } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);

  /* ------------------------------------------------------------------
   * Body scroll lock + Escape-to-close while palette is open
   * ------------------------------------------------------------------ */
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Reset query + focus input whenever the palette opens.
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Focus next tick so the <input> is mounted.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  /* ------------------------------------------------------------------
   * Command items
   * ------------------------------------------------------------------ */
  const commands = React.useMemo<CommandItem[]>(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };
    const fireToast = (title: string, description?: string) => () => {
      close();
      toast(title, description ? { description } : undefined);
    };
    const nextTheme =
      (resolvedTheme ?? theme) === "dark" ? "light" : "dark";

    return [
      // Navigation (9 items — dashboard through settings)
      {
        id: "nav-dashboard",
        group: "navigation",
        label: t.nav.dashboard,
        description: t.commandPalette.nav.dashboardDesc,
        icon: LayoutDashboard,
        shortcut: ["g", "d"],
        keywords: "home overview",
        onSelect: go("/"),
      },
      {
        id: "nav-products",
        group: "navigation",
        label: t.nav.products,
        description: t.commandPalette.nav.productsDesc,
        icon: Package,
        shortcut: ["g", "p"],
        keywords: "inventory catalog",
        onSelect: go("/products"),
      },
      {
        id: "nav-orders",
        group: "navigation",
        label: t.nav.orders,
        description: t.commandPalette.nav.ordersDesc,
        icon: ShoppingCart,
        shortcut: ["g", "o"],
        keywords: "fulfillment sales",
        onSelect: go("/orders"),
      },
      {
        id: "nav-customers",
        group: "navigation",
        label: t.nav.customers,
        description: t.commandPalette.nav.customersDesc,
        icon: Users,
        shortcut: ["g", "c"],
        keywords: "farmers cooperatives distributors",
        onSelect: go("/customers"),
      },
      {
        id: "nav-invoices",
        group: "navigation",
        label: t.nav.invoices,
        description: t.commandPalette.nav.invoicesDesc,
        icon: Receipt,
        shortcut: ["g", "i"],
        keywords: "billing receivables",
        onSelect: go("/invoices"),
      },
      {
        id: "nav-calendar",
        group: "navigation",
        label: t.nav.calendar,
        description: t.commandPalette.nav.calendarDesc,
        icon: CalendarDays,
        shortcut: ["g", "l"],
        keywords: "schedule planning",
        onSelect: go("/calendar"),
      },
      {
        id: "nav-kanban",
        group: "navigation",
        label: t.nav.kanban,
        description: t.commandPalette.nav.kanbanDesc,
        icon: KanbanSquare,
        shortcut: ["g", "k"],
        keywords: "board tasks",
        onSelect: go("/kanban"),
      },
      {
        id: "nav-analytics",
        group: "navigation",
        label: t.nav.analytics,
        description: t.commandPalette.nav.analyticsDesc,
        icon: BarChart3,
        shortcut: ["g", "a"],
        keywords: "reports insights",
        onSelect: go("/analytics"),
      },
      {
        id: "nav-settings",
        group: "navigation",
        label: t.nav.settings,
        description: t.commandPalette.nav.settingsDesc,
        icon: Settings,
        shortcut: ["g", "s"],
        keywords: "preferences workspace",
        onSelect: go("/settings"),
      },

      // Quick actions
      {
        id: "action-new-order",
        group: "quickActions",
        label: t.commandPalette.actions.newOrder,
        description: t.commandPalette.actions.newOrderDesc,
        icon: ShoppingCart,
        keywords: "create order",
        onSelect: fireToast(
          t.commandPalette.toasts.newOrderTitle,
          t.commandPalette.toasts.newOrderDesc
        ),
      },
      {
        id: "action-new-invoice",
        group: "quickActions",
        label: t.commandPalette.actions.newInvoice,
        description: t.commandPalette.actions.newInvoiceDesc,
        icon: FilePlus2,
        keywords: "create invoice",
        onSelect: fireToast(
          t.commandPalette.toasts.newInvoiceTitle,
          t.commandPalette.toasts.newInvoiceDesc
        ),
      },
      {
        id: "action-new-task",
        group: "quickActions",
        label: t.commandPalette.actions.newTask,
        description: t.commandPalette.actions.newTaskDesc,
        icon: KanbanSquare,
        keywords: "create task",
        onSelect: fireToast(
          t.commandPalette.toasts.newTaskTitle,
          t.commandPalette.toasts.newTaskDesc
        ),
      },
      {
        id: "action-new-event",
        group: "quickActions",
        label: t.commandPalette.actions.newEvent,
        description: t.commandPalette.actions.newEventDesc,
        icon: CalendarDays,
        keywords: "create event calendar",
        onSelect: fireToast(
          t.commandPalette.toasts.newEventTitle,
          t.commandPalette.toasts.newEventDesc
        ),
      },
      {
        id: "action-toggle-theme",
        group: "quickActions",
        label: t.commandPalette.actions.toggleTheme,
        description: t.commandPalette.actions.toggleThemeDesc,
        icon: nextTheme === "dark" ? Moon : Sun,
        keywords: "dark light mode",
        onSelect: () => {
          setTheme(nextTheme);
          close();
        },
      },
      {
        id: "action-switch-language",
        group: "quickActions",
        label:
          locale === "en"
            ? t.commandPalette.actions.switchToFrench
            : t.commandPalette.actions.switchToEnglish,
        description: t.commandPalette.actions.switchLanguageDesc,
        icon: Globe,
        keywords: "locale fr en français english",
        onSelect: () => {
          setLocale(locale === "en" ? "fr" : "en");
          close();
        },
      },
      {
        id: "action-profile",
        group: "quickActions",
        label: t.commandPalette.actions.goToProfile,
        description: t.commandPalette.actions.goToProfileDesc,
        icon: User,
        keywords: "me account",
        onSelect: go("/settings"),
      },
      {
        id: "action-logout",
        group: "quickActions",
        label: t.commandPalette.actions.logOut,
        description: t.commandPalette.actions.logOutDesc,
        icon: LogOut,
        keywords: "sign out exit",
        onSelect: fireToast(
          t.commandPalette.toasts.loggingOut,
          t.commandPalette.toasts.loggingOutDesc
        ),
      },

      // Recently viewed (3 mock entries)
      {
        id: "recent-order",
        group: "recent",
        label: t.commandPalette.recent.latestOrder,
        description: t.commandPalette.recent.latestOrderDesc,
        icon: ShoppingCart,
        keywords: "order recent",
        onSelect: go("/orders"),
      },
      {
        id: "recent-customer",
        group: "recent",
        label: t.commandPalette.recent.latestCustomer,
        description: t.commandPalette.recent.latestCustomerDesc,
        icon: UserPlus,
        keywords: "customer recent",
        onSelect: go("/customers"),
      },
      {
        id: "recent-invoice",
        group: "recent",
        label: t.commandPalette.recent.latestInvoice,
        description: t.commandPalette.recent.latestInvoiceDesc,
        icon: Receipt,
        keywords: "invoice recent",
        onSelect: go("/invoices"),
      },
    ];
  }, [t, locale, setLocale, theme, resolvedTheme, setTheme, router, close]);

  /* ------------------------------------------------------------------
   * Filtered + grouped result set
   * ------------------------------------------------------------------ */
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => {
      const hay = (
        c.label +
        " " +
        (c.description ?? "") +
        " " +
        (c.keywords ?? "") +
        " " +
        t.commandPalette.groups[c.group]
      ).toLowerCase();
      return hay.includes(q);
    });
  }, [query, commands, t.commandPalette.groups]);

  // Clamp active index into range when results change.
  React.useEffect(() => {
    setActiveIndex((i) => {
      if (filtered.length === 0) return 0;
      return Math.min(i, filtered.length - 1);
    });
  }, [filtered.length]);

  // Scroll the active row into view when it changes.
  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, filtered]);

  // Grouping for render. Preserves the order items were defined in.
  const grouped = React.useMemo(() => {
    const map = new Map<CommandGroup, CommandItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.group) ?? [];
      arr.push(item);
      map.set(item.group, arr);
    }
    const order: CommandGroup[] = ["navigation", "quickActions", "recent"];
    return order
      .filter((g) => map.has(g))
      .map((g) => ({ group: g, items: map.get(g) ?? [] }));
  }, [filtered]);

  /* ------------------------------------------------------------------
   * Keyboard navigation (on the input)
   * ------------------------------------------------------------------ */
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length === 0 ? 0 : (i + 1) % filtered.length
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length === 0
          ? 0
          : (i - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) item.onSelect();
    }
    // Escape is handled by the open-effect above.
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-[15vh]"
          aria-hidden={!open}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label={t.commandPalette.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            className="absolute inset-0 cursor-default bg-[color:var(--color-foreground)]/35 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.commandPalette.placeholder}
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)] shadow-elev-xl"
          >
            {/* Search input */}
            <div className="relative flex items-center border-b border-[color:var(--color-border)] px-4">
              <Search className="size-4 shrink-0 text-[color:var(--color-muted-foreground)]" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-palette-list"
                aria-activedescendant={
                  filtered[activeIndex]
                    ? `cmd-item-${filtered[activeIndex].id}`
                    : undefined
                }
                aria-label={t.commandPalette.placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder={t.commandPalette.placeholder}
                className="h-12 w-full bg-transparent pl-3 pr-2 text-sm placeholder:text-[color:var(--color-muted-foreground)] focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <Kbd className="ml-2 shrink-0">ESC</Kbd>
            </div>

            {/* Results */}
            <div
              id="command-palette-list"
              ref={listRef}
              role="listbox"
              aria-label={t.commandPalette.placeholder}
              className="max-h-[min(60vh,420px)] overflow-y-auto py-1.5"
            >
              {filtered.length === 0 ? (
                <EmptyResults query={query} />
              ) : (
                grouped.map(({ group, items }) => {
                  // Compute the index offset so each row knows its absolute
                  // position in the filtered array.
                  const start = filtered.indexOf(items[0]);
                  return (
                    <div
                      key={group}
                      role="group"
                      aria-label={t.commandPalette.groups[group]}
                      className="px-1.5 py-1"
                    >
                      <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                        {t.commandPalette.groups[group]}
                      </div>
                      {items.map((item, localIdx) => {
                        const absIdx = start + localIdx;
                        const isActive = absIdx === activeIndex;
                        return (
                          <CommandRow
                            key={item.id}
                            item={item}
                            active={isActive}
                            index={absIdx}
                            onMouseEnter={() => setActiveIndex(absIdx)}
                            onClick={() => item.onSelect()}
                          />
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────
 * Row
 * ────────────────────────────────────────────────────────── */

function CommandRow({
  item,
  active,
  index,
  onMouseEnter,
  onClick,
}: {
  item: CommandItem;
  active: boolean;
  index: number;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      id={`cmd-item-${item.id}`}
      role="option"
      aria-selected={active}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseEnter}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
        active
          ? "bg-[color:var(--color-muted)] text-[color:var(--color-foreground)]"
          : "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]/60"
      )}
    >
      {/* Left accent bar on active/hover */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full transition-colors",
          active ? "bg-[color:var(--color-primary)]" : "bg-transparent"
        )}
      />
      <span
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--color-muted)]/70 text-[color:var(--color-muted-foreground)] transition-colors",
          active &&
            "bg-[color:var(--color-card)] text-[color:var(--color-foreground)] ring-1 ring-[color:var(--color-border)]"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{item.label}</span>
        {item.description && (
          <span className="block truncate text-xs text-[color:var(--color-muted-foreground)]">
            {item.description}
          </span>
        )}
      </span>
      {item.shortcut && item.shortcut.length > 0 && (
        <span className="ml-auto flex shrink-0 items-center gap-1">
          {item.shortcut.map((k, i) => (
            <Kbd key={i}>{k}</Kbd>
          ))}
        </span>
      )}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────
 * Empty state
 * ────────────────────────────────────────────────────────── */

function EmptyResults({ query }: { query: string }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-[color:var(--color-muted)] text-[color:var(--color-muted-foreground)]">
        <Sparkles className="size-4" />
      </div>
      <p className="text-sm font-medium text-[color:var(--color-foreground)]">
        {t.commandPalette.empty.title.replace(
          "{query}",
          query || "…"
        )}
      </p>
      <p className="mt-1 max-w-sm text-xs text-[color:var(--color-muted-foreground)]">
        {t.commandPalette.empty.subtitle}
      </p>
    </div>
  );
}
