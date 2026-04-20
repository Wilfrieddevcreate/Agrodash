"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  ChevronsLeft,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { useT } from "@/components/providers/language-provider";
import { Logo } from "@/components/layout/logo";
import { Tooltip } from "@/components/ui/tooltip";

type NavKey =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "invoices"
  | "calendar"
  | "kanban"
  | "analytics"
  | "settings";

type NavItem = {
  href: string;
  key: NavKey;
  icon: React.ElementType;
  badge?: string;
};

const mainNav: NavItem[] = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/products", key: "products", icon: Package },
  { href: "/orders", key: "orders", icon: ShoppingCart, badge: "12" },
  { href: "/customers", key: "customers", icon: Users },
  { href: "/invoices", key: "invoices", icon: Receipt },
  { href: "/calendar", key: "calendar", icon: CalendarDays },
  { href: "/kanban", key: "kanban", icon: KanbanSquare },
  { href: "/analytics", key: "analytics", icon: BarChart3 },
];

const prefsNav: NavItem[] = [
  { href: "/settings", key: "settings", icon: Settings },
];

function isPathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/* ──────────────────────────────────────────────────────────
 * Sidebar
 * ────────────────────────────────────────────────────────── */

export function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();
  const t = useT();

  // Ctrl/Cmd+B toggles desktop collapse (ignored while typing in inputs)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() !== "b") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }
      e.preventDefault();
      setCollapsed(!collapsed);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collapsed, setCollapsed]);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-[color:var(--color-foreground)]/45 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        aria-label={t.nav.primary}
        data-collapsed={collapsed ? "true" : "false"}
        className={cn(
          // Positioning & surface
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "border-r border-[color:var(--color-border)] bg-[color:var(--color-card)]",
          // Width: mobile 280px, desktop 80 (collapsed) / 260 (expanded)
          "w-[280px] max-w-[85vw]",
          collapsed ? "lg:w-[80px]" : "lg:w-[260px]",
          // Smooth transitions
          "transition-[width,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Mobile slide
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          // Subtle shadow on mobile drawer
          "shadow-xl lg:shadow-none"
        )}
      >
        {/* Brand row */}
        <SidebarBrand collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />

        {/* Nav */}
        <nav
          aria-label={t.nav.mainNavigation}
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-3"
        >
          <NavGroup label={t.nav.main} collapsed={collapsed}>
            {mainNav.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                active={isPathActive(pathname, item.href)}
                collapsed={collapsed}
                label={t.nav[item.key]}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </NavGroup>

          <NavDivider collapsed={collapsed} />

          <NavGroup label={t.nav.preferences} collapsed={collapsed}>
            {prefsNav.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                active={isPathActive(pathname, item.href)}
                collapsed={collapsed}
                label={t.nav[item.key]}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </NavGroup>
        </nav>

        {/* Upgrade promo */}
        <UpgradePromo collapsed={collapsed} />

        {/* Bottom: user + toggle */}
        <div className="border-t border-[color:var(--color-border)]">
          <UserChip collapsed={collapsed} />
          <CollapseToggle
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Mobile close button — floats in the corner */}
        <button
          type="button"
          aria-label={t.nav.closeMenu}
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] lg:hidden"
        >
          <X className="size-5" />
        </button>
      </aside>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Sections
 * ────────────────────────────────────────────────────────── */

function SidebarBrand({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const t = useT();
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center border-b border-[color:var(--color-border)]",
        // Mobile always left-padded, desktop depends on collapsed
        "px-4",
        collapsed && "lg:justify-center lg:px-0"
      )}
    >
      <Link
        href="/"
        onClick={onNavigate}
        aria-label={t.nav.brandHome}
        className="flex items-center"
      >
        {/* Mobile + desktop expanded → full logo; collapsed → icon-only */}
        <span className="contents lg:hidden">
          <Logo iconOnly={false} />
        </span>
        <span className="hidden lg:contents">
          <Logo iconOnly={collapsed} />
        </span>
      </Link>
    </div>
  );
}

function NavGroup({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        collapsed ? "gap-1 lg:items-center lg:px-0" : "gap-0.5 px-3"
      )}
    >
      <div
        className={cn(
          "mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]",
          collapsed && "lg:hidden"
        )}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function NavDivider({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "my-3 h-px bg-[color:var(--color-border)]",
        collapsed ? "mx-auto w-10 lg:w-10" : "mx-6"
      )}
    />
  );
}

