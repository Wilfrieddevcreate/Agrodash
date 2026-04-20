"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  title?: string;
  description?: string;
  showClose?: boolean;
  widthClass?: string;
  className?: string;
  children?: React.ReactNode;
}

const DialogCtx = React.createContext<{
  onOpenChange: (open: boolean) => void;
} | null>(null);

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", key);
    };
  }, [open, onOpenChange]);

  return (
    <DialogCtx.Provider value={{ onOpenChange }}>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => onOpenChange(false)}
              className="absolute inset-0 bg-[color:var(--color-foreground)]/35 backdrop-blur-sm"
            />
            {children}
          </div>
        )}
      </AnimatePresence>
    </DialogCtx.Provider>
  );
}

export function DialogContent({
  title,
  description,
  showClose = true,
  widthClass = "max-w-lg",
  className,
  children,
}: DialogContentProps) {
  const ctx = React.useContext(DialogCtx);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)] shadow-elev-xl sm:max-h-[min(calc(100vh-4rem),720px)] sm:rounded-2xl",
        widthClass,
        className
      )}
    >
      {(title || description) && (
        <div className="shrink-0 border-b border-[color:var(--color-border)] px-5 py-4 pr-12 sm:px-6">
          {title && (
            <h2 className="text-base font-semibold leading-tight">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
              {description}
            </p>
          )}
        </div>
      )}
      {showClose && (
        <button
          type="button"
          onClick={() => ctx?.onOpenChange(false)}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)]"
        >
          <X className="size-4" />
        </button>
      )}
      {children}
    </motion.div>
  );
}

export function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-5 py-5 sm:px-6", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-card)] px-5 py-3 sm:px-6 sm:py-3.5",
        className
      )}
      {...props}
    />
  );
}
