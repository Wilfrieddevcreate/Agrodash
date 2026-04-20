"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
  contentClassName?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "end",
  className,
  contentClassName,
}: DropdownProps) {
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

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(
              "absolute z-40 mt-1.5 min-w-[220px] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-popover)] p-1 shadow-xl",
              align === "end" ? "right-0" : "left-0",
              contentClassName
            )}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({
  className,
  children,
  icon,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
        variant === "destructive"
          ? "text-[color:var(--color-destructive)] hover:bg-[color:var(--color-destructive)]/10"
          : "text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]",
        className
      )}
      {...props}
    >
      {icon && <span className="text-[color:var(--color-muted-foreground)]">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-[color:var(--color-border)]" />;
}

export function DropdownLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-muted-foreground)]",
        className
      )}
    >
      {children}
    </div>
  );
}
