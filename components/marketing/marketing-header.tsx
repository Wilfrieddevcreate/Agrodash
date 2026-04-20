"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, Menu, Monitor, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
} from "@/components/ui/dropdown";
import { useLanguage, useT } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

const HEADER_LINKS: Array<{
  href: string;
  labelKey: "features" | "pricing" | "faq" | "docs" | "github";
  external?: boolean;
}> = [
  { href: "/#features", labelKey: "features" },
  { href: "/pricing", labelKey: "pricing" },
  { href: "/#faq", labelKey: "faq" },
  { href: "/help", labelKey: "docs" },
  { href: "https://github.com", labelKey: "github", external: true },
];

export function MarketingHeader() {
  const t = useT();
  const { locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile panel on Escape
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300",
        scrolled
          ? "border-[color:var(--color-border)] bg-[color:var(--color-background)]/85"
          : "border-transparent bg-[color:var(--color-background)]/60"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label={t.nav.brandHome}
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
        >
          <Logo iconOnly={false} />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 md:flex"
        >
          {HEADER_LINKS.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer noopener" : undefined}
              className="rounded-md px-3 py-2 text-[13px] font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40"
            >
              {t.marketing.nav[link.labelKey]}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Language */}
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label={t.nav.language}
                className="hidden h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] sm:inline-flex"
              >
                <Globe className="size-4" />
                <span>{locale}</span>
              </button>
            }
          >
            <DropdownLabel>{t.nav.language}</DropdownLabel>
            <DropdownItem onClick={() => setLocale("en")}>
              <span className="flex-1">English</span>
              {locale === "en" && (
                <Check className="size-4 text-[color:var(--color-primary)]" />
              )}
            </DropdownItem>
            <DropdownItem onClick={() => setLocale("fr")}>
              <span className="flex-1">Français</span>
              {locale === "fr" && (
                <Check className="size-4 text-[color:var(--color-primary)]" />
              )}
            </DropdownItem>
          </Dropdown>

          {/* Theme */}
          <Tooltip content={t.nav.toggleTheme} side="bottom">
            <button
              type="button"
              aria-label={t.nav.toggleTheme}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative inline-flex size-9 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
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

          {/* CTAs (desktop) */}
          <div className="ml-1 hidden items-center gap-1.5 sm:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                {t.marketing.nav.signIn}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                {t.marketing.nav.openDashboard}
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? t.marketing.nav.closeMenu : t.marketing.nav.openMenu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] md:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-[color:var(--color-border)] bg-[color:var(--color-background)] md:hidden"
          >
            <div className="mx-auto max-w-6xl px-4 py-4">
              <nav className="flex flex-col gap-1">
                {HEADER_LINKS.map((link) => (
                  <Link
                    key={link.labelKey}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer noopener" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--color-foreground)] transition-colors hover:bg-[color:var(--color-muted)]"
                  >
                    {t.marketing.nav[link.labelKey]}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/login" className="contents">
                  <Button variant="outline" className="w-full">
                    {t.marketing.nav.signIn}
                  </Button>
                </Link>
                <Link href="/dashboard" className="contents">
                  <Button variant="primary" className="w-full">
                    {t.marketing.nav.openDashboard}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
