"use client";

import * as React from "react";

/** Currencies surfaced in the Settings picker. */
export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "XOF",
  "NGN",
  "ZAR",
  "KES",
  "GHS",
] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Format a numeric amount using the active currency. */
  format: (amount: number) => string;
}

const CurrencyContext = React.createContext<CurrencyContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "agrodash-currency";

function isSupported(c: string | null): c is Currency {
  return (
    c !== null &&
    (SUPPORTED_CURRENCIES as readonly string[]).includes(c as Currency)
  );
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = React.useState<Currency>("USD");

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isSupported(saved)) setCurrencyState(saved);
    } catch {}
  }, []);

  const setCurrency = React.useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {}
  }, []);

  const format = React.useCallback(
    (amount: number) => {
      // Use French locale when the active document language is French so the
      // number grouping matches (`1 234,50 €` vs `$1,234.50`). Otherwise
      // default to en-US for Anglo currencies.
      const lang =
        typeof document !== "undefined" && document.documentElement.lang
          ? document.documentElement.lang
          : "en";
      const numericLocale = lang.startsWith("fr") ? "fr-FR" : "en-US";
      try {
        return new Intl.NumberFormat(numericLocale, {
          style: "currency",
          currency,
          maximumFractionDigits: amount >= 10000 ? 0 : 2,
        }).format(amount);
      } catch {
        // Fallback if the currency code isn't supported by the runtime
        return `${currency} ${amount.toLocaleString(numericLocale)}`;
      }
    },
    [currency]
  );

  const value = React.useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, format }),
    [currency, setCurrency, format]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
