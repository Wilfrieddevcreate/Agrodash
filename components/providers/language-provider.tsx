"use client";

import * as React from "react";
import {
  dictionaries,
  isRtl,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  /** "rtl" when the active locale is right-to-left, otherwise "ltr" */
  dir: "ltr" | "rtl";
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "agrodash-locale";

function isKnownLocale(value: string | null): value is Locale {
  return value === "en" || value === "fr" || value === "ar";
}

function syncDocument(locale: Locale) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.lang = locale;
  const direction = isRtl(locale) ? "rtl" : "ltr";
  html.dir = direction;
  // Mirror as a data attribute so CSS can key off it without relying on
  // the native `dir` attribute inheritance.
  html.setAttribute("data-rtl", isRtl(locale) ? "true" : "false");
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    let initial: Locale | null = null;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isKnownLocale(saved)) initial = saved;
    } catch {}

    if (!initial && typeof navigator !== "undefined") {
      const nav = navigator.language?.toLowerCase() ?? "";
      if (nav.startsWith("ar")) initial = "ar";
      else if (nav.startsWith("fr")) initial = "fr";
    }

    if (initial) setLocaleState(initial);
    // Ensure the document reflects the active locale even on first load
    syncDocument(initial ?? "en");
  }, []);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    syncDocument(l);
  }, []);

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
      dir: isRtl(locale) ? "rtl" : "ltr",
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
