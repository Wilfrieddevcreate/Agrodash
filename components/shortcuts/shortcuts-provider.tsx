"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ShortcutsDialog } from "@/components/shortcuts/shortcuts-dialog";
import { useLanguage, useT } from "@/components/providers/language-provider";

interface ShortcutsContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
}

const ShortcutsContext = React.createContext<ShortcutsContextValue | undefined>(
  undefined
);

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

/** Valid second keys for "g <letter>" navigation sequences. */
const NAV_SEQUENCES: Record<string, string> = {
  d: "/",
  p: "/products",
  o: "/orders",
  c: "/customers",
  i: "/invoices",
  l: "/calendar",
  k: "/kanban",
  a: "/analytics",
  s: "/settings",
};

export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const t = useT();

  // Latest handlers in a ref so the global listener doesn't re-register.
  const handlersRef = React.useRef({
    router,
    setTheme,
    setLocale,
    theme,
    resolvedTheme,
    locale,
    t,
  });
  React.useEffect(() => {
    handlersRef.current = {
      router,
      setTheme,
      setLocale,
      theme,
      resolvedTheme,
      locale,
      t,
    };
  }, [router, setTheme, setLocale, theme, resolvedTheme, locale, t]);

  const openShortcuts = React.useCallback(() => setOpen(true), []);
  const closeShortcuts = React.useCallback(() => setOpen(false), []);

  /* ------------------------------------------------------------------
   * Global keyboard handler.
   * - "?" (Shift+/) or Ctrl+/ → open shortcuts dialog
   * - Ctrl+T → toggle theme
   * - Ctrl+L → toggle locale
   * - "g <letter>" within 800 ms → navigate
   * Never intercepts when the user is typing.
   * ------------------------------------------------------------------ */
  React.useEffect(() => {
    let pendingG = false;
    let pendingTimer: ReturnType<typeof setTimeout> | null = null;

    function clearPending() {
      pendingG = false;
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingTimer = null;
      }
    }

    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;

      const key = e.key;
      const lower = key.toLowerCase();
      const isMod = e.ctrlKey || e.metaKey;

      // Ctrl+T → toggle theme
      if (isMod && !e.shiftKey && !e.altKey && lower === "t") {
        e.preventDefault();
        const h = handlersRef.current;
        const next = (h.resolvedTheme ?? h.theme) === "dark" ? "light" : "dark";
        h.setTheme(next);
        toast(h.t.shortcuts.toasts.themeToggled);
        clearPending();
        return;
      }

      // Ctrl+L → toggle locale
      if (isMod && !e.shiftKey && !e.altKey && lower === "l") {
        e.preventDefault();
        const h = handlersRef.current;
        h.setLocale(h.locale === "en" ? "fr" : "en");
        toast(h.t.shortcuts.toasts.languageSwitched);
        clearPending();
        return;
      }

      // Ctrl+/ or "?" (Shift+/) → open shortcuts dialog
      const isCtrlSlash = isMod && !e.altKey && key === "/";
      const isQuestionMark = !isMod && !e.altKey && key === "?";
      if (isCtrlSlash || isQuestionMark) {
        e.preventDefault();
        clearPending();
        setOpen(true);
        return;
      }

      // "g <letter>" navigation (ignore while any modifier is held).
      if (isMod || e.altKey) {
        clearPending();
        return;
      }

      if (pendingG) {
        const target = NAV_SEQUENCES[lower];
        if (target) {
          e.preventDefault();
          handlersRef.current.router.push(target);
        }
        clearPending();
        return;
      }

      if (lower === "g") {
        pendingG = true;
        pendingTimer = setTimeout(clearPending, 800);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearPending();
    };
    // handlersRef captures the latest; this effect should only mount once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = React.useMemo<ShortcutsContextValue>(
    () => ({ open, setOpen, openShortcuts, closeShortcuts }),
    [open, openShortcuts, closeShortcuts]
  );

  return (
    <ShortcutsContext.Provider value={value}>
      {children}
      <ShortcutsDialog open={open} onOpenChange={setOpen} />
    </ShortcutsContext.Provider>
  );
}

export function useShortcuts() {
  const ctx = React.useContext(ShortcutsContext);
  if (!ctx) {
    throw new Error("useShortcuts must be used within <ShortcutsProvider>");
  }
  return ctx;
}
