"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  children: React.ReactNode;
  widthClass?: string;
  className?: string;
  closeButton?: boolean;
}

export function Sheet({
  open,
  onOpenChange,
  side = "left",
  children,
  widthClass = "w-72",
  className,
  closeButton = true,
}: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-[color:var(--color-foreground)]/35 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: side === "left" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "left" ? "-100%" : "100%" }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: "90vw" }}
            className={cn(
              "absolute top-0 h-full bg-[color:var(--color-card)] shadow-elev-xl",
              side === "left" ? "left-0 border-r" : "right-0 border-l",
              "border-[color:var(--color-border)]",
              widthClass,
              className
            )}
          >
            {closeButton && (
              <button
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="absolute end-3 top-3 inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)]"
              >
                <X className="size-4" />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
