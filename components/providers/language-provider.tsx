"use client";

import * as React from "react";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = React.createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "agrodash-locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      (window.localStorage.getItem(STORAGE_KEY) as Locale | null)) || null;
    if (saved === "en" || saved === "fr") {
      setLocaleState(saved);
    } else if (typeof navigator !== "undefined") {
      const nav = navigator.language?.toLowerCase() ?? "";
      if (nav.startsWith("fr")) setLocaleState("fr");
    }
  }, []);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  const value = React.useMemo(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
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