function NavLink({
  item,
  active,
  collapsed,
  label,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  label: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center text-sm font-medium outline-none transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--color-card)]",
        // Default expanded geometry (mobile always + desktop expanded)
        "gap-3 rounded-lg px-3 py-2.5 sm:py-2",
        active
          ? "bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)]"
          : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
        // Desktop-collapsed geometry: exact 40×40 tile on the rail
        collapsed &&
          "lg:h-10 lg:w-10 lg:gap-0 lg:justify-center lg:rounded-xl lg:p-0"
      )}
    >
      {/* Left active bar — expanded only */}
      {active && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-[color:var(--color-primary)]",
            collapsed && "lg:hidden"
          )}
        />
      )}

      <Icon className="size-[18px] shrink-0" />

      <span className={cn("truncate", collapsed && "lg:hidden")}>{label}</span>

      {item.badge && (
        <>
          {/* Inline pill badge — expanded */}
          <span
            className={cn(
              "ml-auto inline-flex h-5 min-w-[22px] items-center justify-center rounded-full bg-[color:var(--color-primary)]/15 px-1.5 text-[10px] font-semibold text-[color:var(--color-primary)]",
              collapsed && "lg:hidden"
            )}
          >
            {item.badge}
          </span>
          {/* Dot indicator — collapsed only */}
          {collapsed && (
            <span
              aria-hidden
              className="absolute right-1.5 top-1.5 hidden size-2 rounded-full bg-[color:var(--color-primary)] ring-2 ring-[color:var(--color-card)] lg:block"
            />
          )}
        </>
      )}
    </Link>
  );

  // Tooltip only where labels are actually hidden (desktop collapsed)
  if (collapsed) {
    return (
      <>
        <div className="lg:hidden">{link}</div>
        <div className="hidden lg:block">
          <Tooltip content={label} side="right">
            {link}
          </Tooltip>
        </div>
      </>
    );
  }
  return link;
}

/* ──────────────────────────────────────────────────────────
 * Upgrade promo
 * ────────────────────────────────────────────────────────── */

function UpgradePromo({ collapsed }: { collapsed: boolean }) {
  const t = useT();
  return (
    <div className={cn("pb-3", collapsed ? "px-0" : "px-3")}>
      {/* Expanded card — mobile always + desktop expanded */}
      <div className={cn("block", collapsed && "lg:hidden")}>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[color:var(--color-primary)]/15 via-[color:var(--color-primary)]/5 to-transparent p-4 ring-1 ring-inset ring-[color:var(--color-primary)]/20">
          <div className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-[color:var(--color-primary)]/20 blur-2xl" />
          <div className="mb-1.5 inline-flex size-7 items-center justify-center rounded-md bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-sm">
            <Sparkles className="size-3.5" />
          </div>
          <h4 className="text-sm font-semibold">{t.nav.upgradeTitle}</h4>
          <p className="mt-0.5 text-xs text-[color:var(--color-muted-foreground)]">
            {t.nav.upgradeDesc}
          </p>
          <button className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-md bg-[color:var(--color-primary)] text-xs font-semibold text-[color:var(--color-primary-foreground)] transition-all hover:brightness-110">
            {t.nav.upgradeCta}
          </button>
        </div>
      </div>

      {/* Collapsed tile — desktop only */}
      {collapsed && (
        <div className="hidden lg:grid lg:place-items-center">
          <Tooltip content={t.nav.upgradeTitle} side="right">
            <button
              aria-label={t.nav.upgradeTitle}
              className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-primary)]/25 to-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/30 transition-all hover:brightness-110"
            >
              <Sparkles className="size-[18px]" />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
 * User chip (bottom)
 * ────────────────────────────────────────────────────────── */

function UserChip({ collapsed }: { collapsed: boolean }) {
  const t = useT();
  return (
    <>
      {/* Expanded → mobile always + desktop expanded */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-3 py-3",
          collapsed && "lg:hidden"
        )}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-primary)]/25 to-[color:var(--color-accent)]/30 text-[11px] font-semibold text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-border)]">
          {initials("Alex Diallo")}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-semibold">Alex Diallo</div>
          <div className="truncate text-[11px] text-[color:var(--color-muted-foreground)]">
            alex@agrodash.io
          </div>
        </div>
        <button
          type="button"
          aria-label={t.nav.logout}
          className="inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
        >
          <LogOut className="size-4" />
        </button>
      </div>

      {/* Collapsed → desktop only */}
      {collapsed && (
        <div className="hidden lg:grid lg:place-items-center lg:py-3">
          <Tooltip content="Alex Diallo · Operations" side="right">
            <button
              aria-label={t.nav.account}
              className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[color:var(--color-primary)]/25 to-[color:var(--color-accent)]/30 text-[11px] font-semibold text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-border)] transition-all hover:brightness-110"
            >
              {initials("Alex Diallo")}
            </button>
          </Tooltip>
        </div>
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Collapse toggle (bottom)
 * ────────────────────────────────────────────────────────── */

function CollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
      aria-expanded={!collapsed}
      className={cn(
        // Desktop-only bottom toggle (mobile drawer uses the X in the corner)
        "hidden w-full border-t border-[color:var(--color-border)] text-xs font-medium",
        "text-[color:var(--color-muted-foreground)] transition-colors",
        "hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-ring)]/40",
        "lg:flex",
        collapsed
          ? "items-center justify-center py-3"
          : "items-center justify-between gap-2 px-4 py-3"
      )}
    >
      {collapsed ? (
        <span className="grid size-10 place-items-center rounded-xl">
          <motion.span
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex"
          >
            <ChevronsLeft className="size-[18px]" />
          </motion.span>
        </span>
      ) : (
        <>
          <span className="inline-flex items-center gap-2">
            <motion.span
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex"
            >
              <ChevronsLeft className="size-[18px]" />
            </motion.span>
            <span>{t.nav.collapse}</span>
          </span>
          <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-muted-foreground)]">
            Ctrl B
          </kbd>
        </>
      )}
    </button>
  );
}
