"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AuthCardProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Centered auth surface — ~max-w-sm column with a subtle Framer Motion entrance.
 * Used by every page in the (auth) route group for consistent spacing and motion.
 */
export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full max-w-sm space-y-6", className)}
    >
      <div className="space-y-1.5">
        <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[color:var(--color-foreground)]">
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="space-y-6">{children}</div>
      {footer ? (
        <div className="pt-1 text-center text-sm text-[color:var(--color-muted-foreground)]">
          {footer}
        </div>
      ) : null}
    </motion.div>
  );
}
