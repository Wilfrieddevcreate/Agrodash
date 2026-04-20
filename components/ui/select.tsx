"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  value: string;
  onValueChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  align?: "start" | "end";
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  triggerClassName,
  align = "start",
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative inline-block w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-[color:var(--color-input)] bg-[color:var(--color-card)] px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:border-[color:var(--color-ring)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40",
          triggerClassName
        )}
      >
        <span
          className={cn(
            "flex min-w-0 items-center gap-2 truncate",
            !selected && "text-[color:var(--color-muted-foreground)]"
          )}
        >
          {selected?.icon}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[color:var(--color-muted-foreground)] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div
          role="listbox"
          className={cn(
            "animate-fade-in-up absolute z-40 mt-1.5 min-w-full max-h-64 overflow-auto rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-popover)] p-1 shadow-lg",
            align === "end" ? "right-0" : "left-0"
          )}
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onValueChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]"
                    : "hover:bg-[color:var(--color-muted)]"
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </span>
                {active && <Check className="size-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
