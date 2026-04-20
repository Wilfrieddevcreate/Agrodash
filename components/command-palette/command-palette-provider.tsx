"use client";

import * as React from "react";
import { CommandPalette } from "@/components/command-palette/command-palette";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const CommandPaletteContext = React.createContext<
  CommandPaletteContextValue | undefined
>(undefined);

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const openPalette = React.useCallback(() => setOpen(true), []);
  const closePalette = React.useCallback(() => setOpen(false), []);
  const togglePalette = React.useCallback(() => setOpen((v) => !v), []);

  // Global ⌘K / Ctrl+K listener — open the palette from anywhere.
  // Works even while typing in an input (matches Linear/Raycast behaviour).
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      if (e.key.toLowerCase() !== "k") return;
      // Respect other modifier combinations that may be system chords.
      if (e.altKey || e.shiftKey) return;
      e.preventDefault();
      setOpen((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = React.useMemo<CommandPaletteContextValue>(
    () => ({ open, setOpen, openPalette, closePalette, togglePalette }),
    [open, openPalette, closePalette, togglePalette]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = React.useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used within <CommandPaletteProvider>"
    );
  }
  return ctx;
}

/** Helper — exposed as a plain function for places that can't use hooks. */
export { isTypingTarget };
