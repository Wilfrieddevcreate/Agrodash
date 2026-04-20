"use client";

import * as React from "react";
import {
  Bell,
  Check,
  Globe,
  HelpCircle,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn, relativeTime } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { useLanguage, useT } from "@/components/providers/language-provider";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/dropdown";
import { Tooltip } from "@/components/ui/tooltip";

export function Header() {
  const { setMobileOpen } = useSidebar();
  const t = useT();
  const { locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const mobileSearchRef = React.useRef<HTMLInputElement>(null);

  // Ctrl/Cmd+K focuses the search input
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // On mobile, open the drawer and focus its input; on desktop focus the header search
        if (window.matchMedia("(min-width: 768px)").matches) {
          searchRef.current?.focus();
          searchRef.current?.select();
        } else {
          setMobileSearchOpen(true);
          // Let the drawer mount, then focus
          requestAnimationFrame(() => {
            mobileSearchRef.current?.focus();
          });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[color:var(--color-background)]/80 backdrop-blur-md">
      <div className="flex h-16 min-w-0 items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={t.nav.openMenu}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        {/* Search — desktop / tablet */}
        <div className="relative ml-1 hidden min-w-0 flex-1 md:flex md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
          <input
            ref={searchRef}
            type="text"
            placeholder={t.nav.search}
            className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/40 pl-9 pr-14 text-sm transition-all placeholder:text-[color:var(--color-muted-foreground)] focus:bg-[color:var(--color-card)] focus-visible:border-[color:var(--color-ring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/30"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-0.5 rounded border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--color-muted-foreground)] lg:inline-flex">
            Ctrl K
          </kbd>
        </div>

        <div className="flex-1 md:hidden" />

        {/* Right cluster */}
        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <Tooltip content={t.nav.searchShort} side="bottom">
            <button
              type="button"
              aria-label={t.nav.searchShort}
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] md:hidden"
            >
              <Search className="size-[18px]" />
            </button>
          </Tooltip>

          {/* Language */}
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label={t.nav.language}
                className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] sm:h-9"
              >
                <Globe className="size-4" />
                <span className="hidden xs:inline sm:inline">{locale}</span>
              </button>
            }
          >
          <DropdownLabel>{t.nav.language}</DropdownLabel>
          <DropdownItem onClick={() => setLocale("en")}>
            <span className="flex-1">English</span>
            {locale === "en" && <Check className="size-4 text-[color:var(--color-primary)]" />}
          </DropdownItem>
          <DropdownItem onClick={() => setLocale("fr")}>
            <span className="flex-1">Français</span>
            {locale === "fr" && <Check className="size-4 text-[color:var(--color-primary)]" />}
          </DropdownItem>
        </Dropdown>

        {/* Theme */}
        <Tooltip content={t.nav.toggleTheme} side="bottom">
          <button
            type="button"
            aria-label={t.nav.toggleTheme}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative inline-flex size-10 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] sm:size-9"
          >
            {mounted ? (
              <>
                <Sun className="size-[18px] scale-100 rotate-0 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-[18px] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
              </>
            ) : (
              <Monitor className="size-[18px]" />
            )}
          </button>
        </Tooltip>

        {/* Notifications */}
        <NotificationsMenu />

        {/* Help */}
        <Tooltip content={t.nav.help} side="bottom">
          <button
            type="button"
            aria-label={t.nav.help}
            className="hidden size-9 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] lg:inline-flex"
          >
            <HelpCircle className="size-[18px]" />
          </button>
        </Tooltip>

        <div className="mx-1 hidden h-6 w-px bg-[color:var(--color-border)] lg:block" />

        {/* Profile */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-0.5 pr-0 text-left transition-colors hover:bg-[color:var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] sm:pr-2"
            >
              <Avatar name="Alex Diallo" size="md" />
              <div className="hidden text-xs leading-tight lg:block">
                <div className="font-semibold text-[color:var(--color-foreground)]">
                  Alex Diallo
                </div>
                <div className="text-[color:var(--color-muted-foreground)]">
                  Operations
                </div>
              </div>
            </button>
          }
        >
          <div className="px-2.5 py-2">
            <div className="text-sm font-semibold">Alex Diallo</div>
            <div className="text-xs text-[color:var(--color-muted-foreground)]">
              alex@agrodash.io
            </div>
          </div>
          <DropdownSeparator />
          <Link href="/settings" className="block">
            <DropdownItem icon={<User className="size-4" />}>
              {t.nav.profile}
            </DropdownItem>
          </Link>
          <Link href="/settings" className="block">
            <DropdownItem icon={<Settings className="size-4" />}>
              {t.nav.settings}
            </DropdownItem>
          </Link>
          <DropdownSeparator />
          <DropdownItem icon={<LogOut className="size-4" />} variant="destructive">
            {t.nav.logout}
          </DropdownItem>
        </Dropdown>
        </div>
      </div>

      {/* Mobile search drawer */}
      {mobileSearchOpen && (
        <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 py-2 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
            <input
              ref={mobileSearchRef}
              autoFocus
              type="text"
              placeholder={t.nav.search}
              className="h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/40 pl-9 pr-3 text-sm transition-all placeholder:text-[color:var(--color-muted-foreground)] focus:bg-[color:var(--color-card)] focus-visible:border-[color:var(--color-ring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/30"
            />
          </div>
        </div>
      )}
    </header>
  );
}

function NotificationsMenu() {
  const t = useT();
  const items = [
    {
      icon: "🟢",
      title: t.nav.notif.orderDelivered,
      description: t.nav.notif.orderDeliveredDesc,
      time: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    },
    {
      icon: "⚠️",
      title: t.nav.notif.lowStock,
      description: t.nav.notif.lowStockDesc,
      time: new Date(Date.now() - 46 * 60 * 1000).toISOString(),
    },
    {
      icon: "🧑‍🌾",
      title: t.nav.notif.newCustomer,
      description: t.nav.notif.newCustomerDesc,
      time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <Dropdown
      contentClassName="w-80 p-0 overflow-hidden"
      trigger={
        <button
          type="button"
          aria-label={t.nav.notifications}
          className="relative inline-flex size-9 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-[color:var(--color-primary)] ring-2 ring-[color:var(--color-background)]" />
        </button>
      }
    >
      <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
        <div>
          <div className="text-sm font-semibold">{t.nav.notifications}</div>
          <div className="text-xs text-[color:var(--color-muted-foreground)]">
            {t.nav.notificationsUnread.replace("{count}", "3")}
          </div>
        </div>
        <button className="text-xs font-medium text-[color:var(--color-primary)] hover:underline">
          {t.nav.markAllRead}
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.map((n, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--color-muted)]",
              i < items.length - 1 && "border-b border-[color:var(--color-border)]"
            )}
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-muted)] text-base">
              {n.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{n.title}</div>
              <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                {n.description}
              </div>
              <div
                suppressHydrationWarning
                className="mt-1 text-[11px] text-[color:var(--color-muted-foreground)]"
              >
                {relativeTime(n.time)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="block w-full border-t border-[color:var(--color-border)] py-2.5 text-center text-xs font-medium text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-muted)]">
        {t.nav.viewAll}
      </button>
    </Dropdown>
  );
}
